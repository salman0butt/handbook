---
title: Suspense, Streaming, Navigation & Hydration Testing
sidebar_position: 6
description: Test App Router delivery in real browsers across loading boundaries, streamed content, hard and soft navigation, hydration, preserved layouts, Router Cache, and instant-navigation experiments.
---

# Suspense, Streaming, Navigation & Hydration Testing

Some Next.js behaviour only becomes real when the application is running as a framework in a browser.

Examples:

```text
streaming
RSC navigation
hydration
prefetching
Router Cache
preserved layouts
browser history
focus and scroll
```

These are poor candidates for heavily mocked unit tests.

## 1. Separate shell and completed-page assertions

For streamed routes, write tests around meaningful phases:

```text
navigation starts
→ shell/loading UI can appear
→ dynamic content arrives
→ interaction becomes available
```

Do not use arbitrary sleeps to manufacture the phases.

## 2. Loading boundaries

For a route with `loading.tsx` or Suspense fallback, test that the fallback communicates useful pending state.

Example E2E intent:

```ts
await page.getByRole('link', { name: 'Reports' }).click()
await expect(page.getByText('Loading reports…')).toBeVisible()
await expect(page.getByRole('heading', { name: 'Reports' })).toBeVisible()
```

If data resolves too quickly in the normal test environment, inject a deterministic test dependency rather than sleeping.

## 3. Do not over-specify stream timing

Fragile:

```text
fallback must be visible for exactly 200 ms
```

Better:

```text
while dependency is intentionally blocked → fallback visible
after dependency released              → content visible
```

Control the dependency, not wall-clock luck.

## 4. Hard vs soft navigation

Test both when the distinction matters.

```text
hard navigation
→ browser requests document
→ initial HTML/RSC/hydration path

soft navigation
→ Next router transition
→ RSC payload/prefetch/cache path
```

A route can work on reload but fail during client navigation—or the reverse.

## 5. Preserved layouts

For nested routes, test state that should survive navigation:

```text
sidebar remains mounted
selected workspace remains stable
shared audio/player state persists if intentionally owned above route
```

Also test state that should reset when a `template` or key boundary intentionally remounts.

## 6. Search params and history

Critical URL-state flows should cover:

```text
change filter
URL updates
reload preserves filter
Back restores previous state
Forward restores next state
copy/paste URL reproduces view
```

This verifies URL ownership instead of only local React state.

## 7. Scroll and focus

For accessibility-sensitive navigation test:

```text
focus moves when product design requires it
modal interception restores focus
Back navigation behaves sensibly
validation sends focus to useful error/control
```

Use real browser focus assertions.

## 8. Hydration failures

A production browser test can catch:

```text
server/client text mismatch
browser-only access during render
non-deterministic date/random output
invalid nesting
third-party mutation before hydration
```

Capture console errors in critical smoke tests so hydration warnings do not silently ship.

## 9. Client-ready state

Visible HTML does not always mean interactive UI is hydrated.

For important Client Components assert an actual interaction:

```text
button visible
→ click
→ state changes
```

This proves interactivity, not only prerendered appearance.

## 10. Router Cache freshness

Useful regression scenario:

```text
visit list
open item
mutate item
navigate back
verify intended fresh/stale behaviour
```

If the server rejects stale privileges or data, also verify the authoritative operation—not just rendered text.

## 11. Prefetching can change tests

A hovered/visible `<Link>` may prefetch before a click.

That can alter:

```text
request counts
cache warmth
loading fallback visibility
```

Do not write brittle tests assuming a request only begins at click time unless you disable/control prefetch for the scenario.

## 12. Test cold and warm paths intentionally

Create separate suites where useful:

```text
cold direct load
warm client navigation
prefetched navigation
cached navigation after back/forward
```

Name the state in the test so future maintainers understand the expectation.

## 13. Cache Components instant shell testing

Next.js 16.2 exposes `@next/playwright`, an **experimental** package for testing instant navigation with Cache Components.

Its `instant()` helper holds back dynamic content so tests can assert what exists in the cached/prefetched shell.

Conceptual example:

```ts
import { instant } from '@next/playwright'

await instant(page, async () => {
  await page.click('a[href="/dashboard"]')
  await expect(page.getByTestId('loading')).toBeVisible()
})

await expect(page.getByTestId('content')).toBeVisible()
```

Treat this as optional experimental diagnostic coverage, not the foundation of your stable E2E suite.

## 14. Experimental production exposure warning

The current `@next/playwright` package can expose its testing API in production builds through an experimental config flag.

That capability is intended for **controlled test/preview environments**, not public production deployment.

If you use it:

```text
CI/test-only config
+ explicit environment guard
+ deployment verification that live production does not expose it
```

## 15. Streaming error recovery

Test:

```text
slow child fails
→ nearest error boundary appears
→ surrounding shell survives
→ retry/reset works if failure becomes healthy
```

Also cover permanent failures where retry should not create an infinite loop.

## 16. Not-found during streaming

Phase 14 covered the status-code caveat for streamed not-found responses.

E2E should focus on the user/SEO contract:

```text
not-found UI appears
unavailable content does not render
metadata/noindex policy is correct where relevant
```

Do not infer HTTP semantics only from visible text; inspect the network when status behaviour is part of the test.

## 17. Intercepting/parallel route tests

For route-driven modals test both entry modes:

```text
soft navigation → modal interception
hard reload/direct URL → full page
Back → closes/restores route correctly
```

This is a classic App Router behaviour that component tests cannot fully prove.

## 18. Cross-browser confidence

Use multi-browser E2E for risks involving:

```text
focus
native form behaviour
layout/scroll
browser APIs
media
file upload
history
```

You do not need every test on every browser if CI cost is high.

A common strategy is:

```text
Chromium broad suite
Firefox/WebKit critical smoke suite
```

## 19. Console and network hygiene

For critical routes fail or report on unexpected:

```text
console.error
hydration warning
uncaught rejection
failed essential request
```

Allow-list known intentional failures narrowly.

## 20. Test semantic outcomes, not RSC protocol internals

Avoid coupling E2E tests to private Flight payload formats.

Assert:

```text
what route appears
what stays preserved
what streams
what becomes interactive
what network status is public contract
```

Framework internals can change while the product contract stays stable.

## Production checklist

- [ ] hard and soft navigation both covered where risky
- [ ] loading/streaming tests control dependencies rather than sleep
- [ ] critical Client Components prove interaction after hydration
- [ ] Router Cache/back-forward scenarios exist
- [ ] intercepting/parallel routes are tested by entry mode
- [ ] console/hydration failures are surfaced
- [ ] experimental `@next/playwright` usage is isolated
- [ ] production does not expose test-only APIs
- [ ] browser tests assert semantic outcomes, not private RSC internals

## Interview questions

### Why can a route pass reload tests but fail client navigation?

The two paths exercise different Next.js behaviour: document loading and hydration versus router transitions, prefetching, RSC payloads, preserved layouts, and Router Cache.

### Why is `@next/playwright` not a default recommendation?

At the current baseline it is experimental and tied to Cache Components instant-navigation testing. Use stable Playwright for core E2E, and isolate the helper for targeted structural regression tests.
