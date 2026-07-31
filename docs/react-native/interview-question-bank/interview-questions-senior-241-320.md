---
id: interview-questions-senior-241-320
title: Interview Questions 241–320 — Senior
---

# Senior Interview Questions 241–320

## Q241 — How would you choose between Context, Zustand and Redux Toolkit?
**Expected answer:** Start from ownership, update frequency, debugging needs, middleware/workflow complexity and team conventions; Context is good for low-frequency scoped dependencies, Zustand for lightweight external state, Redux Toolkit for explicit event/state architecture and tooling at scale. **Reasoning:** tool choice follows problem shape. **Common wrong answer:** Redux is always enterprise and Zustand is always faster. **Follow-up:** Where does TanStack Query fit? **Related chapter:** 045–050/199.

## Q242 — Why should server state not automatically live in a global client store?
**Expected answer:** Server state has freshness, caching, invalidation, retries and synchronization semantics that query libraries model directly; copying it into generic state duplicates ownership and creates staleness bugs. **Reasoning:** state-category separation. **Common wrong answer:** One store should own every value. **Follow-up:** What belongs in local UI state? **Related chapter:** 071–080/191.

## Q243 — How do you design a typed API layer for a large RN app?
**Expected answer:** Separate transport, runtime validation, domain mapping and feature-facing repositories; centralize auth/retry/error normalization while keeping endpoint types and cache keys explicit. **Reasoning:** boundary control. **Common wrong answer:** Call fetch directly from every screen. **Follow-up:** Where should Zod validation run? **Related chapter:** 071–080/191.

## Q244 — How would you structure authentication so navigation does not become the source of truth?
**Expected answer:** Session/auth state owns authentication; navigation derives which graph/screen is available and handles validated intents after session resolution. **Reasoning:** navigation is presentation/orchestration. **Common wrong answer:** If the user is on Home, they are authenticated. **Follow-up:** How handle an expired refresh token? **Related chapter:** 086–093.

## Q245 — What makes a refresh-token implementation race-safe?
**Expected answer:** Serialize or deduplicate refresh, queue/retry eligible requests once, rotate tokens atomically, handle refresh failure centrally and prevent infinite retry loops. **Reasoning:** concurrency correctness. **Common wrong answer:** Every 401 starts its own refresh. **Follow-up:** What happens with ten simultaneous 401s? **Related chapter:** 086–093.

## Q246 — How would you model deep-link routing securely?
**Expected answer:** Parse into a typed internal intent, validate route/params and authorization, defer until bootstrap/session/navigation readiness, then consume once. **Reasoning:** external input is untrusted. **Common wrong answer:** Pass URL path directly to navigate. **Follow-up:** How do Universal Links/App Links change trust? **Related chapter:** 091–096/188.

## Q247 — Why is PKCE important in a mobile OAuth client?
**Expected answer:** A public mobile client cannot safely hold a client secret; PKCE binds the authorization code to the initiating app instance through a verifier/challenge and reduces code interception risk. **Reasoning:** public-client threat model. **Common wrong answer:** PKCE encrypts access tokens at rest. **Follow-up:** Why also validate state? **Related chapter:** 086–093.

## Q248 — What is your secure-storage rule for tokens?
**Expected answer:** Store credential material in platform-backed secure storage such as Keychain/Keystore through a maintained library, minimize lifetime/data, and never rely on AsyncStorage or bundled encryption keys as equivalent protection. **Reasoning:** storage classes differ. **Common wrong answer:** Base64 in AsyncStorage is encrypted. **Follow-up:** What remains vulnerable on a compromised device? **Related chapter:** 081–090/188.

## Q249 — How do you decide whether certificate pinning is worth it?
**Expected answer:** Use a threat model, account for certificate/key rotation, outage recovery, observability and compromised-client limits; do not adopt it as a checkbox. **Reasoning:** security control has operational cost. **Common wrong answer:** Pinning makes the client trusted. **Follow-up:** What is a backup-pin/rotation plan? **Related chapter:** 071–080/188.

## Q250 — How would you design offline mutation synchronization?
**Expected answer:** Persist intent with stable IDs/idempotency keys, replay according to connectivity/auth state, define ordering/dependencies, use retries with backoff and resolve conflicts by explicit domain rules/versioning. **Reasoning:** offline is a distributed-system problem. **Common wrong answer:** Retry every failed POST when online. **Follow-up:** How do deletes conflict with edits? **Related chapter:** 176–178.

## Q251 — What is an idempotency key solving in mobile workflows?
**Expected answer:** It lets retried/replayed requests represent the same logical operation so network ambiguity does not create duplicate orders/payments/entities. **Reasoning:** delivery is often at-least-once. **Common wrong answer:** It speeds up requests. **Follow-up:** Who generates and scopes the key? **Related chapter:** 176–178.

## Q252 — How do you resolve offline conflicts without silent data loss?
**Expected answer:** Define per-domain policy such as server version/ETag checks, last-write-wins only where acceptable, mergeable fields, user resolution for ambiguous conflicts, and audit metadata. **Reasoning:** conflict policy is product semantics. **Common wrong answer:** Always overwrite server with local. **Follow-up:** How would notes differ from bank transfers? **Related chapter:** 176–178.

## Q253 — How would you architect a reliable WebSocket client on mobile?
**Expected answer:** Explicit connection state, auth, heartbeat if protocol requires, exponential reconnect with jitter, app-state awareness, dedup/order handling, subscription registry and resync after reconnect. **Reasoning:** mobile networks and lifecycle are unstable. **Common wrong answer:** Open one socket at app launch and keep it forever. **Follow-up:** What happens after background suspension? **Related chapter:** 179–180.

## Q254 — Why must real-time reconnect include resynchronization?
**Expected answer:** Messages can be missed while disconnected/backgrounded; reconnecting transport does not prove application state is current, so fetch a cursor/version/snapshot before trusting live events. **Reasoning:** transport continuity differs from state continuity. **Common wrong answer:** WebSocket reconnect replays everything automatically. **Follow-up:** How avoid duplicate events? **Related chapter:** 179–180.

## Q255 — How would you diagnose a FlatList that is smooth on iPhone but janky on low-end Android?
**Expected answer:** Reproduce release build on affected hardware, measure JS/UI frames, row render cost, image decode, layout, windowing and native work; optimize the measured bottleneck rather than platform-labeling the issue. **Reasoning:** device-class profiling. **Common wrong answer:** Android is slower, so reduce features. **Follow-up:** Which list props would you test? **Related chapter:** 061–067/165–170.

## Q256 — When is `getItemLayout` valuable and when is it unsafe?
**Expected answer:** Valuable for fixed/predictable item sizes to skip measurement and improve scroll-to-index; unsafe when actual item dimensions vary from the supplied calculation. **Reasoning:** optimization depends on invariant. **Common wrong answer:** Use it for every list. **Follow-up:** How handle mixed fixed row types? **Related chapter:** 061–067.

## Q257 — How do you reason about 60 Hz and 120 Hz performance budgets?
**Expected answer:** 60 Hz gives about 16.67 ms per frame; 120 Hz about 8.33 ms, while work spans JS, renderer, main thread, GPU and OS scheduling. Optimize end-to-end latency rather than one timer. **Reasoning:** frame budget shrinks with refresh rate. **Common wrong answer:** React must finish every frame in exactly 16 ms. **Follow-up:** Which interactions deserve 120 Hz validation? **Related chapter:** 165–170.

## Q258 — Why is release-mode profiling important?
**Expected answer:** Dev tooling, validation, logging and bundling behavior can distort timings; release-like builds reveal production optimization, minification and native behavior. **Reasoning:** benchmark representative artifacts. **Common wrong answer:** Debug FPS predicts store performance. **Follow-up:** How keep profiling symbols? **Related chapter:** 161–170.

## Q259 — What is your process for startup optimization?
**Expected answer:** Measure cold-start stages, classify native/runtime/bundle/evaluation/first-render/network work, remove/block less, lazy-load noncritical features, defer SDKs and verify on representative devices. **Reasoning:** startup is a pipeline. **Common wrong answer:** Shrink JS bundle only. **Follow-up:** Which SDKs would you delay? **Related chapter:** 168/197.

## Q260 — Why can eager native SDK initialization be expensive?
**Expected answer:** SDKs may perform disk I/O, reflection/class loading, networking, database setup or main-thread work before first frame; each adds startup and failure surface. **Reasoning:** native work competes with app launch. **Common wrong answer:** Native initialization is free because it is compiled. **Follow-up:** How instrument it? **Related chapter:** 168/197.

## Q261 — How do you investigate a memory leak after repeated navigation?
**Expected answer:** Reproduce a fixed loop, compare JS heap/native allocations, inspect retained screens/listeners/timers/images/JSI resources and validate that memory returns toward steady state after fixes. **Reasoning:** retention must be localized by memory domain. **Common wrong answer:** Force GC after each screen. **Follow-up:** How can navigation stacks retain screens legitimately? **Related chapter:** 143/170.

## Q262 — What is a common image-memory mistake?
**Expected answer:** Loading/displaying source images far larger than rendered dimensions, causing large decoded pixel buffers and cache pressure. **Reasoning:** compressed file size is not memory size. **Common wrong answer:** A 300 KB JPEG uses 300 KB RAM. **Follow-up:** What would you request from CDN? **Related chapter:** 171.

## Q263 — When would you choose a native implementation over JavaScript?
**Expected answer:** When capability is only native, strict latency/threading/background/hardware integration requires it, existing native SDK reuse is compelling, or measurement shows JS path cannot meet constraints. **Reasoning:** native code is a trade-off, not status. **Common wrong answer:** Native is always faster. **Follow-up:** What upgrade cost does native code add? **Related chapter:** 152–159/199.

## Q264 — When would you prefer JavaScript over a native module?
**Expected answer:** For business/domain logic, UI orchestration and cross-platform behavior that meets performance needs, because JS/TS is easier to share, test and upgrade. **Reasoning:** minimize platform surface. **Common wrong answer:** Anything important must be native. **Follow-up:** How isolate a later native replacement? **Related chapter:** 191/199.

## Q265 — What should a TurboModule public API look like?
**Expected answer:** Small, typed, stable, domain-neutral where possible, explicit about sync/async/events/errors and wrapped by a TS adapter that shields generated/native details. **Reasoning:** boundary longevity. **Common wrong answer:** Mirror every native SDK method one-for-one. **Follow-up:** How version events? **Related chapter:** 152–156/194.

## Q266 — Why are synchronous TurboModule methods risky?
**Expected answer:** They can block the caller/runtime path and make latency depend on native work; reserve them for tiny deterministic operations. **Reasoning:** direct access is not free. **Common wrong answer:** JSI makes sync I/O safe. **Follow-up:** What belongs in a Promise method? **Related chapter:** 153/198.

## Q267 — How do you design native-module error contracts?
**Expected answer:** Stable machine-readable codes plus safe messages/details, mapped consistently across Android/iOS and wrapped into domain errors; do not expose platform exception strings as API. **Reasoning:** cross-platform contract. **Common wrong answer:** Throw raw NSError/Exception text to UI. **Follow-up:** Which errors are retryable? **Related chapter:** 156/164.

## Q268 — What is the role of Codegen in API correctness?
**Expected answer:** It generates platform contracts/glue from supported typed specs, catching many shape/type mismatches at build time and integrating TurboModules/Fabric. **Reasoning:** make native boundaries explicit. **Common wrong answer:** Codegen writes business logic. **Follow-up:** Why are supported spec types constrained? **Related chapter:** 154.

## Q269 — Why must a Fabric component cooperate with Yoga?
**Expected answer:** Layout is owned by renderer/shadow-tree/Yoga contracts; native views that secretly mutate size can desynchronize React layout and platform presentation. **Reasoning:** renderer owns layout model. **Common wrong answer:** Native view can resize itself arbitrarily after mount. **Follow-up:** How expose intrinsic measurement? **Related chapter:** 148–158.

## Q270 — How would you review a third-party native library before adoption?
**Expected answer:** Check RN 0.86/New Architecture support, maintenance, native dependencies, permissions, privacy/security, binary/startup cost, platform parity, test coverage, release cadence and upgrade history. **Reasoning:** npm install changes the native product. **Common wrong answer:** Stars and weekly downloads are enough. **Follow-up:** What is an exit strategy? **Related chapter:** 194/199.

## Q271 — What makes autolinking fail even when package installation succeeded?
**Expected answer:** CLI discovery/config may be missing, platform metadata invalid, Gradle/CocoaPods integration broken, codegen/pod install stale or runtime registration incompatible. **Reasoning:** linking is a pipeline. **Common wrong answer:** Node module present means native binary contains it. **Follow-up:** Which command inspects CLI config? **Related chapter:** 159.

## Q272 — What does `npx react-native config` help diagnose?
**Expected answer:** It shows the CLI-resolved project/dependency platform configuration used by autolinking, helping distinguish discovery problems from build/runtime problems. **Reasoning:** inspect generated model. **Common wrong answer:** It edits Gradle and Podfiles automatically. **Follow-up:** What would missing iOS config imply? **Related chapter:** 159.

## Q273 — How do you handle a Gradle dependency conflict after adding an SDK?
**Expected answer:** Read dependency graph and exact resolution error, identify transitive version constraints/capabilities, align supported versions or exclude deliberately, then validate all affected variants. **Reasoning:** resolve evidence, not random pins. **Common wrong answer:** Force newest version globally. **Follow-up:** Why can force break another library? **Related chapter:** 121–140.

## Q274 — How do you handle a CocoaPods conflict safely?
**Expected answer:** Inspect Podfile.lock/spec constraints/deployment targets/source repos, confirm RN/library compatibility, update narrowly through Bundler/CocoaPods and validate workspace/build on clean CI. **Reasoning:** pod graph is versioned native dependency state. **Common wrong answer:** Delete ios folder. **Follow-up:** When is pod repo update relevant? **Related chapter:** 121–140.

## Q275 — Why should teams use Gradle Wrapper and Bundler?
**Expected answer:** They pin project-specific build tool versions so local and CI environments resolve the same Gradle/Ruby gem tooling instead of machine-global latest versions. **Reasoning:** reproducibility. **Common wrong answer:** CI images make version pinning unnecessary. **Follow-up:** What else must be pinned? **Related chapter:** 121–140/185.

## Q276 — How would you design Android flavors and iOS schemes consistently?
**Expected answer:** Map dev/staging/prod identity across package/bundle IDs, icons, endpoints, signing, push, OAuth redirects, deep-link domains, analytics and feature config with one documented environment matrix. **Reasoning:** environment is cross-system. **Common wrong answer:** Only API URL changes. **Follow-up:** How prevent staging credentials in production? **Related chapter:** 182–183.

## Q277 — Why are `.env` files not secret storage in a mobile app?
**Expected answer:** Values needed by client code/native build are packaged into or derivable from the distributed binary; attackers can inspect the app. **Reasoning:** client is untrusted distribution. **Common wrong answer:** Gitignored means secret at runtime. **Follow-up:** Where should privileged API keys live? **Related chapter:** 182/188.

## Q278 — What should a mobile CI pipeline validate before building stores artifacts?
**Expected answer:** Lockfile install, lint, typecheck, unit/component tests, Android/iOS compile, variant-specific config and optionally E2E/security checks before signing/publishing. **Reasoning:** cheap deterministic gates first. **Common wrong answer:** Only run `npm test`. **Follow-up:** How cache without hiding dependency drift? **Related chapter:** 181/185.

## Q279 — Why do iOS CI builds require macOS?
**Expected answer:** Xcode, Apple SDKs, code signing and archive tooling are macOS-only. **Reasoning:** platform toolchain requirement. **Common wrong answer:** CocoaPods alone requires macOS. **Follow-up:** Which RN checks can run on Linux first? **Related chapter:** 185.

## Q280 — What must be retained for production crash symbolication?
**Expected answer:** Exact Hermes source maps, Android R8 mapping/native symbols as applicable, iOS dSYMs and release/build identifiers tied to uploaded artifacts. **Reasoning:** optimized addresses/locations need exact build maps. **Common wrong answer:** Source repository is enough. **Follow-up:** What if maps come from a different build? **Related chapter:** 161–164/187.

## Q281 — How do you roll out a risky mobile release?
**Expected answer:** Internal/beta testing, staged percentage rollout, feature flags/server kill switches for optional behavior, release-specific monitoring, explicit halt criteria and rollback/forward-fix plan. **Reasoning:** binaries propagate slowly. **Common wrong answer:** Publish 100% and monitor support tickets. **Follow-up:** What cannot a feature flag undo? **Related chapter:** 184/192.

## Q282 — Why is mobile rollback different from web rollback?
**Expected answer:** You cannot instantly replace already-installed native binaries; users may run multiple versions for days/months, so backend compatibility, flags and store rollout controls matter. **Reasoning:** distributed version population. **Common wrong answer:** Redeploy previous commit. **Follow-up:** How long should APIs remain backward-compatible? **Related chapter:** 184/200.

## Q283 — What is the key constraint of an OTA JS update?
**Expected answer:** The update must be compatible with native modules/runtime in the installed binary and must respect platform/store/security policy. **Reasoning:** JS cannot add missing native capability. **Common wrong answer:** OTA can update any native code. **Follow-up:** How define runtime compatibility? **Related chapter:** 186.

## Q284 — How would you version OTA runtime compatibility?
**Expected answer:** Tie bundles to a native runtime/binary compatibility identifier derived from native API set/build policy, reject incompatible updates, stage rollout and preserve rollback bundle. **Reasoning:** prevent JS/native mismatch. **Common wrong answer:** App semantic version alone always proves compatibility. **Follow-up:** What change requires new native runtime ID? **Related chapter:** 186.

## Q285 — What should structured mobile logs contain?
**Expected answer:** Event name, severity, timestamp, app/build/platform/environment, safe correlation/context and bounded non-sensitive fields; avoid credentials/PII and uncontrolled payload dumps. **Reasoning:** diagnostics plus privacy. **Common wrong answer:** Log every request body. **Follow-up:** How correlate with backend traces? **Related chapter:** 187.

## Q286 — How do analytics and observability differ?
**Expected answer:** Product analytics answers user/product behavior; observability diagnoses system health/failures using logs, crashes, traces, performance and technical metrics, though schemas can share release context. **Reasoning:** different questions and governance. **Common wrong answer:** One event SDK replaces crash reporting. **Follow-up:** Which events should never include tokens? **Related chapter:** 187.

## Q287 — How do you prevent observability from leaking sensitive data?
**Expected answer:** Data classification, allowlisted fields, redaction at collection boundary, sampling/retention controls, secure transport/access and tests for known secret formats. **Reasoning:** telemetry is another data sink. **Common wrong answer:** Vendor encryption makes logging secrets acceptable. **Follow-up:** What about URLs/query params? **Related chapter:** 187–188.

## Q288 — What is a production-ready crash dashboard sliced by?
**Expected answer:** App version/build, OS/device, environment/release cohort, crash-free users/sessions, top signatures and rollout timing, with symbolicated traces and breadcrumbs. **Reasoning:** prioritize regressions and impact. **Common wrong answer:** Total crash count only. **Follow-up:** How detect one-model regression? **Related chapter:** 187.

## Q289 — How would you decide a mobile performance budget?
**Expected answer:** Pick user-critical metrics such as cold start, interaction latency, frame stability, memory and binary size by representative device tiers, then gate regressions with measurable thresholds. **Reasoning:** performance must be operationalized. **Common wrong answer:** “Keep it fast.” **Follow-up:** Which metric belongs in CI vs field telemetry? **Related chapter:** 165–170/200.

## Q290 — What makes an accessibility regression a production defect?
**Expected answer:** It can block users from completing core flows just like a functional bug; semantic roles/labels/focus/order/dynamic type/touch targets must be acceptance criteria and tested on platforms. **Reasoning:** accessibility is functionality. **Common wrong answer:** Accessibility is visual polish. **Follow-up:** What can automated tests miss? **Related chapter:** 111–116/181.

## Q291 — How would you design a mobile design-system component API?
**Expected answer:** Semantic variants, tokens, accessible defaults, controlled escape hatches, platform adaptation behind stable props, typed states and usage guidance; avoid exposing raw implementation internals. **Reasoning:** scale through constrained consistency. **Common wrong answer:** Wrap View/Text and expose every style prop. **Follow-up:** When allow `style` override? **Related chapter:** 190.

## Q292 — What belongs in a mobile design system besides components?
**Expected answer:** Tokens, typography, spacing, color/theming, motion, accessibility rules, icons, interaction patterns, platform adaptations, documentation/testing and migration/version policy. **Reasoning:** system is a product contract. **Common wrong answer:** Button library only. **Follow-up:** How ship breaking token changes? **Related chapter:** 190/200.

## Q293 — How do you prevent a monorepo from becoming one tightly coupled application?
**Expected answer:** Explicit package boundaries, dependency direction, public APIs, ownership, version/build constraints and architecture tests; colocated code is not permission for arbitrary imports. **Reasoning:** physical proximity differs from modularity. **Common wrong answer:** Workspaces automatically enforce architecture. **Follow-up:** Which packages may depend on native app package? **Related chapter:** 190–192.

## Q294 — What are Metro-specific monorepo concerns?
**Expected answer:** Resolution roots/watch folders/symlinks/duplicate React or RN copies, package exports/transforms and native package locations must align with Metro and workspace layout. **Reasoning:** JS package graph must resolve one compatible runtime. **Common wrong answer:** Node resolution behavior is always identical. **Follow-up:** Why are duplicate React copies dangerous? **Related chapter:** 139–140/190.

## Q295 — How would you define feature boundaries in a large RN app?
**Expected answer:** Around product capabilities with owned screens/orchestration/domain/data adapters, minimal cross-feature public contracts and app-level composition/navigation above them. **Reasoning:** align code with change ownership. **Common wrong answer:** One folder per technical type globally. **Follow-up:** Where do shared domain primitives live? **Related chapter:** 191.

## Q296 — What is a repository abstraction useful for on mobile?
**Expected answer:** It gives features/domain a stable data interface while hiding API/cache/database/platform details and enabling deterministic tests/migrations. **Reasoning:** dependency inversion at data boundary. **Common wrong answer:** Repository means Redux store. **Follow-up:** When is it unnecessary ceremony? **Related chapter:** 191.

## Q297 — How do you keep native platform differences from leaking everywhere?
**Expected answer:** Isolate platform-specific implementation behind typed adapters/components, use platform files selectively and keep product/domain contracts shared. **Reasoning:** constrain divergence. **Common wrong answer:** Scatter `Platform.OS` through every screen. **Follow-up:** When is split UI justified? **Related chapter:** 116–120/191.

## Q298 — How do you decide whether to split `.android.tsx` and `.ios.tsx`?
**Expected answer:** Split when behavior/implementation materially diverges and a shared abstraction becomes conditional noise; keep shared API/domain above both. **Reasoning:** optimize maintainability, not file count. **Common wrong answer:** Always split every component for performance. **Follow-up:** How test parity? **Related chapter:** 116–120.

## Q299 — What is a safe brownfield RN boundary?
**Expected answer:** Native host owns app lifecycle/root navigation, RN surface receives explicit auth/navigation/config/data contracts, and runtime lifetime plus callbacks are documented/tested. **Reasoning:** avoid hidden two-way global coupling. **Common wrong answer:** Let RN directly reach all native singleton state. **Follow-up:** Who owns deep links? **Related chapter:** 193.

## Q300 — What is the hardest part of brownfield integration?
**Expected answer:** Lifecycle/navigation/runtime/dependency ownership and cross-stack contracts, not rendering the first RN view. **Reasoning:** integration complexity is systemic. **Common wrong answer:** JSX conversion. **Follow-up:** How many RN runtimes would you create? **Related chapter:** 193.

## Q301 — How would you publish an RN native library responsibly?
**Expected answer:** Stable TS API, Codegen/native implementation, example app, Android/iOS tests, documented compatibility matrix/install requirements, semantic versioning and CI across supported RN/toolchain versions. **Reasoning:** consumers inherit native risk. **Common wrong answer:** Publish package after local demo works. **Follow-up:** How test New Architecture? **Related chapter:** 194.

## Q302 — What should an RN library compatibility matrix include?
**Expected answer:** Supported RN minors/New Architecture expectations, Android/iOS minimums/toolchains where relevant, peer dependency ranges and known incompatible native dependencies. **Reasoning:** compatibility is multi-dimensional. **Common wrong answer:** Only Node version. **Follow-up:** How deprecate an RN minor? **Related chapter:** 194–195.

## Q303 — How would you upgrade a three-year-old RN app?
**Expected answer:** Inventory dependencies/native customizations, choose staged minors, read release notes/Upgrade Helper/template diffs, modernize unsupported libraries, preserve product native config, validate both release variants and production-critical flows at each step. **Reasoning:** migration risk must be decomposed. **Common wrong answer:** Replace package.json with latest template. **Follow-up:** When would you rewrite a native integration? **Related chapter:** 195–196.

## Q304 — Why upgrade one RN minor at a time in an old app?
**Expected answer:** It narrows template/API/toolchain changes and makes regressions attributable, though teams may batch when compatibility evidence and test coverage justify it. **Reasoning:** control migration blast radius. **Common wrong answer:** It is a strict technical requirement. **Follow-up:** When could a larger jump be rational? **Related chapter:** 195.

## Q305 — What should an RN upgrade smoke test cover?
**Expected answer:** Startup, navigation, auth, networking, storage, deep links, push, permissions, native modules/components, camera/media if used, background behavior, release builds, performance and store-signing paths. **Reasoning:** native integration regressions cluster at boundaries. **Common wrong answer:** App launches = upgrade done. **Follow-up:** Which tests run on real devices? **Related chapter:** 195.

## Q306 — How do you migrate a legacy Bridge module?
**Expected answer:** Define a supported TurboModule spec, map semantics/errors/events, implement generated platform contract, remove bridge-only assumptions and validate threading/lifecycle/performance under New Architecture. **Reasoning:** preserve behavior while changing boundary. **Common wrong answer:** Rename `NativeModules` import. **Follow-up:** What if API depends on callback ordering? **Related chapter:** 152–156/196.

## Q307 — What old architecture knowledge still matters in RN 0.86?
**Expected answer:** Bridge/BatchedBridge/legacy NativeModules/UIManager concepts matter for reading old code, migration and third-party failures, but are not the recommended new-project architecture. **Reasoning:** historical literacy without obsolete guidance. **Common wrong answer:** Legacy Bridge can be enabled for new 0.86 apps. **Follow-up:** When did New Architecture become mandatory? **Related chapter:** 145/196.

## Q308 — How would you debug a production issue spanning JS and native layers?
**Expected answer:** Start from symptom/release cohort, gather JS and native telemetry, build a timeline/correlation ID, isolate boundary calls/events and reproduce exact build/device state before changing code. **Reasoning:** cross-layer evidence. **Common wrong answer:** Pick one layer based on intuition. **Follow-up:** Which artifacts enable symbolication? **Related chapter:** 160–164/187.

## Q309 — What is a good incident hypothesis?
**Expected answer:** Specific, falsifiable and tied to evidence, e.g. “release variant R8 removed class X causing startup failure on path Y,” with an experiment/log to confirm or reject it. **Reasoning:** debugging is controlled learning. **Common wrong answer:** “React Native is flaky.” **Follow-up:** How record rejected hypotheses? **Related chapter:** 161–164/199.

## Q310 — How do you prevent recurrence after fixing a mobile incident?
**Expected answer:** Add targeted test/gate/telemetry/runbook or architectural constraint that detects the same failure class earlier, plus document root cause and ownership. **Reasoning:** repair system, not only symptom. **Common wrong answer:** Add a comment to code. **Follow-up:** Which incident should become CI validation? **Related chapter:** 181–187/199.

## Q311 — How do you handle app versions that use different backend contracts?
**Expected answer:** Maintain backward-compatible APIs or explicit version negotiation, tolerate old clients during adoption window, measure version distribution and retire contracts deliberately. **Reasoning:** mobile clients cannot be upgraded instantly. **Common wrong answer:** Deploy backend and require app update immediately. **Follow-up:** How handle mandatory security upgrade? **Related chapter:** 184/200.

## Q312 — What does a feature flag not replace?
**Expected answer:** Correct code, auth/authorization, migrations, tests and native compatibility; flags are rollout/control mechanisms, not security boundaries or permanent architecture. **Reasoning:** control plane vs correctness. **Common wrong answer:** Hide unfinished unsafe code behind a client flag forever. **Follow-up:** Where must authorization live? **Related chapter:** 182/192.

## Q313 — How would you model release health?
**Expected answer:** Crash-free users/sessions, ANRs/watchdogs, startup/interaction regressions, network/auth failure rates and critical product funnel success segmented by version/device/OS/cohort. **Reasoning:** technical and user outcomes. **Common wrong answer:** Store rating only. **Follow-up:** What halts rollout? **Related chapter:** 184/187.

## Q314 — How do you choose between staged rollout and all-at-once release?
**Expected answer:** Prefer staged for meaningful risk when platform supports it; weigh urgency, security fix, backend compatibility, cohort representativeness and observability. **Reasoning:** rollout is risk management. **Common wrong answer:** Always 100% because tests passed. **Follow-up:** What about a critical vulnerability? **Related chapter:** 184.

## Q315 — How should a senior engineer evaluate a state/navigation library migration?
**Expected answer:** Define pain and measurable goals, inventory coupling, compare compatibility/maintenance/performance/API cost, design incremental adapters, validate critical flows and have rollback criteria. **Reasoning:** migrations need business justification. **Common wrong answer:** Rewrite because a newer library is popular. **Follow-up:** How avoid two sources of truth? **Related chapter:** 191/199.

## Q316 — What is your rule for introducing a new native dependency?
**Expected answer:** Require a capability/performance need, maintenance/New Architecture/platform compatibility review, privacy/security assessment, binary/startup impact and owner/exit plan. **Reasoning:** native dependency is long-term platform surface. **Common wrong answer:** Add it if JS wrapper API is convenient. **Follow-up:** Who owns upgrades? **Related chapter:** 192/199.

## Q317 — What makes an architecture decision record useful?
**Expected answer:** It captures context, decision, alternatives, trade-offs, consequences and date/owners so future teams understand why constraints exist and when to revisit them. **Reasoning:** architecture evolves across people/time. **Common wrong answer:** ADR is a diagram of final code. **Follow-up:** When supersede an ADR? **Related chapter:** 192/200.

## Q318 — How do you balance platform standardization with team autonomy?
**Expected answer:** Standardize high-blast-radius foundations through paved roads and contracts, allow local choices inside bounded feature areas, and provide exception process/evidence rather than central approval for every change. **Reasoning:** scale without bottleneck. **Common wrong answer:** One platform team chooses every implementation detail. **Follow-up:** Which choices are organization-wide? **Related chapter:** 192/200.

## Q319 — What would make you reject an optimization PR?
**Expected answer:** No measured bottleneck, unrealistic benchmark, increased complexity/risk, platform regression or no statistically/practically meaningful gain on target devices. **Reasoning:** performance work is evidence-driven. **Common wrong answer:** Any lower render count is automatically better. **Follow-up:** What evidence should author provide? **Related chapter:** 165–170/199.

## Q320 — What distinguishes senior React Native engineering from API familiarity?
**Expected answer:** Owning cross-layer trade-offs, native/build/release/debugging/security/performance boundaries, designing maintainable architecture and reducing production risk across Android/iOS—not merely knowing component props. **Reasoning:** senior scope is system outcomes. **Common wrong answer:** Memorizing every RN API. **Follow-up:** Which production failure would you want a senior to lead? **Related chapter:** 199.
