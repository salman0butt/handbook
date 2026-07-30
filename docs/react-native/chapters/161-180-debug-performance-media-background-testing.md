---
id: chapters-161-180
title: 161–180 — Debugging, Performance, Media, Background Work & Testing
---

# 161 — Debugging Decision Tree

Start by classifying the failure before changing code.

```text
Does app build?
├─ no → Gradle / Xcode / pods / dependency graph / signing
└─ yes
   ├─ startup crash → native logs + Hermes/JS startup traces
   ├─ JS exception → RN DevTools/source map
   ├─ wrong UI/layout → React/Fabric/layout/a11y
   ├─ native API failure → permission/config/library logs
   └─ performance → profiler + traces + memory/frame data
```

Reproduce, preserve evidence, minimize variables, form one hypothesis, test it, and verify the fix. “Clear everything and reinstall” is not an investigation method.

# 162 — LogBox, Console and Breakpoints

LogBox surfaces React Native warnings/errors in development. Console output is useful during development but should not become production observability or leak secrets. Use source breakpoints and React Native DevTools for JavaScript execution, component inspection and network/runtime analysis. Remember debug timing and bundling differ from release, so performance conclusions need release-like builds.

# 163 — Native Crashes and Symbolication

A native crash exits the process outside ordinary React error boundaries. Android stack traces may require mapping/deobfuscation after R8; iOS crash reports need dSYMs/symbols. Hermes/JavaScript crash services also need source maps. Release pipelines should upload the exact mapping/symbol artifacts tied to the shipped build so crashes correlate to source reliably.

# 164 — Error Boundaries and Recovery

React error boundaries catch render/lifecycle errors in descendant React trees, not every async/native exception. Use boundaries around recoverable product regions and a top-level fallback for catastrophic UI failures. API errors belong in request/server-state handling; native process crashes need crash reporting; promise failures need explicit handling. Recovery should preserve user work where safe and avoid infinite retry loops.

# 165 — Frame Budgets and Threads

At 60 Hz, each frame is ~16.67 ms; at 120 Hz it is ~8.33 ms. Work competing for that budget includes native main/UI-thread layout/drawing/mounting, animation work, image decode, React commits, and sometimes JavaScript-driven updates. Modern RN is not accurately described by only “JS thread vs native thread”; measure the subsystem that misses deadlines.

# 166 — React Render Performance

Start with state ownership and component boundaries. `memo`, `useMemo`, and `useCallback` are tools for avoiding expensive repeated work/prop identity churn, not mandatory decorations. Profile rerenders and actual cost. Moving fast-changing state lower in the tree often outperforms complex memoization. Avoid context providers whose changing values invalidate entire navigation trees.

# 167 — List Performance Case Study

Symptoms: frames drop during feed scroll on low-end Android. Measure frame timing, JS/React render cost, image decode/memory, row mount cost and network paging. Hypotheses may include unstable keys, expensive row composition, oversized images, too-large render windows, synchronous selectors, or nested virtualization. Fix the measured cause, then replay the same scenario on the same device/build to verify.

# 168 — Startup Performance

Startup spans native process launch, SDK initialization, React Native runtime/Hermes creation, bundle evaluation, module initialization, first React render, Fabric commit/mount and first useful content. Defer noncritical SDKs/work, lazy-load feature code/modules where architecture supports it, keep first screen simple, and measure cold start separately from warm resume.

# 169 — Bundle and Dependency Cost

Every dependency may add JS bytes, native binary size, startup initialization, transitive native libraries, security surface and upgrade constraints. Inspect whether a library solves enough value to justify its cost. Prefer tree-shakeable/modular imports where supported and avoid importing huge datasets at startup. Native dependencies are especially expensive organizationally because they affect both build systems and store releases.

# 170 — Memory Leaks and Profilers

Look for retained subscriptions, timers, closures, navigation screens, caches, decoded images, native sessions and JSI/native resources. Use Android Studio profiler for Android memory/CPU and Xcode Instruments for iOS allocations/leaks/time profiling. A steadily rising heap during repeated navigate-away/back cycles is a useful reproducible signal, but distinguish caches that stabilize from true unbounded retention.

# 171 — Image Architecture

Use `Image` with known layout, sensible `resizeMode`, placeholders and failure states. Request images near display size from a CDN when possible. Huge decoded bitmaps can cause OOM even when compressed network files are small. SVG typically requires a maintained ecosystem library/toolchain. Cache policy should account for memory, disk and server invalidation rather than assuming every image library caches the same way.

# 172 — Files, Uploads and Downloads

Core RN does not provide a universal high-level filesystem/background transfer stack; use maintained native libraries for the exact requirement. For uploads, multipart/form-data may stream files rather than converting them to base64. For downloads, handle storage destination, temporary files, resumability, cancellation, low storage and platform permissions. Validate MIME/type server-side regardless of client checks.

# 173 — Audio and Video

Media playback/recording relies on native codecs, sessions, audio focus, interruptions, permissions and background capabilities. Choose a library that supports RN 0.86/New Architecture and required DRM/streaming modes. Release resources when screens leave, handle phone calls/headphones/background transitions, and test on real devices because simulators cannot model all media hardware behavior.

# 174 — Push Notification Architecture

```text
backend
  ↓ provider request
FCM / APNs
  ↓
device OS notification service
  ↓
native app notification integration
  ↓
React Native routing/state
```

Device tokens identify app installations/provider routing, not users by themselves. Store token↔installation/user relationships server-side, rotate on token changes, and never put sensitive data into notification payloads unnecessarily.

# 175 — Foreground, Background and Killed Notification States

A notification may arrive while the app is active, backgrounded, or not running. UI presentation, JS callback availability and data-message behavior differ by platform and provider mode. Design routing idempotently: notification tap should resolve an intent, bootstrap auth/navigation, validate destination, then navigate exactly once.

# 176 — Background Execution Constraints

Mobile OSes aggressively limit background execution. Android offers mechanisms such as WorkManager and foreground services for eligible use cases; iOS offers background modes/tasks with strict policies and runtime limits. React Native cannot promise arbitrary forever-running JavaScript. Put durable jobs on the backend whenever possible and use native scheduling APIs for device-required bounded work.

# 177 — Offline-First Architecture

Offline-first means the local model can support useful work without immediate server success. Reads come from a local/cache source; writes may become queued mutations with client IDs/idempotency/version metadata.

```text
UI → local/domain state → mutation queue → network sync → server
 ↑          ↓ conflict resolution/versioning          ↓
 └──────────── reconciled local state ←───────────────┘
```

Define conflict semantics per domain; “last write wins” is a policy, not a default truth.

# 178 — Real-Time Connections

WebSockets provide a long-lived connection but mobile networks and lifecycle make disconnect/reconnect normal. Authenticate connections, heartbeat where protocol requires it, back off reconnects, resume/resync after gaps, deduplicate events, and handle ordering/version numbers. Backgrounded apps may have sockets suspended/terminated; push notifications or server resync may bridge that gap.

# 179 — Jest and React Native Testing Library

RN 0.85 moved the Jest preset into `@react-native/jest-preset`; current projects should follow the baseline/template and current testing docs rather than older `preset: 'react-native'` guidance. React Native Testing Library encourages testing accessible behavior/queries rather than component internals. Unit-test pure domain functions separately from component integration tests.

# 180 — Async UI, Timers, Native Mocks and Integration Tests

Use fake timers only when the test needs deterministic timer control, and restore real timers afterward. Await user-visible async changes rather than arbitrary sleeps. Mock native modules at their adapter boundary with realistic contracts, including failures. Navigation/server-state tests should verify observable outcomes and provider integration without reproducing third-party implementation details.