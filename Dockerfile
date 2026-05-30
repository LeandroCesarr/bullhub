# =========================================
# BASE
# =========================================
FROM node:22-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

# =========================================
# DEPENDENCIES
# =========================================
FROM base AS deps

# workspace files
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY turbo.json ./

# apps package.json
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/

# packages package.json
COPY packages/core/package.json ./packages/core/
COPY packages/hono-adapter/package.json ./packages/hono-adapter/

# install deps first for docker cache
RUN pnpm install --frozen-lockfile

# =========================================
# BUILD
# =========================================
FROM deps AS builder

COPY . .

ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

# build apps
RUN pnpm turbo run build --filter=@bullhub/api
RUN pnpm turbo run build --filter=@bullhub/web

# =========================================
# RUNTIME
# =========================================
FROM node:22-slim AS runtime

WORKDIR /app

# api build
COPY --from=builder /app/apps/api/build ./apps/api/build
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json

# web build
COPY --from=builder /app/apps/web/dist ./apps/web/dist
COPY --from=builder /app/apps/web/package.json ./apps/web/package.json

# runtime deps
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) process.exit(1); process.exit(0)})"

CMD ["node", "apps/api/build/index.mjs"]