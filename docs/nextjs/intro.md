---
title: Next.js Handbook
description: A modern App Router handbook for Next.js 16, from fundamentals to production architecture and interviews.
slug: /nextjs/intro
---

# Next.js Handbook

This handbook teaches **modern Next.js through the App Router only**, from first principles to production engineering, architecture, debugging, and interviews.

> **Version baseline — verified July 26, 2026:** the npm `latest` release is **Next.js 16.2.11** on the **16.x Active LTS** line. Next.js 16.3 is still preview/canary, so preview-only APIs are not taught as stable behavior.

The goal is not to memorize framework APIs. The goal is to understand what Next.js adds around React, where code executes, how requests and navigations move through the system, what is rendered or cached, what reaches the browser, and which behavior belongs to Next.js versus React, Node.js, the browser, or a deployment platform.

## Scope

This handbook covers the modern `app/` architecture:

- App Router routing, layouts, navigation, route groups, dynamic segments, parallel and intercepting routes
- React Server Components and Client Component boundaries
- data fetching, streaming, Suspense, rendering, caching, and revalidation
- Server Functions, forms, optimistic UI, and mutation security
- Route Handlers and backend-for-frontend design
- the request pipeline and Next.js 16 **Proxy** (`proxy.ts`)
- metadata, SEO, images, fonts, and scripts
- authentication, authorization, security, observability, debugging, and performance
- testing, deployment, self-hosting, CI/CD, and multi-instance concerns
- large-application architecture, multi-tenancy, internals, projects, and interview preparation

## Deliberately out of scope

The **Pages Router is not part of this curriculum**. It remains supported by Next.js, but this handbook is intentionally designed for new App Router development. Historical Pages Router APIs such as `getServerSideProps`, `getStaticProps`, `_app`, `_document`, and API Routes will not be taught as application-building patterns here.

When an older tutorial conflicts with this handbook, verify whether it targets an older Next.js release, the Pages Router, or a pre-Next.js-16 caching/request model.

## Mental models we will keep using

### Next.js is not React

React supplies the component and rendering model. Next.js is a framework around React that adds routing, compilation, server integration, data and caching conventions, asset optimization, request handling, deployment output, and production tooling.

### Server Component is not SSR

A **Server Component** describes where component logic executes and what crosses the React Server Component boundary. **Server-side rendering** describes how initial HTML is produced. They interact, but they are different concepts.

### `'use client'` does not mean “browser-only render”

It creates a client module boundary. Client Components can still contribute to server-generated initial HTML; their client JavaScript is then used for hydration and future interaction.

### `'use server'` is not a Server Component marker

It marks Server Functions. Server Components are already the default in the App Router unless a client boundary changes the module graph.

### Server does not mean trusted

A Server Function or Route Handler executes on infrastructure you control, but request data and arguments can still come from an attacker. Validate input and perform authentication and authorization at the operation that protects the data.

### Dynamic rendering is not client-side rendering

A route can render dynamically **on the server** for each request. Likewise, streaming means server output can arrive in pieces; it does not turn the route into a client-rendered SPA.

## How to study this handbook

Each major topic aims to answer:

1. **What** is the feature?
2. **Why** does it exist?
3. **What is the mental model?**
4. **What triggers the framework behavior?**
5. **What happens at build time, on the server, and in the browser?**
6. **What are the rendering and cache implications?**
7. **What fails in production and how do we debug it?**
8. **What are the security and performance trade-offs?**
9. **What would a senior engineer choose, and why?**

Start with **00 · Start Here**, then work through the chapters in order. Later sections deliberately revisit the same features at deeper architecture and production levels.

## Official baseline sources

This handbook is continuously checked against primary documentation:

- [Next.js App Router documentation](https://nextjs.org/docs/app)
- [Next.js releases and announcements](https://nextjs.org/blog)
- [Next.js npm package](https://www.npmjs.com/package/next)
- [React documentation](https://react.dev/)
- [Next.js support policy](https://nextjs.org/support-policy)

Platform-specific behavior is labeled as such. Vercel is an important deployment option, but **Vercel behavior is not automatically a Next.js core contract**.
