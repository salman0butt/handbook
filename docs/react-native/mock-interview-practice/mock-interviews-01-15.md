---
id: mock-interviews-01-15
title: 15 React Native Mock Interview Rounds
---

# 15 React Native Mock Interview Rounds

Use each round as a 45–60 minute simulation. The interviewer should ask the listed questions first, use follow-ups only after the candidate commits to an answer, and score evidence and reasoning rather than vocabulary.

## Scoring model

Score each round out of **20**: concepts 0–6, implementation 0–5, platform reasoning 0–4, debugging/trade-offs 0–3, communication 0–2. **16–20 strong**, **12–15 pass**, **8–11 borderline**, **0–7 weak**.

---

# Round 1 — React Native Beginner

**Interviewer instructions:** test whether the candidate understands RN as native rendering plus React, not a browser wrapper.

**Questions:** What is React Native? React vs React Native? What do `View`, `Text`, `Image`, `Pressable` and `TextInput` represent? Why does RN not use normal CSS? What does AppRegistry do?

**Coding/task:** build a typed `CounterCard` with increment/decrement buttons, disabled negative values and an accessibility label.

**Follow-ups:** What happens after `setCount`? How would Android and iOS render the result? Why is a `div` invalid?

**Evaluation rubric / score:** concepts 6, task 5, platform 4, reasoning 3, communication 2. **Red flags:** DOM-only mental model; mutating state; no accessibility. **Strong-answer indicators:** explains reconciliation → Fabric → native views and derives UI from state.

---

# Round 2 — React + React Native Fundamentals

**Interviewer instructions:** distinguish React knowledge from mobile-platform knowledge.

**Questions:** props vs state; derived state; `useEffect` vs event handler; refs; controlled input; Strict Mode implications; cleanup; stale closures.

**Coding/task:** implement a debounced search input that cancels its timer on unmount and ignores blank queries.

**Follow-ups:** Should the timer live in state? What if query changes before timeout? Where would server fetching live in production?

**Evaluation rubric / score:** 6/5/4/3/2. **Red flags:** effect for every computation; missing cleanup; `any` everywhere. **Strong-answer indicators:** separates render, event and effect responsibilities and explains lifecycle under background/foreground changes.

---

# Round 3 — UI, Styling and Flexbox

**Interviewer instructions:** probe RN layout rather than browser CSS memorization.

**Questions:** `StyleSheet`; style arrays; density-independent units; PixelRatio; flex direction default; grow/shrink/basis; absolute positioning; safe areas; RTL.

**Coding/task:** build a responsive product row that becomes stacked on narrow screens and preserves dynamic text.

**Follow-ups:** How does Yoga participate? Why can fixed heights break accessibility? Which CSS concepts do not transfer directly?

**Evaluation rubric / score:** 6/5/4/3/2. **Red flags:** assumes `display:block`, rem or media queries behave like web. **Strong-answer indicators:** reasons from Yoga constraints, safe areas, font scaling and platform adaptation.

---

# Round 4 — Navigation

**Interviewer instructions:** test route architecture, typing and lifecycle.

**Questions:** NavigationContainer; native stack vs stack; tabs; nested navigation; params; typed route lists; deep links; auth flow; focus hooks; state restoration.

**Coding/task:** design a typed root graph for signed-out, signed-in tabs and an order-details modal reachable by deep link.

**Follow-ups:** Who owns auth truth? How do you defer a link during bootstrap? How do back semantics differ on Android?

**Evaluation rubric / score:** 6/5/4/3/2. **Red flags:** navigation state used as auth state; arbitrary params; unvalidated external URLs. **Strong-answer indicators:** typed intents, clear graph ownership and lifecycle-aware routing.

---

# Round 5 — State and Data Fetching

**Interviewer instructions:** focus on ownership distinctions.

**Questions:** local vs global vs server state; Context; reducers; Zustand/Redux Toolkit; TanStack Query cache; staleTime; invalidation; optimistic updates.

**Coding/task:** implement an optimistic favorite toggle with rollback that does not overwrite a newer mutation.

**Follow-ups:** What belongs in Query cache vs client store? How do concurrent mutations race? How would offline behavior change the design?

**Evaluation rubric / score:** 6/5/4/3/2. **Red flags:** copies all server data into Redux; snapshot rollback without concurrency reasoning. **Strong-answer indicators:** explicit state ownership and mutation lifecycle.

---

# Round 6 — Mobile Platform APIs

**Interviewer instructions:** assess permission, lifecycle and device constraints.

**Questions:** permissions; camera/location; Linking; Share; clipboard risks; haptics; files/media; simulator limitations; app state.

**Coding/task:** design a location picker that requests permission only when needed, handles denied/blocked states and falls back to manual search.

**Follow-ups:** What belongs in AndroidManifest and Info.plist? How would limited photo access differ? Why test on device?

**Evaluation rubric / score:** 6/5/4/3/2. **Red flags:** requests every permission on launch; assumes one permission state across platforms. **Strong-answer indicators:** progressive permission UX and platform-specific fallbacks.

---

# Round 7 — Android

**Interviewer instructions:** determine whether the candidate can leave the JS layer when needed.

**Questions:** `android/`; Gradle wrapper; AGP; settings/build files; MainActivity/MainApplication; manifest; resources; min/target/compile SDK; variants/flavors; R8; AAB; adb/Logcat.

**Coding/task:** sketch `staging` and `production` flavors with distinct application IDs/API configuration and signing boundaries.

**Follow-ups:** Why can debug work but release crash? How inspect dependency conflicts? What does targetSdk change mean?

**Evaluation rubric / score:** 6/5/4/3/2. **Red flags:** treats Android folder as generated garbage; edits global Gradle installation. **Strong-answer indicators:** understands build graph, variants, signing and release diagnostics.

---

# Round 8 — iOS

**Interviewer instructions:** test practical Xcode/CocoaPods/signing knowledge.

**Questions:** project vs workspace; targets; schemes/configurations; Podfile; Info.plist; AppDelegate; entitlements; certificates/profiles; archive/TestFlight; LLDB/Instruments.

**Coding/task:** design Debug/Staging/Release configurations with bundle IDs, xcconfig values, icons and signing separation.

**Follow-ups:** Why run `bundle exec pod install`? What causes deployment-target conflicts? Why must iOS CI use macOS?

**Evaluation rubric / score:** 6/5/4/3/2. **Red flags:** opens xcodeproj after pods without understanding workspace; calls signing “an npm issue.” **Strong-answer indicators:** follows build identity from scheme to archive and store artifact.

---

# Round 9 — Performance

**Interviewer instructions:** require measurement before optimization.

**Questions:** frame budget; JS/runtime vs UI/main-thread work; list virtualization; images; memoization; startup; memory; animation; profiling.

**Coding/task:** diagnose a feed with 1,000 image rows dropping frames on low-end Android and propose experiments in order.

**Follow-ups:** 60 vs 120 Hz budget? When does memo not help? How distinguish JS heap from native image memory?

**Evaluation rubric / score:** 6/5/4/3/2. **Red flags:** “add useCallback everywhere”; benchmarks debug build only. **Strong-answer indicators:** release-device traces, hypotheses, before/after metrics and cross-thread reasoning.

---

# Round 10 — Testing

**Interviewer instructions:** test confidence strategy rather than test-library trivia.

**Questions:** unit/component/integration/E2E; React Native Testing Library; async queries; fake timers; native module mocks; Detox; accessibility testing; flake causes.

**Coding/task:** test a screen that loads, renders data, retries a failure and navigates after a successful mutation.

**Follow-ups:** What should not be mocked? Why avoid fixed E2E sleeps? Which behavior requires a real device?

**Evaluation rubric / score:** 6/5/4/3/2. **Red flags:** implementation-detail selectors; retry-until-green CI. **Strong-answer indicators:** semantic queries, deterministic fixtures and deliberate test boundaries.

---

# Round 11 — Native Modules

**Interviewer instructions:** use the RN 0.86 New Architecture baseline.

**Questions:** TurboModule; spec; Codegen; JSI; sync vs async; events; lifecycle; Android/iOS implementations; autolinking.

**Coding/task:** design `DeviceInfoModule` exposing a synchronous model string and async free-disk query with stable errors.

**Follow-ups:** Why keep sync tiny? What is generated? How would Swift interact with generated iOS contracts? How do you test registration?

**Evaluation rubric / score:** 6/5/4/3/2. **Red flags:** teaches Bridge-only `NativeModules` as default; raw exception strings. **Strong-answer indicators:** typed contract, Codegen boundary, lifecycle/threading awareness.

---

# Round 12 — New Architecture

**Interviewer instructions:** reject obsolete three-box explanations.

**Questions:** why architecture changed; JSI; Fabric; shadow tree/nodes; Yoga; render/commit/mount; TurboModules; Codegen; threading; legacy status in 0.86.

**Coding/task:** draw what happens when React updates a prop on a custom Fabric rating view.

**Follow-ups:** Does every JSX View equal a platform view? Is JSI zero-cost? Does concurrency mean multiple component renders execute on multiple JS threads?

**Evaluation rubric / score:** 6/5/4/3/2. **Red flags:** Bridge as current architecture; “everything is synchronous.” **Strong-answer indicators:** renderer/runtime/native boundary model and version-aware caveats.

---

# Round 13 — Production Debugging

**Interviewer instructions:** score investigation discipline.

**Questions:** JS vs native crash; Logcat; Xcode/Organizer; symbolication; Hermes source maps; R8 mappings; Metro/build failures; ANR/watchdog; release-only bugs.

**Coding/task:** reason through “Android debug works, Play release crashes before Home.” Produce observations, hypotheses, tests and prevention.

**Follow-ups:** What exact artifact do you need? How isolate R8 vs config vs native SDK? What does an ErrorBoundary not catch?

**Evaluation rubric / score:** 6/5/4/3/2. **Red flags:** random cache cleaning as first step; no exact release reproduction. **Strong-answer indicators:** falsifiable hypotheses, native stacks, artifact correlation and recurrence prevention.

---

# Round 14 — Senior Mobile Architecture

**Interviewer instructions:** test end-to-end production ownership.

**Questions:** feature architecture; repositories/adapters; offline; security; variants; observability; releases; dependency governance; upgrades.

**Coding/task:** architect a production finance app with auth, transaction feed, offline read cache, deep links, push, analytics and staged releases.

**Follow-ups:** Where are secrets? How prevent duplicate transfer on retry? Which features need native code? What is rollback strategy?

**Evaluation rubric / score:** 6/5/4/3/2. **Red flags:** one global store/service singleton; client-side authorization; no failure model. **Strong-answer indicators:** explicit boundaries, idempotency, secure storage, observability and platform release design.

---

# Round 15 — Staff React Native Architecture

**Interviewer instructions:** evaluate organization-level reasoning.

**Questions:** twenty-team ownership; version policy; design system; SDK governance; CI/signing; release trains; performance budgets; mobile/backend compatibility; migration strategy; brownfield choices.

**Coding/task:** propose a two-year platform plan for six RN apps on three different RN minors with duplicated SDKs and inconsistent CI, while product teams must continue shipping weekly.

**Follow-ups:** What do you standardize first? How avoid platform bottleneck? How measure success? How handle an app blocked on one native SDK?

**Evaluation rubric / score:** 6/5/4/3/2. **Red flags:** big-bang rewrite; mandates without migration path; no metrics/ownership. **Strong-answer indicators:** staged paved roads, compatibility windows, self-service tooling, measurable budgets and explicit exception/deprecation policy.
