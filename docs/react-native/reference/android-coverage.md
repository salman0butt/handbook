---
id: android-coverage
title: Android Coverage Audit
---

# Android Coverage Audit

**RN 0.86 template baseline:** minSdk 24, compileSdk/targetSdk 36, Build Tools 36.0.0, NDK 27.1.12297006, Kotlin 2.1.20, Gradle 9.3.1. JDK 17 remains the recommended development baseline in React Native environment guidance.

| Android topic | Status | Handbook location |
| --- | --- | --- |
| Android Studio | Covered | environment + 121–130 |
| SDK Manager / platform / build tools | Covered | environment/version baseline |
| Emulator / AVD | Covered | environment/Android |
| Physical device / USB debugging | Covered | environment/Android |
| `adb` | Covered | Android/debugging |
| Logcat | Covered | Android/debugging/incidents |
| `android/` project structure | Covered in depth | 121–130 |
| Gradle wrapper | Covered in depth | 121–130 |
| Android Gradle Plugin | Covered | version baseline/Gradle sections |
| `build.gradle` / settings | Covered | 121–130 |
| repositories/dependencies/tasks | Covered | Gradle sections |
| Kotlin | Covered | native project/modules |
| Java interoperability | Covered | native project/modules |
| AndroidManifest | Covered | Android/permissions/deep links |
| resources | Covered | Android/build variants |
| MainActivity | Covered | Android project/startup |
| MainApplication / application host | Covered | Android project/startup |
| minSdk / targetSdk / compileSdk | Covered | 121–130/version baseline |
| namespace / applicationId | Covered | Android project/variants |
| BuildConfig | Covered | configuration/variants |
| permissions | Covered | 097–105 |
| intents / App Links | Covered | deep linking/platform APIs |
| build variants / product flavors | Covered in depth | 183 + Android chapters |
| debug / staging / release | Covered | 182–185 |
| R8 / obfuscation | Covered | Android release/security |
| signing / upload key / Play App Signing | Covered | 184 + Android release |
| APK / AAB | Covered | Android release |
| Play Console / testing / staged rollout | Covered | 184 |
| profiling / ANR | Covered | 161–170/incidents |
| native modules / Codegen | Covered | 152–159 |
| native components / Fabric | Covered | 157–158 |

## Build mental model

```text
TypeScript / assets
      ↓ Metro / Hermes bundle work
React Native Android Gradle plugin + app Gradle project
      ↓
Kotlin/Java/C++ + Android resources + manifest + native dependencies
      ↓
variant tasks / R8 / signing
      ↓
APK for device/testing or AAB for Play distribution
```

The Android project is part of the application source of truth. It should not be deleted/replaced casually during upgrades because product-specific manifests, flavors, signing, resources, SDK integrations and native code live there.
