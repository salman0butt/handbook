---
id: interview-questions-intermediate-081-160
title: Interview Questions 081–160 — Intermediate
---

# Intermediate Interview Questions 081–160

## Q81 — What happens when React Native renders a `View`?
**Expected answer:** React reconciles the component tree, Fabric creates/updates shadow nodes, Yoga computes layout, a committed tree is diffed/mounted, and platform-native view mutations occur. **Reasoning:** understands render pipeline. **Common wrong answer:** JSX directly becomes Android XML/iOS storyboard. **Follow-up:** Where can view flattening reduce native nodes? **Related chapter:** 148–150.

## Q82 — What is the Shadow Tree?
**Expected answer:** Fabric's immutable renderer-side representation of native component hierarchy/props/layout state used for reconciliation/layout/commit; it is not the UIKit/Android view tree. **Reasoning:** renderer abstraction. **Common wrong answer:** Hidden DOM. **Follow-up:** What are Shadow Nodes? **Related chapter:** 148–150.

## Q83 — Render vs commit vs mount?
**Expected answer:** Render/reconciliation prepares tree work; commit finalizes a consistent shadow-tree revision/layout; mount applies native view mutations. **Reasoning:** separates phases. **Common wrong answer:** They are three words for the same React render. **Follow-up:** Which phase can be expensive without React render being expensive? **Related chapter:** 149.

## Q84 — Why is the old Bridge diagram insufficient?
**Expected answer:** RN 0.86 is New-Architecture-only; JSI, Fabric, TurboModules, C++ scheduling and modern renderer/threading cannot be represented as JS→serialized Bridge→native. **Reasoning:** current architecture. **Common wrong answer:** Bridge is still the mandatory communication path. **Follow-up:** What historical value does the diagram retain? **Related chapter:** 144–145/196.

## Q85 — New Architecture status in RN 0.86?
**Expected answer:** It is the supported/current architecture; since RN 0.82 React Native is New-Architecture-only and 0.86 continues removing legacy paths. **Reasoning:** version awareness. **Common wrong answer:** Optional experimental flag. **Follow-up:** What happened in 0.76 and 0.82? **Related chapter:** 145.

## Q86 — Why TurboModules can lazy-load?
**Expected answer:** Modern module infrastructure does not require eagerly initializing all native modules at startup; modules can be instantiated on demand according to RN registration/runtime mechanisms. **Reasoning:** startup architecture. **Common wrong answer:** Because JavaScript `import()` automatically compiles native code later. **Follow-up:** Does lazy load remove native binary size? **Related chapter:** 152.

## Q87 — When use sync TurboModule method?
**Expected answer:** Only for tiny deterministic operations where synchronous result is genuinely required; long I/O/computation should be async to avoid blocking runtime/UI-sensitive paths. **Reasoning:** performance contract. **Common wrong answer:** Always use sync because JSI is direct. **Follow-up:** Device model vs free disk scan? **Related chapter:** 153/155.

## Q88 — Why Codegen improves native integration?
**Expected answer:** It turns a typed spec into platform interfaces/glue, reducing stringly typed mismatch and making JS/native contracts explicit at build time. **Reasoning:** cross-language safety. **Common wrong answer:** It generates entire Kotlin/Swift business logic. **Follow-up:** What limitations remain? **Related chapter:** 154.

## Q89 — Why can't Codegen accept all TypeScript types?
**Expected answer:** The contract must map deterministically to generated C++/Kotlin/ObjC/Swift-facing representations and runtime semantics; many TS-only constructs have no portable native mapping. **Reasoning:** language boundary. **Common wrong answer:** TypeScript is too slow. **Follow-up:** How redesign an unsupported union? **Related chapter:** 154.

## Q90 — What is autolinking?
**Expected answer:** CLI/build integration discovers installed RN native packages/config and wires their Android/iOS native dependencies through Gradle/CocoaPods mechanisms. **Reasoning:** package lifecycle. **Common wrong answer:** npm automatically edits native source for every package. **Follow-up:** Which command shows discovered config? **Related chapter:** 016/159.

## Q91 — What does `npx react-native config` help diagnose?
**Expected answer:** The resolved project/dependency platform configuration used by autolinking, useful to see whether a native package is discovered and how. **Reasoning:** staged troubleshooting. **Common wrong answer:** It displays only package.json scripts. **Follow-up:** Next iOS step if package is discovered but missing? **Related chapter:** 016/159.

## Q92 — Why manual linking can be wrong now?
**Expected answer:** Modern packages are usually autolinked; adding legacy manual registrations/project references can duplicate integration or diverge from package instructions. **Reasoning:** current ecosystem. **Common wrong answer:** Every native package requires editing settings.gradle and Xcode manually. **Follow-up:** When is manual config valid? **Related chapter:** 159.

## Q93 — Why `pod install` after adding native iOS package?
**Expected answer:** npm places package source; CocoaPods must resolve its podspec and integrate native source/framework dependencies into the Xcode workspace. **Reasoning:** two package systems. **Common wrong answer:** Pod install installs the JS package. **Follow-up:** `pod install` vs `pod update`? **Related chapter:** 137–138.

## Q94 — `pod install` vs `pod update`?
**Expected answer:** Install honors existing lockfile resolution while integrating declared changes; update deliberately re-resolves selected/all pods to newer allowed versions. **Reasoning:** reproducibility. **Common wrong answer:** Update is the recommended repair whenever install fails. **Follow-up:** Why commit Podfile.lock? **Related chapter:** 137.

## Q95 — What is Gradle wrapper?
**Expected answer:** Project-checked scripts/config that download/use a specified Gradle version so developers/CI run the same build runtime; RN 0.86 template pins 9.3.1. **Reasoning:** reproducible build. **Common wrong answer:** Android package manager. **Follow-up:** What is AGP? **Related chapter:** 129/version baseline.

## Q96 — Gradle vs Android Gradle Plugin?
**Expected answer:** Gradle is the general build engine; AGP is Google's plugin adding Android-specific tasks/models/packaging. **Reasoning:** tool layering. **Common wrong answer:** They are identical version names. **Follow-up:** Why compatibility matters? **Related chapter:** 129.

## Q97 — `compileSdk`, `targetSdk`, `minSdk`?
**Expected answer:** compileSdk controls compile-time Android API availability; targetSdk opts into target-level platform behavior; minSdk is oldest installable API. **Reasoning:** Android versioning. **Common wrong answer:** All three mean minimum Android version. **Follow-up:** RN 0.86 baseline values? **Related chapter:** 124/version baseline.

## Q98 — `namespace` vs `applicationId`?
**Expected answer:** Namespace is source/generated package namespace; applicationId is installed/distribution app identity and can differ, especially across flavors. **Reasoning:** Android identity. **Common wrong answer:** Always the same immutable value. **Follow-up:** Which matters to Play/push? **Related chapter:** 123.

## Q99 — What is Android build variant?
**Expected answer:** A concrete build combination, commonly product flavor × build type, with its own configuration/resources/signing/package identity. **Reasoning:** release configuration. **Common wrong answer:** Only debug vs release JavaScript flag. **Follow-up:** How create staging? **Related chapter:** 125.

## Q100 — What is R8?
**Expected answer:** Android release shrinker/optimizer/obfuscator that can remove/rename bytecode and resources under configured rules. **Reasoning:** release behavior. **Common wrong answer:** RN JavaScript minifier. **Follow-up:** Why reflection can break? **Related chapter:** 127.

## Q101 — What is `adb` useful for?
**Expected answer:** Device/emulator communication: install/launch, shell commands, logs, deep-link intents, ports, process diagnostics. **Reasoning:** Android tooling fluency. **Common wrong answer:** Only starts emulator. **Follow-up:** How test App Link? **Related chapter:** 128.

## Q102 — What is Logcat?
**Expected answer:** Android system/application logging stream containing native/Java/Kotlin/runtime diagnostics and crash traces. **Reasoning:** native debugging. **Common wrong answer:** RN console replacement containing only JS logs. **Follow-up:** How filter production process? **Related chapter:** 128/160.

## Q103 — Xcode target vs scheme vs build configuration?
**Expected answer:** Target defines a product; configuration supplies build settings (Debug/Release/Staging); scheme selects targets/config/actions for run/test/archive. **Reasoning:** iOS build model. **Common wrong answer:** Scheme is the bundle ID. **Follow-up:** Why share CI scheme? **Related chapter:** 132.

## Q104 — What are entitlements?
**Expected answer:** Signed app capabilities/permissions such as associated domains, push, keychain groups or background modes, authorized by signing/provisioning configuration. **Reasoning:** iOS capability model. **Common wrong answer:** Strings shown in permission prompts. **Follow-up:** Where usage descriptions live? **Related chapter:** 133.

## Q105 — Info.plist role?
**Expected answer:** iOS application metadata/configuration including many permission usage strings and URL/native settings; not a secret store. **Reasoning:** native configuration. **Common wrong answer:** JavaScript environment file. **Follow-up:** Why can missing purpose string crash/deny capability? **Related chapter:** 133.

## Q106 — Provisioning profile role?
**Expected answer:** Apple-signed profile authorizing a particular app identity/capabilities/signing context, and for development/ad hoc possibly devices. **Reasoning:** distribution security. **Common wrong answer:** Same as certificate. **Follow-up:** How certificate differs? **Related chapter:** 136.

## Q107 — App Store build vs marketing version?
**Expected answer:** Build number identifies a specific uploaded build and must increment appropriately; marketing version is user-facing release version. **Reasoning:** release identity. **Common wrong answer:** One value only. **Follow-up:** Android equivalents? **Related chapter:** 184.

## Q108 — What is Hermes source-map symbolication?
**Expected answer:** Mapping bundled/minified JS/Hermes stack locations from a specific release back to original source using its exact source map. **Reasoning:** production debugging. **Common wrong answer:** Native dSYM handles JS stacks. **Follow-up:** What handles iOS native addresses? **Related chapter:** 142/163.

## Q109 — dSYM vs Android mapping file?
**Expected answer:** dSYM symbolicates iOS native binaries; R8 mapping file deobfuscates optimized Android bytecode. They complement JS source maps. **Reasoning:** multi-runtime observability. **Common wrong answer:** One source map handles everything. **Follow-up:** Why exact build pairing? **Related chapter:** 163/187.

## Q110 — Why release builds for performance?
**Expected answer:** Debug/dev tooling, bundling, assertions and optimization differ; release-like builds represent actual runtime/compiler/native behavior. **Reasoning:** measurement validity. **Common wrong answer:** Debug is slower by a constant factor, so relative measurements always transfer. **Follow-up:** What reference devices? **Related chapter:** 165–168.

## Q111 — Why can FlatList still be slow?
**Expected answer:** Virtualization bounds mounted rows but row rendering/layout/images, cache/data size, unstable props, native main-thread work and bad window settings can still exceed frame budget. **Reasoning:** avoids silver bullet. **Common wrong answer:** FlatList guarantees smooth 10k rows. **Follow-up:** Investigation steps? **Related chapter:** 167.

## Q112 — Why can ScrollView 10k rows OOM?
**Expected answer:** It eagerly renders/mounts all children, increasing React objects, native views, layout and image memory. **Reasoning:** eager tree. **Common wrong answer:** Because ScrollView has a hard 1000-row limit. **Follow-up:** What does virtualization bound? **Related chapter:** 061–062.

## Q113 — What does `removeClippedSubviews` trade off?
**Expected answer:** It may detach/clamp offscreen native subviews for performance on supported scenarios/platforms but can introduce rendering/layout edge cases; test before relying on it. **Reasoning:** cautious tuning. **Common wrong answer:** Always set true for performance. **Follow-up:** Better first optimization? **Related chapter:** 065.

## Q114 — Why avoid array index keys?
**Expected answer:** Insert/reorder/delete changes index identity, causing React/list to reuse state/views for the wrong logical item. **Reasoning:** identity. **Common wrong answer:** Index is slower because number comparison is expensive. **Follow-up:** What if static immutable list? **Related chapter:** 063.

## Q115 — What is cursor pagination?
**Expected answer:** Server returns opaque position/token for next page, generally more stable than offsets when data changes during paging. **Reasoning:** server consistency. **Common wrong answer:** Cursor equals page number. **Follow-up:** How handle duplicates? **Related chapter:** 066.

## Q116 — Why `onEndReached` can fire more than once?
**Expected answer:** Scroll/layout thresholds are event conditions, not exactly-once requests; state changes/flings can satisfy repeatedly, so guard with pagination state. **Reasoning:** event semantics. **Common wrong answer:** It is always an RN bug. **Follow-up:** Guard condition? **Related chapter:** 066.

## Q117 — Why use React Hook Form on mobile?
**Expected answer:** It provides form state/validation/subscription abstractions that can reduce rerenders and centralize mobile field handling; RN inputs often use Controller/useController. **Reasoning:** architecture not trend. **Common wrong answer:** It automatically secures/validates server input. **Follow-up:** What does Zod add? **Related chapter:** 069.

## Q118 — TypeScript vs Zod?
**Expected answer:** TypeScript provides compile-time types; Zod validates untrusted runtime values and can produce trusted typed data. **Reasoning:** boundary safety. **Common wrong answer:** TS interface validates JSON. **Follow-up:** Where validate API payload? **Related chapter:** 070.

## Q119 — Why client validation isn't security?
**Expected answer:** Client can be modified/bypassed; backend must enforce authorization/business invariants regardless of mobile UI checks. **Reasoning:** trust boundary. **Common wrong answer:** Zod prevents malicious requests. **Follow-up:** What client validation is good for? **Related chapter:** 070/188.

## Q120 — Why a request timeout needs cancellation?
**Expected answer:** A `Promise.race` timeout can stop awaiting but underlying network work may continue; AbortController or library support cancels supported request work. **Reasoning:** resource/lifecycle. **Common wrong answer:** Throwing timeout automatically cancels socket. **Follow-up:** How distinguish cancellation? **Related chapter:** 074.

## Q121 — What is exponential backoff with jitter?
**Expected answer:** Retry delays grow exponentially with randomization to reduce load/synchronized retry storms and are capped/bounded. **Reasoning:** resilience. **Common wrong answer:** Retry every second forever. **Follow-up:** Which operations need idempotency? **Related chapter:** 075.

## Q122 — Why refresh-token requests need single-flight?
**Expected answer:** Concurrent 401s should usually share one refresh operation; otherwise multiple refreshes can race/rotate tokens and fail. **Reasoning:** concurrency. **Common wrong answer:** Every failed request refreshes independently. **Follow-up:** What do waiting requests do? **Related chapter:** 076.

## Q123 — What is query key design rule?
**Expected answer:** Include all stable/serializable inputs that materially change server result and scope it by relevant identity/tenant. **Reasoning:** cache identity. **Common wrong answer:** One key per endpoint name regardless of params. **Follow-up:** User-switch risk? **Related chapter:** 078.

## Q124 — `staleTime` vs GC time?
**Expected answer:** staleTime controls freshness; garbage collection controls retention of unused cached entries after no observers, according to current library terminology/config. **Reasoning:** cache lifecycle. **Common wrong answer:** Both delete data after same timer. **Follow-up:** Can stale data remain in cache? **Related chapter:** 079.

## Q125 — How integrate TanStack Query with AppState?
**Expected answer:** Map app active/inactive state to the library's focus handling/current RN integration so stale queries refetch according to policy on foreground. **Reasoning:** mobile focus model. **Common wrong answer:** Browser focus event works automatically on native. **Follow-up:** What about network status? **Related chapter:** 080.

## Q126 — What is query persistence for?
**Expected answer:** Persisting selected server-cache state across process restarts/offline use, with versioning/expiry/security policy; it is not automatically an offline transactional database. **Reasoning:** storage semantics. **Common wrong answer:** Full offline-first sync comes for free. **Follow-up:** When use SQLite? **Related chapter:** 080/085/177.

## Q127 — AsyncStorage vs MMKV?
**Expected answer:** AsyncStorage is asynchronous community KV; MMKV-style solutions can provide very fast/synchronous native KV via modern integration. Choice depends on compatibility, data size, lifecycle and security—not “MMKV always.” **Reasoning:** trade-offs. **Common wrong answer:** MMKV makes huge JSON parse free. **Follow-up:** Where secrets go? **Related chapter:** 082–083.

## Q128 — What happens to data on app reinstall?
**Expected answer:** Ordinary app sandbox storage is generally removed; platform keychain/backup behavior can differ by OS/config/library, so never assume all storage has same lifecycle. **Reasoning:** platform storage. **Common wrong answer:** AsyncStorage and Keychain always survive identically. **Follow-up:** Why test credential migration? **Related chapter:** 084–086.

## Q129 — Why use integer minor units for money?
**Expected answer:** Avoid binary floating-point rounding and preserve exact currency arithmetic within domain rules. **Reasoning:** domain correctness. **Common wrong answer:** JavaScript `number` decimal is always exact. **Follow-up:** What about currencies with different minor units? **Related chapter:** project 11.

## Q130 — What is an offline outbox?
**Expected answer:** Durable queue/log of intended mutations stored locally so operations survive process death and can replay idempotently when network returns. **Reasoning:** offline durability. **Common wrong answer:** Array in component state. **Follow-up:** What metadata should an operation carry? **Related chapter:** 177.

## Q131 — Why idempotency keys?
**Expected answer:** A retry after timeout can safely produce the same server operation/result instead of duplicates because the server recognizes the operation identity. **Reasoning:** distributed failure. **Common wrong answer:** Debouncing UI is enough. **Follow-up:** When regenerate key? **Related chapter:** 177.

## Q132 — What is conflict resolution in offline-first apps?
**Expected answer:** Policy for concurrent local/server changes using versions and domain-specific merge/reject/resolve semantics; not a generic last-write-wins assumption. **Reasoning:** consistency. **Common wrong answer:** Newest device timestamp always wins. **Follow-up:** Why device clock unreliable? **Related chapter:** 177.

## Q133 — Why sockets disconnect frequently on mobile?
**Expected answer:** Network handoffs, background suspension, process death, server idle timeouts and token expiry are normal; client must reconnect/resync. **Reasoning:** mobile network reality. **Common wrong answer:** WebSocket should remain forever once opened. **Follow-up:** What happens after reconnect? **Related chapter:** 178.

## Q134 — Why sequence IDs in real-time feed?
**Expected answer:** Detect ordering/gaps/replays across reconnect so the client can dedupe and resync from server truth. **Reasoning:** delivery semantics. **Common wrong answer:** Arrival time is authoritative. **Follow-up:** Exactly-once transport? **Related chapter:** 178.

## Q135 — Push token vs user ID?
**Expected answer:** Token identifies a provider/app installation routing endpoint and can rotate; backend maps it to installation/user/session context. **Reasoning:** push architecture. **Common wrong answer:** Token permanently identifies account. **Follow-up:** Logout handling? **Related chapter:** 174.

## Q136 — APNs vs FCM?
**Expected answer:** APNs is Apple's push service; FCM is Firebase messaging and commonly routes Android, and some stacks use it as a provider layer while iOS delivery ultimately involves APNs. **Reasoning:** provider layers. **Common wrong answer:** RN core delivers push itself. **Follow-up:** What must backend store? **Related chapter:** 174.

## Q137 — Foreground vs killed notification?
**Expected answer:** Callback/presentation/routing availability differs; killed-state tap may launch the process, requiring bootstrap before navigation. **Reasoning:** lifecycle. **Common wrong answer:** Same JS handler runs immediately in every state. **Follow-up:** How route once? **Related chapter:** 175.

## Q138 — Why push payload should be minimal?
**Expected answer:** Provider/OS payloads can be visible/limited/stale; avoid sensitive data, use stable intent IDs and fetch authorized current state. **Reasoning:** privacy/security. **Common wrong answer:** Put full user record to avoid API call. **Follow-up:** What if entity deleted? **Related chapter:** 174–175.

## Q139 — Why background JS is constrained?
**Expected answer:** Android/iOS protect battery/privacy/resources and suspend/terminate apps; eligible background work must use OS-specific mechanisms and time limits. **Reasoning:** platform constraint. **Common wrong answer:** RN can run a service forever cross-platform. **Follow-up:** WorkManager concept? **Related chapter:** 176.

## Q140 — WorkManager concept?
**Expected answer:** Android API/library for deferrable guaranteed background work under OS constraints, not a permanent JavaScript loop. **Reasoning:** native scheduling. **Common wrong answer:** Thread pool owned by React. **Follow-up:** iOS equivalent constraints? **Related chapter:** 176.

## Q141 — What is Jest preset change in recent RN?
**Expected answer:** RN 0.85 moved the Jest preset to `@react-native/jest-preset`; current projects should follow the current template/testing docs instead of historical `preset: react-native`. **Reasoning:** version-aware testing. **Common wrong answer:** Old preset path is permanently canonical. **Follow-up:** Why does version baseline matter? **Related chapter:** 179.

## Q142 — What should RNTL tests query by?
**Expected answer:** Prefer user-visible accessible semantics—role, label, text—rather than implementation internals. **Reasoning:** behavior testing. **Common wrong answer:** testID for every element. **Follow-up:** When testID useful? **Related chapter:** 179–180.

## Q143 — Why fake timers?
**Expected answer:** Deterministically control timer-based behavior such as debounce/retry without wall-clock waits, while restoring real timers afterward. **Reasoning:** test determinism. **Common wrong answer:** Fake timers make production code faster. **Follow-up:** Risk with async libraries? **Related chapter:** 180.

## Q144 — Unit vs component vs E2E?
**Expected answer:** Unit tests isolated logic; component/integration tests React UI/provider behavior; E2E runs built app through platform/user flows. **Reasoning:** test pyramid/coverage. **Common wrong answer:** E2E replaces all smaller tests. **Follow-up:** What catches signing failure? **Related chapter:** 179–181.

## Q145 — Why E2E tests become flaky?
**Expected answer:** Uncontrolled async/network/animations/device state, unstable selectors and sleeps; improve deterministic fixtures, synchronization and observable-state waits. **Reasoning:** test systems. **Common wrong answer:** Add longer sleeps. **Follow-up:** How choose selectors? **Related chapter:** 181.

## Q146 — Why accessibility tests still need manual screen-reader testing?
**Expected answer:** Automated semantic checks cannot fully validate focus traversal, announcements, gestures, dynamic content and platform screen-reader behavior. **Reasoning:** test limits. **Common wrong answer:** Passing role queries proves accessibility. **Follow-up:** Release checklist? **Related chapter:** 181.

## Q147 — What is configuration safety rule?
**Expected answer:** Environment configuration in client is extractable; use it for public/build behavior, not privileged secrets, and type/centralize it. **Reasoning:** security. **Common wrong answer:** `.env.production` hides API secret. **Follow-up:** Android/iOS config mechanisms? **Related chapter:** 182.

## Q148 — Android flavors vs iOS schemes/configs?
**Expected answer:** Both allow separate app/environment identities/build settings, but Android uses Gradle flavors/build types while iOS composes schemes, targets/configurations/xcconfig/signing. **Reasoning:** cross-platform release architecture. **Common wrong answer:** Same config file drives both natively. **Follow-up:** What external registrations must differ? **Related chapter:** 183.

## Q149 — What is staged rollout?
**Expected answer:** Release new version to a percentage/cohort, observe health, then expand or halt, reducing blast radius. **Reasoning:** release engineering. **Common wrong answer:** Beta testing after full production. **Follow-up:** Which metrics gate expansion? **Related chapter:** 184.

## Q150 — OTA update limitations?
**Expected answer:** It can deliver compatible JS/assets through an appropriate system, but cannot add/change unavailable native binary capabilities and must respect runtime compatibility/security/store policy. **Reasoning:** binary contract. **Common wrong answer:** Any RN update avoids app stores. **Follow-up:** What is runtime version? **Related chapter:** 186.

## Q151 — Why upload source maps, dSYMs and R8 maps?
**Expected answer:** They reconstruct actionable source/native stack traces for the exact shipped artifacts and enable production crash diagnosis. **Reasoning:** observability lifecycle. **Common wrong answer:** Console logs are enough. **Follow-up:** When upload? **Related chapter:** 187.

## Q152 — What are breadcrumbs in crash reporting?
**Expected answer:** Privacy-safe chronological context events around navigation/network/actions that help reconstruct circumstances before failure. **Reasoning:** diagnosis. **Common wrong answer:** Full request/response payload dump. **Follow-up:** What must be redacted? **Related chapter:** 187.

## Q153 — Why client authorization is insufficient?
**Expected answer:** Mobile client can be modified/tampered; backend must enforce permissions and data access for every request. **Reasoning:** untrusted client. **Common wrong answer:** Hidden button prevents unauthorized action. **Follow-up:** Role-aware UI still useful? **Related chapter:** 188.

## Q154 — Does obfuscation protect embedded secrets?
**Expected answer:** No; it raises reverse-engineering cost but values/runtime behavior can still be extracted/observed. **Reasoning:** security realism. **Common wrong answer:** R8 makes API key secret. **Follow-up:** Where privileged key belongs? **Related chapter:** 188.

## Q155 — What is RTL support?
**Expected answer:** UI/text/interaction adaptation for right-to-left locales using logical layout and semantic mirroring where appropriate, not simply flipping whole screen. **Reasoning:** internationalization. **Common wrong answer:** Apply `scaleX:-1` globally. **Follow-up:** What should not mirror? **Related chapter:** 189.

## Q156 — What is a React Native monorepo risk?
**Expected answer:** Metro resolution/watch/symlink issues, duplicate React copies, native package boundaries, Gradle/CocoaPods integration and CI complexity. **Reasoning:** ecosystem awareness. **Common wrong answer:** Monorepo is only TypeScript path aliases. **Follow-up:** Peer dependencies for shared RN library? **Related chapter:** 190.

## Q157 — What belongs in a mobile design system?
**Expected answer:** Semantic tokens, typography/spacing/color/motion, accessible components/variants, platform adaptations and governance/testing. **Reasoning:** system vs component folder. **Common wrong answer:** Collection of copied buttons. **Follow-up:** Why semantic tokens? **Related chapter:** 190.

## Q158 — Feature-based architecture benefit?
**Expected answer:** Colocates cohesive product behavior/ownership while shared domain/data/platform layers maintain dependency direction and testable boundaries. **Reasoning:** modularity. **Common wrong answer:** Every component must be duplicated inside each feature. **Follow-up:** Where native adapters live? **Related chapter:** 191.

## Q159 — What is brownfield RN?
**Expected answer:** Integrating React Native surfaces/features into an existing native Android/iOS application rather than RN owning the full app shell. **Reasoning:** integration mode. **Common wrong answer:** Migrating a web React app. **Follow-up:** Who owns navigation? **Related chapter:** 193.

## Q160 — What is an RN library example app for?
**Expected answer:** Proves real consumer integration, Codegen/autolinking/Gradle/CocoaPods and platform behavior in addition to unit tests. **Reasoning:** package quality. **Common wrong answer:** Marketing demo only. **Follow-up:** What compatibility matrix should CI test? **Related chapter:** 194.