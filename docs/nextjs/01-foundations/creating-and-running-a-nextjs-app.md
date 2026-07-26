---
title: Creating & Running an App Router App
description: Create, configure, run, build, lint, and upgrade a modern Next.js 16 App Router application.
---

# Creating & Running an App Router App

A good setup chapter should teach what the commands mean, not just which commands to paste.

## Prerequisites

For the Next.js 16 baseline used by this handbook:

- **Node.js 20.9.0+**
- a supported package manager such as pnpm, npm, yarn, or Bun
- modern browser support
- working knowledge of HTML, CSS, JavaScript, and React

This handbook uses **TypeScript** examples and usually shows **pnpm** commands. The concepts are package-manager independent.

## Create the application

```bash
pnpm create next-app@latest next-handbook-lab
cd next-handbook-lab
pnpm dev
```

Open `http://localhost:3000`.

The current recommended `create-next-app` defaults include TypeScript, ESLint, Tailwind CSS, the App Router, Turbopack, and the `@/*` import alias.

For this handbook, the important architectural choices are:

- **App Router: yes**
- **TypeScript: yes**
- **Turbopack: default**

Tailwind is a styling choice, not a requirement for understanding Next.js.

## What `create-next-app` actually does

The CLI is a scaffolder. It does not create a special runtime that you must always use.

It typically:

1. creates a project directory;
2. writes framework/configuration files;
3. installs `next`, `react`, and `react-dom` plus selected tooling;
4. creates an `app/` route tree;
5. configures TypeScript/linting/styling according to your choices;
6. adds package scripts;
7. creates a lockfile for the selected package manager.

After creation, the application is an ordinary project in your repository. Read the generated files rather than treating the scaffold as magic.

## Core package scripts

A minimal project typically exposes these concepts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  }
}
```

### `next dev`

Runs the development server.

In Next.js 16, **Turbopack is the default bundler**. Development prioritizes fast feedback, diagnostics, Fast Refresh, and incremental compilation. Development behavior should not be used as proof that a production build is valid.

### `next build`

Creates the optimized production output. This phase is where route/build analysis and production compilation occur.

Always test `next build` before merging important framework/configuration changes. A route that works during development may still fail production compilation, type checking, prerender analysis, or environment assumptions.

### `next start`

Runs the already-built production application using Next.js' Node server.

It does **not** build first. The usual flow is:

```bash
pnpm build
pnpm start
```

Next.js 16.2 also supports attaching a Node debugger with `next start --inspect`, useful for production-runtime profiling and debugging in an appropriate environment.

### Linting

Do not use old tutorials that rely on:

```bash
next lint
```

Next.js 16 removed that command, and `next build` no longer runs linting automatically. Run your chosen linter explicitly:

```bash
pnpm eslint .
```

or through a project script such as:

```bash
pnpm lint
```

A production CI pipeline should make linting and type checks explicit rather than assuming the framework build covers every quality gate.

## Turbopack and Webpack

The default is:

```bash
next dev
next build
```

Both use Turbopack in Next.js 16.

If a dependency or custom build integration still requires Webpack, Next.js exposes an opt-out:

```bash
next dev --webpack
next build --webpack
```

Treat that as a compatibility decision, not as the modern default.

### What Turbopack does not do for you

Bundling and type checking are different jobs. Turbopack compiles TypeScript syntax, but that does not mean every edit has been type-checked by the bundler in the way your IDE or `tsc` checks it.

Keep explicit type checking in CI when you need an independent type gate:

```bash
pnpm tsc --noEmit
```

## Minimal App Router structure

A minimal application needs a root layout and a page:

```text
app/
├── layout.tsx
└── page.tsx
```

`app/layout.tsx`:

```tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

`app/page.tsx`:

```tsx
export default function HomePage() {
  return (
    <main>
      <h1>Next.js Handbook Lab</h1>
      <p>Learning the App Router from first principles.</p>
    </main>
  )
}
```

The root layout is required for the root route tree and owns the document-level `<html>` and `<body>` elements.

## Add a second route

Create:

```text
app/
├── layout.tsx
├── page.tsx
└── about/
    └── page.tsx
```

`app/about/page.tsx`:

```tsx
export default function AboutPage() {
  return (
    <main>
      <h1>About</h1>
      <p>This route comes from app/about/page.tsx.</p>
    </main>
  )
}
```

The folder `about` contributes a route segment. The `page.tsx` makes `/about` a page route.

This is framework convention. TypeScript does not know that “a file named page” is routable; Next.js does.

## Link between routes

```tsx
import Link from 'next/link'

export function PrimaryNavigation() {
  return (
    <nav aria-label="Primary navigation">
      <Link href="/">Home</Link>
      {' · '}
      <Link href="/about">About</Link>
    </nav>
  )
}
```

Use semantic navigation markup. Next.js navigation optimization is not a reason to ignore accessibility.

Later chapters will explain prefetching, client navigation, partial route updates, scroll/focus behavior, and URL state.

## TypeScript support

Next.js has first-class TypeScript support. `create-next-app` configures it automatically.

A useful distinction:

- **TypeScript checks developer assumptions**;
- **runtime validation checks untrusted values**.

A route parameter, form value, cookie, request body, webhook, or external API response does not become trustworthy merely because your code gives it a TypeScript type.

## `next.config.ts`

Modern projects can use a typed configuration file:

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Add configuration only when the application needs it.
}

export default nextConfig
```

Do not enable flags merely because a blog post mentions them. Configuration changes framework behavior and can affect builds, caching, security, and deployment compatibility.

## Environment variables

Next.js loads environment variables from `.env*` files and the process environment.

A server-only value can be referenced normally:

```ts
const databaseUrl = process.env.DATABASE_URL
```

A value prefixed with `NEXT_PUBLIC_` is intended to be bundled for browser use when referenced from client code:

```ts
const analyticsSiteId = process.env.NEXT_PUBLIC_ANALYTICS_SITE_ID
```

### Security rule

**Never put secrets in `NEXT_PUBLIC_*`.**

If a value ships to browser JavaScript, assume users can inspect it. Hiding UI, minifying code, or placing the variable in a Client Component does not create a security boundary.

The default scaffold ignores local environment files because credentials generally should not be committed.

## Development, production build, production server

These are distinct modes:

```text
pnpm dev
   ↓
fast development feedback

pnpm build
   ↓
compile + analyze + generate production output

pnpm start
   ↓
serve the previously built production output
```

Before shipping a change, reproduce the production path locally or in CI when practical:

```bash
pnpm lint
pnpm tsc --noEmit
pnpm build
pnpm start
```

Your exact scripts may differ, but the principle does not.

## Upgrade workflow

Next.js 16.1+ provides:

```bash
pnpm next upgrade
```

For a real production application:

1. read the target release and upgrade guide;
2. update dependencies and lockfile;
3. review codemod changes rather than accepting them blindly;
4. lint and type-check;
5. run unit/integration/E2E tests;
6. run `next build`;
7. test the production server/deployment artifact;
8. verify routing, request APIs, caching/revalidation, mutations, assets, and observability;
9. deploy with a rollback plan.

## Common mistakes

### Only testing `next dev`

Development mode is optimized for iteration. A successful dev session is not a successful production build.

### Treating generated defaults as requirements

Tailwind, a particular folder organization, or a specific linter can be changed. Understand which choices are framework requirements and which are scaffold preferences.

### Committing secrets

`.env` conveniences do not replace secret-management practices. Keep production credentials in the deployment environment's secret mechanism.

### Assuming environment variables behave identically everywhere

Build-time values, server runtime values, client-bundled public values, containers, and platform-managed environments can have different lifecycles. Later deployment chapters will make this explicit.

### Copying Webpack-era setup by default

Turbopack is now the default. Add Webpack-specific customizations only when the application actually needs them.

## Exercise: first application

Build this route tree:

```text
/
/about
/products
```

Requirements:

- one root layout with semantic navigation;
- one page per URL;
- TypeScript;
- no unnecessary `'use client'` directives;
- one server-only environment variable read in server code;
- one harmless `NEXT_PUBLIC_` value displayed in a small Client Component;
- lint, type-check, production-build, and run the application.

Then explain which code executes during build, request handling, and browser interaction. If you cannot explain that yet, the next foundations chapters are the important part—not adding more features.

## Interview questions

**What is the difference between `next dev`, `next build`, and `next start`?**

A strong answer distinguishes development compilation/runtime, production build generation, and serving an already-built production artifact.

**Is Turbopack optional in Next.js 16?**

It is the default for development and production builds, but Next.js still allows opting into Webpack for compatibility.

**Does `next build` run ESLint in Next.js 16?**

No. Linting should be an explicit command/CI step.

## Official references

- [Installation](https://nextjs.org/docs/app/getting-started/installation)
- [TypeScript](https://nextjs.org/docs/app/api-reference/config/typescript)
- [Environment variables](https://nextjs.org/docs/app/guides/environment-variables)
- [Turbopack](https://nextjs.org/docs/app/api-reference/turbopack)
- [Upgrading](https://nextjs.org/docs/app/getting-started/upgrading)
