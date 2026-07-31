---
id: capstone-production-mobile-saas
title: Capstone — Production Mobile SaaS Platform
---

# Production Mobile SaaS Platform

**Baseline: React Native 0.86 + Community CLI + TypeScript + New Architecture.** The capstone integrates the full handbook into one shippable mobile platform.

## Product requirements

Build a multi-tenant work-management SaaS app with OIDC login, organizations/workspaces, dashboard, projects/items, role-aware actions, paginated activity feed, forms, offline cache, queued edits, push notifications, deep links, analytics, crash reporting, feature flags, Android staging/prod variants, iOS staging/prod schemes, one TurboModule and one Fabric component.

## Architecture

```text
Android / iOS app shell
        ↓
React Navigation
        ↓
feature modules
├─ auth
├─ dashboard
├─ projects
├─ activity
├─ settings
└─ notifications
        ↓
domain/use-case contracts
        ↓
services / repositories
├─ TanStack Query server state
├─ API client
├─ mutation queue
├─ local persistence
├─ analytics/crash adapter
└─ feature flags
        ↓
platform adapters
├─ secure credentials
├─ deep links / push
├─ DeviceInfo TurboModule
└─ NativeRating Fabric component
        ↓
Android Kotlin/Gradle + iOS native/Xcode/CocoaPods
```

## Folder structure

```text
src/
├─ app/                 # providers, navigation, bootstrap
├─ features/
│  ├─ auth/
│  ├─ dashboard/
│  ├─ projects/
│  ├─ activity/
│  └─ settings/
├─ domain/              # shared domain primitives only
├─ services/
│  ├─ api/
│  ├─ auth/
│  ├─ analytics/
│  └─ flags/
├─ platform/
│  ├─ storage/
│  ├─ notifications/
│  └─ native/
└─ ui/                  # design-system primitives
android/
ios/
```

## Community CLI and setup

```bash
npx @react-native-community/cli@latest init MobileSaaS --version latest
cd MobileSaaS
npm start
npm run android
npm run ios
```

Keep generated RN 0.86 CLI versions unless compatibility research justifies change. Configure lint/typecheck/test scripts, Bundler/pods, Android SDK/JDK 17 and Xcode 16.1+.

## Authentication and OAuth/PKCE

Use Authorization Code + PKCE in a system browser/auth session. Store refresh/session credential in a Keychain/Keystore-backed library. Access tokens remain in memory where practical and are renewed through a single-flight refresh coordinator. Deep-link callbacks validate `state` and provider/OIDC expectations. No client secret is embedded.

```text
App → system browser → IdP
 ↑                     ↓ code
callback ← verified link + state
 ↓
PKCE exchange → session → secure credential store
```

## Navigation

Use a root bootstrap flow, anonymous auth group and authenticated app group. Use native stack for screen flows and tabs for top-level product sections where appropriate. Params carry IDs, not whole mutable entities. Deep links map to validated route intents. Push routing reuses the same intent resolver.

## Data and server state

Use a typed API client with Zod parsing at untrusted boundaries. TanStack Query owns server data and freshness. Query keys include workspace and filter identity. Paginated activity uses infinite queries. Mutations invalidate or patch precise cache scopes. Retry policies distinguish connectivity/5xx from validation/auth/conflict errors.

## Client state

Keep UI-local state local. Use a small external store/reducer for client-only cross-screen state such as current workspace preference, unsaved drafts or feature-shell state. Do not copy query data into the global store.

## Forms and validation

Use React Hook Form + Zod. Field-level validation improves UX; server remains authority. Forms support keyboard focus progression, scroll-to-error, autofill metadata, accessible labels/errors, optimistic submit only when safe and idempotency keys for duplicate-sensitive creates.

## Offline cache and queued mutations

Persist a bounded subset of query data for useful offline reads. For explicitly offline-editable entities, maintain a durable outbox with client operation IDs, base server version and idempotency key.

```text
edit → local optimistic state → durable outbox
                     ↓ network returns
sync engine → server version/conflict → reconcile cache/local model
```

Define conflict behavior per entity: reject-and-review, merge safe fields, or server-authoritative resolution. Never silently overwrite an important concurrent change.

## Push notifications and deep links

Register FCM/APNs installation tokens server-side. Notification payloads contain stable intent (`projectId`, `activityId`) and minimal non-sensitive text/data. Foreground notification UI is in-app; background/killed tap bootstraps auth, validates workspace/role, then routes once.

## Secure storage and security review

Store privileged credentials only in OS-backed secure credential storage through a maintained library. Review logs, clipboard, screenshots, deep links, exported Android components, iOS entitlements, TLS, backend authorization and dependency/native SDK risk. Treat every bundled environment value as extractable.

## Analytics, crash reporting and feature flags

Define typed event names and privacy-safe payloads. Capture breadcrumbs around auth, navigation, network state and critical mutations without tokens/PII. Upload Hermes source maps, Android R8 mappings and iOS dSYMs for each release. Feature flags have defaults, kill switches and ownership; critical security rules are never flags enforced only on the client.

## Android flavors

Create development/staging/production identities using flavors/build types as appropriate:

```text
com.example.mobilesaas.dev
com.example.mobilesaas.staging
com.example.mobilesaas
```

Vary app label/icon, API host, OAuth/link/push configuration and analytics project. Protect production signing in CI and release AABs through Play testing tracks and staged rollout.

## iOS schemes/configurations

Create Debug/Staging/Release configurations with shared schemes needed by CI. Use xcconfig for non-secret build configuration and distinct bundle IDs, icons, associated domains, push configuration and signing. Archive production and distribute through TestFlight before App Store rollout.

## Native module

Include `DeviceInfoModule` using TurboModule spec + Codegen. Expose only small sync metadata and async storage/device work. Normalize platform output in a TS adapter and integrate one emitted native event with explicit listener cleanup.

## Fabric component

Include `NativeRatingView` with typed props/event, Codegen, Android native view and iOS native view. Make it accessible, controlled, Yoga-compatible and measured in a feed/detail screen without forcing unnecessary native mounts.

## Testing strategy

- unit: domain validators, reducers, query-key builders, conflict policy;
- component: forms, loading/error/empty states, accessible interactions;
- integration: auth bootstrap/refresh, query + navigation, deep-link intent, offline outbox;
- native: module/component build + smoke tests on Android/iOS;
- E2E: login, create project, offline edit + reconnect, push/deep link route, logout;
- manual: VoiceOver/TalkBack, low-end Android performance, iOS memory/startup, permission denial.

## CI/CD

PR pipeline: install locked Node dependencies, typecheck/lint/test, build Android debug/test artifact, build iOS simulator on macOS. Release pipeline: protected signing, production AAB/iOS archive, E2E smoke, symbols/source maps upload, artifact retention and release metadata. Pin Node >=22.11, JDK 17, Ruby/Bundler, Gradle wrapper and Xcode runner image deliberately.

## Performance budgets

Define measurable budgets: cold-start time on reference devices, dashboard first useful content, activity scroll frame health, peak memory, image decode limits, JS/native bundle growth and network payload size. Profile release builds. A PR adding a native SDK must justify startup/binary/upgrade cost.

## Accessibility release gate

Critical workflows must work with VoiceOver and TalkBack, dynamic text, reduced motion, dark mode and accessible touch targets. Automated tests use semantic queries; manual checks validate focus order, modal focus trapping/restoration, errors, lists and gesture alternatives.

## Acceptance criteria

The capstone is accepted only when Android and iOS release-like builds install and pass auth, role checks, forms, pagination, offline restart/sync, deep links, notifications, native module/component, analytics/crash smoke, accessibility checks and performance profiling. CI must reproduce the build from lockfiles; no production secret may be present in JS/native source or generated bundle.

## Staff review questions

1. Which contracts must remain backward compatible when mobile releases roll out slowly?
2. How would five feature teams share native SDKs without duplicate initialization/version drift?
3. What is the upgrade policy for RN minors and native libraries?
4. Which metrics block a rollout automatically?
5. How do feature flags interact with offline state and old binaries?
6. Where are the failure domains between mobile, identity, API, push providers and local persistence?
7. What can be changed by OTA safely, and how is runtime compatibility enforced?
8. Which native capabilities deserve a platform-owned adapter versus feature-owned integration?