---
title: Capstone — Public Catalog, Search, SEO & Cache Architecture
sidebar_position: 2
description: Build a public discovery product that proves App Router routing, RSC, URL state, SEO, Cache Components, streaming, resource optimization, and production performance.
---

# Capstone — Public Catalog, Search, SEO & Cache Architecture

Build a public catalog/discovery product such as:

```text
software marketplace
travel catalog
course directory
real-estate discovery site
restaurant guide
product comparison portal
```

The domain may change; the architectural requirements do not.

## Product goals

Users can:

```text
browse categories
search
filter
sort
paginate
open detail pages
share canonical URLs
view related items
save lightweight preferences
```

Editors/admin processes can update catalog content and trigger freshness changes.

## Route map

Suggested App Router shape:

```text
/
/catalog
/catalog/[category]
/item/[slug]
/search
/about
```

Use nested layouts for shared navigation and route groups only where they improve organization without changing URL semantics.

## URL-state requirement

Search/filter/sort/pagination must be represented in URL state.

Example:

```text
/search?q=nextjs&category=web&sort=rating&page=2
```

Requirements:

```text
back/forward works
refresh preserves state
URLs are shareable
server reads initial state
client controls progressively enhance
```

## Server-first data ownership

Canonical catalog reads belong on the server.

Preferred flow:

```text
page Server Component
→ search/catalog query module
→ database/search provider
→ minimal DTO
→ render
```

Do not fetch your own Route Handler from a Server Component simply to reuse HTTP.

## Query architecture

Define explicit inputs:

```ts
type CatalogQuery = {
  q?: string
  category?: string
  sort: 'relevance' | 'rating' | 'newest'
  page: number
}
```

Validate all search params before using them in DB/search-provider queries.

## Data model

Minimum entities:

```text
Item
Category
Tag
Publisher/Owner
Editorial metadata
```

Optional:

```text
ratings
availability
location
pricing snapshots
```

## Cache strategy

Classify data:

```text
site chrome/config → long-lived cache
category lists → cached, tag invalidated
item detail → cached with item tag
search results → cache selectively based on cardinality/freshness
personal preference → request/user-owned, not shared public cache
```

Document exact cache keys and invalidation ownership.

## Cache Components requirement

Use Cache Components where they provide value.

Example mental model:

```text
cached layout shell
├─ cached category navigation
├─ dynamic/request search summary
└─ streamed results hole
```

Do not force every route into caching.

## Revalidation workflow

When catalog data changes:

```text
admin update
→ transaction
→ cache tag invalidation
→ future readers receive fresh state according to chosen semantics
```

Test:

```text
old item
update
revalidation
soft navigation
hard reload
```

## Suspense/streaming

Use Suspense to isolate slow, optional sections such as:

```text
recommendations
availability
review aggregate
related items
```

Critical identity/content should not be unnecessarily delayed behind secondary calls.

## Metadata requirements

Implement:

```text
title templates
description
canonical URLs
alternates if relevant
Open Graph/Twitter
robots policy
sitemap
structured data where domain appropriate
```

Use safe JSON-LD serialization.

## Generated social images

Optional advanced requirement:

Generate social images for item detail pages.

Test generation failures and fallback policy.

## Image requirements

Use `next/image` deliberately:

```text
correct intrinsic geometry
responsive sizes
remote/local allowlists
hero preload only when justified
placeholder policy
alt text
```

Measure LCP before and after optimization.

## Font/script requirements

Use `next/font` for project typography.

Third-party scripts must have:

```text
owner
purpose
loading strategy
consent/privacy position
performance budget
failure isolation
```

## Accessibility

Required:

```text
search input label
filter controls keyboard accessible
result headings semantic
pagination meaningful
focus visible
empty/error states announced appropriately
```

## Error model

Define:

```text
invalid search params → normalized safe state
missing item → notFound()
search provider unavailable → useful degraded/error UI
optional recommendation failure → isolated boundary/fallback
```

## Performance targets

Example project budget:

```text
LCP ≤ 2.5s p75 target
INP ≤ 200ms p75 target
CLS ≤ 0.1
client JS kept small on read-heavy routes
search p95 under documented threshold
```

Record lab and field-like evidence where possible.

## Observability

Capture:

```text
route
search query class without sensitive raw terms where inappropriate
cache hit/miss
DB/search-provider latency
result count
release ID
error digest/correlation
```

Avoid uncontrolled high-cardinality telemetry.

## Testing

### Unit

```text
query normalization
sort mapping
canonical URL builder
DTO projection
cache tag builder
```

### Integration

```text
catalog queries
search provider adapter
cache invalidation
not-found behavior
```

### E2E

```text
browse → filter → detail
search URL sharing
back/forward
mobile filter UI
404
admin update → freshness
```

### Nonfunctional

```text
keyboard navigation
metadata assertions
image/resource checks
bundle/performance budget
```

## Deployment

Deploy using a production-supported target.

Document:

```text
build artifact
runtime env
cache backend if distributed
image hosting
DB/search provider
health/readiness
rollback
```

## Architecture ADRs

Required examples:

```text
ADR: URL state vs client global state
ADR: search provider vs direct DB querying
ADR: cache identity and invalidation
ADR: recommendation failure isolation
```

## Stretch goals

```text
localized routes/metadata
multi-region read architecture
search suggestions with keyboard navigation
editor preview mode
A/B search ranking experiment
```

## Interview story

Be prepared to answer:

1. Why did you keep canonical reads server-side?
2. Which parts were cached and why?
3. How did you prevent stale or incorrect shared data?
4. What improved LCP/client JS?
5. How does a content update become visible safely?

A successful project demonstrates that public Next.js products are primarily architecture and delivery problems—not component-count problems.