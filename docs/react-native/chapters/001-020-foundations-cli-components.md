---
id: chapters-001-020
title: 001–020 — Foundations, Environment, CLI & Core Components
---

# 001 — React Native Mental Model

React Native is a renderer plus a native runtime/tooling layer for React. React decides what the UI should be; Fabric translates committed React work into native view mutations. Hermes executes JavaScript; JSI is the C++ interface enabling runtime/native integration. The critical distinction from web development is that there is no DOM or browser layout/event engine.

```text
state → React → Fabric Shadow Tree → Yoga → mount → native views
```

Use this model whenever debugging: first decide whether a bug belongs to React state/rendering, React Native rendering/layout, JavaScript runtime, native platform code, or build/runtime configuration.

# 002 — React Native vs React vs Native Platforms

React is platform-agnostic UI logic; React DOM renders to browser DOM; React Native renders to native platform primitives. A React Native engineer must understand both shared React semantics and Android/iOS constraints. Reach for Kotlin/Swift/native SDKs when the capability is platform-specific, latency-sensitive, unavailable in JavaScript, or already exists as a native foundation. Avoid native code merely because it feels “faster”; measure the real bottleneck and account for maintenance on two platforms.

# 003 — Community CLI vs Frameworks

The Community CLI path gives direct ownership of `android/` and `ios/`. For RN 0.86 the official creation command is:

```bash
npx @react-native-community/cli@latest init MyApp --version latest
```

A framework such as Expo can reduce native setup and provide batteries-included APIs, but it is a product/tooling choice rather than a replacement for understanding React Native. This handbook uses Community CLI because it exposes Gradle, Xcode, pods, autolinking, Codegen, signing, native modules, and release mechanics explicitly.

# 004 — JavaScript, TypeScript & React Prerequisites

Before React Native, be comfortable with lexical scope, closures, modules, promises, async/await, object/array immutability, TypeScript unions/generics/narrowing, React props/state/effects/refs/context, and render purity. Mobile bugs often look platform-specific but are ordinary stale closure or state ownership bugs. Prefer strict TypeScript and pure rendering so native complexity is not compounded by avoidable application-state ambiguity.

# 005 — Mobile Development Prerequisites

Mobile software runs under OS lifecycle, memory, permission, network, battery, signing, and store constraints. Apps foreground/background, processes die, permissions can be denied permanently, networks disappear, keyboards obscure content, and released binaries cannot be patched like a web server. Treat lifecycle, persistence, observability, platform UX, and upgrade compatibility as first-class design inputs.

# 006 — Node, Package Managers & Watchman

RN 0.86 requires Node 22.11.0 or newer. Use a version manager so CI and developers agree on Node. npm and Yarn are both viable; keep one lockfile and one team workflow. Watchman is strongly recommended on macOS because Metro relies on efficient filesystem watching. Verify with:

```bash
node --version
npm --version
watchman --version
```

Do not “fix” dependency problems by deleting lockfiles casually; reproduce and understand the resolved graph first.

# 007 — JDK, Android Studio & Android SDK

Use JDK 17 for the RN 0.86 baseline. Install Android Studio, SDK Platform 36, Build Tools 36.0.0, command-line tools, emulator, and an API-compatible system image. Verify:

```bash
java -version
adb version
sdkmanager --list
```

The generated project targets API 36, compiles against API 36, and supports API 24+. `compileSdk` controls compile-time API availability; `targetSdk` opts into modern OS behavior; `minSdk` controls install eligibility.

# 008 — ANDROID_HOME, PATH, ADB & Devices

Set `ANDROID_HOME` to the Android SDK directory and include platform-tools/emulator tools on `PATH`. `adb devices` is your first device diagnostic. A physical Android device needs Developer Options and USB debugging; authorize the host when prompted.

```text
CLI → Gradle build → APK install → adb → device process
```

If `run-android` fails, separate “could not build” from “built but could not install/launch.” Those are different failure domains.

# 009 — Android Emulator & AVD

An AVD models a device profile plus an Android system image. Prefer hardware acceleration, a modern API image, and at least one lower-end test profile. Emulators are excellent for repeatable testing but not a substitute for physical-device checks involving thermals, camera, Bluetooth, push delivery, OEM behavior, and real memory pressure.

# 010 — Xcode, Simulator & Command Line Tools

Building iOS requires macOS. RN 0.86 has a minimum supported Xcode of 16.1, while current docs recommend the latest Xcode. Install Command Line Tools and required simulator runtimes. Verify:

```bash
xcodebuild -version
xcrun simctl list devices
```

Xcode manages targets, schemes, build settings, signing, archives, simulators, devices, and native debugging. A React Native iOS build is still an Xcode build.

# 011 — Ruby, Bundler & CocoaPods

The Community Template uses a Gemfile so Ruby tooling is reproducible. Install bundle dependencies, then pods through Bundler where possible:

```bash
bundle install
cd ios
bundle exec pod install
```

RN 0.86's template allows CocoaPods >=1.13 while excluding problematic 1.15.0/1.15.1; Xcode 16 integration guidance points to CocoaPods 1.16.2 and xcodeproj 1.27.0 when needed. Treat Gemfile/Podfile/Podfile.lock as build infrastructure, not incidental files.

# 012 — Environment Verification & Doctor

Use layered verification before blaming React Native:

```bash
node -v
java -version
adb devices
xcodebuild -version
bundle exec pod --version
npx react-native doctor
```

`doctor` checks common environment requirements but cannot guarantee every native dependency or signing setup is correct. Keep a known-good sample project to distinguish machine-wide failures from application-specific failures.

# 013 — What Community CLI Actually Does

The CLI coordinates project initialization, Metro, Android/iOS builds, device selection, configuration discovery, autolinking, and diagnostics. It delegates native compilation to Gradle/Xcode rather than replacing them.

```text
CLI
├─ init/template
├─ Metro server
├─ Gradle + adb
├─ Xcode/simctl
├─ config discovery
└─ autolinking
```

Senior troubleshooting follows the delegation chain instead of treating a CLI error as one opaque system.

# 014 — Init, Version Selection & Compatibility

`--version latest` asks the initializer for the current RN line. For existing projects, never assume `@react-native-community/cli@latest` is safe: the CLI has an independent release cycle. RN 0.86's template pins CLI 20.1.0 packages. The safest default is to keep the generated compatible versions and upgrade RN using official release diffs, then let the template/versioned tooling guide CLI changes.

# 015 — Start, Run Android & Run iOS

Generated scripts normally map to the CLI:

```bash
npm start
npm run android
npm run ios
# equivalents inside the project
npx react-native start
npx react-native run-android
npx react-native run-ios
```

`start` launches Metro; `run-android` invokes Android build/install/launch; `run-ios` invokes the iOS build/simulator flow. Build a mental model of which process owns each terminal so you can inspect the right logs.

# 016 — CLI Config, Autolinking & Plugins

`npx react-native config` resolves project and dependency metadata used by autolinking. Native libraries declare platform configuration discoverable by the CLI; Gradle and CocoaPods integrations consume that configuration. `react-native.config.js` is for project/package overrides and custom behavior, not a ritual file every app needs. Manual linking tutorials from pre-autolinking React Native are historical unless a package explicitly requires custom native integration.

# 017 — CLI Caches, Cleaning & Troubleshooting

Caches exist at several layers: Metro transform/file-map caches, package-manager cache, Gradle caches/build outputs, CocoaPods integration, Xcode DerivedData, simulators/devices. Clear the narrowest relevant layer. `--reset-cache` is for Metro problems; it will not fix a Gradle dependency conflict or an invalid provisioning profile. Preserve logs before destructive cleaning so the root cause remains observable.

# 018 — Generated Project Structure

A Community CLI project contains JavaScript/TypeScript plus real native projects:

```text
MyApp/
├─ android/
├─ ios/
├─ App.tsx
├─ index.js
├─ package.json
├─ metro.config.js
├─ babel.config.js
└─ tsconfig.json
```

`index.js` registers the root component through `AppRegistry`; Metro resolves/transforms modules; Babel transforms syntax; TypeScript checks types; Gradle/Xcode build the platform binaries. `android/` and `ios/` must be reviewed and version-controlled like any other source.

# 019 — AppRegistry & Application Boot

`AppRegistry.registerComponent` tells React Native how to obtain the root React component for an app key. Native startup initializes the runtime, loads the JavaScript bundle, and asks the registered provider for the root tree. App startup bugs can therefore happen before React renders: native initialization, bundle loading, Hermes evaluation, module setup, or registration can all fail.

```text
OS launches binary → RN runtime → JS bundle → AppRegistry → root React tree
```

# 020 — View, Text & Native Component Fundamentals

`View` is the fundamental layout/container primitive and `Text` is the text primitive. Text has special nesting/measurement behavior; raw strings cannot be placed directly under arbitrary `View` children as if JSX were HTML. Prefer semantic, accessible component abstractions built on these primitives. Every component choice should consider layout, hit testing, accessibility, render cost, and whether it maps to a native-backed view or a composite React component.