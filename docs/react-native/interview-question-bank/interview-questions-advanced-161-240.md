---
id: interview-questions-advanced-161-240
title: Interview Questions 161–240 — Advanced
---

# Advanced Interview Questions 161–240

## Q161 — Describe RN 0.86 startup end to end.
**Expected answer:** OS launches native binary, host initializes RN/Hermes/runtime infrastructure, bundle loads/evaluates, AppRegistry resolves root, React reconciles, Fabric/Yoga commit layout, native views mount. **Reasoning:** system pipeline. **Common wrong answer:** Metro starts the production app. **Follow-up:** Which parts affect cold start? **Related chapter:** 197.

## Q162 — Hermes vs Metro?
**Expected answer:** Metro resolves/transforms/bundles source; Hermes executes JavaScript and participates in runtime/GC/debugging. **Reasoning:** build/runtime separation. **Common wrong answer:** Hermes bundles files. **Follow-up:** Where does Babel fit? **Related chapter:** 139–142.

## Q163 — Why is Hermes coupled to RN releases?
**Expected answer:** RN ships/tests a compatible engine/runtime integration and build configuration, so independently changing Hermes can violate tested ABI/runtime assumptions. **Reasoning:** version coupling. **Common wrong answer:** Any Hermes version works because JS is standard. **Follow-up:** What if opting for JSC? **Related chapter:** 141/version baseline.

## Q164 — What does Hermes GC manage, and what does it not?
**Expected answer:** It reclaims unreachable JS heap objects; native images/views/C++ resources need their own lifetime ownership and can leak independently. **Reasoning:** memory domains. **Common wrong answer:** Hermes GC frees every native resource referenced by RN automatically. **Follow-up:** How profile both? **Related chapter:** 143/170.

## Q165 — Why can a JSI host object leak native resources?
**Expected answer:** JS/C++ ownership can retain native resources beyond screen lifetime; lifetime must be tied to runtime/object destruction and callbacks guarded. **Reasoning:** cross-language memory. **Common wrong answer:** GC always calls native destructor immediately. **Follow-up:** RAII implications? **Related chapter:** 147.

## Q166 — Is JSI “zero cost”?
**Expected answer:** No. It avoids old serialization/bridge constraints but calls still have runtime, conversion, scheduling, memory and native-work costs; sync work can block. **Reasoning:** performance realism. **Common wrong answer:** JSI makes any native call free. **Follow-up:** What should remain async? **Related chapter:** 146–147/153.

## Q167 — How do TurboModules differ from legacy NativeModules?
**Expected answer:** TurboModules use typed specs/Codegen, modern JSI-backed registration/lifecycle and lazy loading; legacy modules used Bridge-era registration/message semantics. **Reasoning:** architecture migration. **Common wrong answer:** Only naming changed. **Follow-up:** What migration risks exist? **Related chapter:** 152/196.

## Q168 — Why use Codegen instead of handwritten string contracts?
**Expected answer:** Generates compile-time-compatible platform interfaces from one spec, reducing runtime name/type mismatches and enabling renderer/module integration. **Reasoning:** typed boundary. **Common wrong answer:** It eliminates need to write native implementation. **Follow-up:** What is generated for Fabric? **Related chapter:** 154/157.

## Q169 — What are Fabric Shadow Nodes?
**Expected answer:** Immutable-ish renderer data nodes representing native component props/layout/event relationships in a shadow-tree revision, separate from actual platform views. **Reasoning:** renderer internals. **Common wrong answer:** Android Shadow classes for testing. **Follow-up:** How Yoga uses them? **Related chapter:** 148–150.

## Q170 — What is view flattening?
**Expected answer:** Renderer optimization that can avoid unnecessary platform views for layout-only composition while preserving semantics, reducing native hierarchy/mount cost. **Reasoning:** internals/performance. **Common wrong answer:** Metro removes JSX Views from bundle. **Follow-up:** Why not assume one View equals one native view? **Related chapter:** 150.

## Q171 — How does concurrent React relate to New Architecture?
**Expected answer:** Modern renderer/scheduler architecture supports React 18/19 concurrency features and interruptible/scheduled render work more naturally than legacy renderer/bridge constraints. **Reasoning:** architecture goal. **Common wrong answer:** Concurrent React means multiple JS threads execute component render simultaneously. **Follow-up:** What is `useTransition` for? **Related chapter:** 144/151.

## Q172 — What is the modern threading model?
**Expected answer:** Roles include JS runtime/React work, C++ scheduler/Fabric render-commit work, platform UI/main-thread mount/draw and native/background queues; exact operation affinity varies. **Reasoning:** rejects three-thread myth. **Common wrong answer:** Always JS Thread → Bridge Thread → Native Thread. **Follow-up:** Where should disk I/O run? **Related chapter:** 198.

## Q173 — Why can synchronous layout be useful?
**Expected answer:** It enables layout-dependent effects/measurement before visible inconsistencies for interactions, while expensive or repeated measurement still harms performance. **Reasoning:** capability/tradeoff. **Common wrong answer:** All layout should be read synchronously every render. **Follow-up:** `useLayoutEffect` use case? **Related chapter:** 151/040.

## Q174 — Why can React render be fast while UI janks?
**Expected answer:** Native mount/layout/draw, image decode, animations, main-thread work or GC can exceed frame budget after/beside React reconciliation. **Reasoning:** end-to-end profiling. **Common wrong answer:** UI jank always means too many React renders. **Follow-up:** Which profiler next? **Related chapter:** 165–170.

## Q175 — How do you investigate dropped frames?
**Expected answer:** Reproduce release-like on affected device, capture frame/main-thread/JS traces, inspect render/mount/images/animations/GC, form hypotheses and verify changes against baseline. **Reasoning:** measurement discipline. **Common wrong answer:** Add `useCallback` everywhere. **Follow-up:** 120 Hz budget? **Related chapter:** 165–167.

## Q176 — What causes slow RN startup?
**Expected answer:** Native SDK init, runtime creation, bundle load/eval, eager modules, large JS imports/data, first render/layout/mount, disk/network blocking and platform services. **Reasoning:** multi-stage startup. **Common wrong answer:** Only JS bundle size. **Follow-up:** How defer work? **Related chapter:** 168.

## Q177 — Why can native SDK count affect RN upgrades?
**Expected answer:** Each SDK adds Gradle/CocoaPods/toolchain/API compatibility, startup/binary size and New Architecture risk, expanding the intersection that must support a new RN minor. **Reasoning:** dependency governance. **Common wrong answer:** Native packages are isolated behind npm. **Follow-up:** How govern them? **Related chapter:** 169/192.

## Q178 — How do you distinguish JS memory from native memory?
**Expected answer:** Use Hermes/JS heap tooling plus Android Studio/Xcode native allocation/profile tools; inspect images/views/C++ and retained JS separately. **Reasoning:** memory domains. **Common wrong answer:** `global.gc()` tells total app memory. **Follow-up:** Typical image leak? **Related chapter:** 143/170.

## Q179 — Why do large images crash despite small file size?
**Expected answer:** Decode expands compressed image into pixel buffers; e.g. width×height×bytes-per-pixel can consume much more native memory. **Reasoning:** media memory. **Common wrong answer:** JPEG file size equals RAM usage. **Follow-up:** Mitigation? **Related chapter:** 171.

## Q180 — How would you optimize an infinite media feed?
**Expected answer:** Cursor paging, stable keys, bounded cache/pages, sized images, virtualized rows, measured window/batching, isolated state and release-device profiling. **Reasoning:** holistic list architecture. **Common wrong answer:** Set `windowSize=1`. **Follow-up:** How restore scroll? **Related chapter:** 061–067/167.

## Q181 — Why can `memo` hurt or not help?
**Expected answer:** It adds comparison/cognitive cost and cannot prevent rerenders when props/context/state actually change; state ownership may be the real issue. **Reasoning:** optimization judgment. **Common wrong answer:** Memo always makes component faster. **Follow-up:** How decide? **Related chapter:** 166.

## Q182 — `useMemo` correctness rule?
**Expected answer:** Code should remain correct if memoized computation reruns; useMemo is optimization, not semantic storage for side effects/state. **Reasoning:** React model. **Common wrong answer:** useMemo guarantees value persists forever. **Follow-up:** Where persistent mutable value belongs? **Related chapter:** 166/030.

## Q183 — `useCallback` and FlatList?
**Expected answer:** Stable callback identity may help memoized rows, but only if downstream equality/render cost benefits; it doesn't solve changing item/context props. **Reasoning:** targeted optimization. **Common wrong answer:** Every renderItem must always be wrapped. **Follow-up:** Better first check? **Related chapter:** 063/166.

## Q184 — How would you diagnose ANR?
**Expected answer:** Use Android ANR traces/Play diagnostics, reproduce, identify main-thread blocked work/locks/I/O/startup, inspect native/Java stacks and fix the blocking path. **Reasoning:** native production debugging. **Common wrong answer:** Catch exception in JS. **Follow-up:** How can native SDK cause it? **Related chapter:** 161/165.

## Q185 — How would you diagnose iOS watchdog termination?
**Expected answer:** Inspect termination reason/crash report, profile launch/main thread/background task duration, defer/block less, then validate release build. **Reasoning:** OS responsiveness. **Common wrong answer:** It is always out-of-memory. **Follow-up:** Difference from exception crash? **Related chapter:** 161/168.

## Q186 — How would you diagnose release-only Android crash?
**Expected answer:** Capture release Logcat, deobfuscate R8 if needed, compare build config/minification/Hermes/native initialization/environment/signing, reproduce exact variant. **Reasoning:** build-mode isolation. **Common wrong answer:** Metro reset. **Follow-up:** Why mapping file? **Related chapter:** 127/163.

## Q187 — How would you diagnose iOS startup crash before JS?
**Expected answer:** Xcode/Organizer native crash report, symbolicate exact archive, inspect AppDelegate/native SDK/runtime/pod initialization before root bundle/render. **Reasoning:** native boundary. **Common wrong answer:** React error boundary. **Follow-up:** How binary-search SDKs? **Related chapter:** 134/163.

## Q188 — How do native crash and JS exception differ operationally?
**Expected answer:** JS exception may be handled/reported within runtime/UI boundary; native fatal exception/signal can terminate process and needs native symbols/logs; both need release artifact mapping. **Reasoning:** failure domains. **Common wrong answer:** Both are caught by ErrorBoundary. **Follow-up:** What does ErrorBoundary not catch? **Related chapter:** 163–164.

## Q189 — What can ErrorBoundary catch?
**Expected answer:** Errors thrown during rendering/lifecycle of descendant React tree (per React semantics), not arbitrary async handlers/native process crashes. **Reasoning:** recovery limits. **Common wrong answer:** Every promise/network/native crash. **Follow-up:** How handle API errors? **Related chapter:** 164.

## Q190 — Why keep user-facing failure states separate from crash reporting?
**Expected answer:** Expected recoverable failures need UX/retry; unexpected defects need telemetry/diagnostics. Logging an error does not help the user and showing every technical exception is unsafe. **Reasoning:** resilience UX. **Common wrong answer:** Crash reporter replaces error UI. **Follow-up:** Example API 503? **Related chapter:** 164/075.

## Q191 — How would you build reliable uploads?
**Expected answer:** File URI/streaming, cancellation/progress, server idempotency/resumable chunks where needed, background transfer for eligible scenarios, low-storage/network handling. **Reasoning:** mobile I/O lifecycle. **Common wrong answer:** Convert 500 MB video to base64 and fetch. **Follow-up:** Why base64 risky? **Related chapter:** 172/269 exercise.

## Q192 — Why media APIs need real-device testing?
**Expected answer:** Camera/microphone/codecs/audio focus/interruptions/hardware/permissions/background behavior are incompletely modeled in simulators. **Reasoning:** platform hardware. **Common wrong answer:** Simulator success proves production. **Follow-up:** What lifecycle must release resources? **Related chapter:** 173.

## Q193 — Push notification architecture layers?
**Expected answer:** Backend sends to FCM/APNs, OS/provider routes to installation, native integration receives/presents, RN maps payload/tap to validated app intent/navigation. **Reasoning:** system boundary. **Common wrong answer:** React Navigation sends push. **Follow-up:** Where auth is checked? **Related chapter:** 174–175.

## Q194 — Data message vs notification payload trade-off?
**Expected answer:** Platform/provider behavior differs by app state; data handling may allow custom processing but background delivery is constrained, while notification payload may be OS-presented. Follow current provider/platform rules. **Reasoning:** lifecycle awareness. **Common wrong answer:** Data handler always executes instantly when killed. **Follow-up:** Design reliable routing? **Related chapter:** 175.

## Q195 — Why notification tap routing must be idempotent?
**Expected answer:** Initial notification, link events and bootstrap replays can trigger the same intent; route should be consumed exactly once or deduped. **Reasoning:** lifecycle races. **Common wrong answer:** Every callback navigate immediately. **Follow-up:** How queue until navigation ready? **Related chapter:** 175.

## Q196 — What is an offline-first source of truth?
**Expected answer:** Usually a local/domain store/database for offline-capable entities with sync to server, while server remains global authority according to consistency model; UI reads coherent local state. **Reasoning:** architecture. **Common wrong answer:** Network request is required before any UI. **Follow-up:** Query cache vs DB? **Related chapter:** 177.

## Q197 — Why client-generated IDs offline?
**Expected answer:** Let local entities/mutations have stable identity before server round trip, aiding references/idempotency/reconciliation. **Reasoning:** disconnected creation. **Common wrong answer:** Use array index until server returns ID. **Follow-up:** Server collision handling? **Related chapter:** 177.

## Q198 — What is optimistic update rollback trap with concurrency?
**Expected answer:** A snapshot rollback from one failed mutation can overwrite later successful/optimistic changes; mutation ordering/version-aware reconciliation is needed. **Reasoning:** concurrency. **Common wrong answer:** Always restore original snapshot. **Follow-up:** Per-entity serialization? **Related chapter:** 080/177.

## Q199 — Why network “online” is not API availability?
**Expected answer:** Device can have interface connectivity while DNS/TLS/backend/captive portal/routing fails; requests remain authoritative evidence. **Reasoning:** networking. **Common wrong answer:** Wi-Fi means API success. **Follow-up:** NetInfo use? **Related chapter:** 077.

## Q200 — Certificate pinning trade-off?
**Expected answer:** Can reduce some MITM/trust-store threats but creates certificate/key rotation/outage/recovery complexity and is bypassable on compromised clients; adopt from threat model. **Reasoning:** security maturity. **Common wrong answer:** Mandatory for every RN app. **Follow-up:** Backup pin strategy? **Related chapter:** 014/188.

## Q201 — Why root/jailbreak detection isn't a security boundary?
**Expected answer:** Client/device under attacker control can spoof/bypass checks; it is a risk signal, not proof of trust. **Reasoning:** adversarial client. **Common wrong answer:** Block rooted devices and tokens are safe. **Follow-up:** Server-side mitigations? **Related chapter:** 188.

## Q202 — What does R8 obfuscation protect?
**Expected answer:** Raises reverse-engineering effort and reduces bytecode size, but does not make embedded secrets or runtime behavior inaccessible. **Reasoning:** realistic hardening. **Common wrong answer:** Encrypts app secrets. **Follow-up:** What stays server-side? **Related chapter:** 127/188.

## Q203 — How should mobile API secrets be handled?
**Expected answer:** Privileged secrets stay backend-side; app contains only public/constrained identifiers designed for exposure and authenticates user/device requests to backend. **Reasoning:** distributed client. **Common wrong answer:** Hide key in native C++/env. **Follow-up:** What about map SDK keys? **Related chapter:** 092/188.

## Q204 — OAuth Authorization Code + PKCE flow?
**Expected answer:** Client generates verifier/challenge, opens system auth, receives code+state callback, verifies state, exchanges code with verifier, obtains tokens/session without a bundled client secret. **Reasoning:** mobile public-client security. **Common wrong answer:** Store OAuth client secret in app. **Follow-up:** Why system browser? **Related chapter:** 090.

## Q205 — What does OIDC add to OAuth?
**Expected answer:** Identity layer on OAuth, defining ID token/claims/discovery/user authentication semantics; OAuth alone is authorization framework. **Reasoning:** auth protocols. **Common wrong answer:** They are identical names. **Follow-up:** Which claims matter? **Related chapter:** 090.

## Q206 — Why use system browser/auth session for OAuth?
**Expected answer:** Shares trusted provider session/security UI and avoids collecting credentials inside arbitrary app WebView; follows platform/provider best practice. **Reasoning:** security UX. **Common wrong answer:** WebView is safer because app controls it. **Follow-up:** Callback mechanisms? **Related chapter:** 090.

## Q207 — How can biometric auth be modeled correctly?
**Expected answer:** Local user-presence gate to unlock a securely stored credential/key or sensitive UI; backend identity still depends on server session/token. **Reasoning:** local vs remote auth. **Common wrong answer:** Face ID itself logs user into backend with no credential. **Follow-up:** Enrollment changes? **Related chapter:** 091.

## Q208 — Keychain/Keystore caveats?
**Expected answer:** Access policy, backup/reinstall/device lock/biometric invalidation and platform/library behavior vary; test lifecycle and avoid assuming universal survival. **Reasoning:** native storage. **Common wrong answer:** Encrypted vault behaves identically on both OSes. **Follow-up:** What if biometric set changes? **Related chapter:** 084/091.

## Q209 — What is a safe logout sequence?
**Expected answer:** Best-effort server revoke, immediately clear local secure credentials, sensitive caches/stores, subscriptions and protected navigation; never depend on network for local logout. **Reasoning:** cross-layer teardown. **Common wrong answer:** Navigate to Login. **Follow-up:** Offline logout? **Related chapter:** 089/100 exercise.

## Q210 — How should multi-account cache be scoped?
**Expected answer:** Query/storage keys or separate cache instances must include session/tenant identity where appropriate, and sensitive state cleared on switch to prevent leakage. **Reasoning:** data isolation. **Common wrong answer:** Same `['profile']` cache forever. **Follow-up:** What about persisted cache? **Related chapter:** 078/188.

## Q211 — What is Android App Link verification?
**Expected answer:** Domain publishes Digital Asset Links tying package/signing cert to domain and manifest declares verified HTTPS intent filters, enabling OS-trusted routing. **Reasoning:** platform security. **Common wrong answer:** Any HTTPS link opens app if React Navigation configured. **Follow-up:** Why signing fingerprint matters? **Related chapter:** 094.

## Q212 — What is iOS Universal Link association?
**Expected answer:** Associated Domains entitlement plus website AASA mapping app identifiers/routes enables OS to open verified HTTPS links in app. **Reasoning:** OS boundary. **Common wrong answer:** Add URL to JS linking config only. **Follow-up:** Why production/staging differ? **Related chapter:** 095.

## Q213 — How do you debug a deep link that works Android not iOS?
**Expected answer:** First isolate iOS OS association/entitlement/AASA with native logs/test; then initial URL/link event/parser/navigation. **Reasoning:** layered diagnosis. **Common wrong answer:** Rewrite shared navigator immediately. **Follow-up:** Cold vs warm path? **Related chapter:** 095–096.

## Q214 — What is permission “blocked”?
**Expected answer:** State where app cannot simply request again and user must change permission in Settings/platform flow; exact states depend on API/library/OS. **Reasoning:** UX action. **Common wrong answer:** Same as denied and request repeatedly. **Follow-up:** What should UI show? **Related chapter:** 098.

## Q215 — Why not ask every permission on launch?
**Expected answer:** Poor trust/conversion and lacks context; request at meaningful feature action with fallback, minimizing capabilities. **Reasoning:** privacy UX. **Common wrong answer:** Easier because all permissions resolved early. **Follow-up:** Notification prompt timing? **Related chapter:** 097–099.

## Q216 — How should location subscription lifecycle work?
**Expected answer:** Start only when needed/authorized, select accuracy/frequency for product, remove watcher on blur/unmount/background as appropriate, and account for battery/background policy. **Reasoning:** native resource lifecycle. **Common wrong answer:** Start once globally forever. **Follow-up:** Background location justification? **Related chapter:** 099.

## Q217 — Why gestures and navigation can conflict?
**Expected answer:** Both use native recognizers that may compete for same touch stream/edge region; composition/priority/product design must define ownership. **Reasoning:** recognizer model. **Common wrong answer:** JS event bubbling alone decides. **Follow-up:** iOS back swipe example? **Related chapter:** 115.

## Q218 — How do Reanimated shared values differ from React state?
**Expected answer:** Shared values are animation/runtime mutable state optimized for UI/gesture work; React state drives declarative component rendering and semantic app state. **Reasoning:** state domains. **Common wrong answer:** Shared values should replace all React state. **Follow-up:** When sync back to React? **Related chapter:** 109.

## Q219 — Why respect reduced motion?
**Expected answer:** Accessibility preference; animation should reduce/replace motion while preserving state/meaning and usability. **Reasoning:** inclusive UX. **Common wrong answer:** Disable every visual response. **Follow-up:** How test? **Related chapter:** 110/118.

## Q220 — Accessibility role/value/state difference?
**Expected answer:** Role describes control type, state conveys conditions like disabled/selected/checked, value communicates current numeric/text range/value. **Reasoning:** semantics. **Common wrong answer:** Put all information into label string. **Follow-up:** Rating control semantics? **Related chapter:** 116/158.

## Q221 — How should a custom Fabric control be accessible?
**Expected answer:** Native view and JS wrapper expose equivalent role/value/actions/labels on both platforms, with focus/touch sizing and events matching semantics. **Reasoning:** native component quality. **Common wrong answer:** Fabric automatically makes it accessible. **Follow-up:** Adjustable rating? **Related chapter:** 158.

## Q222 — Why Storybook isn't enough for a design system?
**Expected answer:** It documents/isolate states, but real navigation, insets, keyboard, native accessibility, device performance and platform integration require actual app/device tests. **Reasoning:** tooling limits. **Common wrong answer:** Storybook snapshot means production-ready. **Follow-up:** What belongs in component CI? **Related chapter:** 190.

## Q223 — What is a CI release artifact set?
**Expected answer:** Built APK/AAB/archive/IPA as appropriate plus JS source maps, Android mapping, iOS dSYMs, test reports and metadata tied to commit/build. **Reasoning:** reproducibility/debugging. **Common wrong answer:** Only uploaded binary. **Follow-up:** Why retain metadata? **Related chapter:** 185/187.

## Q224 — Why pin Xcode in CI?
**Expected answer:** Xcode changes compilers/SDKs/signing/build behavior; explicit runner image/version makes builds reproducible and upgrades deliberate. **Reasoning:** native toolchain. **Common wrong answer:** Always latest silently. **Follow-up:** RN 0.86 minimum Xcode? **Related chapter:** version baseline/185.

## Q225 — Why pin JDK 17 for RN 0.86 baseline?
**Expected answer:** Current RN environment guidance recommends JDK17; higher JDKs may require build-tool changes, so a known supported baseline reduces drift. **Reasoning:** toolchain compatibility. **Common wrong answer:** Node version controls Java compiler. **Follow-up:** What pins Gradle? **Related chapter:** version baseline/006–012.

## Q226 — How would you cache Gradle safely in CI?
**Expected answer:** Cache dependency/build data with keys incorporating relevant Gradle wrapper/lock/config inputs, but periodically prove clean reproducibility and never treat cache as required source. **Reasoning:** CI reliability. **Common wrong answer:** Cache entire workspace forever. **Follow-up:** CocoaPods cache caveat? **Related chapter:** 185.

## Q227 — Why iOS CI needs Bundler?
**Expected answer:** Gemfile/Gemfile.lock pin CocoaPods/xcodeproj/Ruby tool versions so CI matches team rather than arbitrary global gems. **Reasoning:** reproducible native deps. **Common wrong answer:** npm lockfile pins CocoaPods. **Follow-up:** Command to install pods? **Related chapter:** 011/137/185.

## Q228 — What can make a monorepo duplicate React?
**Expected answer:** Shared package depending directly/bundling its own React/RN, workspace/resolver misconfiguration or package manager graph resolving multiple copies. **Reasoning:** runtime identity. **Common wrong answer:** TypeScript path alias alone duplicates it. **Follow-up:** Peer dependency strategy? **Related chapter:** 140/190.

## Q229 — Why `watchFolders` matters in Metro monorepo?
**Expected answer:** Metro may need visibility/watch access to source outside app project root; exact config depends on current workspace/resolver support. **Reasoning:** filesystem graph. **Common wrong answer:** It changes TypeScript type checking. **Follow-up:** What about symlinks? **Related chapter:** 140/190.

## Q230 — Brownfield lifecycle challenge?
**Expected answer:** Decide RN runtime/surface lifetime relative to native host activity/view-controller lifecycle, navigation, memory and repeated entry. **Reasoning:** host integration. **Common wrong answer:** RN always owns application root. **Follow-up:** Shared runtime trade-off? **Related chapter:** 193.

## Q231 — What data should cross brownfield boundary?
**Expected answer:** Stable typed serializable/domain contracts or service interfaces, not raw native controller objects or duplicated global state; define ownership. **Reasoning:** architecture. **Common wrong answer:** Expose whole native singleton to JS. **Follow-up:** Navigation handshake? **Related chapter:** 193.

## Q232 — What should a reusable RN library publish?
**Expected answer:** Narrow TS API/types, native setup docs, supported RN range, example app/tests; Codegen/native internals hidden behind public contract where possible. **Reasoning:** library design. **Common wrong answer:** Export generated internals directly. **Follow-up:** Semver implications? **Related chapter:** 194.

## Q233 — Why `create-react-native-library`-style tooling?
**Expected answer:** Provides current package scaffold/example/native module/component/Codegen/build setup for library authors, reducing obsolete manual boilerplate; verify current official recommendation. **Reasoning:** ecosystem tooling. **Common wrong answer:** It creates end-user RN apps. **Follow-up:** Why example app? **Related chapter:** 194.

## Q234 — How do you upgrade a 3-year-old RN app?
**Expected answer:** Inventory native dependencies/toolchains, read release notes/support policy, plan staged version jumps, apply native template diffs, migrate legacy architecture, test release builds critical flows/performance. **Reasoning:** upgrade systems. **Common wrong answer:** Change `react-native` version then reinstall node_modules. **Follow-up:** Upgrade Helper role? **Related chapter:** 195–196.

## Q235 — What is Upgrade Helper?
**Expected answer:** Community/officially referenced diff tool showing generated template changes between RN versions, used as guidance to apply native/config changes without replacing product customizations. **Reasoning:** migration tool. **Common wrong answer:** Automatically upgrades every dependency/app source. **Follow-up:** Why review release notes too? **Related chapter:** 195.

## Q236 — Why one RN minor at a time for very old apps?
**Expected answer:** Reduces compatibility/debugging search space and aligns migrations with documented changes, though a controlled jump can be chosen with strong test coverage. **Reasoning:** risk management. **Common wrong answer:** Never jump under any circumstances. **Follow-up:** When fresh-template comparison helps? **Related chapter:** 195.

## Q237 — What legacy knowledge remains useful?
**Expected answer:** Bridge, BatchedBridge, legacy NativeModules/UIManager/renderer patterns help understand old code/libraries and migration, but should be labeled historical for RN 0.86 new work. **Reasoning:** legacy context. **Common wrong answer:** Legacy Bridge is still recommended default. **Follow-up:** When did RN become New-Arch-only? **Related chapter:** 196.

## Q238 — How would you migrate a Bridge-only native library?
**Expected answer:** Find/define Codegen spec, implement TurboModule or Fabric component using current platform APIs, replace registration/events, add both-platform integration tests and preserve public JS contract where possible. **Reasoning:** migration path. **Common wrong answer:** Wrap old NativeModules call in TypeScript. **Follow-up:** What if upstream has maintained release? **Related chapter:** 152–159/196.

## Q239 — What is an architecture decision record (ADR)?
**Expected answer:** Concise record of context, decision, alternatives/trade-offs and consequences/revisit triggers for meaningful architecture choices. **Reasoning:** organizational memory. **Common wrong answer:** Code-comment replacement for every function. **Follow-up:** Example RN ADR? **Related chapter:** 192/199.

## Q240 — Advanced scenario: list jank after RN upgrade—first steps?
**Expected answer:** Compare exact before/after release builds and dependency/native changes, profile JS/Fabric/main-thread/images, verify behavior changed before assuming RN regression, produce minimal reproduction if engine/framework issue. **Reasoning:** controlled diagnosis. **Common wrong answer:** Downgrade immediately with no evidence. **Follow-up:** What metrics prove fix? **Related chapter:** 167/195.