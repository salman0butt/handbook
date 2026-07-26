---
title: Version & Platform Support
description: The verified Next.js 16.2 App Router baseline, runtime requirements, React relationship, and stability policy used by this handbook.
---

# Version & Platform Support

Framework behavior changes quickly enough that version context is part of engineering correctness. This page defines the baseline used throughout the handbook.

## Current verified baseline

**Verified: July 26, 2026**

| Item | Handbook baseline |
| --- | --- |
| Next.js npm `latest` | **16.2.11** |
| Supported production line | **16.x Active LTS** |
| Next.js 16.3 | **Preview/canary — not stable** |
| Stable React docs | **React 19.2** |
| App Router React integration | Framework-managed React Canary including stable React 19.2 behavior |
| Minimum Node.js | **20.9.0** |
| Minimum TypeScript for Next.js 16 | **5.1.0** |
| Chrome | **111+** |
| Edge | **111+** |
| Firefox | **111+** |
| Safari | **16.4+** |
| Default bundler | **Turbopack** for `next dev` and `next build` |

The latest patch matters. The July 2026 Next.js security release moved the recommended Active LTS patch to **16.2.11**, so “Next.js 16” alone is not a sufficiently precise production dependency policy.

## Stable, preview, and canary

Treat release channels as different contracts:

- **Stable / Active LTS** — appropriate baseline for production and this handbook.
- **Preview** — public preview of an upcoming release. Useful for evaluation, not assumed by handbook examples.
- **Canary** — rapidly changing prerelease channel. APIs may change before stable.

At this snapshot, **16.3 preview/canary features are excluded from the stable curriculum** unless a later verification shows they have shipped to npm `latest`.

## App Router and React versions

There is an important nuance behind the phrase “Next.js uses React 19.2.”

The stable React documentation currently targets **React 19.2**, but the Next.js App Router uses a framework-managed React Canary build that includes stable React 19 changes plus framework-facing features being validated ahead of future React releases. Your application should still declare `react` and `react-dom` dependencies for tooling and ecosystem compatibility.

This handbook therefore separates:

- **React public stable APIs** — explained according to React's stable documentation;
- **React features exposed through stable Next.js App Router releases** — explained when Next.js documents them as supported;
- **React/Next.js canary experiments** — never presented as stable contracts.

## What changed in the Next.js 16 generation?

These changes materially affect how modern examples should be written.

### Turbopack is the default

Next.js 16 made Turbopack the default for both development and production builds. Webpack is still available with `--webpack` when a dependency or build integration requires it.

Next.js 16.1 made Turbopack filesystem caching stable and enabled by default for development. Next.js 16.2 then added substantial Turbopack and rendering improvements.

### `middleware.ts` became `proxy.ts`

Next.js 16 renamed the Middleware file convention to **Proxy** to communicate that it sits at a request/network boundary. New handbook examples use `proxy.ts` and the `proxy()` function.

Do not infer that Proxy is an authorization layer. It can perform early request checks and routing decisions, but protected operations must still authorize access where the data-changing or data-reading operation occurs.

### Cache Components introduced a new opt-in model

Next.js 16 introduced **Cache Components** behind `cacheComponents: true`. It combines the modern `use cache` model with partial prerendering behavior.

This needs careful wording because, in Next.js 16.2, Cache Components is **opt-in**. The handbook will teach:

1. the stable App Router behavior when Cache Components is **not enabled**;
2. the Cache Components model when it **is enabled**;
3. the migration and architectural differences between the two.

That prevents a common documentation error: teaching an opt-in model as though every Next.js 16 application behaves that way by default.

### Request APIs are asynchronous

Modern App Router code treats request-bound values such as route `params` and relevant request APIs as asynchronous where the current API requires it. Examples will not copy old synchronous patterns from Next.js 13/14 tutorials.

### React Compiler integration is stable, but optional

Next.js 16 describes its React Compiler integration as stable. That does not mean every application must enable it, nor does it remove the need to understand component purity, state architecture, and profiling.

### Linting is separate from `next build`

Next.js 16 removed the `next lint` command and production builds no longer run linting for you. Run ESLint, Biome, or another chosen linter explicitly in development and CI.

### 16.2 improves debugging and platform integration

Next.js 16.2 added or stabilized several production-oriented improvements, including faster development startup/rendering, improved hydration diagnostics, Server Function development logging, `next start --inspect`, and the stable Adapter API for deployment-platform integrations.

## Core framework vs deployment platform

A feature can belong to different layers:

```text
Application code
    ↓
React component/rendering model
    ↓
Next.js framework contracts
    ↓
Node.js / Web platform runtime
    ↓
Hosting adapter / server / CDN
    ↓
Deployment provider infrastructure
```

For example:

- `page.tsx` is a **Next.js** convention.
- `useState` is a **React** API.
- `Request` and `Response` are **Web APIs**.
- `process.env` is a **Node.js/runtime** capability.
- a provider's geographic regions, CDN cache topology, function limits, and analytics product are **platform behavior**.

We will never silently turn a Vercel platform feature into a framework requirement.

## Creating against the current stable release

Use the `latest` tag when starting a new project, then commit the resulting lockfile:

```bash
pnpm create next-app@latest my-app
```

For Next.js 16.1 and later, the framework also provides an upgrade command:

```bash
pnpm next upgrade
```

Before a production upgrade, read the relevant version guide, run the production build and tests, and verify rendering, caching, request handling, and deployment behavior rather than assuming semver alone captures every operational change.

## Version-sensitive topics in this handbook

Re-check official docs before relying on these areas during upgrades:

- caching and revalidation
- static, dynamic, and partial prerendering behavior
- `cookies()`, `headers()`, `params`, and other request APIs
- Server Functions and mutation APIs
- Proxy and runtime constraints
- Turbopack compatibility
- React Compiler integration
- route segment configuration
- image defaults and optimizations
- deployment adapters and self-hosting behavior

## Primary sources

- [Next.js App Router docs](https://nextjs.org/docs/app)
- [Next.js installation requirements](https://nextjs.org/docs/app/getting-started/installation)
- [Next.js 16 release](https://nextjs.org/blog/next-16)
- [Next.js 16.1 release](https://nextjs.org/blog/next-16-1)
- [Next.js 16.2 release](https://nextjs.org/blog/next-16-2)
- [Next.js support policy](https://nextjs.org/support-policy)
- [Next.js npm versions](https://www.npmjs.com/package/next?activeTab=versions)
- [React versions](https://react.dev/versions)

## Exercise

For an existing Next.js project, answer these before changing code:

1. What exact `next`, `react`, and `react-dom` versions are locked?
2. Is it App Router-only, mixed, or Pages Router-only?
3. Is `cacheComponents` enabled?
4. Does the project run Turbopack or opt back into Webpack?
5. Which Node.js version does production actually use?
6. Does CI run linting and type checking explicitly?
7. Which behaviors come from the hosting provider rather than Next.js core?

If you cannot answer those questions, you do not yet have enough version context to debug framework behavior safely.
