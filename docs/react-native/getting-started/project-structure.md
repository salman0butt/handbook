---
title: Project Structure and Ownership
description: Understand JavaScript, Android and iOS files and adopt a scalable feature-oriented source layout.
---

# Project Structure and Ownership

Understand JavaScript, Android and iOS files and adopt a scalable feature-oriented source layout. This page is a canonical production guide for the React Native 0.86 Community CLI baseline. It separates React Native framework behavior, third-party library behavior and Android/iOS platform ownership so version-specific configuration remains visible.

```mermaid
flowchart LR
  A["Presentation"] --> B["Application use cases"]
  B --> C["Domain policy"]
  C --> D["Platform and data adapters"]
  D --> E["Tests, metrics and recovery"]
```

## Core mental model

Start with ownership. Identify which state is authoritative, which thread or process performs the work, which platform resource is involved and what survives backgrounding or process death. Keep rendering pure, move user-triggered work into event handlers, use effects only for synchronization and clean up every listener, timer, subscription and native handle.

In a Community CLI project, JavaScript code does not replace native configuration. A package can expose a TypeScript API while still requiring Android manifest entries, Gradle dependencies, iOS usage descriptions, capabilities, entitlements, pods or Xcode build settings. Record those requirements next to the feature and test both platforms.

## TypeScript pattern

```ts
export interface Repository<T> {
  get(id: string): Promise<T | null>
  save(value: T): Promise<void>
}

export class LoadEntity<T> {
  constructor(private readonly repository: Repository<T>) {}
  execute(id: string): Promise<T | null> {
    return this.repository.get(id)
  }
}
```

Use narrow contracts, discriminated outcomes and stable error codes. Avoid leaking raw native exceptions or transport responses through the UI. A screen should render a finite state model that includes initial, loading, success, empty, recoverable error and terminal/unavailable states where relevant.

## Android and iOS ownership

**Android:** inspect the manifest, Gradle build graph, SDK levels, resources, activity/application lifecycle, permission status and Logcat output. Verify debug and release variants because R8, signing, resource shrinking and environment configuration can change behavior.

**iOS:** inspect Info.plist usage descriptions, targets, schemes, configurations, capabilities, entitlements, pods, deployment target, signing and device logs. Verify the workspace and archive configuration, not only the simulator debug build.

## Production design

- Keep one source of truth and derive presentation values.
- Model cancellation, timeout, retry, idempotency and offline behavior explicitly.
- Validate external input such as links, notifications, files and API data before use.
- Redact tokens, personal data and secrets from logs and analytics.
- Provide accessible labels, roles, focus behavior, dynamic text and reduced-motion behavior.
- Measure on representative release devices before optimizing.
- Place platform-specific code behind a small typed boundary and preserve shared domain logic.

## Failure modes and recovery

Common failures include stale closures, duplicate submissions, race conditions, missing cleanup, blocked permissions, unavailable hardware, invalid platform configuration, process death, network loss and release-only native behavior. Reproduce the exact environment, capture the first meaningful error, classify the failure domain and test one falsifiable hypothesis at a time. Cache deletion is not a diagnosis.

Recovery should be user-safe and observable. Preserve durable intent when appropriate, avoid retry storms, make operations idempotent, expose a manual fallback and attach release/build identity to telemetry. Do not promise delivery or background execution that the OS does not guarantee.

## Testing strategy

Unit-test pure policy and transformations. Component-test visible behavior with semantic queries. Integration-test adapters and native-module boundaries. Use Android emulators and iOS simulators for repeatability, then physical devices for permissions, camera, Bluetooth, push, background work, memory pressure and OEM-specific behavior. Critical journeys need deterministic E2E coverage without fixed sleeps.

## Interview reasoning

A strong answer explains the state owner, lifecycle, platform differences, failure semantics, security boundary, measurements and rollback. A weak answer only names an API or library. Be ready to draw the path from user intent through React, the JavaScript runtime, native configuration and the final Android/iOS behavior.

## Completion checklist

- [ ] TypeScript contract and state model are explicit.
- [ ] Android and iOS setup is documented.
- [ ] Loading, empty, error, denied, offline and retry behavior is defined.
- [ ] Cleanup and process-restoration behavior is tested.
- [ ] Accessibility, privacy and security requirements are covered.
- [ ] Release builds and physical devices are included.
- [ ] Metrics and rollback criteria exist.

## Related deep reference

The preserved 200-topic chapter archive contains expanded API-by-API and platform-by-platform material. Use this focused page as the canonical decision guide and the archive for deeper drills.
