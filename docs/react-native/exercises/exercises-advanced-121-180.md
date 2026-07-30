---
id: exercises-advanced-121-180
title: Exercises 121–180 — Advanced
---

# Advanced Exercises 121–180

## Exercise 121 — Diagnose Android Build vs JS Failure
**Problem:** `npm run android` fails before Metro bundle loads. **Expected:** classify native build failure. **Hint:** inspect Gradle output before JavaScript. **Solution:** run the failing Gradle task with stacktrace/info, identify plugin/dependency/source error, fix native build, then retry. **Explanation:** Gradle owns Android compilation; Metro cannot repair it. **Common mistake:** reset Metro cache. **Alternative:** reproduce in Android Studio.

## Exercise 122 — Inspect Gradle Dependency Conflict
**Problem:** installing a native SDK causes duplicate classes. **Expected:** find transitive conflict. **Hint:** dependency graph. **Solution:** use `./gradlew app:dependencies` and dependency insight for the duplicated artifact; align/exclude only with library guidance. **Explanation:** Maven graph resolution determines native classpath. **Common mistake:** random exclusions. **Alternative:** upgrade/downgrade package to compatible release.

## Exercise 123 — Release-Only R8 Crash
**Problem:** debug works, release crashes in SDK reflection. **Expected:** identify shrinker issue. **Hint:** reproduce minified build and inspect mapped stack. **Solution:** add documented keep rules or SDK update, verify optimized release. **Explanation:** R8 can remove/rename reflectively accessed code. **Common mistake:** disable minification permanently without diagnosis. **Alternative:** narrower consumer rules from library vendor.

## Exercise 124 — Android Flavor API URLs
**Problem:** dev/staging/prod need distinct API hosts. **Expected:** native build variant selects value. **Hint:** resources/BuildConfig + typed JS adapter. **Solution:** define per-flavor config and expose through one application config boundary. **Explanation:** environment is build identity. **Common mistake:** runtime string switch based on package name everywhere. **Alternative:** generated config module.

## Exercise 125 — Different Android Application IDs
**Problem:** install staging beside production. **Expected:** unique package IDs. **Hint:** `applicationIdSuffix`/flavor IDs. **Solution:** configure IDs such as `.staging`, matching OAuth/push/deep-link registrations. **Explanation:** OS identifies installed apps by application ID. **Common mistake:** change only display name. **Alternative:** full explicit applicationId per flavor.

## Exercise 126 — Android Manifest Merge Conflict
**Problem:** two native libraries declare conflicting manifest attributes. **Expected:** inspect merged manifest and resolve intentionally. **Hint:** Android Studio merged manifest/tools directives. **Solution:** locate source manifests, apply documented `tools:replace/remove` only when semantics are understood. **Explanation:** manifests are merged from dependencies. **Common mistake:** override blindly. **Alternative:** compatible library version.

## Exercise 127 — adb Deep-Link Isolation
**Problem:** deep link fails from UI test. **Expected:** determine OS routing vs JS routing. **Hint:** invoke intent directly. **Solution:** use adb VIEW intent with exact URL; if app not opened, fix manifest/verification first; if opened, inspect Linking/navigation parser. **Explanation:** isolates layers. **Common mistake:** edit React Navigation while App Link association is broken. **Alternative:** Android Studio link diagnostics.

## Exercise 128 — Diagnose Android ANR
**Problem:** production reports ANRs after SDK initialization. **Expected:** identify main-thread blocking. **Hint:** traces, startup timeline. **Solution:** inspect Play/trace/native stacks, reproduce release startup, move long native I/O/init off main path or lazily initialize. **Explanation:** ANR is OS responsiveness failure. **Common mistake:** profile only React renders. **Alternative:** vendor SDK deferred-init API.

## Exercise 129 — Android Memory OOM
**Problem:** photo feed crashes on low-memory devices. **Expected:** connect decoded image size to native memory. **Hint:** profiler + image dimensions. **Solution:** request/downsample appropriate image sizes, release unused media, inspect cache limits. **Explanation:** compressed network bytes differ from decoded bitmap memory. **Common mistake:** optimize JS object count only. **Alternative:** specialized image pipeline/library.

## Exercise 130 — Android Signing Separation
**Problem:** CI needs release signing without committing keystore. **Expected:** protected injection. **Hint:** secrets + temporary file/environment. **Solution:** decode/provision keystore in CI, pass aliases/passwords securely, clean workspace, restrict secret access. **Explanation:** signing keys are release authority. **Common mistake:** commit `.jks`. **Alternative:** managed signing service/CI credential store.

## Exercise 131 — Xcode Workspace vs Project
**Problem:** iOS native dependency symbols missing when building `.xcodeproj`. **Expected:** build workspace. **Hint:** CocoaPods integration. **Solution:** use `.xcworkspace` after `pod install`. **Explanation:** workspace includes app + Pods projects. **Common mistake:** repeatedly reinstall package. **Alternative:** Swift Package dependency only when supported by app/library design.

## Exercise 132 — CocoaPods Lockfile Discipline
**Problem:** teammate runs `pod update` and hundreds of native versions change. **Expected:** restore controlled resolution. **Hint:** Podfile.lock. **Solution:** revert unintended lockfile changes and use `pod install`; update specific pods deliberately. **Explanation:** install honors locked versions; update changes resolution. **Common mistake:** `pod update` as generic repair. **Alternative:** targeted `pod update SomePod` during planned upgrade.

## Exercise 133 — Pod Deployment Target Failure
**Problem:** pod requires newer iOS than project. **Expected:** choose compatible target/version. **Hint:** inspect podspec and RN 0.86 min target. **Solution:** evaluate raising deployment target or selecting compatible package release; align Podfile/project settings. **Explanation:** binary/source dependency has platform floor. **Common mistake:** force a lower target with patch without validation. **Alternative:** replace dependency.

## Exercise 134 — iOS Scheme for Staging
**Problem:** CI cannot find staging configuration. **Expected:** shared scheme checked into repo. **Hint:** scheme visibility. **Solution:** create shared scheme tied to Staging config and include generated scheme file. **Explanation:** local user schemes are not available to CI. **Common mistake:** rely on personal Xcode state. **Alternative:** script generation if team standardizes it.

## Exercise 135 — iOS Bundle ID Separation
**Problem:** staging push notifications overwrite production install. **Expected:** distinct bundle IDs and provider config. **Hint:** app identity. **Solution:** create staging bundle ID/profile/push config and matching scheme. **Explanation:** platform services bind to bundle identity. **Common mistake:** duplicate icon only. **Alternative:** separate target if product requires deeper binary divergence.

## Exercise 136 — iOS Provisioning Failure
**Problem:** archive says profile lacks capability. **Expected:** align entitlement/profile/App ID. **Hint:** compare entitlements and portal configuration. **Solution:** enable capability for App ID, regenerate/use matching profile, verify target entitlements. **Explanation:** signed entitlements must be authorized. **Common mistake:** delete DerivedData only. **Alternative:** automatic signing where policy permits.

## Exercise 137 — iOS Startup Crash
**Problem:** app crashes before React UI. **Expected:** inspect native stack. **Hint:** Xcode/Organizer crash report. **Solution:** identify failing native initializer/AppDelegate/runtime setup, symbolicate exact build, reproduce release-like. **Explanation:** React boundaries do not catch native process crashes. **Common mistake:** add JS try/catch. **Alternative:** binary-search native SDK initialization.

## Exercise 138 — CocoaPods Autolinking Check
**Problem:** native package JS imports but iOS symbol unavailable. **Expected:** verify package discovery and pods. **Hint:** CLI config + pod install output. **Solution:** inspect `npx react-native config`, package podspec, run bundled pod install, then workspace build. **Explanation:** npm install and Xcode linking are distinct stages. **Common mistake:** legacy manual linking immediately. **Alternative:** package-specific custom config only if documented.

## Exercise 139 — Pod Cache Misdiagnosis
**Problem:** compile error references API removed by SDK version. **Expected:** resolve version mismatch, not merely clean cache. **Hint:** inspect Podfile.lock/source compatibility. **Solution:** align package/pod versions, then clean/reinstall only after dependency fix. **Explanation:** caches reproduce resolved content; they do not create incompatible APIs. **Common mistake:** delete Pods repeatedly. **Alternative:** targeted pod version pin.

## Exercise 140 — iOS dSYM Verification
**Problem:** production crashes are unsymbolicated. **Expected:** associate dSYM with shipped archive. **Hint:** UUID/build matching. **Solution:** retain/upload dSYMs from exact release archive to crash service. **Explanation:** symbols map machine addresses to code. **Common mistake:** upload dSYM from a rebuilt binary. **Alternative:** automate symbol upload in archive pipeline.

## Exercise 141 — Metro Resolver Failure
**Problem:** TS editor resolves alias but Metro says module missing. **Expected:** align runtime resolver. **Hint:** tsconfig does not configure Metro. **Solution:** configure supported Metro/Babel/package mapping or remove alias; ensure all tools agree. **Explanation:** type resolution and bundle resolution are separate. **Common mistake:** trust IDE green import. **Alternative:** relative/package imports.

## Exercise 142 — Platform Resolution
**Problem:** Android should load `Scanner.android.tsx`. **Expected:** Metro resolves platform file automatically. **Hint:** import suffixless path. **Solution:** `import Scanner from './Scanner'`; provide `.android.tsx` and `.ios.tsx`. **Explanation:** Metro platform resolution chooses variant. **Common mistake:** runtime `require` with platform strings. **Alternative:** inline Platform branch for tiny difference.

## Exercise 143 — Metro Monorepo Watch Folder
**Problem:** shared workspace package changes are not seen. **Expected:** configure workspace visibility correctly. **Hint:** current Metro monorepo docs. **Solution:** set project/watch/resolver configuration according to current Metro workspace behavior and ensure package dependency declared. **Explanation:** Metro must observe and resolve outside app root when needed. **Common mistake:** symlink hacks copied from old versions. **Alternative:** build shared package to consumable output.

## Exercise 144 — Duplicate React in Monorepo
**Problem:** hooks fail with invalid hook call. **Expected:** detect duplicate React copies. **Hint:** dependency graph/resolver. **Solution:** ensure workspace package uses peerDependency for React/RN where appropriate and Metro resolves one app copy. **Explanation:** React identity must be shared. **Common mistake:** bundle React inside shared library. **Alternative:** package manager overrides/resolution with proper package contracts.

## Exercise 145 — Hermes Production Source Map
**Problem:** stack says `index.android.bundle:1:12345`. **Expected:** map to source. **Hint:** exact source map. **Solution:** upload/use source map generated by release bundle and matching build/version. **Explanation:** minified/bundled locations need mapping. **Common mistake:** use debug map. **Alternative:** automated crash-tool upload.

## Exercise 146 — Hermes vs Native Crash
**Problem:** crash log contains native signal and Hermes frames. **Expected:** determine ownership from full stack/context. **Hint:** JS runtime can appear in native crash. **Solution:** symbolicate, inspect fatal signal/exception, reproduce input; separate JS exception from engine/native memory failure. **Explanation:** Hermes executes inside native process. **Common mistake:** label every Hermes frame “JS bug.” **Alternative:** minimal reproduction against RN patch release.

## Exercise 147 — Startup Bundle Cost
**Problem:** cold start slowed after adding analytics SDK and huge locale data. **Expected:** measure native init and JS eval separately. **Hint:** startup trace/bundle analysis. **Solution:** defer SDK, lazy-load locale/features, compare before/after release builds. **Explanation:** startup spans native + runtime + bundle + render. **Common mistake:** optimize first screen JSX only. **Alternative:** server/config bootstrap deferment.

## Exercise 148 — Synchronous Native Call Review
**Problem:** teammate exposes `scanEntireDisk(): string[]` synchronously through TurboModule. **Expected:** reject design. **Hint:** sync blocks caller/runtime. **Solution:** make long work async/background and return promise/event/progress. **Explanation:** JSI capability does not make expensive sync work safe. **Common mistake:** “no bridge means sync is free.” **Alternative:** cached tiny sync summary plus async refresh.

## Exercise 149 — TurboModule Spec Design
**Problem:** design typed battery module. **Expected:** small stable spec with sync current level and event changes if supported. **Hint:** Codegen-supported types. **Solution:** define `Spec extends TurboModule`, exported registry, supported scalar/event types. **Explanation:** spec is cross-language contract. **Common mistake:** arbitrary nested TS classes/unions unsupported by Codegen. **Alternative:** normalized primitives/object structs documented by current Codegen.

## Exercise 150 — TurboModule Error Contract
**Problem:** Android throws `IllegalStateException`, iOS throws NSError text. **Expected:** same JS-facing failure model. **Hint:** normalize. **Solution:** wrapper/native layer maps to stable code such as `E_UNAVAILABLE`, details optional. **Explanation:** consumers need platform-independent semantics. **Common mistake:** branch on exception message strings. **Alternative:** result union for expected domain failure.

## Exercise 151 — Native Event Cleanup
**Problem:** native orientation events duplicate after repeated navigation. **Expected:** one subscription per mounted consumer. **Hint:** remove listener. **Solution:** subscribe in effect, retain subscription, remove cleanup; native module should start/stop observation appropriately. **Explanation:** event emitter lifetime crosses React screen lifetime. **Common mistake:** subscription in render. **Alternative:** app-level singleton subscription with external store.

## Exercise 152 — Codegen Build Failure
**Problem:** unsupported spec type breaks generated build. **Expected:** simplify contract. **Hint:** Codegen supported type set. **Solution:** replace unsupported generic/complex union with supported primitive/object/enum-like representation per current docs. **Explanation:** native languages need deterministic generated mapping. **Common mistake:** cast around generation. **Alternative:** serialize opaque payload only if type safety trade-off is acceptable.

## Exercise 153 — Fabric Controlled Native Component
**Problem:** rating native view changes internally but React prop remains old. **Expected:** event drives parent update and prop re-applies source of truth. **Hint:** controlled component loop. **Solution:** emit `onChange`, parent `setRating`, render `value={rating}`. **Explanation:** declarative state owns value. **Common mistake:** mutate native view forever without prop synchronization. **Alternative:** explicitly uncontrolled API with initial value if justified.

## Exercise 154 — Fabric Command Decision
**Problem:** want command `setRating`. **Expected:** prefer prop. **Hint:** declarative vs imperative. **Solution:** expose rating as prop; reserve command for focus/scroll-like imperative operation. **Explanation:** props participate in renderer consistency. **Common mistake:** mirror every setter as command. **Alternative:** native event + controlled prop.

## Exercise 155 — Fabric Measurement
**Problem:** custom native view reports arbitrary width after mount. **Expected:** integrate with Yoga measurement contract. **Hint:** renderer owns layout. **Solution:** implement supported measurement/intrinsic sizing path and keep updates visible to Fabric. **Explanation:** hidden native layout mutations desynchronize trees. **Common mistake:** manually change frame behind RN. **Alternative:** require explicit width/height props.

## Exercise 156 — JSI Thread Safety
**Problem:** background native callback captures `jsi::Runtime&` and calls it later. **Expected:** identify unsafe lifetime/thread assumption. **Hint:** runtime affinity. **Solution:** schedule work through React Native-supported runtime scheduler/call invoker mechanism and avoid raw runtime use off contract. **Explanation:** JSI runtime is not arbitrary-thread safe. **Common mistake:** mutex around runtime call as universal fix. **Alternative:** emit through supported TurboModule event infrastructure.

## Exercise 157 — Host Object Ownership
**Problem:** JSI host object holds native resource after app reload. **Expected:** define lifecycle/destruction. **Hint:** JS reachability + native ownership. **Solution:** use RAII/shared ownership carefully, release when host object/runtime dies, guard stale callbacks. **Explanation:** C++/JS lifetimes interact. **Common mistake:** global raw pointer. **Alternative:** TurboModule-managed resource handle.

## Exercise 158 — New Architecture Migration Audit
**Problem:** library README shows `RCTBridgeModule`. **Expected:** determine current support before adoption. **Hint:** check latest package/RN 0.86 docs/source. **Solution:** verify TurboModule/Fabric/New Architecture compatibility, migration path and maintained release. **Explanation:** old tutorial can compile only via compatibility layers or not at all. **Common mistake:** assume bridge tutorial is recommended. **Alternative:** current compatible library or own modern module.

## Exercise 159 — Legacy Module Identification
**Problem:** old app manually registers NativeModules package. **Expected:** classify as migration knowledge. **Hint:** Bridge/Package/NativeModules patterns. **Solution:** document current behavior, find library upgrade/new spec path, migrate incrementally and test. **Explanation:** RN 0.86 is New-Architecture-only baseline. **Common mistake:** teach old pattern to new project. **Alternative:** TurboModule.

## Exercise 160 — React Render vs Fabric Mount
**Problem:** profiler shows React render cheap but UI stutters when opening grid. **Expected:** investigate native mount/layout/images. **Hint:** render != mount. **Solution:** profile main/UI thread, Fabric mount count, Yoga/layout, image decoding; reduce native hierarchy/work. **Explanation:** React timing covers only part of pipeline. **Common mistake:** add `memo` blindly. **Alternative:** incremental virtualization.

## Exercise 161 — View Flattening Reasoning
**Problem:** count of native views is lower than JSX Views. **Expected:** explain flattening. **Hint:** layout-only abstractions may not require platform view. **Solution:** recognize Fabric/view flattening can omit unnecessary native nodes when semantics allow. **Explanation:** shadow tree and native hierarchy differ. **Common mistake:** assume 1 JSX View = 1 UIView/View forever. **Alternative:** inspect native hierarchy tooling.

## Exercise 162 — Yoga Axis Debug
**Problem:** button unexpectedly stretches cross-axis. **Expected:** inspect `alignItems`, child `alignSelf`, stretch default. **Hint:** main/cross axes. **Solution:** adjust parent/child alignment deliberately. **Explanation:** Yoga computes constraints; width absence plus stretch can expand. **Common mistake:** hard-code width. **Alternative:** wrapper with desired alignment.

## Exercise 163 — Layout Effect Measurement
**Problem:** tooltip needs geometry before visible positioning. **Expected:** use supported measurement/layout effect carefully. **Hint:** modern Fabric synchronous layout capabilities. **Solution:** measure ref in `useLayoutEffect`, set minimal positioning state before user-visible frame where supported. **Explanation:** layout effect runs in commit-related timing. **Common mistake:** measure every render/scroll frame. **Alternative:** declarative anchor/layout library.

## Exercise 164 — Reanimated Shared Value
**Problem:** drag animation rerenders React every pixel. **Expected:** move visual progress to shared value. **Hint:** UI-runtime animation state. **Solution:** gesture updates shared value; animated style reads it; React state updates only on semantic completion. **Explanation:** per-frame visual state need not be React state. **Common mistake:** setState in gesture update. **Alternative:** core Animated for simpler transition.

## Exercise 165 — Gesture Conflict with Back Swipe
**Problem:** custom horizontal pan blocks iOS navigation back gesture. **Expected:** redesign recognizer region/composition. **Hint:** edge gesture ownership. **Solution:** avoid consuming edge region or configure gesture relationship/current navigation integration. **Explanation:** product gestures compete with system/navigation gestures. **Common mistake:** disable back gesture globally. **Alternative:** vertical/custom interaction.

## Exercise 166 — 120 Hz Animation Budget
**Problem:** animation passes 60 Hz but stutters on 120 Hz. **Expected:** recognize ~8.33 ms frame budget. **Hint:** refresh rate. **Solution:** profile on high-refresh device, reduce frame work/mount/image operations, keep animation UI-thread friendly. **Explanation:** higher refresh halves time per frame. **Common mistake:** hard-code 16.67 ms target universally. **Alternative:** adaptive performance budgets.

## Exercise 167 — Memory Leak Navigation
**Problem:** memory grows each time camera screen opens/closes. **Expected:** inspect JS subscription + native camera session. **Hint:** repeated cycle profiler. **Solution:** stop camera session/release resource on blur/unmount as library requires, remove listeners, compare heap/native allocations after cycles. **Explanation:** native resources can outlive React. **Common mistake:** force GC and declare fixed. **Alternative:** keep one intentional reusable session if library supports lifecycle safely.

## Exercise 168 — Timer in Background
**Problem:** countdown assumes JS timer runs every second in background. **Expected:** fix model. **Hint:** OS suspension. **Solution:** store target timestamp, derive remaining time on foreground; schedule native notification if needed. **Explanation:** background JavaScript is not guaranteed. **Common mistake:** long `setInterval`. **Alternative:** backend authoritative deadline.

## Exercise 169 — WebSocket Reconnect
**Problem:** reconnect floods server after network loss. **Expected:** exponential backoff + jitter + lifecycle awareness. **Hint:** bounded state machine. **Solution:** retry with capped delay/jitter, pause background, reset after stable connection, resync state. **Explanation:** reconnect is expected mobile behavior. **Common mistake:** immediate infinite loop. **Alternative:** push + polling for low-frequency use case.

## Exercise 170 — Message Ordering
**Problem:** chat receives events out of order. **Expected:** server sequence/version reconciliation. **Hint:** transport arrival order not domain truth after reconnect. **Solution:** order by server-assigned sequence, detect gaps, fetch missing range, dedupe IDs. **Explanation:** real-time streams need consistency model. **Common mistake:** append every arrival. **Alternative:** server timestamp only if uniqueness/order contract is sufficient.

## Exercise 171 — Push Killed-State Routing
**Problem:** notification tap opens wrong initial screen. **Expected:** bootstrap then route intent. **Hint:** auth/navigation readiness. **Solution:** persist/hold notification intent, finish app/auth setup, validate entity/role, navigate once. **Explanation:** tap can launch cold process. **Common mistake:** navigate in native callback before NavigationContainer ready. **Alternative:** root linking integration that queues initial URL/notification intent.

## Exercise 172 — Token Refresh for Push
**Problem:** backend keeps stale notification token. **Expected:** update installation record when token rotates. **Hint:** token lifecycle. **Solution:** listen/register current token, upsert installation securely, delete invalid tokens on provider errors/logout policy. **Explanation:** push token is mutable routing credential. **Common mistake:** save once at signup. **Alternative:** anonymous installation record later associated with user.

## Exercise 173 — Background Job Design
**Problem:** sync 50 MB data “every 5 minutes forever.” **Expected:** reject unrestricted JS schedule. **Hint:** OS restrictions/battery. **Solution:** redesign with server push/delta sync/WorkManager or iOS background APIs for eligible bounded work; run opportunistically on foreground. **Explanation:** OS owns background execution budget. **Common mistake:** timer library promising desktop-like daemon. **Alternative:** server processing.

## Exercise 174 — Offline Mutation Queue
**Problem:** create task offline, kill app, reconnect. **Expected:** durable idempotent replay. **Hint:** outbox. **Solution:** persist operation `{clientId,type,payload,idempotencyKey,baseVersion}`, replay sequentially/policy-based, mark ack transactionally. **Explanation:** in-memory optimistic state is insufficient. **Common mistake:** retry from component state only. **Alternative:** local-first database sync engine.

## Exercise 175 — Conflict Resolution
**Problem:** same note edited on two devices. **Expected:** explicit conflict policy. **Hint:** server version. **Solution:** send base version, server returns conflict/current; merge safe fields or present conflict copy. **Explanation:** offline synchronization needs semantics. **Common mistake:** silent last-write-wins without product decision. **Alternative:** CRDT for domains requiring collaborative merge.

## Exercise 176 — Idempotent Retry
**Problem:** create transaction request times out after server committed. **Expected:** retry without duplicate. **Hint:** idempotency key. **Solution:** client generates stable operation ID; server stores/result-replays key. **Explanation:** timeout does not prove failure. **Common mistake:** generate new key on each retry. **Alternative:** client-generated resource ID with PUT semantics.

## Exercise 177 — Jest Native Module Mock
**Problem:** component calls secure credential adapter. **Expected:** test behavior without real Keychain. **Hint:** mock your adapter, not vendor internals. **Solution:** inject/mock `CredentialStore` methods returning success/failure. **Explanation:** boundary tests remain stable across native library upgrades. **Common mistake:** mock internal package implementation deeply. **Alternative:** dependency-injected fake.

## Exercise 178 — React Native Testing Library Query
**Problem:** test submit button. **Expected:** locate by accessible role/name. **Hint:** semantic query. **Solution:** `getByRole('button',{name:/save/i})`, trigger user event, assert UI outcome. **Explanation:** mirrors user-accessible contract. **Common mistake:** query implementation testID everywhere. **Alternative:** testID only for non-semantic E2E/native edge cases.

## Exercise 179 — Fake Timer Scope
**Problem:** debounce test hangs. **Expected:** control timers and restore them. **Hint:** `useFakeTimers`/advance. **Solution:** enable fake timers for test suite/case, trigger input, advance debounce duration, await result, restore real timers. **Explanation:** deterministic clock. **Common mistake:** fake timers globally without cleanup. **Alternative:** inject debounce scheduler.

## Exercise 180 — Advanced Integration
**Problem:** Build release-ready feed with native dependency, deep links, push intent, offline mutation, animation and profiler evidence. **Expected:** both platforms and documented failure boundaries. **Hint:** combine 123, 138, 145, 164, 171, 174. **Solution:** architecture isolates native/build/runtime/data concerns, CI builds release variants, tests route/offline logic, profiling captures baseline. **Explanation:** advanced RN is systems integration. **Common mistake:** optimize only JSX. **Alternative:** smaller feature slice with same engineering gates.