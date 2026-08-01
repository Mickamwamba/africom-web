# syntax=docker/dockerfile:1

# ---- Base ----
FROM node:20-alpine AS base
# libc6-compat helps some native deps (e.g. sharp) on Alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

# ---- Dependencies ----
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ---- Builder ----
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* vars are inlined into the client bundle AT BUILD TIME. The
# Supabase project URL and anon key are public (they ship to every browser),
# so they are safe to bake in as defaults for build platforms (e.g. Spaceship
# Hyperlift) that don't support passing build args. A `docker build --build-arg`
# still overrides these defaults for local/other environments.
# NOTE: never hardcode the SUPABASE service_role key here — this app doesn't use it.
ARG NEXT_PUBLIC_SUPABASE_URL=https://sfpkcnyiqwesvfuhbjeo.supabase.co
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmcGtjbnlpcXdlc3ZmdWhiamVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzMzAwMzksImV4cCI6MjA5NDkwNjAzOX0.uJs1kvnYk5lZoaveY_iAgAcrs0VtDqN8pP9ktwLKYi4
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY

ENV NEXT_TELEMETRY_DISABLED=1
# Raise V8's heap ceiling so the build doesn't OOM under the container cgroup.
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build

# ---- Runner ----
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Run as a non-root user
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Standalone output does not bundle static assets or public/ — copy them in.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# server.js is emitted by Next's standalone output
CMD ["node", "server.js"]
