---
id: chapters-101-120
title: 101–120 — Keyboard, Animations, Gestures, Accessibility & Platform Code
---

# 101 — Keyboard API

`Keyboard` exposes show/hide notifications and dismissal behavior. Event availability/timing differs by platform, so do not build critical state machines around one exact animation event without testing both OSes. Use keyboard events to coordinate UI such as toolbars or measurement, not to guess permanent layout dimensions.

# 102 — KeyboardAvoidingView

`KeyboardAvoidingView` adjusts height, position, or padding to keep content away from the keyboard. The best behavior depends on screen structure and platform. RN 0.86 fixes important Android 15+ edge-to-edge interactions, but nested scroll views, bottom bars, and custom headers still require real-device testing. Prefer one coherent keyboard strategy per screen.

# 103 — Input Focus, Refs and Submit Flow

Use refs to focus the next input or an invalid field after validation. Configure `returnKeyType` and `onSubmitEditing` according to the flow. A multiline input may treat Return as content rather than submit. Avoid surprising automatic focus on screen transitions because it can immediately open the keyboard and interfere with accessibility/navigation gestures.

# 104 — Android Soft Input vs iOS Keyboard Behavior

Android window resizing/edge-to-edge and iOS safe-area/keyboard animations have different mechanics. `adjustResize`, pan behavior, immersive layouts, modals, and navigation containers can change what “keyboard overlap” means. Debug geometry with insets and actual measured layouts rather than assuming the same fix should be copied across platforms.

# 105 — Animated Mental Model

The core `Animated` API models values and transformations over time using timing/spring/decay style animations. Keep animation state separate from business state when possible. Declarative interpolation maps a changing animated value to visual properties. In recent React Native versions, core animation internals are evolving; verify support for specific native-driver/layout properties against the baseline rather than repeating old limitations.

# 106 — Animated.Value, Timing and Spring

An `Animated.Value` is a mutable animation node. `Animated.timing` moves toward a target using duration/easing; `Animated.spring` models spring dynamics. Start/stop callbacks need cancellation-aware logic. Avoid triggering React renders every animation frame—animation systems exist to update visual state efficiently outside ordinary React reconciliation where possible.

# 107 — Interpolation and Easing

Interpolation maps input ranges to output ranges such as opacity, translation, rotation strings, or supported values. Keep ranges monotonic and reason about extrapolation. Easing changes velocity over time; choose motion to communicate hierarchy and continuity, then support reduced-motion preferences rather than using animation only as decoration.

# 108 — Layout Animation and Modern Animation Backend

React Native 0.85 introduced a new shared animation backend that improves how core Animated and Reanimated can apply updates; experimental/native-driver capabilities continue to evolve. Layout animation is appropriate when layout changes themselves should transition. Because this area is version-sensitive, use the current RN/Reanimated docs for exact supported properties and flags, and test release builds on low-end devices.

# 109 — Reanimated Architecture

Reanimated is a native-integrated animation library designed to run animation logic close to the UI runtime. Shared values and worklet-like execution models avoid round trips through normal React renders for each frame. Treat Reanimated as a native dependency: align its current compatibility with RN 0.86, Gesture Handler, and the New Architecture before upgrading one piece independently.

# 110 — Animation Performance and Reduced Motion

At 60 Hz, one frame is about 16.67 ms; 120 Hz gives about 8.33 ms. That budget includes more than JavaScript. Avoid expensive React renders, image decode, synchronous native work, or heavy list mounting during motion. Respect reduced-motion settings, preserve meaning without animation, and profile both JS and UI/native work before diagnosing “the JS thread.”

# 111 — Gesture Handler Mental Model

Gesture Handler integrates with native gesture recognition so complex interactions can be coordinated efficiently. Modern APIs define gesture objects such as Tap, LongPress, Pan, Pinch and Rotation and attach them through gesture detectors. Keep gesture state and visual feedback tightly scoped and compose recognizers explicitly rather than stacking unrelated touch callbacks.

# 112 — Tap and Long Press

Tap needs thresholds for duration/movement; long press intentionally waits. Combine feedback with accessibility equivalents—an interaction cannot be discoverable only through long press. If tap and long press share a target, define their relationship so one does not accidentally trigger after the other.

# 113 — Pan, Swipe and Drag

Pan exposes translation/velocity suitable for dragging, dismissals and carousels. A “swipe” is often a pan interpreted using distance/velocity thresholds. Clamp or rubber-band movement intentionally and settle to deterministic end states. Avoid gesture-driven state updates that rerender huge screen trees every pointer move.

# 114 — Pinch and Rotation

Pinch and rotation are continuous multi-touch gestures. Apply transforms around appropriate anchors and maintain accumulated scale/rotation between gesture sessions. Coordinate with nested scroll/zoom surfaces, enforce sensible limits, and provide alternative controls when accessibility users cannot perform complex gestures.

# 115 — Gesture Composition and Conflicts

Simultaneous, exclusive, and race-style composition determine which gestures can recognize together. Common conflicts include horizontal carousels inside vertical lists, edge-back navigation versus custom pans, and pinch inside scroll containers. Solve conflicts by product intent and recognizer relationships, not by disabling parent scrolling globally.

# 116 — Accessibility Semantics

Native accessibility services consume semantic information, not your visual design. Supply meaningful `accessibilityRole`, labels, hints only when useful, state/value, grouping, and focus order. Text already provides text semantics; buttons should be exposed as buttons. Avoid duplicate labels when nested accessible elements cause both parent and child to be announced.

# 117 — VoiceOver and TalkBack

Test the app manually with iOS VoiceOver and Android TalkBack. Navigate without sight, change controls, dismiss modals, use forms, encounter errors, and traverse dynamic lists. Platform screen readers differ in gestures and announcements, so automated component tests are necessary but not sufficient.

# 118 — Dynamic Type, Touch Targets, Contrast and Reduced Motion

Support font scaling unless there is a justified exception, and make layouts tolerate larger text. Keep interactive hit areas comfortably large, use semantic contrast across themes/states, and avoid conveying state by color alone. Reduced motion should preserve spatial/interaction meaning without forcing large transitions.

# 119 — Platform.OS and Platform.select

Use `Platform.OS` or `Platform.select` for small differences such as style values or native capability branches. If conditionals spread across a feature, create a platform adapter or platform-specific file instead. Platform branching should expose one product contract to the rest of the application.

# 120 — Platform-Specific Files and Native Boundaries

React Native resolves `.ios.tsx` and `.android.tsx` variants when configured by the standard resolver. Split implementation when platform APIs, UX patterns, or native integrations truly diverge; share domain behavior and interfaces. A good boundary looks like:

```text
feature/domain
     ↓ stable interface
platform adapter
 ├─ android implementation
 └─ ios implementation
```

This prevents every call site from learning platform quirks.