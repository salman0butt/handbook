---
id: chapters-121-140
title: 121–140 — Android, iOS, Gradle, CocoaPods & Metro
---

# 121 — Android Project Anatomy

The `android/` directory is a Gradle multi-project build containing the application module plus React Native build integration.

```text
android/
├─ app/
│  ├─ build.gradle
│  └─ src/main/AndroidManifest.xml
├─ build.gradle
├─ settings.gradle
├─ gradle.properties
└─ gradle/wrapper/
```

Root configuration establishes SDK/Kotlin/build-tool values; the app module defines namespace/application ID, variants, signing, dependencies and packaging. `settings.gradle` wires the React Native Gradle plugin and autolinking.

# 122 — Android Manifest, MainActivity and MainApplication

`AndroidManifest.xml` declares app components, permissions, intent filters, metadata and package-facing capabilities. `MainActivity` hosts the React Native surface and participates in Android Activity lifecycle/navigation behavior. Application-level initialization belongs in the application layer, but avoid eagerly initializing every SDK at process start because it increases startup cost and failure surface.

# 123 — Android Resources, Namespace and applicationId

Android resources (`res/`) contain strings, drawables, icons, colors and configuration-specific resources. `namespace` identifies generated/source package scope; `applicationId` identifies the installed app and Play Store package. They can differ. Flavors commonly change application ID suffixes, app names/icons, resources and endpoints while preserving shared code.

# 124 — minSdk, targetSdk and compileSdk

`minSdk` is the oldest Android API allowed to install; `compileSdk` determines APIs available at compile time; `targetSdk` declares the OS behavior level the app targets. RN 0.86 template: min 24, compile 36, target 36. Increasing target SDK can change runtime behavior even when source code is unchanged, so target bumps deserve regression testing.

# 125 — Android Build Variants and Flavors

A variant is typically a product flavor × build type combination. A common production setup is `devDebug`, `stagingRelease`, `prodRelease` or a simpler debug/staging/release model. Keep identifiers, icons, URLs and feature flags variant-aware. Explicitly tell the React Native Gradle plugin which custom variants are debuggable when its default assumptions no longer match.

# 126 — Android Signing, APK and AAB

Debug builds use a debug keystore. Production releases use a protected upload key and generally Play App Signing for distribution. APK is an installable package; AAB is a publishing bundle from which Google Play generates optimized APKs. Never commit production keystores/passwords to source control. CI signing should inject protected material at build time.

# 127 — R8, ProGuard Rules and Release-Only Bugs

R8 shrinks/optimizes/obfuscates Android bytecode for release builds when enabled. Native SDKs using reflection or dynamic lookup may need keep rules. A debug-only success followed by release crash is a classic sign to inspect minification, missing resources, BuildConfig differences, Hermes bundle mode, signing/API configuration and release-only flags—not to assume “React Native release is broken.”

# 128 — adb and Logcat

`adb` is the command-line bridge to Android devices/emulators. Use it to install/uninstall apps, inspect processes, invoke deep links, forward ports and capture logs.

```bash
adb devices
adb shell am start -W -a android.intent.action.VIEW -d 'https://example.com/path'
adb logcat
```

Filter logs by process/tag and preserve native stack traces before restarting an app.

# 129 — Gradle Wrapper, Plugins and Tasks

The Gradle wrapper pins the project Gradle runtime; RN 0.86 template uses Gradle 9.3.1. Plugins configure build logic such as Android application, Kotlin and React Native. Tasks form the execution graph: compilation, bundling, resource processing, packaging and tests. Use `./gradlew tasks` and `./gradlew app:dependencies` to inspect the build instead of guessing.

# 130 — Gradle Dependency Resolution and Caches

Gradle resolves Maven dependencies from configured repositories and chooses versions/variants according to attributes and constraints. Conflicts after installing a native package often come from transitive Android libraries, Kotlin/AGP requirements, duplicate classes or incompatible min/compile SDK assumptions. Inspect the dependency graph and dependency insight; clearing caches cannot resolve an objectively incompatible graph.

# 131 — iOS Project Anatomy

The `ios/` directory contains the Xcode project/workspace, native source, plist/entitlements and CocoaPods integration.

```text
ios/
├─ App.xcodeproj/
├─ App.xcworkspace/   ← after pod install
├─ Podfile
├─ Podfile.lock
├─ App/
│  ├─ AppDelegate.*
│  └─ Info.plist
└─ Pods/              ← generated locally/CI
```

When CocoaPods is used, open/build the workspace because it includes both the app project and pods.

# 132 — Xcode Targets, Schemes and Configurations

A target defines a product; build configurations provide settings such as Debug/Release; schemes select targets/configurations and actions for build/test/run/archive. Staging often adds configurations/schemes and bundle identifiers. Keep scheme files shared when CI depends on them. A scheme name is not itself an environment-security boundary.

# 133 — Info.plist, Entitlements and Capabilities

`Info.plist` stores app metadata and platform configuration including many permission usage descriptions and URL declarations. Entitlements represent signed capabilities such as associated domains, push, keychain groups and background modes. Xcode capabilities edit project/entitlement configuration, but backend/portal configuration can still be required.

# 134 — AppDelegate and Native Startup

The iOS application delegate participates in process launch, React Native host/root view setup and platform callbacks. Keep startup work minimal and deterministic. Native SDK initialization, push callbacks and linking handlers commonly touch this layer; follow current library guidance because old Objective-C AppDelegate snippets may not match the current template or Swift/ObjC++ integration model.

# 135 — Swift and Objective-C Interoperability

React Native's iOS internals/native extension points still involve Objective-C/Objective-C++ and C++ generated interfaces even when app code is Swift. Do not invent a Swift-only shortcut where Codegen expects generated protocols/base classes or C++ bindings. Use Swift where supported, and add thin Objective-C++ adapters when required by the current New Architecture API.

# 136 — iOS Signing, Provisioning, Archive and TestFlight

A bundle ID identifies the app; certificates identify signing authority; provisioning profiles bind app/capabilities/devices or distribution rules. Xcode can automate much of this, but CI/release engineers need the model. Archive produces a distributable build record; Organizer/App Store Connect handle upload; TestFlight distributes pre-release builds. Signing failures are configuration failures, not JavaScript failures.

# 137 — CocoaPods Mental Model

CocoaPods resolves native iOS dependencies described by the Podfile and podspecs, then integrates them into an Xcode workspace. React Native's Podfile calls `use_native_modules!` for autolinking and `use_react_native!` for core setup. `pod install` updates integration from Podfile/lock state; `pod update` changes resolved versions and should not be used casually as a generic repair command.

# 138 — Why npm Native Packages Need Pod Installation

Installing a JavaScript package can add an iOS native podspec. npm only places files in `node_modules`; CocoaPods must update the Xcode workspace/build graph so the native library compiles and links.

```text
npm install native-package
      ↓
node_modules/package/*.podspec
      ↓ use_native_modules!
bundle exec pod install
      ↓
Pods project + workspace integration
```

JavaScript-only packages need no native linking step.

# 139 — Metro Resolver, Transformer and Module Graph

Metro is React Native's JavaScript bundler/dev server.

```text
entry file
  ↓ resolver
module graph
  ↓ transformer/Babel
transformed modules + assets
  ↓ serializer
bundle + source map
  ↓
Hermes/runtime
```

Resolution chooses files/packages/platform variants; transformation processes syntax; serialization emits a bundle representation. Debug each stage separately when an import cannot resolve versus syntax transform fails versus runtime evaluation crashes.

# 140 — Metro Configuration, Monorepos and Caches

`metro.config.js` extends React Native's Metro defaults. Monorepos may require workspace roots/watch folders/resolver visibility depending on layout and current Metro symlink/package-export behavior. Prefer current supported configuration over historical `extraNodeModules` hacks. Metro caches transformation/file-map state; reset them for stale resolution/transform evidence, not for native build failures. Aliases must also agree with TypeScript/Babel/runtime resolution so editor success does not mask bundle failure.