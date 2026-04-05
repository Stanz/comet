# Stage 1: Build Frontend
FROM node:25 AS frontend-builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app/frontend

COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.bashrc" SHELL="$(which bash)" bash -
RUN pnpm install --frozen-lockfile

COPY frontend/ ./
RUN pnpm build

# Stage 2: Python dependency builder
FROM ghcr.io/astral-sh/uv:python3.13-alpine AS python-builder

RUN apk add --no-cache gcc python3-dev musl-dev linux-headers git make

WORKDIR /app

ENV UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    UV_HTTP_TIMEOUT=300

COPY pyproject.toml uv.lock ./

ARG TARGETPLATFORM
RUN --mount=type=cache,target=/root/.cache/uv,id=uv-${TARGETPLATFORM},sharing=locked \
    uv sync --frozen --no-install-project --no-dev

COPY . .

RUN --mount=type=cache,target=/root/.cache/uv,id=uv-${TARGETPLATFORM},sharing=locked \
    uv sync --frozen --no-dev

# Stage 3: Distroless runtime
FROM python:3.13-alpine
LABEL name="Comet" \
      description="Stremio's fastest torrent/debrid search add-on." \
      url="https://github.com/g0ldyy/comet"

# Copy the uv binary from the official distroless image
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

RUN apk add --no-cache tzdata mimalloc2

WORKDIR /app

# Copy the pre-built virtual environment and application from the builder
COPY --from=python-builder /app/.venv /app/.venv
COPY --from=python-builder /app /app

# Copy frontend build output
COPY --from=frontend-builder /app/frontend/.output /app/frontend/.output

ARG COMET_COMMIT_HASH
ARG COMET_BUILD_DATE
ARG COMET_BRANCH

ENV TZ=UTC \
    PYTHONMALLOC=malloc \
    LD_PRELOAD=/usr/lib/libmimalloc.so.2 \
    PATH="/app/.venv/bin:$PATH" \
    COMET_COMMIT_HASH=${COMET_COMMIT_HASH} \
    COMET_BUILD_DATE=${COMET_BUILD_DATE} \
    COMET_BRANCH=${COMET_BRANCH}

ENTRYPOINT ["uv", "run", "python", "-m", "comet.main"]
