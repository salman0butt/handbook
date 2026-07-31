---
id: intro
title: React Native Developer Handbook
sidebar_position: 1
---

# React Native + Community CLI Developer Handbook

**Baseline: React Native 0.86 · React 19.2.3 · Community CLI 20.x · New Architecture only**

This handbook teaches React Native as a native mobile platform, not as “React with different tags.” The primary path is a bare Android/iOS application created with the React Native Community CLI and maintained through Gradle, Xcode, CocoaPods, Metro, Hermes, Fabric, TurboModules, JSI, and Codegen.

```text
React / TypeScript
      ↓
React Native
      ↓
Metro → Hermes
      ↓
React renderer / Fabric / Yoga
      ↓
JSI ↔ TurboModules / Codegen / native components
      ↓
Android: Kotlin + Gradle     iOS: Swift/ObjC++ + Xcode/CocoaPods
      ↓
Native Android + iOS applications
```

## Production path

The learning path moves from JavaScript/TypeScript and React prerequisites through UI, state, navigation, networking, storage, device APIs, Android/iOS internals, New Architecture, native modules/components, testing, performance, security, releases, CI/CD, large-scale architecture, brownfield integration, library development, upgrades, and staff-level platform decisions.

## Community CLI first

For the 0.86 production baseline, the official release guidance creates a project with:

```bash
npx @react-native-community/cli@latest init MyProject --version latest
```

The generated 0.86 template pins compatible CLI packages instead of assuming every CLI major works with every React Native release. Expo is discussed as an ecosystem option and migration target, but it is not the default workflow taught here.

## How to study

For each major topic, use this sequence:

```text
Problem → mental model → API/syntax → small example → production example
       → Android → iOS → performance → mistakes → production guidance → interview reasoning
```

Use the projects after the corresponding topic block, then the exercises, incident drills, and interview bank. When a section is version-sensitive, its baseline note wins over old blog posts or tutorials.