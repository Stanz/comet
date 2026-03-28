import { queryOptions } from "@tanstack/react-query";

import * as v from "valibot";
import { validatedGet } from "../../util/api";
import { resolutions, serverResolutionMap } from "./constants";

export const BYTES_PER_GB = 1073741824;

export const DebridServiceEntrySchema = v.object({
  service: v.optional(v.string(), ""),
  apiKey: v.optional(v.string(), ""),
  id: v.optional(v.string(), () => crypto.randomUUID()),
});

export type DebridServiceEntry = v.InferOutput<typeof DebridServiceEntrySchema>;

/**
 * The user's per-stream configuration, serialized into the Stremio manifest
 * URL as a base64 parameter. This is what gets decoded from `$b64config`.
 */
export const StreamConfigSchema = v.object({
  cachedOnly: v.optional(v.boolean(), false),
  sortCachedUncachedTogether: v.optional(v.boolean(), false),
  removeTrash: v.optional(v.boolean(), true),
  resultFormat: v.optional(v.array(v.string()), () => ["all"]),
  maxResultsPerResolution: v.optional(v.number(), 0),
  maxSize: v.optional(v.number(), 0),
  debridService: v.optional(v.string(), "torrent"),
  debridApiKey: v.optional(v.string(), ""),
  debridServices: v.optional(v.array(DebridServiceEntrySchema), () => []),
  enableTorrent: v.optional(v.boolean(), false),
  deduplicateStreams: v.optional(v.boolean(), false),
  scrapeDebridAccountTorrents: v.optional(v.boolean(), false),
  debridStreamProxyPassword: v.optional(v.string(), ""),
  languages: v.optional(
    v.object({
      required: v.optional(v.array(v.string()), () => []),
      allowed: v.optional(v.array(v.string()), () => []),
      exclude: v.optional(v.array(v.string()), () => []),
      preferred: v.optional(v.array(v.string()), () => []),
    }),
    () => ({}),
  ),
  resolutions: v.optional(v.record(v.string(), v.boolean()), () => ({})),
  options: v.optional(
    v.object({
      remove_ranks_under: v.optional(v.number(), -1000000000),
      allow_english_in_languages: v.optional(v.boolean(), false),
      remove_unknown_languages: v.optional(v.boolean(), false),
    }),
    () => ({}),
  ),
});

export type StreamConfig = v.InferOutput<typeof StreamConfigSchema>;

/**
 * Server-provided UI configuration, fetched from `/api/ui-config`.
 * Holds global settings and feature flags used to drive the configure page UI.
 */
export const UiServerConfigSchema = v.object({
  CUSTOM_HEADER_HTML: v.string(),
  webConfig: v.object({
    resolutions: v.array(v.number()),
    resultFormat: v.array(v.string()),
  }),
  proxyDebridStream: v.boolean(),
  disableTorrentStreams: v.boolean(),
  stremioApiPrefix: v.string(),
  passwordEnabled: v.boolean(),
});

export type UiServerConfig = v.InferOutput<typeof UiServerConfigSchema>;

export const configQueryOptions = () =>
  queryOptions({
    queryKey: ["config"],
    queryFn: () => validatedGet("/api/ui-config", UiServerConfigSchema),
  });

export const resolutionKeys = Object.keys(resolutions);

/**
 * The shape of the TanStack Form state for the configure page.
 * Intentionally differs from StreamConfig — e.g. resolutions are represented
 * as a string[] of selected keys rather than a Record<string, boolean>.
 */
export const StreamConfigFormSchema = v.object({
  selectedResolutions: v.array(v.string()),
  maxResultsPerResolution: v.number(),
  maxSize: v.number(),
  debridStreamProxyPassword: v.string(),
  debridServices: v.array(DebridServiceEntrySchema),
  enableTorrent: v.boolean(),
  deduplicateStreams: v.boolean(),
  scrapeAccount: v.boolean(),
  langRequired: v.array(v.string()),
  langAllowed: v.array(v.string()),
  langExcluded: v.array(v.string()),
  langPreferred: v.array(v.string()),
  allowEnglishInLanguages: v.boolean(),
  removeUnknownLanguages: v.boolean(),
  rankThreshold: v.number(),
  cachedOnly: v.boolean(),
  sortCachedTogether: v.boolean(),
  removeTrash: v.boolean(),
  resultFormat: v.array(v.string()),
});

export type StreamConfigFormValues = v.InferOutput<typeof StreamConfigFormSchema>;

export const streamConfigToFormValues = (
  uiConfig: UiServerConfig,
  initialStreamConfig?: Partial<StreamConfig>,
): StreamConfigFormValues => {
  const selectedResolutions = initialStreamConfig?.resolutions
    ? Object.entries(initialStreamConfig.resolutions)
        .filter(([_, enabled]) => enabled !== false)
        .map(([key]) => key)
    : uiConfig.webConfig.resolutions
        .map((r) => serverResolutionMap[r])
        .filter((r): r is keyof typeof resolutions => !!r);

  return {
    selectedResolutions,
    maxResultsPerResolution: initialStreamConfig?.maxResultsPerResolution ?? 0,
    maxSize: (initialStreamConfig?.maxSize ?? 0) / BYTES_PER_GB,
    debridStreamProxyPassword: initialStreamConfig?.debridStreamProxyPassword ?? "",
    debridServices: (initialStreamConfig?.debridServices || []).map((service) => ({
      ...v.getDefaults(DebridServiceEntrySchema),
      ...service,
    })),
    enableTorrent: initialStreamConfig?.enableTorrent ?? !uiConfig?.disableTorrentStreams,
    deduplicateStreams: initialStreamConfig?.deduplicateStreams ?? false,
    scrapeAccount: initialStreamConfig?.scrapeDebridAccountTorrents ?? false,
    langRequired: initialStreamConfig?.languages?.required ?? [],
    langAllowed: initialStreamConfig?.languages?.allowed ?? [],
    langExcluded: initialStreamConfig?.languages?.exclude ?? [],
    langPreferred: initialStreamConfig?.languages?.preferred ?? [],
    allowEnglishInLanguages: initialStreamConfig?.options?.allow_english_in_languages ?? false,
    removeUnknownLanguages: initialStreamConfig?.options?.remove_unknown_languages ?? false,
    rankThreshold: initialStreamConfig?.options?.remove_ranks_under ?? -10000000000,
    cachedOnly: initialStreamConfig?.cachedOnly ?? false,
    sortCachedTogether: initialStreamConfig?.sortCachedUncachedTogether ?? false,
    removeTrash: initialStreamConfig?.removeTrash ?? true,
    resultFormat: initialStreamConfig?.resultFormat ?? (uiConfig.webConfig.resultFormat || ["all"]),
  };
};

/**
 * Higher-order component used only for TanStack Form type inference in configuration sections.
 * It wraps withCometForm with a valid default shape so that TanStack Form can correctly infer types.
 */
const dummyUiConfig: UiServerConfig = {
  CUSTOM_HEADER_HTML: "",
  webConfig: { resolutions: [], resultFormat: [] },
  proxyDebridStream: false,
  disableTorrentStreams: false,
  stremioApiPrefix: "",
  passwordEnabled: false,
};

/**
 * Standard options for TanStack Form in configuration sections to aid type inference.
 * Components should spread this into withCometForm.
 */
export const configureFormOptions = {
  defaultValues: streamConfigToFormValues(dummyUiConfig),
};

export const formValuesToStreamConfig = (
  values: StreamConfigFormValues,
  uiConfig: UiServerConfig,
): StreamConfig => {
  const resMap = resolutionKeys.reduce(
    (acc: Record<string, boolean>, r: string) => {
      if (!values.selectedResolutions.includes(r)) acc[r] = false;
      return acc;
    },
    {} as Record<string, boolean>,
  );

  const debridClean = values.debridServices
    .filter((s) => s.service && s.apiKey)
    .map(({ service, apiKey, id }) => ({ service, apiKey, id }));

  // Check if result format matches default
  const defaultFormat = uiConfig.webConfig.resultFormat || ["all"];
  const resultFormat =
    values.resultFormat.length === defaultFormat.length &&
    values.resultFormat.every((v, i) => v === defaultFormat[i])
      ? ["all"]
      : values.resultFormat;

  return v.parse(StreamConfigSchema, {
    maxResultsPerResolution: values.maxResultsPerResolution,
    maxSize: values.maxSize * BYTES_PER_GB,
    cachedOnly: values.cachedOnly,
    sortCachedUncachedTogether: values.sortCachedTogether,
    removeTrash: values.removeTrash,
    resultFormat,
    debridServices: debridClean,
    enableTorrent: values.enableTorrent,
    deduplicateStreams: values.deduplicateStreams,
    scrapeDebridAccountTorrents: values.scrapeAccount,
    debridStreamProxyPassword: values.debridStreamProxyPassword,
    languages: {
      required: values.langRequired,
      allowed: values.langAllowed,
      exclude: values.langExcluded,
      preferred: values.langPreferred,
    },
    resolutions: resMap,
    options: {
      remove_ranks_under: values.rankThreshold,
      allow_english_in_languages: values.allowEnglishInLanguages,
      remove_unknown_languages: values.removeUnknownLanguages,
    },
  });
};

export const Base64ToStreamConfigSchema = v.pipe(
  v.string(),
  v.base64(),
  v.transform((data) => atob(data)),
  v.parseJson(),
  StreamConfigSchema,
);

export const StreamConfigSchemaToBase64 = v.pipe(
  StreamConfigSchema,
  v.transform((data) => btoa(JSON.stringify(data))),
);

export const getStreamConfigSchemaFromBase64 = (b64: string): StreamConfig => {
  return v.parse(Base64ToStreamConfigSchema, b64);
};

export const getBase64FromStreamConfigSchema = (config: StreamConfig): string => {
  return v.parse(StreamConfigSchemaToBase64, config);
};
