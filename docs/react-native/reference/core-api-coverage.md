---
id: core-api-coverage
title: React Native Core API Coverage Audit
---

# React Native Core API Coverage Audit

**Baseline: React Native 0.86, audited July 31, 2026.** Status is based on the current 0.86/current React Native documentation, not archived tutorials.

## Core components

| Component | RN 0.86 status | Handbook coverage |
| --- | --- | --- |
| `View` | Current | 011–020, 021–040 |
| `Text` | Current | 011–020, typography/a11y sections |
| `Image` / `ImageBackground` | Current | 011–020, 171 |
| `ScrollView` | Current | 011–020, 061–067 |
| `TextInput` | Current | 011–020, forms/keyboard |
| `Pressable` | Current | 011–020, 041–044 |
| `Button` | Current | fundamentals |
| `Switch` | Current | fundamentals/forms |
| `ActivityIndicator` | Current | fundamentals/loading states |
| `Modal` | Current | fundamentals/navigation patterns |
| `FlatList` | Current | 061–067, performance |
| `SectionList` | Current | 061–067 |
| `RefreshControl` | Current | lists/server state |
| `StatusBar` | Current | platform/UI coverage |
| `KeyboardAvoidingView` | Current | 101–105; RN 0.86 Android edge-to-edge fixes reflected in baseline notes |
| `SafeAreaView` from core | **Deprecated** | Taught as legacy/deprecated; use `react-native-safe-area-context` for new work |

## APIs

| API | Status | Handbook location / note |
| --- | --- | --- |
| `AccessibilityInfo` | Current | 111–115 accessibility |
| `Alert` | Current | UI/device patterns |
| `Animated` / `Easing` | Current | 106–110 animations |
| `AppRegistry` | Current | foundations/startup; note RN 0.86 deprecates only the second argument of `setComponentProviderInstrumentationHook`, not AppRegistry itself |
| `AppState` | Current | effects/lifecycle, server-state focus, background behavior |
| `Appearance` | Current | styling/theme |
| `BackHandler` | Android-specific | navigation/platform handling |
| `Dimensions` | Current | responsive layout/effects |
| `Keyboard` | Current | 101–105 |
| `Linking` | Current | deep links/device API |
| `PanResponder` | Current legacy-style responder API | events/gestures; Gesture Handler recommended for richer production gestures |
| `PermissionsAndroid` | Android-specific | permissions |
| `PixelRatio` | Current | styling/images |
| `Platform` | Current | 116–120 |
| `Share` | Current | device APIs |
| `StyleSheet` | Current | 031–040 |
| `Vibration` | Current | device APIs |
| `Clipboard` from core | **Removed** | Use a maintained community package; core docs explicitly mark it removed |
| `InteractionManager` | **Deprecated** | Historical/scheduling context only; current docs advise modern idle/scheduling alternatives rather than new reliance on it |

## Platform-specific current surfaces

Android-only core APIs/components such as `PermissionsAndroid`, `BackHandler`, `ToastAndroid` and `DrawerLayoutAndroid` are treated as platform-specific rather than cross-platform abstractions. iOS-specific surfaces such as `ActionSheetIOS` are likewise labeled platform-specific. The handbook favors cross-platform feature contracts with platform adapters where behavior differs.

## Audit rules

- **Current** means present in the React Native 0.86/current documentation.
- **Deprecated** means still documented but not recommended for new design.
- **Removed** means do not import from React Native core.
- **Platform-specific** means availability/semantics are intentionally Android- or iOS-only.
- Third-party replacements are verified separately before recommendation because compatibility changes independently of React Native.

## Evidence notes

The official current Core Components and APIs page lists View, Text, Image, TextInput, Pressable, ScrollView, StyleSheet, Button, Switch, FlatList, SectionList, ActivityIndicator, Alert, Animated, Dimensions, KeyboardAvoidingView, Linking, Modal, PixelRatio, RefreshControl and StatusBar among current surfaces. Current React Native docs mark core `SafeAreaView` deprecated and recommend `react-native-safe-area-context`; the core Clipboard page is marked removed; current InteractionManager documentation marks it deprecated.
