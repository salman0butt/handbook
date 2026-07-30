---
id: chapters-021-040
title: 021–040 — Components, TypeScript, Styling & Yoga
---

# 021 — Images, Backgrounds & Asset Resolution

`Image` renders local or remote images; `ImageBackground` is a convenience wrapper for content over an image. Local static assets can be resolved at bundle time; remote images need explicit dimensions or layout constraints and introduce network/cache failure states. Decode size matters more than compressed file size for memory: a large photo can allocate many megabytes after decoding. Prefer appropriately sized assets, placeholders, explicit error/loading handling, and measured cache behavior.

# 022 — ScrollView and Content Containers

`ScrollView` renders its entire React child tree, then places it in a native scrolling container. This is ideal for bounded forms/settings/article-like content but poor for thousands of repeated rows. Give scroll views bounded height through parent layout. Understand `contentContainerStyle`, keyboard interaction, nested scrolling, and platform differences before adding multiple nested scroll containers.

# 023 — TextInput Fundamentals

`TextInput` bridges React state/focus semantics with native text controls and OS keyboards. Controlled inputs are predictable but can become expensive if every keystroke causes large parent rerenders. Configure `keyboardType`, `autoComplete`, `textContentType` where appropriate, `returnKeyType`, secure entry, selection, capitalization, and accessibility. Treat IME composition and autofill as platform features, not merely string updates.

# 024 — Pressable, Button & Touch Feedback

`Pressable` is the flexible foundation for press interactions, exposing pressed state and press lifecycle callbacks. `Button` is intentionally limited and platform-styled. Touch targets need accessible size, visual pressed/disabled states, and correct roles/labels. Do not implement a button as a random `View` with touch handlers when semantic pressability matters.

# 025 — Switch, ActivityIndicator & Modal

`Switch` maps to native toggle behavior, `ActivityIndicator` communicates indeterminate work, and `Modal` presents content above the app surface using native modal facilities. Modals change focus, back behavior, accessibility traversal, and navigation expectations. Keep loading indicators attached to a user-understandable operation and avoid permanent spinners with no recovery state.

# 026 — FlatList, SectionList & RefreshControl

`FlatList` and `SectionList` are convenience layers over virtualization. They render windows of content rather than all rows at once. `RefreshControl` integrates native pull-to-refresh behavior. Stable keys, predictable item rendering, pagination boundaries, item memoization, and correct empty/loading/error states matter more than tweaking virtualization knobs blindly.

# 027 — StatusBar and Safe Areas

System bars and display cutouts vary by device and Android/iOS version. RN 0.86 includes Android 15+ edge-to-edge fixes, so layout must treat insets deliberately. Use a current safe-area solution for screen content and test modals, keyboards, rotation, and transparent bars. `StatusBar` controls supported visual/system-bar behavior but is not a universal layout manager.

# 028 — TypeScript Component Props

Model props as the component contract. Prefer domain-oriented unions over boolean combinations that permit impossible states:

```ts
type LoadState<T> =
  | {status: 'idle'}
  | {status: 'loading'}
  | {status: 'success'; data: T}
  | {status: 'error'; error: Error};
```

Use `PropsWithChildren` only when arbitrary children are truly part of the API. Avoid exposing implementation details through overly broad prop bags.

# 029 — Typing Events and Native Event Payloads

React Native events often wrap native payloads in `NativeSyntheticEvent<T>`. Use the event type exported by the relevant component/API when available instead of inventing object shapes. Event typing should preserve units, nullable states, and platform distinctions. If a third-party native library's types are wrong, isolate the correction at an adapter boundary instead of leaking casts through the app.

# 030 — Refs, Imperative APIs & Generics

Refs are appropriate for focus, measurement, scrolling, animation/native handles, and other imperative escape hatches. They should not become a shadow state-management system. Type component refs with the actual instance/API and create generic reusable components only when consumers gain meaningful type relationships, not because generics appear advanced.

# 031 — Strict TypeScript and Domain Models

Use strict TypeScript, validate external data at runtime, and distinguish transport models from domain models. The server can violate your compile-time types. Zod or another schema validator can turn unknown JSON into trusted domain data. Keep identifiers and status values narrow enough to prevent accidental cross-domain use where practical.

# 032 — Styling Mental Model

React Native style objects describe native layout/paint properties; they are not CSS rules interpreted by a browser. There is no cascade, selector engine, stylesheet specificity, pseudo-class system, arbitrary CSS property surface, or automatic web unit model. `StyleSheet.create` centralizes style definitions and can improve consistency/tooling, but architecture matters more than expecting magical runtime performance from every StyleSheet call.

# 033 — Inline Styles, Style Arrays & Conditional Styles

Style arrays merge left-to-right, making them useful for variants:

```tsx
<View style={[styles.card, selected && styles.selected, style]} />
```

Falsy entries are ignored. Use arrays to make precedence intentional. Avoid recreating large dynamic style objects deep in hot lists; calculate only what is dynamic and keep stable structural styles static.

# 034 — Dimensions, useWindowDimensions & Responsive Design

Prefer `useWindowDimensions` when rendering depends on current window size because it updates with changes. The `Dimensions` API is useful for imperative access/subscriptions. Mobile responsiveness includes orientation, split-screen/window resizing, font scaling, insets, tablets, foldables, and platform conventions—not just width breakpoints copied from CSS frameworks.

# 035 — PixelRatio and Image/Text Density

React Native layout units are density-independent logical units. `PixelRatio` helps reason about physical pixel density and font scale. Avoid manually converting every dimension to pixels; native layout already operates in logical units. Use density knowledge for asset sizing, hairlines, image requests, canvas/native integrations, and debugging visual precision.

# 036 — Typography, Spacing & Design Tokens

A design system should define semantic typography, spacing, radii, colors, elevation/shadow strategy, motion, and state tokens. Account for font scaling and fallback fonts. Do not lock text into fixed-height containers that break under accessibility font sizes. Separate raw primitives (e.g. spacing scale) from semantic component tokens (e.g. button padding).

# 037 — Appearance, Dark Mode & Theme Architecture

`Appearance` and `useColorScheme` expose system color-scheme changes. A robust theme layer maps semantic tokens (`surface`, `textPrimary`, `danger`) to platform/theme values. Avoid storing the current system color scheme redundantly in global state unless the product supports an explicit user override; derive system state and persist only the override policy.

# 038 — Flexbox in React Native

React Native uses Yoga for layout. Its defaults differ from the web: notably the default `flexDirection` is `column`. Learn main axis/cross axis before memorizing properties.

```text
column container
main axis  ↓  justifyContent
cross axis → alignItems
```

`flexGrow`, `flexShrink`, and `flexBasis` explain space distribution more precisely than treating `flex: 1` as magic.

# 039 — Yoga, Gap, Percentages & Positioning

Yoga computes layout from the React Native shadow tree before mounting native views. Modern RN supports `gap` and percentage layout in supported forms, but verify version behavior before copying web assumptions. Absolute-positioned children leave normal flex flow. `aspectRatio` is useful when one dimension is known. Prefer constraints that adapt rather than hard-coded screen coordinates.

# 040 — RTL and Layout Measurement

RTL affects row direction, start/end semantics, text alignment, icons, and gestures. Use logical concepts where APIs support them and test an actual RTL locale. For measurement, prefer layout callbacks or ref measurement APIs only when declarative layout cannot express the requirement. In modern Fabric, synchronous layout capabilities enable patterns such as `useLayoutEffect`, but measurement should still be minimized and reasoned about because it couples logic to rendered geometry.