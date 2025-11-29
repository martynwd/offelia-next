FROM node:22-slim AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Use Russian mirror for faster package downloads
RUN sed -i 's|http://deb.debian.org|http://mirror.yandex.ru|g' /etc/apt/sources.list.d/debian.sources || \
    sed -i 's|http://deb.debian.org|http://mirror.yandex.ru|g' /etc/apt/sources.list

# Install build dependencies for better-sqlite3
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies with timeout settings and npm mirror
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build Next.js
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV DATABASE_PATH=/app/data/development.sqlite3

RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 -g nodejs nextjs

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Create directory for database and set permissions
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/data

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
