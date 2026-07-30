---
id: exercises-production-241-300
title: Exercises 241–300 — Production
---

# Production Exercises 241–300

## Exercise 241 — Release Crash Triage
**Problem:** Android release crashes immediately while debug works. **Expected:** isolate release-only variables. **Hint:** R8, Hermes bundle, config, signing, native initialization. **Solution:** reproduce signed release locally/CI, capture Logcat, symbolicate/deobfuscate, compare build config and minification, then test one hypothesis at a time. **Explanation:** release is a different build/runtime environment. **Common mistake:** disable every optimization. **Alternative:** create minified debug-like diagnostic variant.

## Exercise 242 — iOS CI-Only Failure
**Problem:** iOS builds locally but not CI. **Expected:** find undeclared machine dependency. **Hint:** Xcode/Ruby/pods/scheme/signing. **Solution:** compare toolchain versions, shared schemes, Bundler lock, pods, environment and signing artifacts; reproduce on clean runner. **Explanation:** local state can hide missing configuration. **Common mistake:** rerun CI until green. **Alternative:** disposable local/hosted clean machine.

## Exercise 243 — Metro Mismatch After Upgrade
**Problem:** RN upgraded, Metro package manually stayed old. **Expected:** restore RN-coupled toolchain. **Hint:** template versions. **Solution:** compare official target template/package lock and remove unsupported direct pins/overrides. **Explanation:** Metro evolves with RN runtime/build expectations. **Common mistake:** independently upgrade/downgrade Metro until bundling starts. **Alternative:** documented custom Metro only where necessary.

## Exercise 244 — CLI Version Drift
**Problem:** existing RN 0.86 app updates all CLI packages to latest without checking. **Expected:** revert to compatible template baseline or verified matrix. **Hint:** independent CLI semver. **Solution:** compare RN 0.86 template pins and CLI compatibility docs, restore lockfile-compatible versions, test commands. **Explanation:** CLI latest is not universally compatible with old RN. **Common mistake:** global `react-native-cli`. **Alternative:** project-local generated CLI versions.

## Exercise 245 — Pod Duplicate Symbols
**Problem:** iOS linker reports duplicate symbols after native SDK addition. **Expected:** identify duplicate binary/library inclusion. **Hint:** pods/link phases/dependency graph. **Solution:** inspect Podfile.lock, podspecs and linked frameworks; remove duplicate direct+transitive integration or choose compatible SDK configuration. **Explanation:** linker sees same symbols from multiple objects. **Common mistake:** add linker flags blindly. **Alternative:** vendor-supported subspec selection.

## Exercise 246 — Gradle Duplicate Classes
**Problem:** Android compile fails with duplicate classes after package install. **Expected:** trace artifact versions. **Hint:** dependency insight. **Solution:** identify both sources, align supported versions or exclude documented redundant dependency. **Explanation:** classpath contains two implementations. **Common mistake:** exclude foundational library without testing. **Alternative:** upgrade offending RN package.

## Exercise 247 — Native Module Not Found
**Problem:** `TurboModuleRegistry.getEnforcing` throws in release. **Expected:** inspect spec/name/build registration/autolinking. **Hint:** JS name must match native generated registration. **Solution:** verify Codegen config, module name, generated files, Android/iOS build integration and release target membership. **Explanation:** JS contract exists even when native binary lacks module. **Common mistake:** add optional chaining around missing native capability. **Alternative:** `get` only when module intentionally optional.

## Exercise 248 — Fabric Component Missing
**Problem:** custom native component works Android, unknown on iOS. **Expected:** inspect iOS Codegen/component registration/build sources. **Hint:** platform implementation. **Solution:** confirm spec generated for iOS, native component class/descriptor configured as current docs require, pod target includes sources. **Explanation:** component contract is cross-platform but implementation is platform-specific. **Common mistake:** assume Android registration creates iOS component. **Alternative:** JS fallback only if product supports it.

## Exercise 249 — Hermes Crash Reproduction
**Problem:** Hermes crash occurs only in production cohort. **Expected:** preserve exact artifacts/data path. **Hint:** source map + native symbols + release flags. **Solution:** collect build/version/device/OS/breadcrumbs, symbolicate, reproduce release binary with representative data, reduce case and check RN patch issues. **Explanation:** engine/runtime crashes need exact binary context. **Common mistake:** infer from one minified frame. **Alternative:** controlled Hermes/RN patch upgrade experiment.

## Exercise 250 — Source Map Integrity
**Problem:** mapped stack points to impossible source. **Expected:** detect mismatched source map. **Hint:** build hash/version. **Solution:** verify bundle and map generated in same build, release identifier, minifier/config inputs; automate immutable artifact pairing. **Explanation:** maps are content-specific. **Common mistake:** regenerate from current main. **Alternative:** retain release bundle + map together.

## Exercise 251 — ANR After Database Migration
**Problem:** Android freezes on first launch after update. **Expected:** find main-thread migration cost. **Hint:** migration timing. **Solution:** profile migration, make schema changes efficient, batch/index carefully, show bounded startup/migration UX or move safe work off critical path. **Explanation:** local DB work can block UI. **Common mistake:** blame React Native startup. **Alternative:** phased/background data backfill after minimal schema migration.

## Exercise 252 — iOS Watchdog on Migration
**Problem:** iOS terminates during launch migration. **Expected:** reduce launch blocking. **Hint:** watchdog budget. **Solution:** make migration transactional/efficient, defer nonessential backfill and render progress-safe shell where architecture allows. **Explanation:** OS enforces responsiveness. **Common mistake:** synchronous full-data rewrite before root view. **Alternative:** lazy migration per record/access.

## Exercise 253 — OOM from Image Carousel
**Problem:** memory spikes as user swipes HD images. **Expected:** bound decoded images and cache. **Hint:** prefetch window. **Solution:** request display-sized variants, reduce preload window, release old images, inspect library memory cache. **Explanation:** decoded pixel buffers dominate. **Common mistake:** only compress JPEG more. **Alternative:** tiled/zoom image component for very large assets.

## Exercise 254 — FlatList Blank Cells
**Problem:** aggressive tuning creates blanks during fast scroll. **Expected:** rebalance window/batching. **Hint:** virtualization trade-off. **Solution:** increase appropriate window/batch or reduce row cost; profile low-end device. **Explanation:** renderer cannot populate viewport in time. **Common mistake:** minimize `windowSize` for memory without testing. **Alternative:** simplify row/native image work.

## Exercise 255 — Navigation Memory Growth
**Problem:** app accumulates large screens in stack. **Expected:** inspect navigation product semantics and retained resources. **Hint:** mounted screens/caches. **Solution:** reset/replace flows that should not remain, release screen resources on blur/unmount, avoid giant params, profile stack. **Explanation:** navigation history intentionally retains state. **Common mistake:** force-unmount every screen and break UX. **Alternative:** lazy resource lifecycle while preserving screen state.

## Exercise 256 — Infinite Query Memory
**Problem:** endless feed holds hundreds of pages. **Expected:** bound page/cache retention according to library capabilities/product needs. **Hint:** page trimming. **Solution:** retain reasonable windows, persist summaries if needed, restore position with server cursor strategy. **Explanation:** virtualization limits mounted views, not necessarily JS cached data. **Common mistake:** assume FlatList virtualizes query cache. **Alternative:** local database-backed feed.

## Exercise 257 — Duplicate Optimistic Mutations
**Problem:** rapid like/unlike responses arrive reversed. **Expected:** mutation concurrency policy. **Hint:** sequence/latest intent. **Solution:** serialize per entity, use mutation IDs/versioning, or reconcile from server truth after settle. **Explanation:** optimistic operations can race. **Common mistake:** each rollback restores stale snapshot. **Alternative:** disable toggle during mutation where UX acceptable.

## Exercise 258 — Refresh Token Reuse Detection
**Problem:** server reports refresh-token reuse. **Expected:** treat session as potentially compromised. **Hint:** rotation policy. **Solution:** invalidate local session, revoke server token family as backend policy dictates, require reauth and log security event. **Explanation:** rotated token reuse can indicate theft/race. **Common mistake:** keep retrying same refresh token. **Alternative:** server session cookie/token architecture with comparable rotation semantics.

## Exercise 259 — Offline Logout
**Problem:** user logs out while offline. **Expected:** local sensitive access ends immediately. **Hint:** server revoke can be deferred/best-effort. **Solution:** clear local credentials/cache/state immediately; queue/reconcile server revocation when appropriate without restoring old session. **Explanation:** local logout cannot depend on network. **Common mistake:** block logout until API responds. **Alternative:** mark refresh credential revoked locally and never reuse.

## Exercise 260 — Account Switch Cache Leak
**Problem:** second user sees first user's cached data. **Expected:** scope/clear server cache by identity. **Hint:** auth boundary. **Solution:** include tenant/user scoping where required and clear sensitive cache on session transition. **Explanation:** caches survive component navigation. **Common mistake:** only reset navigation. **Alternative:** separate QueryClient per authenticated session.

## Exercise 261 — Push Opens Unauthorized Workspace
**Problem:** stale notification points to workspace user lost access to. **Expected:** reauthorize before navigation. **Hint:** intent is not authorization. **Solution:** bootstrap current session, fetch/validate entity membership, route to safe fallback if forbidden. **Explanation:** notification payload is stale external data. **Common mistake:** navigate directly from IDs. **Alternative:** backend short-lived route endpoint resolving current destination.

## Exercise 262 — Deep Link to Deleted Entity
**Problem:** link target no longer exists. **Expected:** graceful not-found state. **Hint:** route intent then server fetch. **Solution:** navigate to detail shell or resolver, handle 404 with context/back/home. **Explanation:** links outlive data. **Common mistake:** crash on non-null entity. **Alternative:** server redirect/archived entity view.

## Exercise 263 — Universal Link Association Failure
**Problem:** production iOS URL opens Safari, staging works. **Expected:** inspect production AASA/entitlement/bundle/team. **Hint:** environment-specific association. **Solution:** verify live AASA served correctly, production associated domain entitlement and app identifier; inspect device logs/cache. **Explanation:** OS routing precedes JS. **Common mistake:** change React Navigation config. **Alternative:** temporary diagnostic custom scheme.

## Exercise 264 — App Link Verification Failure
**Problem:** Android link chooser appears. **Expected:** inspect assetlinks/package/signing fingerprints. **Hint:** production signing identity. **Solution:** publish correct package + signing certificate fingerprints and manifest autoVerify host; reinstall/reverify. **Explanation:** verified links bind domain to signed app. **Common mistake:** use debug SHA for production. **Alternative:** adb verification diagnostics.

## Exercise 265 — Permission Prompt Regression
**Problem:** new release prompts location on launch unexpectedly. **Expected:** find eager SDK/feature request. **Hint:** permission UX is behavior change. **Solution:** trace native/JS initialization, remove automatic prompt, request after user intent, audit manifest/plist dependencies. **Explanation:** third-party SDK can change permission surface. **Common mistake:** accept because manifest contains permission. **Alternative:** configure SDK without location capability.

## Exercise 266 — Limited Photo Access
**Problem:** iOS user grants selected photos only. **Expected:** support limited library semantics. **Hint:** permission is not simply granted/denied. **Solution:** use current media library APIs/library states, display accessible selected assets and option to adjust selection. **Explanation:** modern permissions can be scoped. **Common mistake:** treat limited as blocked. **Alternative:** system picker requiring less broad access.

## Exercise 267 — Bluetooth Permission Versioning
**Problem:** Android behavior differs across OS levels. **Expected:** branch by platform/API capability using current docs/library. **Hint:** permissions evolved. **Solution:** declare/request only required permissions for target versions and handle legacy behavior separately. **Explanation:** native permission model changes over Android releases. **Common mistake:** copy old manifest list. **Alternative:** library abstraction with audited manifest.

## Exercise 268 — Notification Permission Timing
**Problem:** opt-in rate is poor after launch prompt. **Expected:** request in context. **Hint:** pre-permission education. **Solution:** explain value at feature moment, request native permission only when meaningful, respect denial. **Explanation:** permission UX affects trust and conversion. **Common mistake:** prompt first launch before value. **Alternative:** in-app inbox without push.

## Exercise 269 — Background Upload Interruption
**Problem:** large upload dies when app backgrounds. **Expected:** use platform-appropriate background transfer or resumable server protocol. **Hint:** ordinary JS request may suspend. **Solution:** choose native background transfer library/API compatible with RN 0.86, resumable chunks/idempotency, reconcile on resume. **Explanation:** OS controls background execution. **Common mistake:** keep JS fetch loop alive. **Alternative:** upload only foreground with user warning.

## Exercise 270 — Download Storage Exhaustion
**Problem:** offline media fills device. **Expected:** quota/lifecycle. **Hint:** cache vs user data. **Solution:** track size, LRU/expiry, user controls, low-storage failure handling and cleanup. **Explanation:** filesystem is finite shared resource. **Common mistake:** unlimited cache. **Alternative:** streaming with no offline retention.

## Exercise 271 — WebSocket Auth Expiry
**Problem:** socket remains connected after access token expires. **Expected:** refresh/reconnect protocol. **Hint:** server authentication lifecycle. **Solution:** handle auth-expiry signal, refresh via auth service, reconnect/re-authenticate, resync missed sequence. **Explanation:** long-lived connections outlast token lifetimes. **Common mistake:** put refresh token in WebSocket query URL. **Alternative:** short-lived socket credential minted by backend.

## Exercise 272 — Real-Time Duplicate Events
**Problem:** reconnect replays events. **Expected:** dedupe by stable event/message ID. **Hint:** at-least-once delivery. **Solution:** persist/track last sequence and idempotently apply events. **Explanation:** reliable systems often replay. **Common mistake:** assume exactly-once transport. **Alternative:** server snapshot + delta.

## Exercise 273 — Offline Clock Skew
**Problem:** conflict logic uses device timestamp and fails. **Expected:** avoid trusting client wall clock for ordering. **Hint:** server versions/logical sequence. **Solution:** use server version/ETag/sequence for concurrency; timestamps are metadata. **Explanation:** device clocks drift/change. **Common mistake:** “latest updatedAt wins” from clients. **Alternative:** hybrid logical clocks/CRDT where domain requires.

## Exercise 274 — Schema Migration Failure Recovery
**Problem:** local DB migration crashes halfway. **Expected:** transactional/recoverable migration. **Hint:** version and rollback. **Solution:** perform supported transactional migration, backup or rebuild disposable cache when safe, record schema version only after success. **Explanation:** partial schema state can brick app. **Common mistake:** increment version first. **Alternative:** staged migrations per app release.

## Exercise 275 — Corrupted Persisted Cache
**Problem:** AsyncStorage JSON is malformed after old bug. **Expected:** safe fallback. **Hint:** parse/validate boundary. **Solution:** catch parse, validate schema/version, discard only corrupted key and report diagnostics. **Explanation:** persisted state is untrusted across versions. **Common mistake:** startup crash. **Alternative:** migrate to structured DB.

## Exercise 276 — Query Cache Migration
**Problem:** persisted query shape changes between releases. **Expected:** bust/version persisted cache. **Hint:** cache compatibility. **Solution:** set persistence version/buster tied to incompatible data schema; discard/repopulate when mismatch. **Explanation:** old serialized cache may violate new assumptions. **Common mistake:** cast it. **Alternative:** domain migration for intentionally durable offline data.

## Exercise 277 — Feature Flag Offline State
**Problem:** user offline has flag-on UI from previous session after feature disabled. **Expected:** define cached flag safety. **Hint:** defaults and server enforcement. **Solution:** classify flags: safe presentation flags may cache; risky capabilities require server authorization and conservative defaults. **Explanation:** offline clients cannot receive immediate flag updates. **Common mistake:** flag is security revocation. **Alternative:** backend rejects operation.

## Exercise 278 — Analytics Queue Offline
**Problem:** analytics retries consume battery/network. **Expected:** bounded batching/backoff. **Hint:** telemetry is lower priority than product work. **Solution:** batch, cap disk queue, drop low-value events, flush opportunistically, respect privacy/network lifecycle. **Explanation:** observability must not harm app. **Common mistake:** immediate retry loop. **Alternative:** native SDK with audited batching policy.

## Exercise 279 — Crash Loop Protection
**Problem:** startup SDK crashes every launch. **Expected:** recovery path/remote kill where possible. **Hint:** initialize noncritical systems defensively. **Solution:** defer SDK, persist guarded startup attempt/flag policy, remotely disable before initialization if config is safely available; ship binary fix. **Explanation:** startup failure can prevent users reaching recovery UI. **Common mistake:** initialize everything before root render. **Alternative:** staged SDK rollout.

## Exercise 280 — Bad OTA Rollout
**Problem:** new JS bundle crashes on one native runtime. **Expected:** stop/rollback and fix runtime targeting. **Hint:** compatibility + staged deployment. **Solution:** rollback OTA for affected runtime, verify native capability manifest, add pre-release smoke matrix. **Explanation:** OTA must match binary contract. **Common mistake:** one bundle channel for all native versions. **Alternative:** runtime-version-specific channels.

## Exercise 281 — Store Rejection
**Problem:** store rejects app for permission explanation/behavior. **Expected:** map rejection to platform guideline and binary/config fix. **Hint:** store review is release dependency. **Solution:** review exact message, remove unnecessary permission or improve purpose string/flow and resubmit with notes. **Explanation:** technical permission config and policy both matter. **Common mistake:** appeal without changing violating behavior. **Alternative:** redesign feature to use system picker/no broad permission.

## Exercise 282 — AAB Version Conflict
**Problem:** Play Console rejects duplicate versionCode. **Expected:** monotonic build identity. **Hint:** versionCode. **Solution:** CI generates/sets unique increasing versionCode according to release policy; versionName remains user-facing version. **Explanation:** Play uses versionCode ordering. **Common mistake:** change versionName only. **Alternative:** CI run number mapped within safe range.

## Exercise 283 — TestFlight Build Number
**Problem:** upload rejected because build number reused. **Expected:** increment `CFBundleVersion` per upload. **Hint:** build vs marketing version. **Solution:** CI assigns unique build number while marketing version can remain same across candidates. **Explanation:** App Store Connect identifies builds separately. **Common mistake:** only increment short version. **Alternative:** Git/CI-derived build number.

## Exercise 284 — Signing Certificate Expiry
**Problem:** release pipeline breaks unexpectedly. **Expected:** monitor credential lifecycle. **Hint:** certificates/profiles have expiry. **Solution:** inventory owners/expiry, rotate before deadline, test archive/upload, keep emergency process documented. **Explanation:** release credentials are operational dependencies. **Common mistake:** discover on release day. **Alternative:** managed automatic signing with monitoring.

## Exercise 285 — Dependency CVE Response
**Problem:** native dependency has high-severity vulnerability. **Expected:** assess exploitability and upgrade impact. **Hint:** version + usage + platform. **Solution:** verify affected versions/paths, patch/upgrade or mitigate, test RN/native compatibility, document decision and rollout urgency. **Explanation:** CVE severity alone does not describe app exposure. **Common mistake:** blindly npm audit fix across native graph. **Alternative:** vendor backport/replacement.

## Exercise 286 — Supply Chain Package Takeover
**Problem:** maintained package publishes suspicious new release. **Expected:** do not auto-consume latest. **Hint:** lockfiles/provenance/review. **Solution:** keep pinned lock, inspect changelog/source/provenance, wait/revert if compromised, rotate exposed secrets if applicable. **Explanation:** native/JS dependencies execute/build with trust. **Common mistake:** unbounded semver update in CI. **Alternative:** dependency update bot with review gates.

## Exercise 287 — Privacy Regression in SDK Update
**Problem:** SDK update starts collecting new device identifier. **Expected:** block until reviewed. **Hint:** release notes/privacy manifest/config. **Solution:** inspect platform privacy declarations/runtime behavior, disable collection or reject update, update consent/docs if justified. **Explanation:** dependency updates can change data practices. **Common mistake:** treat version bump as implementation-only. **Alternative:** server-side provider integration.

## Exercise 288 — Accessibility Regression Incident
**Problem:** screen reader cannot dismiss new modal. **Expected:** hotfix-level priority for blocked flow. **Hint:** focus/modal semantics. **Solution:** reproduce VoiceOver/TalkBack, fix accessible close control/focus containment/restoration, add semantic test and manual checklist. **Explanation:** inaccessible UI can make feature unusable. **Common mistake:** add label without reachable focus. **Alternative:** native navigation modal.

## Exercise 289 — Localization Crash
**Problem:** formatting crashes for unusual locale/currency. **Expected:** safe locale-aware formatter inputs. **Hint:** external locale data. **Solution:** validate currency/locale codes, use supported Intl/runtime APIs/polyfills if needed for baseline, fallback gracefully. **Explanation:** production locales expand state space. **Common mistake:** substring/hand-built currency formatting. **Alternative:** server-formatted presentation only when product accepts it.

## Exercise 290 — RTL Production Regression
**Problem:** destructive swipe direction becomes wrong in RTL. **Expected:** semantic direction decision. **Hint:** gesture meaning vs physical direction. **Solution:** define product semantics, mirror only directional interactions/icons that should mirror, test actual RTL locale. **Explanation:** layout direction affects interaction conventions. **Common mistake:** global transform mirroring. **Alternative:** explicit start/end actions.

## Exercise 291 — High Refresh Rate Regression
**Problem:** animation smooth on reference 60 Hz device, janky on 120 Hz flagship. **Expected:** profile stricter budget. **Hint:** ~8.33 ms. **Solution:** capture UI frame workload, remove per-frame JS/render/native mount pressure, use appropriate animation runtime. **Explanation:** refresh rate changes deadline. **Common mistake:** measure FPS average only. **Alternative:** frame-time percentile/jank metric.

## Exercise 292 — Thermal/Long-Session Degradation
**Problem:** app slows after 20 minutes of map/media usage. **Expected:** examine CPU/GPU/battery/thermal/memory. **Hint:** sustained workload. **Solution:** profile long session on device, reduce polling/location precision/render frequency, release media resources. **Explanation:** mobile performance is sustained-resource constrained. **Common mistake:** benchmark 30 seconds. **Alternative:** adaptive quality based on product/device state where appropriate.

## Exercise 293 — Cellular Data Budget
**Problem:** feed consumes excessive mobile data. **Expected:** reduce payload/media/prefetch. **Hint:** network cost is performance/product concern. **Solution:** thumbnails, compression, pagination, conditional prefetch, caching/ETags, track bytes by feature. **Explanation:** fast Wi-Fi masks production cost. **Common mistake:** optimize only latency. **Alternative:** user low-data mode.

## Exercise 294 — Battery Drain Investigation
**Problem:** users report background battery drain. **Expected:** inspect location, sockets, timers, retries, native SDKs. **Hint:** lifecycle. **Solution:** use platform energy/profiler diagnostics, compare background activity, pause unnecessary work and use OS scheduling. **Explanation:** background activity has direct battery cost. **Common mistake:** blame React Native generically. **Alternative:** server push instead of polling.

## Exercise 295 — Production Search Failure
**Problem:** Docusaurus handbook search cannot find “TurboModule.” **Expected:** verify doc index generation and content. **Hint:** local-search build artifact. **Solution:** ensure docs are included/indexDocs true, production build generates index and published route contains term; fix plugin/build integration. **Explanation:** documentation release has searchable-content gate. **Common mistake:** test dev navigation only. **Alternative:** dedicated search smoke test.

## Exercise 296 — Exact-Head CI Gate
**Problem:** PR passed CI, then a new commit was pushed. **Expected:** do not merge based on old run. **Hint:** compare validated SHA to current head. **Solution:** wait/run CI for new exact head and merge with expected-head guard. **Explanation:** evidence applies to a commit, not a PR name. **Common mistake:** “green earlier today.” **Alternative:** protected branch required checks.

## Exercise 297 — Merge-Base Drift
**Problem:** main changed after feature validation. **Expected:** resync before final validation. **Hint:** test integration, not obsolete base. **Solution:** update branch/merge main, resolve conflicts, rerun production build/CI on new head. **Explanation:** combined result may differ. **Common mistake:** merge stale branch because its own tests passed. **Alternative:** merge queue.

## Exercise 298 — Pages Deployment Verification
**Problem:** merge succeeds but live handbook route 404s. **Expected:** inspect Pages workflow/artifact/baseUrl/routes. **Hint:** merge is not publication. **Solution:** check deployment job, build output and exact live URLs; fix and redeploy before marking complete. **Explanation:** release gate is user-visible artifact. **Common mistake:** assume merged = live. **Alternative:** deployment smoke-test workflow.

## Exercise 299 — Completeness Audit Integrity
**Problem:** audit says COMPLETE while live native-module page is broken. **Expected:** revert/keep NOT COMPLETE. **Hint:** evidence-gated status. **Solution:** list required gates with links/SHAs/results; update status only after every live check passes. **Explanation:** audit is a release assertion. **Common mistake:** use completion status as aspiration. **Alternative:** machine-readable release checklist plus human audit.

## Exercise 300 — Production Capstone Incident
**Problem:** after RN upgrade, Android release crashes, iOS CI fails, push routes wrongly, and list performance regresses. **Expected:** triage by independent failure domains, stop rollout, recover systematically. **Hint:** observe → reproduce → isolate → logs → hypothesis → test → fix → validate → prevent. **Solution:** freeze release; classify Android Gradle/runtime, iOS toolchain/signing, notification intent logic, performance trace separately; fix with exact-head CI and staged rollout; add regression gates. **Explanation:** production engineering is disciplined decomposition under pressure. **Common mistake:** one sweeping dependency rollback without evidence. **Alternative:** revert known upgrade commit only if it safely restores all validated contracts, then investigate offline.