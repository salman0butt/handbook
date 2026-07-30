---
id: interview-questions-beginner-001-080
title: Interview Questions 001–080 — Beginner
---

# Beginner Interview Questions 001–080

Each question includes the expected answer, reasoning signal, a common wrong answer, a follow-up, and a related chapter.

## Q1 — What is React Native?
**Expected answer:** A React renderer and mobile platform stack that lets React describe native Android/iOS UI while JavaScript runs in an engine such as Hermes and native projects remain real Gradle/Xcode apps. **Reasoning:** distinguishes React from renderer/platform. **Common wrong answer:** “It converts HTML/CSS into an app.” **Follow-up:** What renders a `View`? **Related chapter:** 001.

## Q2 — React vs React Native?
**Expected answer:** React provides component/state/reconciliation semantics; React Native provides native renderer, components, platform APIs and mobile tooling instead of React DOM/browser APIs. **Reasoning:** renderer boundary. **Common wrong answer:** They are separate UI frameworks with unrelated React logic. **Follow-up:** Can a DOM component render directly in RN? **Related chapter:** 002.

## Q3 — React Native vs native Android/iOS?
**Expected answer:** RN shares React/TS application code while still integrating real native platform projects and views; fully native apps program platform frameworks directly. **Reasoning:** trade-off, not false equivalence. **Common wrong answer:** RN avoids native code entirely. **Follow-up:** When might Kotlin/Swift be needed? **Related chapter:** 002.

## Q4 — Why Community CLI?
**Expected answer:** It creates/manages a bare RN app with explicit Android/iOS projects and delegates builds to Gradle/Xcode while coordinating Metro, devices and autolinking. **Reasoning:** understands ownership. **Common wrong answer:** It is a replacement for Gradle/Xcode. **Follow-up:** What is the RN 0.86 init command? **Related chapter:** 003/013.

## Q5 — Current init command for RN 0.86?
**Expected answer:** `npx @react-native-community/cli@latest init MyProject --version latest` as stated by the 0.86 release guidance. **Reasoning:** current CLI path. **Common wrong answer:** globally install `react-native-cli` then `react-native init`. **Follow-up:** Why not independently bump CLI in an old app? **Related chapter:** 014.

## Q6 — Why is old global `react-native-cli` problematic?
**Expected answer:** It is historical tooling that can shadow/conflict with project/current Community CLI behavior; modern projects use npx/project-local compatible CLI packages. **Reasoning:** tooling version scope. **Common wrong answer:** Global CLI is required for all commands. **Follow-up:** How do you run doctor? **Related chapter:** 014.

## Q7 — What does Metro do?
**Expected answer:** Resolves JS/TS modules/assets, transforms them (including Babel), builds the module graph, serves development bundles and emits production bundle/source-map inputs for runtime/build tooling. **Reasoning:** bundler role. **Common wrong answer:** Metro compiles Kotlin/Swift. **Follow-up:** What does Gradle do instead? **Related chapter:** 139.

## Q8 — What is Hermes?
**Expected answer:** React Native's default JavaScript engine, bundled/coupled with RN; RN 0.86 uses Hermes V1 by default. **Reasoning:** runtime vs bundler. **Common wrong answer:** Hermes is the RN renderer. **Follow-up:** Does Metro execute JavaScript? **Related chapter:** 141.

## Q9 — What is Fabric?
**Expected answer:** React Native's modern renderer that manages shadow trees/layout/commit/mount and native view updates. **Reasoning:** New Architecture component. **Common wrong answer:** A navigation library. **Follow-up:** What role does Yoga play? **Related chapter:** 148.

## Q10 — What is JSI?
**Expected answer:** A C++ JavaScript Interface abstraction used to interact with a JS runtime and power modern native integration without the old serialized bridge model. **Reasoning:** architecture layer. **Common wrong answer:** A JSON messaging protocol. **Follow-up:** Should app code usually write raw JSI? **Related chapter:** 146.

## Q11 — What is a TurboModule?
**Expected answer:** The modern typed native-module model using a spec, Codegen and native implementation exposed through RN's New Architecture. **Reasoning:** native boundary. **Common wrong answer:** Any JS utility imported lazily. **Follow-up:** Why lazy loading matters? **Related chapter:** 152.

## Q12 — What is Codegen?
**Expected answer:** Build-integrated generation of native contracts/glue from supported TypeScript/Flow specs for TurboModules and native components. **Reasoning:** type-safe cross-language integration. **Common wrong answer:** Babel compiling TypeScript. **Follow-up:** Can arbitrary TS types be used? **Related chapter:** 154.

## Q13 — What is Yoga?
**Expected answer:** The layout engine React Native uses to compute flexbox-style layout from the shadow tree. **Reasoning:** layout internals. **Common wrong answer:** A CSS engine/browser. **Follow-up:** What is RN's default flexDirection? **Related chapter:** 038–039.

## Q14 — What is `AppRegistry`?
**Expected answer:** The API used to register the app's root component/provider so native startup can obtain and render the React tree. **Reasoning:** boot boundary. **Common wrong answer:** A global component store. **Follow-up:** What can fail before root render? **Related chapter:** 019.

## Q15 — What is `View`?
**Expected answer:** Fundamental RN layout/container primitive rendered through the native renderer, not an HTML `div`. **Reasoning:** native semantics. **Common wrong answer:** Alias for `div`. **Follow-up:** Can raw text be direct View child? **Related chapter:** 020.

## Q16 — What is special about `Text`?
**Expected answer:** It provides native text semantics/measurement and is required to contain textual strings; nested text has text-specific behavior. **Reasoning:** RN text model. **Common wrong answer:** Any View can render raw strings. **Follow-up:** Accessibility implication? **Related chapter:** 020.

## Q17 — `ScrollView` vs `FlatList`?
**Expected answer:** ScrollView renders all children eagerly; FlatList virtualizes a large logical list and mounts a bounded window. **Reasoning:** memory/render work. **Common wrong answer:** FlatList is only a styled ScrollView. **Follow-up:** Why can 10,000 rows differ dramatically? **Related chapter:** 061–062.

## Q18 — Why stable FlatList keys?
**Expected answer:** Keys preserve item identity for reconciliation and virtualization as data changes. **Reasoning:** identity. **Common wrong answer:** Keys are only to silence a warning. **Follow-up:** Why is index bad for reorderable data? **Related chapter:** 063.

## Q19 — What does `getItemLayout` do?
**Expected answer:** Provides exact item length/offset when geometry is known, allowing list operations without measuring preceding rows. **Reasoning:** performance with correctness. **Common wrong answer:** Makes variable rows faster by guessing height. **Follow-up:** What if rows vary? **Related chapter:** 064.

## Q20 — What is `Pressable`?
**Expected answer:** Flexible core primitive for press interactions that exposes press lifecycle/pressed state and supports accessible semantics. **Reasoning:** interaction primitive. **Common wrong answer:** CSS hover wrapper. **Follow-up:** When use `Button`? **Related chapter:** 024.

## Q21 — What does `StyleSheet.create` provide?
**Expected answer:** A structured way to define RN style objects with validation/tooling/organization benefits; styles still describe native layout/paint, not CSS selectors/cascade. **Reasoning:** avoids performance folklore. **Common wrong answer:** It creates a browser stylesheet. **Follow-up:** How do style arrays merge? **Related chapter:** 032–033.

## Q22 — RN Flexbox default direction?
**Expected answer:** `column`, unlike common web assumptions where flex direction defaults to row. **Reasoning:** mobile layout basics. **Common wrong answer:** row. **Follow-up:** Main vs cross axis? **Related chapter:** 038.

## Q23 — `justifyContent` vs `alignItems`?
**Expected answer:** justify aligns/distributes along main axis; alignItems controls children on cross axis. **Reasoning:** axis mental model. **Common wrong answer:** justify always horizontal. **Follow-up:** What changes with row? **Related chapter:** 038.

## Q24 — What is `flex: 1` used for?
**Expected answer:** Commonly lets a child participate in flex growth to consume available space; exact shorthand semantics should be understood through grow/shrink/basis. **Reasoning:** not magic. **Common wrong answer:** Means 100% screen height. **Follow-up:** Why can parent constraints matter? **Related chapter:** 038.

## Q25 — `useWindowDimensions` vs `Dimensions.get`?
**Expected answer:** Hook updates rendering when dimensions change; a one-time `Dimensions.get` read does not automatically subscribe. **Reasoning:** responsive lifecycle. **Common wrong answer:** They are identical. **Follow-up:** What causes window changes besides rotation? **Related chapter:** 034.

## Q26 — What is `PixelRatio`?
**Expected answer:** API for device pixel density/font-scale related calculations; RN layout normally uses logical density-independent units. **Reasoning:** avoids manual pixel conversion. **Common wrong answer:** Every style number must be multiplied by it. **Follow-up:** Where can it help? **Related chapter:** 035.

## Q27 — How do style arrays work?
**Expected answer:** Entries are flattened/merged in order, later style values overriding earlier ones; falsy conditional entries can be ignored. **Reasoning:** predictable variants. **Common wrong answer:** First style always wins. **Follow-up:** Why useful for disabled state? **Related chapter:** 033.

## Q28 — What does `useColorScheme` do?
**Expected answer:** Exposes current system color scheme and updates when it changes, enabling derived theme behavior. **Reasoning:** environment state. **Common wrong answer:** It permanently stores user's theme. **Follow-up:** How would an override work? **Related chapter:** 037.

## Q29 — Controlled `TextInput`?
**Expected answer:** React state supplies `value`, and `onChangeText` updates that state. **Reasoning:** source of truth. **Common wrong answer:** Use `event.target.value` like DOM. **Follow-up:** Performance concern in huge form? **Related chapter:** 023/068.

## Q30 — Does `secureTextEntry` encrypt a password?
**Expected answer:** No; it masks display. Storage/transmission/security need separate controls. **Reasoning:** security semantics. **Common wrong answer:** Yes, RN encrypts the value. **Follow-up:** Where should a refresh token live? **Related chapter:** 072/084.

## Q31 — Why use refs in RN?
**Expected answer:** Imperative interactions such as focus, scroll, measurement or supported native handles—not general app state. **Reasoning:** escape hatch. **Common wrong answer:** Refs replace state because they are faster. **Follow-up:** Example with TextInput? **Related chapter:** 030/103.

## Q32 — What is local state?
**Expected answer:** State owned near the component/feature whose UI behavior needs it, such as a draft or modal visibility. **Reasoning:** ownership. **Common wrong answer:** All state must be global for navigation. **Follow-up:** What is server state? **Related chapter:** 044.

## Q33 — What is derived state?
**Expected answer:** A value computed from source props/state rather than separately synchronized storage. **Reasoning:** avoids inconsistency. **Common wrong answer:** Every computed value belongs in `useState` + effect. **Follow-up:** Example? **Related chapter:** 044.

## Q34 — When use Context?
**Expected answer:** To transport cross-tree dependencies/values such as theme/session interface where prop drilling is unsuitable, while considering rerender scope. **Reasoning:** context is transport, not universal store. **Common wrong answer:** Context is always Redux replacement. **Follow-up:** Why split contexts? **Related chapter:** 046.

## Q35 — What is `useReducer` good for?
**Expected answer:** Pure, event-oriented transitions where related state fields/actions benefit from centralized transition logic. **Reasoning:** state-machine thinking. **Common wrong answer:** It is for API calls in reducer. **Follow-up:** Why keep reducers pure? **Related chapter:** 047.

## Q36 — What belongs in Redux Toolkit?
**Expected answer:** Shared client state/workflows that benefit from centralized event model, selectors/middleware/tooling—not automatically all server responses. **Reasoning:** tool fit. **Common wrong answer:** Everything in app. **Follow-up:** Where server state can live? **Related chapter:** 048/050.

## Q37 — What is Zustand useful for?
**Expected answer:** Lightweight external client state with selector subscriptions, useful for cohesive cross-screen client state. **Reasoning:** store boundaries. **Common wrong answer:** Database replacement. **Follow-up:** Why narrow selectors? **Related chapter:** 049.

## Q38 — What is `useEffect` for?
**Expected answer:** Synchronizing React with external systems such as subscriptions, timers, SDKs or imperative processes, not computing ordinary derived render data. **Reasoning:** modern effect model. **Common wrong answer:** Run every piece of business logic after render. **Follow-up:** What cleanup means? **Related chapter:** 051.

## Q39 — Why effect cleanup?
**Expected answer:** To release/undo subscriptions, timers or resources when dependency instance changes or component unmounts. **Reasoning:** lifecycle. **Common wrong answer:** Cleanup only runs at app exit. **Follow-up:** Example with AppState? **Related chapter:** 052.

## Q40 — What is a stale closure?
**Expected answer:** A callback/effect captures values from an earlier render and later uses them after state changed, often due to incorrect dependency/lifecycle design. **Reasoning:** React execution model. **Common wrong answer:** A memory leak caused by Hermes. **Follow-up:** How fix? **Related chapter:** 053.

## Q41 — What is `AppState`?
**Expected answer:** RN API exposing coarse app foreground/background/inactive state transitions depending on platform. **Reasoning:** mobile lifecycle. **Common wrong answer:** Guarantees code continues in background. **Follow-up:** What should sockets do? **Related chapter:** 054.

## Q42 — Can JS timers run forever in background?
**Expected answer:** No; mobile OS may suspend/terminate the app, so background work must use appropriate native/OS mechanisms or backend design. **Reasoning:** lifecycle constraint. **Common wrong answer:** `setInterval` keeps RN alive. **Follow-up:** Countdown design? **Related chapter:** 176.

## Q43 — What is React Navigation's `NavigationContainer`?
**Expected answer:** Root container that owns/coordinately manages navigation state, linking and navigation integration for a tree. **Reasoning:** navigation state owner. **Common wrong answer:** A visual screen wrapper. **Follow-up:** Should you create one per screen? **Related chapter:** 055.

## Q44 — Native stack vs tabs?
**Expected answer:** Stack models push/pop screen history; bottom tabs model top-level destinations and often keep independent nested histories. **Reasoning:** information architecture. **Common wrong answer:** Tabs are just colored stack buttons. **Follow-up:** Why nest navigators? **Related chapter:** 056.

## Q45 — What should navigation params contain?
**Expected answer:** Small serializable intent data, often IDs, rather than giant mutable domain objects/functions. **Reasoning:** ownership/restoration/linking. **Common wrong answer:** Put whole Redux store object in params. **Follow-up:** How fetch detail data? **Related chapter:** 057.

## Q46 — How model auth navigation?
**Expected answer:** Bootstrap session, then render anonymous/authenticated route groups based on auth state; logout tears down sensitive state and route reachability. **Reasoning:** structural access UX. **Common wrong answer:** Navigate to login but keep protected history. **Follow-up:** What about pending deep link? **Related chapter:** 058.

## Q47 — Mounted vs focused screen?
**Expected answer:** A screen can remain mounted in navigator while not focused; use navigation focus lifecycle only for visibility-specific work. **Reasoning:** navigation lifecycle. **Common wrong answer:** Leaving a screen always unmounts it. **Follow-up:** Fetch policy on refocus? **Related chapter:** 059.

## Q48 — What is deep linking?
**Expected answer:** Mapping external URLs/intents into validated internal app navigation/actions across cold/background/foreground states. **Reasoning:** external boundary. **Common wrong answer:** Just calling `navigate()` from a URL string. **Follow-up:** Security concern? **Related chapter:** 093–096.

## Q49 — Custom URI scheme vs Universal/App Links?
**Expected answer:** Custom scheme is app-specific and simpler but can have ownership/collision concerns; verified HTTPS links associate a web domain with a signed app on iOS/Android. **Reasoning:** OS routing/security. **Common wrong answer:** They are identical. **Follow-up:** Which is stronger for auth callback? **Related chapter:** 093–095.

## Q50 — What is fetch in RN?
**Expected answer:** Standard-style HTTP API used by RN to issue network requests through platform/runtime networking stack; app should still centralize error/auth/validation policy. **Reasoning:** API vs architecture. **Common wrong answer:** Fetch rejects for every HTTP 4xx/5xx automatically. **Follow-up:** What does `response.ok` mean? **Related chapter:** 073.

## Q51 — What is `AbortController` used for?
**Expected answer:** Cancelling supported async fetch work, such as obsolete search/request on screen change. **Reasoning:** lifecycle/race control. **Common wrong answer:** It rolls back server request already committed. **Follow-up:** Timeout implementation? **Related chapter:** 074.

## Q52 — Why classify API errors?
**Expected answer:** Connectivity, timeout, auth, validation, conflict, rate-limit and server failures have different retry/UI/recovery semantics. **Reasoning:** production resilience. **Common wrong answer:** Every error should retry three times. **Follow-up:** Which 4xx should normally not retry? **Related chapter:** 075.

## Q53 — What is TanStack Query for?
**Expected answer:** Server-state cache/fetch/mutation lifecycle: query keys, freshness, retries, invalidation, pagination and synchronization. **Reasoning:** state ownership. **Common wrong answer:** General replacement for all local UI state. **Follow-up:** What is a query key? **Related chapter:** 078.

## Q54 — What is `staleTime`?
**Expected answer:** Duration cached query data is considered fresh before it becomes stale according to query policy. **Reasoning:** freshness semantics. **Common wrong answer:** Time until cache is deleted. **Follow-up:** What controls unused cache removal? **Related chapter:** 079.

## Q55 — What is query invalidation?
**Expected answer:** Marking matching server-state entries stale so observers can refetch according to policy after a mutation/external change. **Reasoning:** cache coherence. **Common wrong answer:** Always delete entire cache. **Follow-up:** Example after create? **Related chapter:** 079–080.

## Q56 — What is optimistic update?
**Expected answer:** Speculatively updating UI/cache before server confirmation with rollback/reconciliation strategy if request fails/conflicts. **Reasoning:** latency vs consistency. **Common wrong answer:** Ignore server response because UI already changed. **Follow-up:** When avoid optimism? **Related chapter:** 080.

## Q57 — AsyncStorage use case?
**Expected answer:** Non-secret persistent key-value data such as preferences/small app state through community package. **Reasoning:** storage class. **Common wrong answer:** Secure token vault. **Follow-up:** Where tokens go? **Related chapter:** 082/084.

## Q58 — Keychain/Keystore use case?
**Expected answer:** OS-protected credential/key storage used through native library for sensitive tokens/keys, with platform access policies. **Reasoning:** security storage. **Common wrong answer:** Database for all app content. **Follow-up:** Are secrets in app bundle safe? **Related chapter:** 084/092.

## Q59 — When use SQLite?
**Expected answer:** Structured persistent/offline data requiring queries, indexes, relationships, migrations or durable sync semantics. **Reasoning:** data model. **Common wrong answer:** Any single preference. **Follow-up:** Why not giant AsyncStorage JSON? **Related chapter:** 085.

## Q60 — Is `.env` secret in mobile?
**Expected answer:** No; values bundled into distributed app/bundle/native constants can be extracted. Privileged secrets belong server-side. **Reasoning:** client trust boundary. **Common wrong answer:** `.gitignore` makes runtime value secret. **Follow-up:** What kind of key can be in app? **Related chapter:** 092.

## Q61 — What is permission UX principle?
**Expected answer:** Request only when capability is needed/understood, handle denied/blocked/limited states and offer fallback where possible. **Reasoning:** platform/privacy UX. **Common wrong answer:** Ask for every permission at startup. **Follow-up:** Denied vs blocked? **Related chapter:** 097–098.

## Q62 — Android manifest vs runtime permission?
**Expected answer:** Manifest declares capability; applicable dangerous permissions also require runtime user grant according to Android version/API rules. **Reasoning:** two layers. **Common wrong answer:** Manifest alone guarantees access. **Follow-up:** Where iOS purpose strings live? **Related chapter:** 097.

## Q63 — What is `Linking`?
**Expected answer:** Core RN API for receiving/opening external links/URLs, requiring validation and platform configuration for app links/schemes. **Reasoning:** core boundary. **Common wrong answer:** A navigation library. **Follow-up:** Initial URL vs runtime event? **Related chapter:** 100/096.

## Q64 — What is `Share`?
**Expected answer:** Core API invoking platform share UI for supported content; result does not necessarily prove external delivery. **Reasoning:** OS ownership. **Common wrong answer:** Posts directly to social network. **Follow-up:** Analytics implication? **Related chapter:** 100.

## Q65 — Is Clipboard still core?
**Expected answer:** No; old core Clipboard is removed/moved to community ecosystem, so use the current maintained replacement after compatibility review. **Reasoning:** Lean Core/current API awareness. **Common wrong answer:** `import {Clipboard} from 'react-native'` is current. **Follow-up:** Why audit old tutorials? **Related chapter:** 100.

## Q66 — What does `KeyboardAvoidingView` do?
**Expected answer:** Adjusts layout behavior to help content avoid the software keyboard; behavior needs platform/screen testing. **Reasoning:** mobile input layout. **Common wrong answer:** Guarantees every form works cross-platform. **Follow-up:** What else may be needed? **Related chapter:** 102.

## Q67 — What is core `Animated`?
**Expected answer:** RN animation API for declarative animated values/timing/spring/interpolation and supported native/UI execution paths. **Reasoning:** motion model. **Common wrong answer:** React state loop at 60 FPS. **Follow-up:** What is Reanimated for? **Related chapter:** 105–108.

## Q68 — Why Reanimated?
**Expected answer:** Native-integrated animation system with shared values/worklet-style execution for performant gestures/motion close to UI runtime. **Reasoning:** per-frame architecture. **Common wrong answer:** It replaces React Navigation. **Follow-up:** Why verify RN compatibility? **Related chapter:** 109.

## Q69 — 60 FPS frame budget?
**Expected answer:** About 16.67 ms per frame; at 120 Hz about 8.33 ms. **Reasoning:** performance deadline. **Common wrong answer:** 60 ms. **Follow-up:** What work can consume budget? **Related chapter:** 110/165.

## Q70 — What is Gesture Handler?
**Expected answer:** Native-integrated gesture recognition library for tap/pan/pinch/rotation/composition and efficient coordination with animation/navigation. **Reasoning:** gesture system. **Common wrong answer:** Same as `onPress`. **Follow-up:** Why compose gestures? **Related chapter:** 111–115.

## Q71 — What are accessibility labels/roles for?
**Expected answer:** Expose semantic purpose/name to assistive technologies independent of visual presentation. **Reasoning:** semantic UI. **Common wrong answer:** Only automated test selectors. **Follow-up:** Icon-only button? **Related chapter:** 116.

## Q72 — TalkBack vs VoiceOver?
**Expected answer:** Android and iOS screen readers respectively; both require manual platform testing because gestures/announcements differ. **Reasoning:** platform accessibility. **Common wrong answer:** Browser screen readers. **Follow-up:** What automated testing can cover? **Related chapter:** 117.

## Q73 — What is dynamic text/font scaling?
**Expected answer:** OS accessibility/user font scaling that can enlarge text, so layouts must wrap/scroll instead of relying on rigid heights. **Reasoning:** accessibility layout. **Common wrong answer:** Disable it for design consistency. **Follow-up:** How test? **Related chapter:** 118.

## Q74 — `Platform.OS` use case?
**Expected answer:** Small, explicit Android/iOS behavior/style differences. **Reasoning:** platform branching. **Common wrong answer:** Put checks throughout domain code. **Follow-up:** When split files? **Related chapter:** 119.

## Q75 — `.ios.tsx` / `.android.tsx` files?
**Expected answer:** Platform-specific module implementations resolved by RN/Metro when imported via suffixless module path. **Reasoning:** abstraction boundary. **Common wrong answer:** Import suffix manually at every call site. **Follow-up:** What should stay shared? **Related chapter:** 120.

## Q76 — What is Gradle in RN?
**Expected answer:** Android build system executing plugin/task/dependency/resource/compile/package work for the native Android project. **Reasoning:** native build ownership. **Common wrong answer:** JavaScript bundler. **Follow-up:** What does wrapper do? **Related chapter:** 121/129.

## Q77 — What is CocoaPods in RN?
**Expected answer:** iOS native dependency manager/integration used by RN Podfile/autolinking to generate Pods project/workspace integration. **Reasoning:** native dependency path. **Common wrong answer:** npm for JavaScript packages. **Follow-up:** Why run pod install after native npm package? **Related chapter:** 137–138.

## Q78 — What is Xcode workspace?
**Expected answer:** Workspace can contain app project plus CocoaPods Pods project; with pods, build/open `.xcworkspace`. **Reasoning:** iOS integration. **Common wrong answer:** Workspace is only VS Code folder. **Follow-up:** What is a scheme? **Related chapter:** 131–132.

## Q79 — APK vs AAB?
**Expected answer:** APK is installable Android package; AAB is publishing bundle from which Play generates optimized APKs. **Reasoning:** release artifacts. **Common wrong answer:** AAB runs directly on device exactly like APK. **Follow-up:** What is Play App Signing? **Related chapter:** 126.

## Q80 — Why iOS builds need macOS?
**Expected answer:** Xcode and Apple's iOS build/sign/archive toolchain require macOS, even though shared JS tests/Android can run elsewhere. **Reasoning:** native platform toolchain. **Common wrong answer:** React Native compiles iOS from Linux because JS is cross-platform. **Follow-up:** CI implication? **Related chapter:** 185.