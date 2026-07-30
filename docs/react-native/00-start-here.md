---
id: 00-start-here
title: 00 — Start Here
sidebar_position: 3
---

# 00 — Start Here

## What React Native is

React Native lets React describe native application UI. Your component tree is not a browser DOM: React Native's renderer creates and updates platform-native views through Fabric, while JavaScript runs in a JavaScript engine—Hermes by default in this baseline.

```text
TypeScript/JSX
    ↓ React reconciliation
React Native renderer
    ↓ Fabric Shadow Tree
Yoga layout
    ↓ commit / mount
UIKit views / Android views
```

React supplies the component/state/effect programming model. React Native supplies the renderer, native components/APIs, platform integration, build tooling, and runtime infrastructure.

## React Native vs React DOM

`<View>` is not `<div>`, `<Text>` is not `<span>`, and `StyleSheet` is not CSS. There is no browser layout engine, DOM event system, or default HTML semantics. Native text nesting, keyboard behavior, permissions, navigation, lifecycle, accessibility, memory, release signing, and OS background rules matter.

## React Native vs fully native Android/iOS

React Native shares application logic and much UI across platforms while retaining real native projects. Kotlin/Java and Swift/Objective-C/C++ still matter for build configuration, platform capabilities, performance-sensitive integrations, native SDKs, and production debugging.

## Community CLI vs Expo

This handbook is **Community CLI first**. Expo is excellent when its framework and services fit the product, but the learning target here is direct ownership of `android/` and `ios/`, native build systems, autolinking, Codegen, and platform release processes.

## Prerequisites

You should be comfortable with modern JavaScript, TypeScript basics, React functional components, props, state, effects, async/await, HTTP, Git, and command-line work. Mobile-specific prerequisites are taught here: touch interaction, constrained devices, lifecycle/backgrounding, native permissions, deep links, app stores, signing, and device debugging.

## How to use the handbook

```text
Read mental model
   ↓
Run the smallest example
   ↓
Inspect Android + iOS behavior
   ↓
Apply it in a guided project
   ↓
Solve exercises without the solution
   ↓
Practice interview reasoning
   ↓
Use incident drills to connect JS ↔ native ↔ build ↔ OS
```

## What senior React Native reasoning looks like

A senior engineer does not stop at “use FlatList” or “install a library.” They ask what owns state, which thread/runtime does work, what happens when the app backgrounds, whether a native dependency is compatible with 0.86, how it changes binary size and release risk, how Android and iOS differ, how failure is observed, and how the design will survive the next React Native upgrade.