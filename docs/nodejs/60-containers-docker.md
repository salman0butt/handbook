---
title: Containers & Docker
---

# Containers & Docker

A container packages a Node process with a filesystem/runtime environment. It does not remove the need to understand signals, memory, CPU, users, native dependencies, and shutdown.

## Multi-stage build

```dockerfile
FROM node:24-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:24-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
USER node
CMD ["node", "src/server.js"]
```

Adapt build stages so dev dependencies/build tooling are omitted from final images when possible.

## Slim vs Alpine

Small image size is not the only goal. Alpine uses musl rather than glibc and can affect native dependency compatibility/performance/tooling. Choose based on tested application needs and security maintenance.

## PID 1 and signals

Ensure the Node process receives termination signals and reaps children if it is PID 1. Avoid shell-form `CMD` when it interferes with signal propagation.

## Non-root

Run with least privilege, read-only filesystem where feasible, minimal capabilities, and explicit writable directories.

## Resource limits

Container CPU limits can cause throttling; memory limits apply to total process RSS. V8 may not be the only memory consumer. Leave headroom for buffers/native allocations.

## Native modules

Build native dependencies for the same OS/libc/architecture as runtime or use prebuilt artifacts that match. Multi-architecture images need testing.
