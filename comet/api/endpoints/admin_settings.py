"""Admin settings API — exposes all AppSettings fields with source tracking and DB-persisted overrides."""
import os
import time
from typing import Any

import orjson
from fastapi import APIRouter, Cookie, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from pydantic.fields import FieldInfo
from pydantic_core import PydanticUndefinedType

from comet.api.endpoints.admin import require_admin_auth
from comet.core.logger import logger
from comet.core.models import database, settings

router = APIRouter()

# ---------------------------------------------------------------------------
# Metadata: which settings are editable and how they're grouped
# ---------------------------------------------------------------------------

# Fields that should never be exposed (sensitive credentials)
_SENSITIVE_KEYS: frozenset[str] = frozenset(
    {
        "ADMIN_DASHBOARD_PASSWORD",
        "CONFIGURE_PAGE_PASSWORD",
        "PUBLIC_API_TOKEN",
        "PROXY_DEBRID_STREAM_PASSWORD",
        "PROXY_DEBRID_STREAM_DEBRID_DEFAULT_APIKEY",
        "TMDB_READ_ACCESS_TOKEN",
        "JACKETT_API_KEY",
        "PROWLARR_API_KEY",
        "INDEXER_MANAGER_API_KEY",
        "COMETNET_API_KEY",
        "COMETNET_KEY_PASSWORD",
        "COMETNET_NETWORK_PASSWORD",
        "DEBRIDIO_API_KEY",
        "DEBRIDIO_PROVIDER_KEY",
        "TORBOX_API_KEY",
        "MEDIAFUSION_API_PASSWORD",
        "AIOSTREAMS_USER_UUID_AND_PASSWORD",
        "PUBLIC_API_TOKEN_FILE",
    }
)

# Fields that require a process restart to take effect
_RESTART_REQUIRED_KEYS: frozenset[str] = frozenset(
    {
        "FASTAPI_HOST",
        "FASTAPI_PORT",
        "FASTAPI_WORKERS",
        "USE_GUNICORN",
        "GUNICORN_PRELOAD_APP",
        "DATABASE_TYPE",
        "DATABASE_URL",
        "DATABASE_PATH",
        "EXECUTOR_MAX_WORKERS",
    }
)

# Group assignment for each key prefix / key name
_GROUPS: dict[str, str] = {
    # Server
    "FASTAPI_": "Server",
    "USE_GUNICORN": "Server",
    "GUNICORN_": "Server",
    "EXECUTOR_": "Server",
    "ADDON_": "Server",
    "PUBLIC_BASE_URL": "Server",
    "CUSTOM_HEADER_HTML": "Server",
    # Security & Auth
    "ADMIN_DASHBOARD_": "Security",
    "CONFIGURE_PAGE_": "Security",
    "PUBLIC_API_TOKEN": "Security",
    "PUBLIC_METRICS_API": "Security",
    "REMOVE_ADULT_CONTENT": "Security",
    # Database
    "DATABASE_": "Database",
    # Cache TTLs
    "METADATA_CACHE_TTL": "Cache",
    "TORRENT_CACHE_TTL": "Cache",
    "LIVE_TORRENT_CACHE_TTL": "Cache",
    "DEBRID_CACHE_TTL": "Cache",
    "METRICS_CACHE_TTL": "Cache",
    "DEBRID_CACHE_CHECK_RATIO": "Cache",
    "SCRAPE_LOCK_TTL": "Cache",
    "SCRAPE_WAIT_TIMEOUT": "Cache",
    # Background Scraper
    "BACKGROUND_SCRAPER_": "Background Scraper",
    # Scrapers
    "INDEXER_MANAGER_": "Scrapers",
    "SCRAPE_": "Scrapers",
    "JACKETT_": "Scrapers",
    "PROWLARR_": "Scrapers",
    "COMET_URL": "Scrapers",
    "COMET_CLEAN_TRACKER": "Scrapers",
    "NYAA_": "Scrapers",
    "ANIMETOSHO_": "Scrapers",
    "SEADEX_": "Scrapers",
    "NEKOBT_": "Scrapers",
    "ZILEAN_": "Scrapers",
    "STREMTHRU_SCRAPE_": "Scrapers",
    "DMM_": "Scrapers",
    "BITMAGNET_": "Scrapers",
    "TORRENTIO_": "Scrapers",
    "MEDIAFUSION_": "Scrapers",
    "AIOSTREAMS_": "Scrapers",
    "JACKETTIO_": "Scrapers",
    "DEBRIDIO_": "Scrapers",
    "TORBOX_": "Scrapers",
    "GET_TORRENT_TIMEOUT": "Scrapers",
    "MAGNET_RESOLVE_TIMEOUT": "Scrapers",
    "CATALOG_TIMEOUT": "Scrapers",
    "DOWNLOAD_TORRENT_FILES": "Scrapers",
    "DOWNLOAD_GENERIC_TRACKERS": "Scrapers",
    # Proxy / Debrid Streaming
    "PROXY_DEBRID_STREAM": "Proxy & Debrid",
    "STREMTHRU_URL": "Proxy & Debrid",
    "DISABLE_TORRENT_STREAMS": "Proxy & Debrid",
    "TORRENT_DISABLED_": "Proxy & Debrid",
    "DEBRID_ACCOUNT_SCRAPE_": "Proxy & Debrid",
    # HTTP / Performance
    "HTTP_": "Performance",
    "FILTER_PARSE_CACHE_": "Performance",
    "RATELIMIT_": "Performance",
    "GLOBAL_PROXY_URL": "Performance",
    "PROXY_ETHOS": "Performance",
    "MEMORY_TRIM_INTERVAL": "Performance",
    "RTN_FILTER_DEBUG": "Performance",
    "SMART_LANGUAGE_DETECTION": "Performance",
    # Content
    "DIGITAL_RELEASE_FILTER": "Content",
    "ANIME_MAPPING_": "Content",
    # CometNet
    "COMETNET_": "CometNet",
}

# Editable fields (can be overridden via Admin UI at runtime)
_EDITABLE_KEYS: frozenset[str] = frozenset(
    {
        # Server
        "FASTAPI_PORT",
        "FASTAPI_WORKERS",
        "PUBLIC_BASE_URL",
        "ADDON_NAME",
        # Background Scraper
        "BACKGROUND_SCRAPER_ENABLED",
        "BACKGROUND_SCRAPER_INTERVAL",
        "BACKGROUND_SCRAPER_CONCURRENT_WORKERS",
        "BACKGROUND_SCRAPER_MAX_MOVIES_PER_RUN",
        "BACKGROUND_SCRAPER_MAX_SERIES_PER_RUN",
        "BACKGROUND_SCRAPER_SUCCESS_TTL",
        "BACKGROUND_SCRAPER_RUN_TIME_BUDGET",
        "BACKGROUND_SCRAPER_ENABLE_DEMAND_PRIORITY",
        # Cache TTLs
        "METADATA_CACHE_TTL",
        "TORRENT_CACHE_TTL",
        "LIVE_TORRENT_CACHE_TTL",
        "DEBRID_CACHE_TTL",
        "DEBRID_CACHE_CHECK_RATIO",
        "SCRAPE_LOCK_TTL",
        # Proxy / Debrid Streaming
        "PROXY_DEBRID_STREAM",
        "PROXY_DEBRID_STREAM_MAX_CONNECTIONS",
        "PROXY_DEBRID_STREAM_INACTIVITY_THRESHOLD",
        "DISABLE_TORRENT_STREAMS",
        # Scrapers
        "INDEXER_MANAGER_TIMEOUT",
        "INDEXER_MANAGER_UPDATE_INTERVAL",
        "GET_TORRENT_TIMEOUT",
        "MAGNET_RESOLVE_TIMEOUT",
        "CATALOG_TIMEOUT",
        "DOWNLOAD_TORRENT_FILES",
        "DOWNLOAD_GENERIC_TRACKERS",
        # Content
        "REMOVE_ADULT_CONTENT",
        "DIGITAL_RELEASE_FILTER",
        "SMART_LANGUAGE_DETECTION",
        # Performance
        "HTTP_CLIENT_LIMIT",
        "HTTP_CLIENT_LIMIT_PER_HOST",
        "HTTP_CLIENT_TIMEOUT_TOTAL",
        "HTTP_CACHE_ENABLED",
        "MEMORY_TRIM_INTERVAL",
        # Security
        "PUBLIC_METRICS_API",
        # CometNet
        "COMETNET_MAX_PEERS",
        "COMETNET_MIN_PEERS",
        "COMETNET_CONTRIBUTION_MODE",
    }
)


def _resolve_group(key: str) -> str:
    """Match field key to a display group using prefix rules."""
    # Exact match first
    if key in _GROUPS:
        return _GROUPS[key]
    # Prefix match
    for prefix, group in _GROUPS.items():
        if prefix.endswith("_") and key.startswith(prefix):
            return group
    return "Miscellaneous"


def _resolve_field_type(annotation: Any) -> str:
    """Return a simple type string for the UI."""
    import typing

    origin = getattr(annotation, "__origin__", None)
    args = getattr(annotation, "__args__", ())

    # Handle Optional[X] -> unwrap X
    if origin is typing.Union:
        non_none = [a for a in args if a is not type(None)]
        if non_none:
            return _resolve_field_type(non_none[0])

    if annotation is bool or annotation == bool:
        return "bool"
    if annotation is int or annotation == int:
        return "int"
    if annotation is float or annotation == float:
        return "float"

    if origin is list or str(annotation).startswith("typing.List"):
        return "list"

    return "string"


async def _load_overrides() -> dict[str, Any]:
    rows = await database.fetch_all("SELECT key, value_json FROM admin_settings_overrides")
    result: dict[str, Any] = {}
    for row in rows:
        try:
            result[row["key"]] = orjson.loads(row["value_json"])
        except Exception:
            pass
    return result


async def load_and_apply_db_overrides() -> None:
    """Load all DB overrides and apply them to the live settings object. Called at startup."""
    try:
        overrides = await _load_overrides()
        for key, value in overrides.items():
            if hasattr(settings, key):
                try:
                    setattr(settings, key, value)
                except Exception as e:
                    logger.warning(f"Could not apply settings override {key}: {e}")
        if overrides:
            logger.log("SETTINGS", f"Applied {len(overrides)} admin setting override(s) from DB")
    except Exception as e:
        logger.error(f"Failed to load admin settings overrides: {e}")


def _build_settings_list(overrides: dict[str, Any]) -> list[dict]:
    """Introspect AppSettings and build the full settings payload."""
    model_fields: dict[str, FieldInfo] = settings.model_fields
    env_keys = {k.upper() for k in os.environ}

    skipped_internal = {"STREMIO_API_PREFIX", "PUBLIC_API_TOKEN_SOURCE"}
    result = []

    for key, field_info in model_fields.items():
        if key in skipped_internal:
            continue

        raw_value = getattr(settings, key, None)
        raw_default = field_info.default
        # PydanticUndefined is not JSON-serializable — treat it as None
        default = None if isinstance(raw_default, PydanticUndefinedType) else raw_default

        # Determine source
        if key in overrides:
            source = "override"
        elif key in settings.__pydantic_fields_set__ or key.upper() in env_keys:
            source = "env"
        else:
            source = "default"

        sensitive = key in _SENSITIVE_KEYS
        field_type = _resolve_field_type(field_info.annotation)

        if sensitive:
            if source == "env":
                display_value = "Set via environment variable"
            elif source == "override":
                display_value = "Set via admin override"
            else:
                display_value = None
        else:
            display_value = raw_value

        result.append(
            {
                "key": key,
                "value": display_value,
                "default": None if sensitive else default,
                "source": source,
                "type": field_type,
                "group": _resolve_group(key),
                "editable": key in _EDITABLE_KEYS and not sensitive,
                "sensitive": sensitive,
                "restart_required": key in _RESTART_REQUIRED_KEYS,
                "description": (
                    field_info.description
                    if field_info.description
                    else None
                ),
            }
        )

    return result


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------


@router.get(
    "/admin/api/settings",
    tags=["Admin"],
    summary="Get All Settings",
    description="Returns all application settings with source (env/override/default) and editability metadata.",
)
async def admin_get_settings(
    admin_session: str = Cookie(None),
):
    require_admin_auth(admin_session)
    overrides = await _load_overrides()
    items = _build_settings_list(overrides)
    # Group them
    groups: dict[str, list] = {}
    for item in items:
        groups.setdefault(item["group"], []).append(item)
    return JSONResponse({"settings": items, "groups": list(groups.keys())})


class SettingOverride(BaseModel):
    key: str
    value: Any


@router.patch(
    "/admin/api/settings",
    tags=["Admin"],
    summary="Override a Setting",
    description="Saves a runtime override for a setting. The value is persisted to DB and applied in-memory immediately.",
)
async def admin_patch_setting(
    body: SettingOverride,
    admin_session: str = Cookie(None),
):
    require_admin_auth(admin_session)

    key = body.key
    value = body.value

    if key not in settings.model_fields:
        raise HTTPException(status_code=400, detail=f"Unknown setting: {key}")
    if key in _SENSITIVE_KEYS:
        raise HTTPException(status_code=403, detail=f"Setting {key} cannot be overridden via the admin UI")
    if key not in _EDITABLE_KEYS:
        raise HTTPException(status_code=403, detail=f"Setting {key} is read-only")

    # Type coercion
    field_info = settings.model_fields[key]
    field_type = _resolve_field_type(field_info.annotation)
    try:
        if field_type == "bool":
            value = bool(value)
        elif field_type == "int":
            value = int(value)
        elif field_type == "float":
            value = float(value)
        elif field_type == "list":
            if isinstance(value, str):
                value = [v.strip() for v in value.split(",") if v.strip()]
    except (ValueError, TypeError) as e:
        raise HTTPException(status_code=422, detail=f"Invalid value for {key}: {e}")

    value_json = orjson.dumps(value).decode("utf-8")
    await database.execute(
        """
        INSERT INTO admin_settings_overrides (key, value_json, updated_at)
        VALUES (:key, :value_json, :updated_at)
        ON CONFLICT (key) DO UPDATE SET
            value_json = :value_json,
            updated_at = :updated_at
        """,
        {"key": key, "value_json": value_json, "updated_at": time.time()},
        force_primary=True,
    )

    # Hot-apply
    try:
        setattr(settings, key, value)
    except Exception as e:
        logger.warning(f"Could not hot-apply settings override {key}: {e}")

    return JSONResponse({"success": True, "key": key, "value": value, "source": "override"})


@router.delete(
    "/admin/api/settings/{key}",
    tags=["Admin"],
    summary="Remove a Setting Override",
    description="Removes an admin override for a specific setting, reverting to env/default.",
)
async def admin_delete_setting(
    key: str,
    admin_session: str = Cookie(None),
):
    require_admin_auth(admin_session)

    if key not in settings.model_fields:
        raise HTTPException(status_code=400, detail=f"Unknown setting: {key}")

    await database.execute(
        "DELETE FROM admin_settings_overrides WHERE key = :key",
        {"key": key},
        force_primary=True,
    )

    # Revert to env or the original pydantic default
    field_info = settings.model_fields[key]
    env_val = os.environ.get(key)
    if env_val is not None:
        try:
            reverted = getattr(settings.__class__(**{key: env_val}), key)
            setattr(settings, key, reverted)
        except Exception:
            pass
    else:
        raw_default = field_info.default
        default = None if isinstance(raw_default, PydanticUndefinedType) else raw_default
        if default is not None:
            try:
                setattr(settings, key, default)
            except Exception:
                pass

    return JSONResponse({"success": True, "key": key})


@router.delete(
    "/admin/api/settings",
    tags=["Admin"],
    summary="Reset All Setting Overrides",
    description="Removes all admin overrides, reverting every setting to its env/default value.",
)
async def admin_reset_all_settings(
    admin_session: str = Cookie(None),
):
    require_admin_auth(admin_session)

    rows = await database.fetch_all("SELECT key FROM admin_settings_overrides")
    keys = [row["key"] for row in rows]

    await database.execute("DELETE FROM admin_settings_overrides", force_primary=True)

    # Revert each key in memory
    for key in keys:
        if key not in settings.model_fields:
            continue
        field_info = settings.model_fields[key]
        env_val = os.environ.get(key)
        if env_val is not None:
            try:
                reverted = getattr(settings.__class__(**{key: env_val}), key)
                setattr(settings, key, reverted)
            except Exception:
                pass
        else:
            raw_default = field_info.default
            default = None if isinstance(raw_default, PydanticUndefinedType) else raw_default
            if default is not None:
                try:
                    setattr(settings, key, default)
                except Exception:
                    pass

    return JSONResponse({"success": True, "reset_count": len(keys)})
