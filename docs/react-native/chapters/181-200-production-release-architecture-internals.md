---
id: chapters-181-200
title: 181–200 — Production, Release Engineering, Architecture & Internals
---

# 181 — E2E and Accessibility Testing

Use a current compatible E2E solution such as Detox when its RN/platform support matches the project. Build the actual app for simulator/emulator, select elements by stable accessible/test identifiers, control backend fixtures, and diagnose flakiness instead of adding sleeps. Pair automation with manual VoiceOver/TalkBack checks because screen-reader navigation, dynamic type and gesture discoverability require platform-level validation.

# 182 — App Configuration and Environment Safety

Development, staging and production differ through build-time/native configuration, backend endpoints, feature flags and signing—not by pretending `.env` values are secret. Android can use flavors/resources/BuildConfig; iOS can use schemes/configurations/xcconfig. Keep a typed configuration module in JS so features do not read raw environment variables everywhere.

# 183 — Android Flavors and iOS Schemes

Create matching product identities such as dev/staging/prod. Android flavors can change `applicationId`, icons, resources and build fields; iOS schemes/configurations can choose bundle IDs, xcconfig, assets and signing. Ensure deep-link domains, OAuth redirect URIs, push credentials and analytics projects also map per environment—those external systems are part of the variant contract.

# 184 — Android and iOS Store Releases

Android release flow: versionCode/versionName → signed AAB → Play Console testing track → staged rollout → monitoring. iOS: build/version → archive → upload/App Store Connect → TestFlight → review/release. Treat rollout as a production control: observe crashes, ANRs, startup, auth, payment/critical flows and stop/rollback server flags where possible if the binary is unhealthy.

# 185 — CI/CD for Community CLI Apps

A practical pipeline runs lint/typecheck/tests, Android build and iOS build on appropriate runners, preserves caches safely, injects signing material, and uploads artifacts/symbols/source maps.

```text
commit/PR
  ↓ quality gates
Android: Linux/macOS → Gradle → AAB/APK
_iOS_: macOS only → Bundler/CocoaPods/Xcode → archive/IPA
  ↓
release metadata + symbols + deployment
```

CI should reproduce the lockfiles, Node/JDK/Ruby/Xcode toolchain, not “whatever latest is on runner.”

# 186 — OTA JavaScript Updates

Bare React Native can use ecosystem OTA systems, but an OTA can update only content compatible with the installed native runtime/binary. A JS bundle that calls a native module absent from the installed binary is incompatible. Define runtime-version matching, signing/integrity, rollout, rollback and store-policy compliance. OTA is not a way to evade app-store review for native-capability changes.

# 187 — Analytics, Logs and Crash Reporting

Build one observability layer that normalizes screen events, product events, structured logs, breadcrumbs, JS exceptions, native crashes and performance traces. Include app version/build, platform and release/environment while minimizing personal data. Upload Hermes source maps, Android mapping files and iOS dSYMs for the exact build. Correlate incidents with rollout cohorts and feature flags.

# 188 — Mobile Security Architecture

Use OWASP mobile concepts: protect credentials at rest, enforce TLS/server authorization, minimize secrets/data, validate deep links, harden exported Android components, configure iOS entitlements correctly, and assume clients can be inspected/tampered with. R8/obfuscation raises reverse-engineering cost but does not make embedded secrets safe. Root/jailbreak detection can inform risk policy but cannot create a trustworthy client.

# 189 — Internationalization and RTL

Internationalization includes translations, locale detection, dates/numbers/currencies, pluralization, text expansion, dynamic language switching and RTL. Keep message IDs stable and formatting locale-aware. Test long German-like strings, CJK fonts, Arabic/Hebrew RTL, plural categories and large accessibility fonts. Mirroring icons/gestures requires semantic review rather than blindly flipping every asset.

# 190 — Monorepos and Design Systems

A monorepo can share TypeScript/domain/design packages across app(s), but Metro, native Gradle/CocoaPods dependencies, symlinks and package boundaries must be configured intentionally. A mobile design system owns tokens, components, accessibility, platform adaptations and variants. Storybook for React Native can be valuable when compatible/current, but real-device app integration remains the final behavior test.

# 191 — Feature-Based Application Architecture

Organize by product capability and dependency direction, not one global folder for every hook/component.

```text
app/navigation/composition
        ↓
features (screens + orchestration)
        ↓
domain/use cases
        ↓
data repositories / API / storage
        ↓
platform/native adapters
```

Shared UI should be genuinely shared; server state and client state have different owners. Keep native/platform details behind interfaces so features remain testable and platform changes stay localized.

# 192 — Large-Scale React Native and Team Ownership

At scale, architecture is also organizational. Define module owners, dependency policies, native-foundation ownership, release trains, feature-flag standards, observability contracts, upgrade windows and ADRs. Avoid every team independently choosing navigation/state/network/native libraries. Platform teams should enable product teams without becoming a blocking monolith.

# 193 — Brownfield Integration

React Native can be embedded into existing Android/iOS apps as selected surfaces. The native host owns application lifecycle/navigation and initializes an RN runtime/surface when needed. Define boundary contracts for auth, navigation, analytics and data passing.

```text
existing native app
   ↓ host/navigation
React Native surface
   ↓ shared RN feature/domain
```

Brownfield success depends on runtime lifetime, dependency integration, back navigation and ownership clarity more than on rendering a single RN screen.

# 194 — React Native Library Development

Use current library tooling (commonly `create-react-native-library` where appropriate/current) to provide an example app, JS/TS API, Codegen specs for native modules/components, Android/iOS implementations, tests and publishing metadata. Support a deliberate RN compatibility range, test New Architecture, document native installation and use semantic versioning for API/native contract changes.

# 195 — Upgrading React Native

Upgrade by reading release notes, support policy and Upgrade Helper/native template diffs. Inventory native dependencies first; update the branch from current main; change one RN minor at a time for old apps when practical; apply Android/iOS template changes; reinstall pods/Gradle deps; test startup, navigation, native modules, notifications, deep links, storage, release builds and performance. Never blindly replace `android/`/`ios/` and lose product-specific native configuration.

# 196 — Legacy Architecture: Historical Knowledge

Older apps used Bridge/BatchedBridge, legacy `NativeModules`, old UIManager/renderer and bridge-style module registration. Understand this to migrate old libraries and debug legacy code, but do not teach it as the new-project model. RN 0.80 froze legacy work; RN 0.82 became New-Architecture-only; RN 0.86 continues removing legacy internals.

# 197 — React Native Initialization Internals

Conceptually startup creates the native host/runtime infrastructure, initializes Hermes, installs core JSI/native bindings, loads/evaluates the bundle, resolves AppRegistry, renders the root through React/Fabric, computes Yoga layout and mounts native views. Lazy TurboModules and prebuilt iOS RN binaries change costs compared with old architectures. Profile each stage rather than treating “RN startup” as one black box.

# 198 — Modern Threading Model

Avoid the obsolete three-box diagram. Think in roles:

```text
JS runtime execution / React work
          ↕ RuntimeScheduler / JSI / C++
Fabric render + commit work
          ↓
platform UI/main-thread mount/draw
          ↕
native modules/background native queues
```

Specific operations can schedule across these roles. A native module doing disk/network work should move that work off the UI thread; a synchronous JSI API must remain tiny; animation/UI operations need frame-aware scheduling.

# 199 — Senior Engineering Decision Patterns

Senior engineers evaluate libraries by maintenance, RN 0.86/New Architecture compatibility, native code, binary size, platform behavior, API quality, security, testability and upgrade risk. They distinguish server/client/navigation/native state, choose JS vs native implementation from requirements and measurements, build failure observability, and design upgrades/releases as continuous engineering rather than emergencies.

# 200 — Staff-Level Mobile Architecture

Staff-level reasoning sets organization-wide constraints: shared native foundations, SDK governance, version policy, CI fleet, performance budgets, observability schemas, security baselines, design-system contracts, release trains, rollback/feature-flag strategy, backward-compatible backend contracts and migration plans. The core question becomes not “how do I build this screen?” but “how can many teams ship independently while preserving platform reliability, upgradeability, performance and user experience?”

```text
product teams
   ↓ shared contracts / paved roads
mobile platform architecture
├─ RN/runtime/version policy
├─ native SDK foundation
├─ design system
├─ data/security/observability standards
├─ CI + signing + release train
└─ upgrade/migration governance
   ↓
reliable Android + iOS products at organization scale
```