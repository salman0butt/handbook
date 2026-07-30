---
id: exercises-senior-181-240
title: Exercises 181–240 — Senior
---

# Senior Exercises 181–240

## Exercise 181 — State Ownership Audit
**Problem:** App has Redux copies of every API response plus TanStack Query. **Expected:** remove duplicate ownership. **Hint:** classify server vs client state. **Solution:** keep server data in query cache, retain Redux only for cross-feature client state that needs it, expose selectors/use cases. **Explanation:** two authorities create invalidation races. **Common mistake:** synchronize stores with effects. **Alternative:** one external client store plus query cache.

## Exercise 182 — Feature Boundary Design
**Problem:** `components/`, `hooks/`, `services/` contain hundreds of unrelated files. **Expected:** reorganize by feature/dependency direction. **Hint:** cohesion. **Solution:** colocate feature UI/hooks/use cases, put genuinely shared UI/domain/platform adapters in explicit shared layers. **Explanation:** ownership becomes clear. **Common mistake:** copy every file into feature folders without fixing imports. **Alternative:** package-level modularization in monorepo.

## Exercise 183 — API Client Contract
**Problem:** every screen constructs headers and parses errors. **Expected:** shared typed client boundary. **Hint:** transport concerns below features. **Solution:** centralize base URL/auth/cancellation/error normalization/runtime validation; feature repositories expose domain methods. **Explanation:** screens should not own HTTP mechanics. **Common mistake:** giant API singleton with UI navigation side effects. **Alternative:** generated client wrapped by domain repositories.

## Exercise 184 — Repository Decision
**Problem:** team asks whether every query needs repository class. **Expected:** apply abstraction where it buys boundary/testability. **Hint:** avoid ceremony. **Solution:** use feature service/repository for complex mapping/offline/native boundaries; direct typed query function may suffice for simple endpoint. **Explanation:** architecture serves change, not patterns. **Common mistake:** Java-style class per endpoint. **Alternative:** functional adapters.

## Exercise 185 — Native vs JavaScript Decision
**Problem:** calculate 2 ms formatting in JS; proposal moves it native “for speed.” **Expected:** keep JS absent evidence. **Hint:** crossing/maintenance cost. **Solution:** profile; native implementation only for platform API, existing native SDK, measured hotspot or capabilities unavailable in JS. **Explanation:** two-platform native ownership costs more. **Common mistake:** native always faster. **Alternative:** optimize algorithm/worker-like native library only after measurement.

## Exercise 186 — Library Selection Scorecard
**Problem:** choose between three navigation/media/storage libraries. **Expected:** evidence-based scorecard. **Hint:** maintenance and architecture compatibility. **Solution:** compare RN 0.86/New Arch support, native footprint, platform parity, API stability, security, release cadence, testability, license, migration path. **Explanation:** popularity alone is insufficient. **Common mistake:** newest package wins. **Alternative:** minimal in-house adapter.

## Exercise 187 — Dependency Governance
**Problem:** 12 teams independently upgrade native SDKs. **Expected:** ownership/version policy. **Hint:** native graph is shared binary. **Solution:** assign owners, approved versions, compatibility matrix, upgrade windows, central adapters and CI smoke builds. **Explanation:** native dependency changes affect whole app. **Common mistake:** feature team updates transitive Kotlin pod without platform review. **Alternative:** modular native packages with governed compatibility.

## Exercise 188 — Monorepo Package Boundary
**Problem:** shared package imports app navigation internals. **Expected:** reverse dependency. **Hint:** dependency direction. **Solution:** shared package exposes callbacks/interfaces; app composes navigation implementation. **Explanation:** lower-level package should not depend on app shell. **Common mistake:** path alias hides coupling. **Alternative:** feature package owns its navigator contract.

## Exercise 189 — Design System Variant API
**Problem:** `Button` has 17 booleans. **Expected:** constrained variant model. **Hint:** discriminated props. **Solution:** `variant:'primary'|'secondary'|'danger'`, size, loading/disabled; reject incompatible combinations in types. **Explanation:** API prevents invalid visual states. **Common mistake:** `red`, `outlined`, `danger`, `compact`, etc. independently. **Alternative:** composition for specialized buttons.

## Exercise 190 — Design Tokens Across Platforms
**Problem:** iOS and Android elevation differ. **Expected:** semantic token with platform implementation. **Hint:** design intent > raw property. **Solution:** define `surfaceRaised` semantics and map to supported shadow/elevation behavior per platform. **Explanation:** same product intent may need different native implementation. **Common mistake:** force one CSS-like shadow object. **Alternative:** flatter cross-platform design.

## Exercise 191 — Startup Budget
**Problem:** leadership wants cold start under target. **Expected:** define measurable milestone/device/build. **Hint:** first useful content. **Solution:** select reference devices, release build, cold process, start→interactive milestone, percentile target and regression threshold. **Explanation:** “startup time” is otherwise ambiguous. **Common mistake:** simulator debug timing. **Alternative:** platform telemetry in production.

## Exercise 192 — Native SDK Startup Cost
**Problem:** five analytics/marketing SDKs initialize in AppDelegate/Application. **Expected:** defer noncritical work. **Hint:** startup critical path. **Solution:** classify required-before-first-frame vs post-interactive/on-demand; lazy init and measure. **Explanation:** native initialization can dominate startup. **Common mistake:** blame Hermes. **Alternative:** server-side event forwarding to reduce SDK count.

## Exercise 193 — Performance Budget Enforcement
**Problem:** bundle/native size grows every release. **Expected:** CI/report budget. **Hint:** baseline + threshold. **Solution:** record artifact sizes/bundle analysis, fail or require review above thresholds, attribute deltas. **Explanation:** budgets make performance governable. **Common mistake:** manual annual cleanup. **Alternative:** dashboard warning without hard fail initially.

## Exercise 194 — FlatList Performance Investigation
**Problem:** scrolling is bad only on low-end Android. **Expected:** hypotheses with evidence. **Hint:** render, mount, images, GC, main thread. **Solution:** reproduce release build, trace frames, profile rows/images/memory, alter one variable, verify. **Explanation:** low-end hardware exposes bottlenecks. **Common mistake:** randomly set `windowSize=1`. **Alternative:** specialized list library after verified limitation.

## Exercise 195 — Over-Memoization Review
**Problem:** every callback/value/component is memoized. **Expected:** simplify where no benefit. **Hint:** memo has cognitive/comparison cost. **Solution:** use profiler/compiler/current React guidance; keep memo where expensive stable subtrees/props justify it. **Explanation:** optimization should target work. **Common mistake:** memo as correctness mechanism. **Alternative:** better state colocation.

## Exercise 196 — Server Cache vs Offline Database
**Problem:** persisted query cache is proposed for full offline CRM editing. **Expected:** distinguish snapshot cache from durable domain store. **Hint:** mutations/conflicts/querying. **Solution:** use local DB/outbox/sync engine for first-class offline domain; query persistence for bounded read cache. **Explanation:** offline editing has consistency semantics. **Common mistake:** treat cache serialization as database. **Alternative:** local-first library after compatibility evaluation.

## Exercise 197 — Conflict Policy ADR
**Problem:** product says “sync conflicts automatically.” **Expected:** document per-entity policy. **Hint:** invariants and user intent. **Solution:** define versions, mergeable fields, server-authoritative fields, user-visible conflict flow, telemetry. **Explanation:** conflicts are domain decisions. **Common mistake:** universal last-write-wins. **Alternative:** CRDT for collaborative text/list cases.

## Exercise 198 — Feature Flag Ownership
**Problem:** flag disables checkout UI but API remains callable. **Expected:** client flag not security control. **Hint:** server authorization. **Solution:** enforce rules server-side; client flag controls presentation/rollout only; define defaults/expiry/owner. **Explanation:** client is untrusted. **Common mistake:** feature flag as entitlement enforcement. **Alternative:** server-driven capability response.

## Exercise 199 — Release Train
**Problem:** 20 teams need mobile releases. **Expected:** predictable train and cutoff. **Hint:** binary coordination. **Solution:** define cadence, branch policy, freeze, automated gates, exception path, rollout stages and owner rotation. **Explanation:** store releases aggregate changes. **Common mistake:** every team demands ad-hoc production binary. **Alternative:** continuous delivery with automated store rollout if org/tooling mature.

## Exercise 200 — Rollback Strategy
**Problem:** released binary has non-crashing bad feature. **Expected:** mitigate before store update lands. **Hint:** flags/backend compatibility. **Solution:** disable feature via remotely controlled flag/server behavior if safe, halt rollout, submit fixed binary; OTA only for runtime-compatible JS changes and policy-compliant system. **Explanation:** mobile rollback differs from web. **Common mistake:** assume previous binary can instantly redeploy. **Alternative:** staged rollout minimizes blast radius.

## Exercise 201 — OTA Compatibility Contract
**Problem:** OTA bundle imports new native module not in old binary. **Expected:** reject update for old runtime. **Hint:** runtime version. **Solution:** version native capabilities and target bundle to compatible binary range. **Explanation:** JS cannot call absent native code. **Common mistake:** “OTA updates any RN change.” **Alternative:** store release first, then OTA for compatible JS.

## Exercise 202 — Security Threat Model
**Problem:** design auth for finance app. **Expected:** assets/adversaries/boundaries/mitigations. **Hint:** mobile client is inspectable. **Solution:** enumerate tokens/PII, device theft, reverse engineering, MITM/proxy, rooted device, malicious app/deep link, backend abuse; prioritize mitigations. **Explanation:** security is risk model, not checklist. **Common mistake:** start with certificate pinning before basic token/backend controls. **Alternative:** OWASP-based review workshop.

## Exercise 203 — Certificate Pinning Decision
**Problem:** team proposes pinning for all API traffic. **Expected:** weigh threat vs operational risk. **Hint:** rotation/outage. **Solution:** only adopt if threat model justifies; design backup pins/rotation/recovery and understand platform/network instrumentation limits. **Explanation:** pinning can create self-inflicted outages. **Common mistake:** pin one leaf cert forever. **Alternative:** normal platform TLS + strong backend/auth controls.

## Exercise 204 — Sensitive Logging Audit
**Problem:** crash breadcrumbs contain request bodies. **Expected:** redact/minimize. **Hint:** logs become another data store. **Solution:** structured allowlisted fields, token/PII scrubber, environment policy, retention controls. **Explanation:** observability can leak secrets. **Common mistake:** regex only after logging. **Alternative:** log event metadata, not payload.

## Exercise 205 — Screenshot Risk
**Problem:** app shows account number in app switcher. **Expected:** evaluate platform privacy controls and UX. **Hint:** screenshot/snapshot behavior differs. **Solution:** mask/redact sensitive screens or use supported platform secure-screen mechanisms where policy requires; test both OSes. **Explanation:** OS captures app previews/screens. **Common mistake:** assume one cross-platform prop exists in core. **Alternative:** partial masking in React UI.

## Exercise 206 — Root/Jailbreak Signal
**Problem:** security wants block all rooted devices. **Expected:** treat detection as bypassable risk signal. **Hint:** client untrusted. **Solution:** combine with server risk policy, user impact and sensitive-operation controls; do not claim absolute protection. **Explanation:** attackers controlling device can tamper with checks. **Common mistake:** detection = secure device guarantee. **Alternative:** hardware-backed attestation where supported, still risk-based.

## Exercise 207 — Deep-Link Security Review
**Problem:** link contains `redirect=https://evil.example`. **Expected:** prevent open redirect/unsafe scheme. **Hint:** allowlist. **Solution:** map known route identifiers/hosts, validate params and auth; never blindly open arbitrary target. **Explanation:** external link input crosses trust boundary. **Common mistake:** `Linking.openURL(param)`. **Alternative:** backend-generated signed route token.

## Exercise 208 — OAuth Callback Hijack Risk
**Problem:** custom scheme callback for high-risk app. **Expected:** prefer verified link or secure auth-session mechanism when provider/platform supports. **Hint:** scheme ownership can collide. **Solution:** use universal/app link redirect or provider-recommended claimed HTTPS; PKCE still required. **Explanation:** PKCE mitigates stolen authorization code but callback routing also matters. **Common mistake:** client secret in app. **Alternative:** custom scheme with PKCE when ecosystem requires and threat accepted.

## Exercise 209 — Accessibility Release Gate
**Problem:** accessibility tested only after launch. **Expected:** CI/manual gate. **Hint:** semantic tests + screen-reader checklist. **Solution:** component semantic queries, lint/design-system constraints, manual VoiceOver/TalkBack/dynamic type/reduced motion on release candidate. **Explanation:** accessibility defects are product defects. **Common mistake:** automated scanner only. **Alternative:** periodic specialist audit plus per-feature checks.

## Exercise 210 — Dynamic Type Layout Failure
**Problem:** checkout button disappears at 200% font scale. **Expected:** flexible layout/scroll. **Hint:** avoid fixed heights. **Solution:** let text wrap, remove rigid container heights, allow screen scrolling, test large fonts. **Explanation:** font scale changes geometry. **Common mistake:** disable font scaling globally. **Alternative:** carefully bounded text only where justified and accessible.

## Exercise 211 — Analytics Event Governance
**Problem:** teams invent duplicate names/payloads. **Expected:** typed event schema/owners. **Hint:** analytics is contract. **Solution:** shared typed event catalog, semantic naming, privacy classification, versioning and validation. **Explanation:** data quality depends on consistency. **Common mistake:** log arbitrary objects. **Alternative:** generated analytics SDK from schema.

## Exercise 212 — Crash Correlation
**Problem:** spike after staged rollout. **Expected:** correlate build/version/flag/device. **Hint:** release metadata. **Solution:** dashboards group crash/ANR by exact binary, RN/OS/device, rollout cohort and flag state; halt if threshold exceeded. **Explanation:** observability drives release decisions. **Common mistake:** global crash rate only. **Alternative:** per-critical-flow health metrics.

## Exercise 213 — Source Map Pipeline
**Problem:** source maps missing for one release. **Expected:** make upload release gate. **Hint:** exact artifact pairing. **Solution:** generate and upload map during build before publishing, verify upload result, retain artifact keyed by build SHA/version. **Explanation:** post-hoc regeneration may not match. **Common mistake:** rely on developer laptop. **Alternative:** archive maps in CI artifact storage too.

## Exercise 214 — Android Mapping File Pipeline
**Problem:** R8 crash unreadable. **Expected:** preserve mapping.txt. **Hint:** release artifact. **Solution:** upload/store exact mapping file per version code. **Explanation:** obfuscation mapping is binary-specific. **Common mistake:** clean build directory without artifact retention. **Alternative:** Play Console deobfuscation upload.

## Exercise 215 — CI Cache Poisoning Risk
**Problem:** build passes only with warm Gradle cache. **Expected:** prove clean reproducibility. **Hint:** cache optimization, not source of truth. **Solution:** periodically run clean-cache CI, key caches by lock/tool versions, avoid caching generated config that hides missing steps. **Explanation:** CI must rebuild from declared inputs. **Common mistake:** persist entire workspace. **Alternative:** remote Gradle build cache with correct keys.

## Exercise 216 — CI macOS Constraint
**Problem:** team wants iOS archive on Linux runner. **Expected:** reject. **Hint:** Xcode requires macOS. **Solution:** use macOS runner with installed Xcode/signing tools; Linux can run JS tests/Android. **Explanation:** iOS build toolchain is Apple/macOS. **Common mistake:** assume React Native removes native compiler requirement. **Alternative:** hosted macOS CI provider.

## Exercise 217 — Deterministic Toolchains
**Problem:** CI uses latest Node/JDK/Ruby every run. **Expected:** pin supported versions. **Hint:** baseline. **Solution:** Node >=22.11 fixed range/version, JDK17, Gradle wrapper, Gemfile.lock/Bundler, defined Xcode image. **Explanation:** moving toolchain changes can break build without source changes. **Common mistake:** “latest is safest.” **Alternative:** scheduled dependency/toolchain upgrade job.

## Exercise 218 — Upgrade Planning
**Problem:** app on RN 0.82 must reach 0.86. **Expected:** staged plan. **Hint:** releases/native deps/template diffs. **Solution:** inventory libraries, read 0.83–0.86 notes, upgrade compatible dependencies, apply native diffs minor-by-minor or controlled jump with checkpoints, run release regression/perf. **Explanation:** RN upgrade includes native projects/toolchains. **Common mistake:** change package.json only. **Alternative:** fresh-template diff as reference, not replacement.

## Exercise 219 — Native Dependency Compatibility Matrix
**Problem:** upgrade blocked by camera/animation packages. **Expected:** matrix before RN bump. **Hint:** package release docs. **Solution:** table RN version × package version × Android/iOS/New Arch support, test sample branch. **Explanation:** app compatibility is intersection of native ecosystems. **Common mistake:** npm peer-dependency success = runtime support. **Alternative:** temporarily replace library.

## Exercise 220 — Upgrade Regression Suite
**Problem:** define what must pass after RN minor. **Expected:** critical native/runtime flows. **Hint:** startup, nav, storage, push, links, permissions, release. **Solution:** automated + manual checklist including both release builds, native module/component, performance/memory baselines. **Explanation:** upgrades can alter native behavior without TS errors. **Common mistake:** unit tests only. **Alternative:** smoke matrix on device farm.

## Exercise 221 — Brownfield Boundary
**Problem:** native banking app embeds RN statements screen. **Expected:** explicit host contracts. **Hint:** auth/navigation/analytics/lifecycle. **Solution:** native host passes token/session interface and navigation callbacks via stable bridge/TurboModule boundary; RN does not own whole app lifecycle. **Explanation:** brownfield has two navigation/runtime worlds. **Common mistake:** RN screen directly manipulates native singleton internals. **Alternative:** shared service protocol.

## Exercise 222 — Brownfield Runtime Lifetime
**Problem:** creating RN runtime for every screen open is slow. **Expected:** evaluate shared runtime. **Hint:** startup vs isolation. **Solution:** keep host/runtime alive according to platform/RN brownfield guidance if memory/product supports, create/destroy surfaces instead. **Explanation:** runtime creation has cost. **Common mistake:** global runtime with unbounded retained feature state. **Alternative:** pooled/session runtime strategy.

## Exercise 223 — Native Navigation Handshake
**Problem:** RN detail must open native transfer screen. **Expected:** stable command/callback contract. **Hint:** route intent, not controller reference. **Solution:** emit typed navigation intent to native host, native decides route and later passes result. **Explanation:** ownership stays with host navigation. **Common mistake:** expose UIViewController/Activity object to JS. **Alternative:** deep-link style internal route contract.

## Exercise 224 — Library Public API
**Problem:** publishing RN library leaks generated/native internals. **Expected:** narrow JS API. **Hint:** adapter façade. **Solution:** export documented TS component/functions/types; keep Codegen/generated paths internal where possible. **Explanation:** consumers should depend on stable contract. **Common mistake:** export every native module method. **Alternative:** separate low-level package and high-level wrapper.

## Exercise 225 — Library Compatibility Range
**Problem:** package claims “all React Native versions.” **Expected:** define tested range. **Hint:** RN/native toolchain changes. **Solution:** set peer dependencies/engines and CI matrix for supported minors/platforms/New Arch. **Explanation:** compatibility is evidence. **Common mistake:** no lower/upper bound. **Alternative:** latest-three-minors policy.

## Exercise 226 — Library Example App
**Problem:** native library tests compile but users report install failures. **Expected:** example app validates integration. **Hint:** real Gradle/CocoaPods/Codegen. **Solution:** maintain bare example app consuming package as external user would; build Android/iOS in CI. **Explanation:** integration failures occur outside unit tests. **Common mistake:** only test source module directly. **Alternative:** fixture apps for multiple RN versions.

## Exercise 227 — Semantic Versioning for Native Library
**Problem:** change prop/event/native setup. **Expected:** classify breaking changes. **Hint:** consumer contract includes native installation/config. **Solution:** major for incompatible JS/native contract or required migration; minor for backward-compatible feature; patch for compatible fixes. **Explanation:** native config changes can be breaking even if TS signature unchanged. **Common mistake:** version only JS API. **Alternative:** explicit compatibility policy beyond semver.

## Exercise 228 — ADR for Navigation Choice
**Problem:** team debates navigation package weekly. **Expected:** record decision. **Hint:** context/options/tradeoffs/consequences. **Solution:** ADR captures native-stack requirements, deep links, accessibility, team expertise, package compatibility and revisit triggers. **Explanation:** prevents repeated context loss. **Common mistake:** ADR says “popular library.” **Alternative:** architecture RFC for broader change.

## Exercise 229 — Native Ownership Model
**Problem:** no one owns iOS/Android folders. **Expected:** establish code ownership. **Hint:** native code is product code. **Solution:** platform/mobile owners review native config/deps, document patterns, train feature engineers, maintain CI. **Explanation:** ignoring native folders increases upgrade/release risk. **Common mistake:** only external contractor touches them. **Alternative:** rotating native stewardship.

## Exercise 230 — Mobile/Backend Compatibility
**Problem:** backend removes field after web deploy, old mobile crashes. **Expected:** backward-compatible API strategy. **Hint:** slow mobile adoption. **Solution:** additive changes, tolerant readers/schema validation/defaults, deprecation telemetry, minimum-version policy only when necessary. **Explanation:** old binaries remain in wild. **Common mistake:** server assumes all clients update instantly. **Alternative:** versioned endpoint for breaking contract.

## Exercise 231 — Failure Domain Mapping
**Problem:** login fails for subset of users. **Expected:** map IdP, deep link, device clock/network, API, secure store, app version. **Hint:** systems diagram. **Solution:** collect stage-specific telemetry and correlation IDs, reproduce by cohort, isolate before code change. **Explanation:** mobile auth spans services/platform. **Common mistake:** generic “login failed” event. **Alternative:** synthetic auth monitoring.

## Exercise 232 — Multi-Team Feature Flags
**Problem:** stale flags accumulate. **Expected:** lifecycle. **Hint:** owner + expiry. **Solution:** metadata owner, creation reason, default, rollout, cleanup date; CI/report expired flags. **Explanation:** flags create permanent state-space cost if unmanaged. **Common mistake:** flag every branch forever. **Alternative:** release configuration with short-lived flags.

## Exercise 233 — Release Incident Command
**Problem:** crash rate doubles at 20% rollout. **Expected:** halt, triage, communicate. **Hint:** runbook. **Solution:** stop rollout, compare cohorts/stacks, disable safe flags, assign incident roles, ship fix/rollback strategy, postmortem. **Explanation:** operational response is part of engineering. **Common mistake:** continue rollout while investigating. **Alternative:** automated threshold halt.

## Exercise 234 — ANR vs Crash Prioritization
**Problem:** no crash spike but users report freezes. **Expected:** inspect ANRs/watchdogs/perf metrics. **Hint:** process can be alive but unusable. **Solution:** correlate ANR rate, main-thread traces, startup/network waits, device cohorts. **Explanation:** crash-free metric is incomplete. **Common mistake:** declare healthy because crash rate low. **Alternative:** interaction latency/SLO dashboards.

## Exercise 235 — iOS Watchdog Termination
**Problem:** app dies during launch with watchdog report. **Expected:** reduce main-thread launch work. **Hint:** OS kills unresponsive app. **Solution:** inspect termination reason/timing, defer blocking initialization/I/O, profile release startup. **Explanation:** watchdog differs from ordinary exception. **Common mistake:** look only for JS stack. **Alternative:** background native initialization when safe.

## Exercise 236 — Production Memory Budget
**Problem:** app is killed after long image-heavy session. **Expected:** define memory benchmark. **Hint:** device class and scenario. **Solution:** measure native+JS memory through scripted flow, set cache/image limits, compare releases, investigate unbounded growth. **Explanation:** memory pressure varies by device. **Common mistake:** desktop simulator benchmark. **Alternative:** low-memory physical test matrix.

## Exercise 237 — Privacy-Safe Analytics
**Problem:** product wants full search text in analytics. **Expected:** minimize/hash/categorize based on purpose. **Hint:** data minimization. **Solution:** log derived category/length/success metric or explicit consent policy, not raw potentially sensitive text by default. **Explanation:** telemetry should collect only needed data. **Common mistake:** “analytics vendor is secure.” **Alternative:** on-device aggregation.

## Exercise 238 — Third-Party SDK Risk
**Problem:** marketing SDK requests contacts/location though feature does not need them. **Expected:** reject or constrain. **Hint:** permissions/privacy/supply chain. **Solution:** audit SDK manifest/plist/runtime behavior, disable optional collection, choose alternative if unjustified. **Explanation:** dependencies inherit app trust. **Common mistake:** accept default SDK config. **Alternative:** server-side integration.

## Exercise 239 — Senior Code Review
**Problem:** PR adds global store, native SDK, deep link and background timer. **Expected:** review architecture/security/lifecycle/versioning. **Hint:** ask owner/lifetime/platform/failure/upgrade. **Solution:** separate concerns, replace timer with lifecycle-safe design, justify store/SDK, validate links, add tests/observability. **Explanation:** senior review sees system effects beyond code style. **Common mistake:** focus on naming only. **Alternative:** design review before implementation.

## Exercise 240 — Senior Integration
**Problem:** Design and ship an offline-capable authenticated SaaS feature across Android/iOS with release gates. **Expected:** ADRs, state ownership, security, observability, performance, test and rollout plan. **Hint:** chapters 181–200. **Solution:** feature architecture + query/local DB/outbox + secure auth + platform adapters + staged release metrics. **Explanation:** senior engineering optimizes lifecycle and changeability. **Common mistake:** feature “done” when debug build works. **Alternative:** smaller vertical slice through same production pipeline.