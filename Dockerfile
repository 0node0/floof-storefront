# syntax=docker/dockerfile:1.6
FROM node:22-bookworm-slim AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG PUBLIC_MEDUSA_URL=https://floof-backend-production-6742.up.railway.app
ARG PUBLIC_MEDUSA_PK
ARG PUBLIC_STRIPE_PK=
ENV PUBLIC_MEDUSA_URL=$PUBLIC_MEDUSA_URL
ENV PUBLIC_MEDUSA_PK=$PUBLIC_MEDUSA_PK
ENV PUBLIC_STRIPE_PK=$PUBLIC_STRIPE_PK

RUN npm run build \
 && npm prune --omit=dev

FROM node:22-bookworm-slim AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

RUN apt-get update && apt-get install -y --no-install-recommends curl \
  && rm -rf /var/lib/apt/lists/* \
  && groupadd -g 1001 astro && useradd -m -u 1001 -g astro astro

COPY --from=builder --chown=astro:astro /app/dist ./dist
COPY --from=builder --chown=astro:astro /app/package.json ./package.json
COPY --from=builder --chown=astro:astro /app/node_modules ./node_modules

USER astro
EXPOSE 4321

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=5 \
  CMD curl -fsS "http://127.0.0.1:${PORT:-4321}/" || exit 1

CMD ["node", "./dist/server/entry.mjs"]
