---
title: SEO Architecture, Debugging & Production Review
description: Design, debug, and review a production Next.js SEO system across metadata, URLs, crawlers, structured data, caching, and deployments.
---

# SEO Architecture, Debugging & Production Review

Production SEO is a distributed system of signals.

It spans:

```text
route tree
content model
canonical URLs
metadata
Open Graph/Twitter
structured data
robots policy
sitemaps
redirects
Proxy
caching
CDN/reverse proxy
deployment environments
```

A senior engineer does not debug SEO by editing `<title>` until a preview looks right.

They trace the document identity through every layer.

## A production SEO architecture

For a public content page:

```text
CMS / database
      ↓
public domain model
      ↓
route resolution
      ↓
page UI
      ↓
metadata + canonical
      ↓
Open Graph / Twitter
      ↓
JSON-LD
      ↓
sitemap membership
      ↓
public crawler delivery
```

Each layer should agree on publication state and URL identity.

## One public truth model

Avoid independent logic such as:

```text
page checks `publishedAt`
metadata checks `status === LIVE`
sitemap checks `deletedAt === null`
OG image checks nothing
```

That creates leaks and inconsistencies.

Prefer a public read model:

```ts
type PublicArticle = {
  slug: string
  title: string
  summary: string
  publishedAt: Date
  updatedAt: Date
  canonicalPath: string
  heroImage: string | null
  author: PublicAuthor
}
```

and one query boundary that guarantees the record is publishable.

## Route identity review

For every public route, answer:

```text
What URLs can reach this content?
Which one is canonical?
Which ones redirect?
Which are language variants?
Which query parameters change content meaning?
Which are tracking-only?
```

If the team cannot answer this, metadata will become inconsistent.

## Content lifecycle review

Model SEO across lifecycle states:

```text
draft
scheduled
published
updated
unpublished
slug renamed
deleted
```

For each state define:

- page response
- canonical
- robots policy
- sitemap membership
- social image visibility
- JSON-LD visibility
- redirect behavior

## Slug rename

A robust rename flow:

```text
/products/old-widget
→ permanent redirect
→ /products/new-widget
```

Then ensure:

```text
new page canonical = new URL
sitemap contains only new URL
OG URL = new URL
JSON-LD URL = new URL
internal links use new URL
```

Do not keep both URLs as competing indexable documents.

## Deleted content

Deletion policy depends on product semantics.

Possible outcomes:

```text
410 Gone
404 Not Found
redirect to replacement/category
```

Avoid keeping a deleted URL in sitemap with a canonical to a generic homepage.

That hides the real lifecycle signal.

## Pagination

Pagination SEO needs product-specific reasoning.

For:

```text
/blog?page=1
/blog?page=2
/blog?page=3
```

ask whether each page contains distinct useful content that should be discoverable.

Do not automatically canonicalize every page to page 1 if that makes deeper content effectively undiscoverable.

## Faceted navigation

Facets can explode URL count:

```text
/shoes?size=10&color=black&brand=acme&sort=price
```

Classify query dimensions:

```text
meaningful landing facet
→ potentially indexable

sort/view/tracking
→ usually not separate document identity

high-cardinality combinations
→ may need crawl/index restrictions
```

SEO architecture should align with product URL design.

## Internationalization

For localized content, verify:

```text
locale URL
localized visible content
localized title/description
canonical for locale
hreflang alternates
localized OG text/image if required
sitemap alternate languages
JSON-LD language/content consistency
```

Do not emit hreflang for translations that do not exist.

## Multi-tenant SEO

For tenant sites, decide whether tenants are:

```text
private application spaces
public microsites
custom-domain public sites
subdomain public sites
marketplace listings under main domain
```

Each has different canonical and crawl policy.

Never let raw unvalidated host headers define public identity.

Use the trusted-host model from Phase 9.

## Authenticated routes

SEO for authenticated product routes is usually simple:

```text
generic safe title
noindex
no public sitemap entry
no private OG image
no private JSON-LD
```

The critical requirement is still access control.

Do not spend database latency personalizing metadata for a page search engines should not index.

## Environment matrix

Review every deployment class:

| Environment | Public crawl? | Canonical host | Sitemap? | Verification? |
| --- | --- | --- | --- | --- |
| Production | yes, as intended | production origin | yes | production tokens |
| Preview | normally no | production canonical or noindex policy | usually no | usually no |
| Staging | controlled | explicit staging policy | usually no | test-only if needed |
| Local | no | local | no | no |

The exact policy varies, but accidental ambiguity is dangerous.

## Preview safety

A preview deployment should not accidentally emit:

```text
self-canonical preview URL
production sitemap containing preview host
production verification ownership
index,follow for unpublished content
```

Use explicit environment-aware policy.

## Proxy interaction review

Inspect whether `proxy.ts` affects:

```text
page requests
robots.txt
sitemap.xml
OG/Twitter image routes
icons
manifest
crawler user agents
locale redirects
host/tenant routing
```

A route can have perfect metadata code and still fail because Proxy redirects the crawler before the route runs.

## HTTP status first

Before debugging metadata, verify status codes.

SEO signals on a broken response are secondary.

Start with:

```text
200 expected document
3xx intentional redirect
404/410 missing/deleted document
5xx server failure
```

A `200` page that says “not found” is a soft-404 pattern.

## Raw request debugging

Use a repeatable checklist:

```text
curl/fetch final URL
follow and record redirects
inspect response status
inspect response headers
inspect initial HTML
fetch with crawler user agent
fetch metadata assets directly
```

Compare browser behavior only after transport behavior is known.

## Metadata streaming debugging

If metadata appears in the final browser DOM but not where you expected in raw HTML:

1. Determine whether `generateMetadata` is request-time.
2. Determine whether streaming metadata is active.
3. Test an HTML-limited crawler user agent.
4. Check `htmlLimitedBots` configuration.
5. Inspect dependency latency.
6. Confirm metadata is not being overwritten by a child/file convention.

## Social preview debugging

When a platform shows an old or missing card:

```text
check page URL status
check canonical/og:url
check crawler metadata response
check image URL status/content type/size
check file-based override
check generated image cache
check platform's own preview cache
```

Do not rebuild the app repeatedly before checking platform caching.

## Sitemap debugging

When expected content is missing:

```text
publication query
partition/generateSitemaps math
cache freshness
canonical slug
soft-delete filters
locale filter
page size/range boundary
```

When too many URLs appear, inspect whether filters/sort/tracking variants are being generated as canonical URLs.

## Robots debugging

When crawling drops unexpectedly:

```text
robots.txt environment config
Proxy redirect
robots meta inherited from layout
child robots object replacing parent object
CDN stale robots file
```

Remember metadata nested objects merge shallowly.

## JSON-LD debugging

Validate:

```text
HTML-safe serialization
valid JSON
correct Schema.org shape
public URL identity
visible-content consistency
publication state
```

A rich-results validator passing does not prove the data is truthful.

## Caching incident example

Incident:

```text
article title changed
page shows new title
Google/social preview still shows old title/image
```

Possible causes:

```text
page data refreshed
metadata data cached separately
OG image route cached separately
social platform cache retained old URL
CDN cached old HTML
```

Trace each cache layer instead of assuming one global cache exists.

## Host leakage incident

Incident:

```text
canonical URLs point to internal service hostname
```

Trace:

```text
metadataBase source
public origin environment variable
reverse proxy Host/X-Forwarded-* configuration
tenant domain validation
preview fallback behavior
```

Fix the ownership model, not just one page string.

## Publication leak incident

Incident:

```text
unpublished article appears in OG image and sitemap
```

Root cause often looks like:

```text
page uses public query
but OG/sitemap use generic DB query by slug
```

Move publication filtering into the shared data boundary.

## SEO observability

Useful logs/metrics:

```text
metadata generation failures
metadata dependency latency
OG generation failures/latency
sitemap generation duration/count
robots response changes
404/410 rate for indexed routes
redirect-chain anomalies
canonical-host mismatch detection
```

Do not log full private metadata inputs if they may contain sensitive content.

Phase 14 owns full observability implementation.

## Automated assertions

Later testing phases can encode invariants such as:

```text
public product page has canonical production host
private dashboard has noindex
published article appears in sitemap
unpublished article does not
OG image route returns image/png
robots.txt returns text/plain
all locale alternates resolve successfully
```

SEO is testable system behavior.

## Build-time validation

Production build can catch:

```text
invalid relative metadata URLs without metadataBase
oversized static social-image files
invalid route metadata conventions
TypeScript metadata shape errors
broken handbook/page imports
```

But build success does not prove crawler correctness.

## Production smoke test

After deployment, verify a representative matrix:

```text
homepage
static marketing page
dynamic article/product
localized page
private route
redirect source
404/deleted route
robots.txt
sitemap.xml
OG image
manifest/icon
```

Test the public deployed host.

## Senior design review questions

For a proposed SEO architecture, ask:

1. What defines the canonical public origin?
2. How is canonical path generated?
3. What is the publication/publication-filter boundary?
4. Which route layers own metadata defaults?
5. Which nested metadata fields are intentionally replaced vs extended?
6. Which metadata is static, cached, or request-time?
7. How do content updates invalidate page/metadata/OG/sitemap output?
8. How do previews/staging avoid accidental indexing?
9. How are locale alternates derived from real translations?
10. How do private routes avoid metadata leaks?
11. Does Proxy bypass public metadata resources correctly?
12. What is tested automatically?

## Architecture example: commerce

```text
Product domain
├─ public product query
├─ canonical slug resolver
├─ SEO mapper
└─ publication/availability rules

App Router page
├─ UI
├─ generateMetadata
├─ JSON-LD
└─ notFound/redirect rules

Metadata routes
├─ opengraph-image
├─ sitemap
└─ robots

Shared config
├─ public site origin
├─ supported locales
└─ verification/brand config
```

This separates domain truth from transport/rendering concerns.

## Anti-patterns

### One global SEO service that knows every route

Creates tight coupling and weak route ownership.

### Metadata generated from client state

Search/share identity becomes unstable and unavailable before hydration.

### Every query parameter indexed

Creates duplicate/thin URL explosion.

### Private data in title/social cards

Leaks information through public HTML/image routes.

### Fixing crawl problems with `robots.txt` only

Ignores status, canonical, noindex, security, and sitemap layers.

### Using preview host as canonical automatically

Pollutes production identity.

## Interview questions

**How would you debug a page that looks correct in-browser but has the wrong social preview?**  
Trace the crawler response, canonical/OG tags, image route, file-based precedence, redirects/Proxy, and platform cache separately from browser rendering.

**How should page, sitemap, OG image, and JSON-LD agree on publication state?**  
They should consume a shared public-domain data boundary that enforces publication and tenant visibility rules.

**Why is SEO architecture tied to URL architecture?**  
Canonical, alternates, redirects, sitemaps, and structured data all describe URL identity; metadata cannot repair an incoherent routing model.

**What should happen when an article slug changes?**  
Redirect the old URL to the new canonical URL, emit the new canonical everywhere, update sitemap/internal links, and ensure social/structured data uses the new identity.

## Capstone exercise

Design the SEO system for a global marketplace with:

```text
10 million products
12 locales
custom seller storefront domains
preview deployments
scheduled publishing
product slug changes
private seller dashboards
price/availability updates
```

Produce:

- canonical host/path rules
- locale alternate rules
- metadata ownership tree
- OG generation/cache strategy
- JSON-LD architecture
- sitemap partition strategy
- robots/noindex policy
- publish/unpublish workflow
- Proxy exclusions
- preview/staging policy
- cache invalidation model
- production smoke-test matrix
- incident runbook for wrong canonical/social preview
