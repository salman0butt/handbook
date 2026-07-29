---
title: Node & Edge Runtimes, Custom Server, Process Model & Package Boundaries
sidebar_position: 8
description: Understand Next.js runtime selection, process/global-state assumptions, server bundling, external packages, custom-server trade-offs, and how runtime boundaries affect caches, networking, shutdown, and deployment.
---

# Node & Edge Runtimes, Custom Server, Process Model & Package Boundaries

“Runs on the server” is still too vague for senior Next.js work.

You need to know:

```text
which runtime?
which process/container?
which deployment instance?
which bundle?
which lifecycle?
which filesystem/network capabilities?
```

A Node.js server, Edge runtime, build worker, and browser have different contracts even when they execute code from the same repository.

## 1. Node.js is the default rendering runtime

Current App Router route segments default to:

```ts
export const runtime = 'nodejs'
```

Node.js gives access to the full Node platform and is the recommended runtime for application rendering.

That includes common capabilities such as:

```text
Node filesystem APIs
TCP clients/database drivers
native modules
standard npm server ecosystem
long-lived process semantics where platform allows
```

## 2. Edge runtime is a constrained server environment

Some App Router pages/layouts/Route Handlers can use:

```ts
export const runtime = 'edge'
```

when the active framework model supports it.

The Edge runtime exposes Web-standard APIs and a smaller compatibility surface.

Do not assume every Node package works there.

## 3. Cache Components and Edge do not mix in the stable model

Current Next.js 16 guidance states Cache Components requires the Node.js runtime.

Therefore, if your architecture depends on:

```text
use cache
Cache Components PPR model
```

you should reason from Node runtime ownership.

Do not copy older Edge-heavy architecture advice into a Cache Components app without re-verification.

## 4. Proxy is Node.js in current Next.js 16

`proxy.ts` currently uses the Node.js runtime and does not support a route `runtime` export.

This differs from older Middleware-era assumptions.

Current-version rule:

```text
proxy.ts
→ Node.js runtime
→ runtime option not configurable in the file
```

## 5. Runtime is not deployment topology

Node runtime can execute as:

```text
one long-lived VM process
Docker replica
managed function/container
regional deployment
adapter-provided runtime
```

The JavaScript runtime contract does not tell you whether process memory persists for ten minutes, ten hours, or one request.

Treat infrastructure lifetime separately.

## 6. Process memory is not durable state

A global variable may survive between requests on one warm process:

```ts
let count = 0
```

but production can have:

```text
pod A → count 12
pod B → count 3
new pod → count 0
restart → count 0
```

Therefore process globals are unsuitable for canonical shared business state.

## 7. Process memory can still be useful for process-local optimizations

Reasonable uses include carefully scoped:

```text
connection pools
SDK clients
compiled schemas
read-only configuration
process-local memoization
telemetry providers
```

provided the code remains correct if the process restarts or multiple replicas disagree.

Correctness must not depend on one global instance.

## 8. Module initialization may happen once per process/bundle load

Top-level server module code can run when the module is loaded.

That makes it suitable for idempotent initialization such as:

```text
creating SDK client
config validation
registering instrumentation
```

but dangerous for business side effects.

Bad top-level behavior:

```text
charge customer
send email
create DB record
```

Module loading is not a user command boundary.

## 9. HMR makes dev module lifetime especially misleading

Development can reload modules, preserve some HMR caches, or recreate server modules as code changes.

Do not infer production singleton behavior from dev observations.

Likewise, Fast Refresh preserving browser state does not imply production navigation preserves the same state under every route transition.

## 10. `instrumentation.ts` owns explicit server startup hooks

For startup-time framework initialization, use supported instrumentation hooks instead of relying on incidental import ordering.

Conceptually:

```text
server/runtime starts
→ instrumentation register()
→ initialize telemetry/runtime integration
→ requests handled
```

This makes lifecycle ownership explicit.

## 11. Initialization must be runtime-aware

Instrumentation code may need to branch according to runtime capability.

Do not import Node-only exporters into a runtime that cannot load them.

Separate adapters or dynamically load environment-specific integrations where documented/safe.

## 12. Node package bundling changes dependency semantics

Next.js normally bundles dependencies used by Server Components and Route Handlers.

This gives the framework control over:

```text
chunking
tree shaking
module transforms
deployment closure
```

But some packages expect native Node resolution/runtime behavior.

## 13. `serverExternalPackages` opts selected packages out

With:

```js
serverExternalPackages: ['some-package']
```

Next.js leaves that package external to server bundling so Node resolves it natively.

Mental model:

```text
bundled
→ emitted as part of server output graph

external
→ runtime resolves installed package
```

This is a deployment responsibility shift.

## 14. External package means runtime package availability matters

If a package is externalized:

```text
local dev node_modules exists
```

is not enough.

The production container/standalone artifact must include the runtime dependency in a resolvable location.

Test the packaged artifact.

## 15. Native modules can require matching platform binaries

Examples may depend on:

```text
linux vs macOS
x64 vs arm64
glibc vs musl
Node ABI
system libraries
```

A production artifact should be built for a compatible runtime target.

This is especially important with image, database, crypto, browser automation, and ML/native packages.

## 16. Node version is part of the artifact contract

Next.js support defines minimum Node versions.

Application dependencies may impose additional constraints.

Production should pin/test a specific supported Node line rather than relying on “whatever latest happens to be installed.”

Include runtime version in diagnostics.

## 17. Filesystem semantics vary by deployment

A Node runtime can expose `fs`, but deployment storage may be:

```text
read-only
container-ephemeral
instance-local
network-mounted
persistent volume
```

Node API availability does not imply persistence.

Write durable user files to object storage or an explicitly durable filesystem.

## 18. Standalone output uses a generated minimal server

`output: 'standalone'` emits a traced minimal runtime including generated `server.js`.

This is **not** your custom server file.

The generated server exists to run the compiled Next.js artifact with minimal dependencies.

## 19. Custom Server is a different architecture

A custom server uses the `next` package programmatically:

```ts
import next from 'next'
```

then connects Next.js request handling to your own Node HTTP server.

Use this only when the built-in server/router cannot satisfy a real requirement.

## 20. Existing backend does not automatically mean custom Next server

If your organization already has:

```text
Go API
NestJS service
Rails backend
Java service
```

Next.js can simply call that backend.

A **custom Next server** specifically means programmatically hosting the Next.js framework server yourself.

Do not conflate these concepts.

## 21. Custom server removes some optimizations

Current Next.js guidance warns that custom servers can remove important framework optimizations such as Automatic Static Optimization behavior in supported contexts.

The more important principle is:

> Ejecting makes you responsible for more of the server lifecycle and routing integration.

Choose it only for requirements the integrated server cannot meet.

## 22. Custom server and standalone output are incompatible models

Standalone output traces/generates its own minimal `server.js` and does not trace your custom server file.

Therefore:

```text
custom server
and
output: 'standalone'
```

should not be combined as if they were additive features.

Choose one runtime ownership model.

## 23. Custom server source is not compiled like application source

Current docs note a custom `server.js` is not processed by the Next compiler/bundling pipeline.

That means your server file must itself be compatible with the target Node runtime and module system.

Do not assume SWC/Turbopack will transform unsupported syntax for you.

## 24. Custom server can own HTTP server options

A programmatic server may be useful for requirements such as:

```text
special socket integration
legacy protocol integration
custom HTTP server lifecycle
unusual routing before Next
existing Node server embedding
```

But first check whether:

```text
Proxy
Route Handlers
rewrites
headers
redirects
adapter/platform configuration
```

already solve the need with less ownership.

## 25. Reverse proxy is usually better than custom server for perimeter concerns

Tasks like:

```text
TLS termination
slow-client protection
WAF
rate limiting
body limits
compression
```

usually belong in reverse-proxy/platform infrastructure, not a custom Next server.

Keep rendering processes focused on application work.

## 26. Custom server does not mean safer shared process state

Even if you own `http.createServer`, production may still run multiple replicas.

Global memory remains process-local.

If shared correctness needs one value, use shared infrastructure.

## 27. Connection pools are per process

Suppose:

```text
pool max = 20
replicas = 20
```

Potential database connections can approach:

```text
20 × 20 = 400
```

before considering other services.

Autoscaling must account for per-process pools.

## 28. Serverless/ephemeral scale changes pool strategy

Bursting many short-lived instances can create connection storms.

Possible mitigations depend on database architecture:

```text
connection proxy/pooler
smaller per-instance pools
HTTP-based DB access
bounded concurrency
warm capacity
```

Framework runtime choice is only one part of backend capacity.

## 29. SDK clients should usually be reused per process

Creating a new HTTP/database SDK client for every component can waste:

```text
connection setup
TLS handshakes
memory
pools
```

A process-local singleton/module-scoped client is often appropriate if the SDK is designed for reuse.

But singleton does not imply globally unique across replicas.

## 30. Hot reload can duplicate clients if initialization is careless

Development module reload may recreate module state.

Database client examples sometimes store a dev client on `globalThis` to avoid opening excessive local connections.

That is a dev ergonomics pattern, not canonical distributed state.

Understand why the pattern exists before copying it.

## 31. Runtime env is read in the executing environment

Server runtime variables can be read from `process.env` when the deployment injects them appropriately.

Browser `NEXT_PUBLIC_*` values are generally compiled into the client artifact.

Do not conflate:

```text
runtime server environment
vs
compiled browser configuration
```

## 32. Build-time secrets should not be required at request time by accident

If a secret exists only in CI during `next build` but runtime code later expects it from `process.env`, production will fail.

Classify every configuration value:

```text
build-only
runtime-only
both
public compiled
```

## 33. Runtime determines available networking APIs

Node.js can use Node HTTP/TCP libraries and most database drivers.

Edge runtime is limited to its supported Web APIs and platform capabilities.

If a package opens raw sockets, Edge compatibility is unlikely unless the platform provides an abstraction.

## 34. Runtime also affects package size/cold-start behavior

A large server bundle with heavy native/server dependencies can increase:

```text
startup time
memory
container image size
cold-start latency
```

Externalization may help some libraries, but measure the full deployment trade-off.

## 35. Edge does not automatically mean faster

Potential benefit:

```text
closer geographic execution
```

Potential costs:

```text
limited APIs
distant database calls
smaller runtime limits
package incompatibility
cache model limitations
```

If the database is in one region, moving compute farther from it can increase total latency.

Optimize the whole dependency graph.

## 36. Region affinity is a data architecture decision

`preferredRegion` and platform-specific placement can influence where server work runs.

Choose placement based on:

```text
source-of-truth location
latency
regulatory requirements
cache topology
failure recovery
```

not only user geography.

## 37. Server shutdown has a lifecycle

For long-lived `next start` processes:

```text
SIGTERM / SIGINT
→ stop taking new work according to server/platform behavior
→ drain in-flight requests
→ finish pending framework after-work
→ process exits
```

Your orchestrator termination grace period must allow meaningful drain time.

## 38. Abrupt termination defeats graceful shutdown

If infrastructure sends SIGKILL immediately or grace period is too short:

```text
in-flight requests drop
pending after() work stops
connections close abruptly
```

Application graceful behavior requires infrastructure cooperation.

## 39. Graceful shutdown still does not make `after()` durable

A machine crash, OOM, region failure, or forced kill can still lose post-response work.

Use queue/workflow systems for required delivery guarantees.

## 40. Health endpoints should avoid false positives

A liveness endpoint should answer whether the process is alive enough to continue.

A readiness endpoint should answer whether the instance should receive traffic.

Do not make liveness depend on every external dependency or a temporary DB outage can restart all replicas simultaneously.

## 41. Runtime failures should be classified

Examples:

```text
module load error
native binary load error
missing env
port bind failure
DB connection exhaustion
out-of-memory
uncaught exception
unhandled rejection
deadlock/CPU saturation
```

Different classes require different response.

## 42. Memory leaks are process-lifetime bugs

Common server causes:

```text
unbounded global maps
request objects retained
telemetry queues never flushed
SDK listeners duplicated
cache without eviction
large response buffers
```

Profile heap over time under realistic request patterns.

## 43. CPU-bound work blocks Node event-loop capacity

Heavy synchronous transforms can reduce concurrency for unrelated requests.

Examples:

```text
large JSON processing
PDF generation
image processing
crypto loops
compression
```

Move or bound CPU-heavy work as needed using worker processes/services/queues/platform facilities.

## 44. Streaming reduces buffering but not CPU cost

A response can stream early while the server still performs expensive work later.

Streaming improves delivery latency.

It does not create extra CPU capacity.

## 45. Server bundle boundaries matter for observability agents

APM/profiling packages may need native Node hooks and may be externalized by Next.js automatically or explicitly.

Verify instrumentation in the actual production artifact.

Do not assume a library imported in source is active in every runtime.

## 46. Multi-Zones create separate process/application runtimes

Each zone can have:

```text
own build
own client runtime
own Server Functions
own caches
own deployment lifecycle
```

A hard navigation across zones is expected because you cross an application boundary.

Shared packages do not make them one runtime.

## 47. Adapters can change deployment implementation

The Adapter API lets a platform integrate with Next.js build/runtime output.

Application architecture should target supported framework contracts while the adapter maps those contracts onto platform primitives.

Do not assume every adapter implements identical persistence, region, or cache semantics unless documented.

## 48. Platform support tables are part of runtime reasoning

Before adopting a feature, check support across:

```text
Node server
Docker
static export
adapter/platform
```

A feature working on one hosting model does not prove universal support.

## 49. Senior runtime decision model

Ask:

```text
1. Which framework features are required?
2. Which Node APIs/packages are required?
3. Where is canonical data located?
4. What process lifetime does platform provide?
5. What state must be shared?
6. What startup/cold-start budget exists?
7. What deployment artifact model is used?
8. What failure/scale topology exists?
```

Then choose runtime/deployment—not the reverse.

## Production checklist

- [ ] Node vs Edge assumptions match current Next.js version
- [ ] Cache Components routes use supported Node runtime
- [ ] Proxy runtime assumptions are current
- [ ] global memory is never canonical shared state
- [ ] process-local clients/pools are bounded
- [ ] externalized packages exist in runtime artifact
- [ ] native dependencies match production platform
- [ ] filesystem persistence assumptions are explicit
- [ ] custom server is used only for a real unmet requirement
- [ ] custom server is not combined with standalone generated server model
- [ ] runtime environment variables are validated at startup
- [ ] graceful shutdown fits orchestrator grace periods
- [ ] durable work uses durable infrastructure

## Interview questions

### Is a module-scoped variable shared across all users?

It may be shared by requests hitting one warm process, but it is not shared across replicas and disappears on restart. It is process-local state, not durable application state.

### When should you use a custom Next.js server?

Only when the built-in server/router and normal framework/platform extension points cannot meet a genuine requirement. It increases lifecycle ownership and can remove optimizations.

### What does `serverExternalPackages` change?

It opts packages out of Next.js server bundling so the Node runtime resolves them natively, shifting dependency availability/compatibility responsibility to the deployment artifact.
