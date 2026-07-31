---
id: interview-questions-staff-321-400
title: Interview Questions 321–400 — Staff Architecture
---

# Staff Interview Questions 321–400

## Q321 — How would you define a React Native platform strategy for twenty product teams?
**Expected answer:** Define supported RN/runtime versions, shared native foundations, design/data/security/observability contracts, CI/release paved roads, ownership and migration policy while preserving bounded feature autonomy. **Reasoning:** architecture must scale organizationally. **Common wrong answer:** Put every team in one app folder. **Follow-up:** Which decisions remain local? **Related chapter:** 192/200.

## Q322 — What belongs in a mobile platform team's charter?
**Expected answer:** High-blast-radius shared foundations: RN/toolchain upgrades, native SDK governance, build/signing/release infrastructure, observability/security baselines, design-system platform support and developer experience. **Reasoning:** platform owns leverage, not product features. **Common wrong answer:** Platform team approves every UI PR. **Follow-up:** How measure platform success? **Related chapter:** 192/200.

## Q323 — How do you avoid turning the platform team into a bottleneck?
**Expected answer:** Self-service templates/APIs, documented paved roads, automated policy checks, ownership delegation, office hours and explicit exception mechanisms. **Reasoning:** standards should reduce coordination cost. **Common wrong answer:** Central team manually reviews every dependency update. **Follow-up:** What requires central review? **Related chapter:** 192/200.

## Q324 — How would you set an organization-wide React Native version policy?
**Expected answer:** Choose supported minor window, upgrade cadence, compatibility matrix, deprecation dates, exception criteria and telemetry for app/library adoption; align with RN support cycle. **Reasoning:** version drift creates compound risk. **Common wrong answer:** Every app upgrades whenever convenient. **Follow-up:** How handle a blocked business app? **Related chapter:** 195/200.

## Q325 — Why is staying near current RN releases strategically valuable?
**Expected answer:** It reduces accumulated native/template/toolchain migration distance, keeps security/platform support current and improves library compatibility; upgrades become routine instead of rescue projects. **Reasoning:** migration cost compounds. **Common wrong answer:** Upgrade only for new UI features. **Follow-up:** What evidence can justify delaying? **Related chapter:** 195/200.

## Q326 — How would you govern third-party native SDKs across multiple apps?
**Expected answer:** Central inventory with owner, purpose, permissions/data use, versions, supported RN/platform range, startup/binary cost, security status and replacement plan; standard wrappers where shared. **Reasoning:** SDKs are supply-chain and platform dependencies. **Common wrong answer:** Let each feature install independently. **Follow-up:** How retire an SDK? **Related chapter:** 192/199–200.

## Q327 — What is a useful dependency admission policy?
**Expected answer:** Require business need, maintenance/compatibility, security/privacy/license review, native/build impact, performance size, testability and ownership; scale rigor with blast radius. **Reasoning:** dependency cost persists. **Common wrong answer:** Weekly downloads threshold alone. **Follow-up:** JS-only vs native review difference? **Related chapter:** 194/199–200.

## Q328 — How would you standardize native-module boundaries?
**Expected answer:** Shared typed contracts, Codegen-first New Architecture patterns, error/event/threading conventions, TS adapters, observability and compatibility tests. **Reasoning:** cross-language contracts need consistency. **Common wrong answer:** Every team exposes raw SDK APIs differently. **Follow-up:** How enforce sync-method limits? **Related chapter:** 152–159/200.

## Q329 — What is the role of a “paved road” in mobile architecture?
**Expected answer:** A supported default path for common tasks with templates, libraries, CI and documentation that makes the safe/reliable option easiest without forbidding justified exceptions. **Reasoning:** architecture through enablement. **Common wrong answer:** Mandatory framework for every feature. **Follow-up:** Give a networking paved road. **Related chapter:** 192/200.

## Q330 — How do you decide what should be a shared platform package?
**Expected answer:** Share stable cross-team capability with repeated need and clear ownership; avoid centralizing volatile product logic or one-off abstractions. **Reasoning:** reuse has coordination cost. **Common wrong answer:** Deduplicate any two similar functions immediately. **Follow-up:** When split a package back out? **Related chapter:** 190–192/200.

## Q331 — How would you design a cross-app design system release model?
**Expected answer:** Semantic tokens/components, compatibility/version policy, codemods/migrations, visual/a11y tests, staged adoption and deprecation windows with clear owners. **Reasoning:** design systems are APIs. **Common wrong answer:** Publish latest and force all apps same day. **Follow-up:** How handle brand variants? **Related chapter:** 190/200.

## Q332 — How do you enforce accessibility at organization scale?
**Expected answer:** Accessible defaults in design system, lint/test rules where reliable, acceptance criteria, manual VoiceOver/TalkBack playbooks, training and release-quality metrics for critical flows. **Reasoning:** shift quality into shared foundations. **Common wrong answer:** Annual audit only. **Follow-up:** What cannot automation prove? **Related chapter:** 111–116/181/200.

## Q333 — How would you define mobile performance budgets across device tiers?
**Expected answer:** Pick representative low/mid/high devices and target cold start, interaction latency/frame stability, memory and binary size with field percentiles and regression thresholds. **Reasoning:** averages hide user segments. **Common wrong answer:** Benchmark newest flagship only. **Follow-up:** Which percentile would you monitor? **Related chapter:** 165–170/200.

## Q334 — What is a reasonable response to a team exceeding a performance budget?
**Expected answer:** Measure user impact/root cause, require mitigation or explicit exception with owner/expiry, and improve tooling/paved road if systemic. **Reasoning:** budgets are governance, not punishment. **Common wrong answer:** Block release indefinitely regardless of context. **Follow-up:** How prevent permanent exceptions? **Related chapter:** 165–170/200.

## Q335 — How would you make startup performance an organizational metric?
**Expected answer:** Standard instrumentation from process start to meaningful milestones, consistent device/version cohorts, dashboards/alerts, ownership and release regression gates. **Reasoning:** metric must be comparable and actionable. **Common wrong answer:** One local stopwatch test. **Follow-up:** What is “time to interactive” on your app? **Related chapter:** 168/187/200.

## Q336 — How do you distinguish platform SLOs from product KPIs?
**Expected answer:** Platform SLOs cover reliability/performance of technical capabilities—crash-free sessions, startup, build success, release lead time—while product KPIs measure user/business outcomes. **Reasoning:** teams need both. **Common wrong answer:** DAU is a platform SLO. **Follow-up:** What SLO would signing infrastructure own? **Related chapter:** 185–187/200.

## Q337 — How would you design shared observability schemas?
**Expected answer:** Versioned event/log conventions with common release/device/session/correlation fields, privacy classification, domain namespaces, ownership and compatibility policy. **Reasoning:** cross-app analysis needs consistent dimensions. **Common wrong answer:** Free-form message strings. **Follow-up:** How evolve a field? **Related chapter:** 187/200.

## Q338 — What should release health gates look like?
**Expected answer:** Predefined thresholds for crashes/ANRs/watchdogs/startup/network/auth/critical flows by release cohort with enough sample size, automated alerts and authority to halt rollout. **Reasoning:** objective risk control. **Common wrong answer:** Watch dashboards informally. **Follow-up:** How handle low-volume apps? **Related chapter:** 184/187/200.

## Q339 — How would you design a release train for multiple teams?
**Expected answer:** Predictable cutoff, automated quality gates, ownership of integration conflicts, staged channels, release notes, incident authority and emergency path while feature flags decouple code merge from exposure. **Reasoning:** coordinate shared binary risk. **Common wrong answer:** All teams merge on release morning. **Follow-up:** What gets cherry-picked? **Related chapter:** 184–185/192/200.

## Q340 — When are independent app releases better than a release train?
**Expected answer:** When products/binaries have separate ownership/dependency graphs and shared platform changes are versioned safely; choose coordination model from coupling and operational cost. **Reasoning:** process follows architecture. **Common wrong answer:** One model fits every organization. **Follow-up:** How keep platform versions aligned? **Related chapter:** 192/200.

## Q341 — How would you manage multiple app versions against one backend?
**Expected answer:** Backward-compatible contracts, capability/version negotiation when needed, server-driven flags, deprecation telemetry and explicit minimum-version policy for security-critical cases. **Reasoning:** client population is heterogeneous. **Common wrong answer:** Backend deploy assumes newest app. **Follow-up:** How retire a field? **Related chapter:** 184/200.

## Q342 — What is a mobile/backend compatibility contract?
**Expected answer:** Defined API semantics, auth/error/idempotency/version behavior and deprecation guarantees that account for long-lived installed binaries and offline retries. **Reasoning:** compatibility spans time. **Common wrong answer:** OpenAPI types alone solve compatibility. **Follow-up:** How test older clients? **Related chapter:** 176–180/200.

## Q343 — How do you plan a breaking backend migration used by mobile?
**Expected answer:** Add new behavior compatibly, release clients that support it, measure adoption, migrate traffic/data, then remove old contract after policy threshold; use dual-read/write only with explicit consistency plan. **Reasoning:** expand-migrate-contract. **Common wrong answer:** Flip endpoint atomically. **Follow-up:** What if users never update? **Related chapter:** 184/200.

## Q344 — What is a good mandatory-update policy?
**Expected answer:** Reserve for security/compliance/unsupported-contract cases, provide minimum supported version server-side, graceful UX and rollout lead time; avoid using it to compensate for routine compatibility. **Reasoning:** forced updates harm availability. **Common wrong answer:** Force every monthly release. **Follow-up:** How handle offline users? **Related chapter:** 184/200.

## Q345 — How would you govern feature flags?
**Expected answer:** Owners, naming/types, server/client trust classification, default/failure behavior, rollout/audit history, expiry/removal date and tests for both paths. **Reasoning:** flags create hidden state space. **Common wrong answer:** Permanent booleans scattered in components. **Follow-up:** Which flag decisions must be server-authoritative? **Related chapter:** 182/192/200.

## Q346 — Why are client feature flags not security boundaries?
**Expected answer:** Distributed clients can be inspected/tampered with and stale; authorization/entitlement must be enforced server-side/native platform where authoritative. **Reasoning:** client cannot grant trust. **Common wrong answer:** Hidden flag secures premium API. **Follow-up:** What can client flag safely control? **Related chapter:** 182/188.

## Q347 — How would you govern OTA updates in a bare RN fleet?
**Expected answer:** Runtime compatibility scheme, signed artifacts, staged channels, rollback, policy review, observability, ownership and rules distinguishing JS-safe changes from native binary changes. **Reasoning:** OTA is another release system. **Common wrong answer:** Ship any hotfix outside stores. **Follow-up:** What change invalidates runtime? **Related chapter:** 186/200.

## Q348 — How do OTA and store releases interact operationally?
**Expected answer:** Store binary defines native runtime; OTA channels target compatible binary cohorts. New native capability requires store release, and rollback plans must account for both installed binary and bundle version. **Reasoning:** two-dimensional versioning. **Common wrong answer:** OTA replaces store pipeline. **Follow-up:** What telemetry identifies both versions? **Related chapter:** 186–187.

## Q349 — How would you centralize signing without exposing credentials broadly?
**Expected answer:** Dedicated CI identities/key stores, least privilege, protected environments, short-lived access where possible, audit logs, rotation and separation between build/test and release approval. **Reasoning:** signing is supply-chain trust. **Common wrong answer:** Commit keystore/cert to private repo. **Follow-up:** Who can promote release? **Related chapter:** 184–185/188/200.

## Q350 — What is your mobile supply-chain threat model?
**Expected answer:** Compromised dependencies, package registries, CI runners, build scripts, signing keys, developer machines and release accounts; mitigate with pinning, review, provenance, least privilege and artifact verification. **Reasoning:** security starts before runtime. **Common wrong answer:** TLS to API is enough. **Follow-up:** Which dependency changes deserve special review? **Related chapter:** 185/188/200.

## Q351 — How would you respond to a compromised native SDK dependency?
**Expected answer:** Identify affected versions/apps/builds, block pipeline, rotate exposed credentials, replace/update dependency, issue store/OTA remediation within compatibility limits, notify stakeholders and add supply-chain controls. **Reasoning:** containment plus recovery. **Common wrong answer:** Delete package from main and wait for users. **Follow-up:** What if binary already shipped? **Related chapter:** 184–188/200.

## Q352 — What security controls belong in a shared mobile foundation?
**Expected answer:** Auth/token handling, secure storage wrapper, link validation, network/error logging redaction, config classification, privacy defaults and platform manifest/entitlement guidance—not hardcoded business authorization. **Reasoning:** centralize reusable controls. **Common wrong answer:** One “security SDK” solves all threats. **Follow-up:** What remains server responsibility? **Related chapter:** 086–096/188/200.

## Q353 — How would you govern permissions across teams?
**Expected answer:** Central inventory/rationale, least privilege, standardized request UX, manifest/Info.plist reviews, privacy declarations and analytics for denial impact; require evidence before adding sensitive permissions. **Reasoning:** permission footprint affects trust/store review. **Common wrong answer:** Request all permissions at startup. **Follow-up:** How retire a permission? **Related chapter:** 097–105/188.

## Q354 — What is a privacy review for analytics SDKs?
**Expected answer:** Data collected, identifiers, destinations/processors, retention, consent/legal basis, platform disclosures, opt-out behavior and whether SDK behavior matches declared configuration. **Reasoning:** SDK behavior is app behavior. **Common wrong answer:** Vendor is popular, so privacy is covered. **Follow-up:** How validate network collection? **Related chapter:** 187–188.

## Q355 — How do you design incident ownership for cross-layer mobile failures?
**Expected answer:** One incident lead, platform/product/native/backend roles by evidence, shared timeline, release authority and postmortem actions with owners; avoid handoffs based only on layer assumptions. **Reasoning:** failures cross boundaries. **Common wrong answer:** JS team owns only JS logs. **Follow-up:** Who halts rollout? **Related chapter:** 161–164/187/200.

## Q356 — What makes a strong mobile incident runbook?
**Expected answer:** Symptoms/alerts, exact artifacts/log sources, version/device segmentation, reproduction steps, rollback/flag options, escalation ownership and known failure-specific commands/checks. **Reasoning:** reduce diagnosis latency under pressure. **Common wrong answer:** Generic “restart app” checklist. **Follow-up:** How keep it current? **Related chapter:** 161–164/200.

## Q357 — How do you decide whether to hotfix, flag off or wait for store review?
**Expected answer:** Compare user/security impact, affected cohort, reversibility, native vs JS scope, OTA policy, backend mitigation and store timing; choose fastest safe control. **Reasoning:** recovery options differ by failure domain. **Common wrong answer:** Always publish a new binary. **Follow-up:** What if auth is broken? **Related chapter:** 184–188/200.

## Q358 — How would you perform a blameless postmortem without becoming vague?
**Expected answer:** Describe concrete timeline, contributing system/process conditions, detection gaps, technical root causes and owned corrective actions without reducing explanation to individual fault. **Reasoning:** learn from system. **Common wrong answer:** “Human error” as root cause. **Follow-up:** What action prevents recurrence? **Related chapter:** 199–200.

## Q359 — How do you measure mobile developer experience?
**Expected answer:** Setup time, local/CI build times, flaky-test rate, PR-to-artifact lead time, upgrade friction, support load and paved-road adoption plus qualitative feedback. **Reasoning:** platform productivity is measurable. **Common wrong answer:** Number of internal packages. **Follow-up:** Which metric could be gamed? **Related chapter:** 185/192/200.

## Q360 — How would you reduce CI build time without sacrificing reproducibility?
**Expected answer:** Profile pipeline, parallelize independent checks, cache content-addressed dependencies/build outputs safely, use incremental Gradle where valid, prebuilt RN/iOS benefits, shard tests and avoid rebuilding unchanged artifacts. **Reasoning:** optimize measured critical path. **Common wrong answer:** Skip iOS build on PRs. **Follow-up:** How validate cache correctness? **Related chapter:** 185/200.

## Q361 — What should a mobile build cache key include?
**Expected answer:** Relevant lockfiles, toolchain/build config, native dependency inputs, Gradle/CocoaPods state and target variant; overly broad keys miss hits, overly narrow keys risk stale artifacts. **Reasoning:** cache correctness comes from inputs. **Common wrong answer:** Branch name only. **Follow-up:** Which caches are safe to share? **Related chapter:** 121–140/185.

## Q362 — How would you manage Xcode version upgrades across CI and developers?
**Expected answer:** Compatibility test RN/pods/SDKs, pin CI image/toolchain, publish migration window, validate archives/signing/tests, update local tooling docs and retire old image after adoption. **Reasoning:** Xcode is production build dependency. **Common wrong answer:** CI always uses newest image automatically. **Follow-up:** How handle urgent App Store SDK requirement? **Related chapter:** 121–140/185/195.

## Q363 — How would you manage Android Gradle/AGP/JDK upgrades?
**Expected answer:** Treat them as a compatibility set with RN/Gradle plugin/native SDKs, test wrapper/AGP/JDK combinations, update templates centrally and validate all flavors/release/R8. **Reasoning:** Android toolchain versions are coupled. **Common wrong answer:** Upgrade AGP alone to latest. **Follow-up:** Why use wrapper? **Related chapter:** 121–140/195.

## Q364 — What is a shared app template useful for?
**Expected answer:** Encodes current toolchain, folder architecture, lint/test/config/observability/security defaults and CI wiring so new apps start on supported paved road. **Reasoning:** defaults shape long-term cost. **Common wrong answer:** Template should include every possible SDK. **Follow-up:** How keep generated apps upgraded? **Related chapter:** 191–195/200.

## Q365 — How do you keep a template from becoming stale?
**Expected answer:** Version it, test generated app in CI, align with platform release cadence, consume it through upgrades/codemods rather than only at project creation. **Reasoning:** creation-time standards decay. **Common wrong answer:** Update README yearly. **Follow-up:** Which checks prove template health? **Related chapter:** 194–195/200.

## Q366 — How would you evaluate a monorepo for a multi-app mobile organization?
**Expected answer:** Assess shared code/native libraries, ownership, build tooling, CI graph, dependency boundaries and repo scale; monorepo improves coordination only if architecture/build systems enforce modularity. **Reasoning:** repo topology is a trade-off. **Common wrong answer:** Monorepo automatically speeds all builds. **Follow-up:** When prefer polyrepo? **Related chapter:** 190–192/200.

## Q367 — How would you prevent duplicate React Native runtime copies in a workspace?
**Expected answer:** Use peer/workspace dependency policy, Metro resolution rules and package boundaries so app owns one compatible React/RN instance; validate dependency graph in CI. **Reasoning:** runtime singleton assumptions matter. **Common wrong answer:** npm will always dedupe safely. **Follow-up:** What symptom can duplicate React cause? **Related chapter:** 139–140/190.

## Q368 — What is dependency-direction enforcement in a mobile monorepo?
**Expected answer:** Machine-checkable rules such as app → feature → domain → data/platform contracts, preventing lower layers from importing app/UI or cross-feature internals. **Reasoning:** architecture survives only if enforceable. **Common wrong answer:** Folder names alone enforce it. **Follow-up:** How allow shared UI? **Related chapter:** 191–192.

## Q369 — How would you decide between one super-app binary and multiple apps?
**Expected answer:** Evaluate user journeys, release independence, ownership, binary/startup cost, regulatory/store boundaries, shared authentication/data and organizational coupling. **Reasoning:** binary topology is product + platform architecture. **Common wrong answer:** One codebase means one binary. **Follow-up:** Can packages be shared across separate apps? **Related chapter:** 190–192/200.

## Q370 — How do brownfield constraints change platform strategy?
**Expected answer:** Native host ownership, existing navigation/DI/build/release systems and gradual RN surfaces require contracts/runtime lifecycle compatible with native platform rather than assuming RN controls app root. **Reasoning:** integration must respect host architecture. **Common wrong answer:** Replace AppDelegate/MainActivity immediately. **Follow-up:** How share auth? **Related chapter:** 193/200.

## Q371 — How would you migrate a large native app to RN incrementally?
**Expected answer:** Select bounded features, build shared RN runtime/foundation, define host navigation/data/auth contracts, ship isolated surfaces, measure quality, then expand where benefits justify migration. **Reasoning:** reduce migration blast radius. **Common wrong answer:** Rewrite entire app before first release. **Follow-up:** Which feature would you choose first? **Related chapter:** 193/200.

## Q372 — When should an organization not adopt React Native?
**Expected answer:** When core experience depends heavily on unsupported platform-specific rendering/realtime constraints, team/tooling economics are unfavorable, or shared-code benefits do not offset native integration complexity. **Reasoning:** framework is a means. **Common wrong answer:** RN is always cheaper for two platforms. **Follow-up:** What evidence would you collect in a spike? **Related chapter:** 199–200.

## Q373 — How would you evaluate RN versus separate native apps for a new product?
**Expected answer:** Compare product UI/capability needs, team skills, native SDK surface, performance constraints, iteration velocity, shared logic, accessibility, release/toolchain and long-term ownership through a representative prototype. **Reasoning:** total lifecycle cost. **Common wrong answer:** Choose from benchmark alone. **Follow-up:** What prototype is high-risk? **Related chapter:** 001–010/199–200.

## Q374 — What is the staff-level question behind “should this be native?”
**Expected answer:** Which layer should own capability given latency/threading/platform/API longevity/team expertise/upgrade cost, and how do we preserve a stable contract if implementation changes? **Reasoning:** boundary design matters more than language. **Common wrong answer:** Kotlin/Swift means higher quality. **Follow-up:** How hide implementation choice? **Related chapter:** 191/199–200.

## Q375 — How do you manage platform-specific divergence over years?
**Expected answer:** Track divergence intentionally, keep shared domain/contracts, isolate platform adapters, require justification/owners for forks and periodically reassess whether separate implementations remain cheaper. **Reasoning:** conditional complexity accumulates. **Common wrong answer:** Force identical UI/behavior at all costs. **Follow-up:** What differences should remain native? **Related chapter:** 116–120/191/200.

## Q376 — What is a platform abstraction leak?
**Expected answer:** When feature code must know low-level Android/iOS/build/native details that the supposed shared contract should encapsulate, increasing coupling and test/upgrade cost. **Reasoning:** abstractions should localize volatility. **Common wrong answer:** Any platform-specific behavior is a leak. **Follow-up:** When expose platform capability explicitly? **Related chapter:** 116–120/191.

## Q377 — How would you define ownership for shared native code?
**Expected answer:** Named team/on-call, API/release compatibility policy, code owners, tests across platforms/RN versions, security review and deprecation process. **Reasoning:** shared code without ownership decays. **Common wrong answer:** Everyone owns it. **Follow-up:** Who approves breaking change? **Related chapter:** 192/194/200.

## Q378 — How should internal RN libraries be versioned?
**Expected answer:** Semantic/versioned contracts or synchronized workspace policy with explicit compatibility range, changelog/migration tooling and CI against supported app/RN combinations. **Reasoning:** consumers need predictable change. **Common wrong answer:** Always import main branch. **Follow-up:** When is lockstep versioning useful? **Related chapter:** 194–195/200.

## Q379 — How would you deprecate an internal mobile API?
**Expected answer:** Mark/document replacement, measure usages, provide codemod/migration examples, set deadline, notify owners and remove only after adoption/exception review. **Reasoning:** deprecation is a migration program. **Common wrong answer:** Delete method after warning comment. **Follow-up:** How find all call sites across repos? **Related chapter:** 194–195/200.

## Q380 — How do you design shared libraries for testability?
**Expected answer:** Explicit dependencies, deterministic core logic, adapter boundaries for native/network/storage/time, small public APIs and example/integration tests on both platforms. **Reasoning:** platform effects should be injectable/testable. **Common wrong answer:** Mock entire React Native runtime in every test. **Follow-up:** What belongs in device integration test? **Related chapter:** 180–181/191–194.

## Q381 — How would you govern test strategy across teams?
**Expected answer:** Common pyramid/contracts: fast domain/unit, component/integration at feature boundaries, selected E2E critical journeys, native integration and accessibility/performance checks with ownership and flake budgets. **Reasoning:** optimize confidence per cost. **Common wrong answer:** Require 100% E2E coverage. **Follow-up:** What is a flake budget? **Related chapter:** 180–181/200.

## Q382 — What does “deterministic E2E” require?
**Expected answer:** Controlled backend/test data/auth, stable selectors, explicit synchronization, known app/build state and isolation from third-party variability where possible. **Reasoning:** flakes are uncontrolled dependencies. **Common wrong answer:** Add longer sleeps. **Follow-up:** How test push/deep links? **Related chapter:** 181.

## Q383 — How would you treat flaky tests organizationally?
**Expected answer:** Track rate/ownership, quarantine only with deadline, fix root synchronization/data/environment issue, and prevent flakes from becoming ignored signal. **Reasoning:** unreliable gates erode culture. **Common wrong answer:** Re-run until green forever. **Follow-up:** When disable a test? **Related chapter:** 181/200.

## Q384 — How do you choose what to test on real devices?
**Expected answer:** Hardware/performance/permissions/camera/Bluetooth/biometrics/push/background/audio and representative low-end behavior need device coverage; simulators cover faster deterministic UI flows. **Reasoning:** virtualization misses physical/platform constraints. **Common wrong answer:** Emulator parity is complete. **Follow-up:** Which device matrix is sufficient? **Related chapter:** 097–110/165–181.

## Q385 — How would you define a device/OS support policy?
**Expected answer:** Product market share, platform security/support, RN minimums, performance/accessibility burden and test capacity; publish minimum OS/device tiers and retirement process. **Reasoning:** support has real cost. **Common wrong answer:** Support every OS RN can compile for. **Follow-up:** How communicate deprecation? **Related chapter:** version baseline/184/200.

## Q386 — How do you manage platform API deprecations before they become emergencies?
**Expected answer:** Track Android/iOS SDK/store deadlines, toolchain release notes and warnings; assign migrations in platform roadmap and validate ahead of required target SDK/Xcode dates. **Reasoning:** platform deadlines are predictable. **Common wrong answer:** Fix only when store rejects build. **Follow-up:** Who owns target SDK changes? **Related chapter:** 184–185/195/200.

## Q387 — What is your approach to React Native release-note consumption?
**Expected answer:** Platform owner reviews each release/RC, maps breaking/toolchain/architecture changes to internal dependencies, runs compatibility branch/tests and publishes migration guidance. **Reasoning:** upstream change needs local translation. **Common wrong answer:** Read release notes only during annual upgrade. **Follow-up:** How use Upgrade Helper? **Related chapter:** 195/200.

## Q388 — How would you evaluate a future RN RC without destabilizing production?
**Expected answer:** Separate compatibility branch/sample app, run shared library/native build/test/performance matrix, file upstream issues and keep stable apps on current baseline until release criteria are met. **Reasoning:** learn early without promoting prerelease. **Common wrong answer:** Upgrade production because RC has desired feature. **Follow-up:** What evidence allows early adoption? **Related chapter:** version baseline/195/200.

## Q389 — How do you design migration plans that survive changing priorities?
**Expected answer:** Incremental milestones that leave system shippable, compatibility adapters, measurable adoption, explicit owners/deadlines and ability to pause without two permanent architectures. **Reasoning:** migrations compete with product work. **Common wrong answer:** Big-bang rewrite with no intermediate value. **Follow-up:** How prevent adapter permanence? **Related chapter:** 192–196/200.

## Q390 — How would you migrate organization-wide state tooling?
**Expected answer:** Define target/problem, provide interoperability boundary/adapters, migrate feature by feature, prevent dual ownership, add codemods/docs and measure adoption before removing legacy. **Reasoning:** state migration is ownership migration. **Common wrong answer:** Install new store and mix both everywhere. **Follow-up:** What migrates last? **Related chapter:** 045–050/192/200.

## Q391 — How would you migrate navigation across a large app?
**Expected answer:** Model route contracts/links/auth first, create boundary between old/new navigators where supported, migrate coherent flows, preserve analytics/deep links/state restoration and test back behavior on both platforms. **Reasoning:** navigation is app topology. **Common wrong answer:** Rename screen components one by one. **Follow-up:** How avoid duplicate URL ownership? **Related chapter:** 051–060/192/200.

## Q392 — What is a safe strategy for changing persistent local data schemas?
**Expected answer:** Versioned forward migrations, idempotent steps, backup/rollback semantics where appropriate, old-app compatibility, test real historical states and never assume reinstall. **Reasoning:** installed storage outlives code versions. **Common wrong answer:** Clear storage on schema error. **Follow-up:** How migrate encrypted credentials? **Related chapter:** 081–085/176–178/200.

## Q393 — How do you reason about failure domains in mobile architecture?
**Expected answer:** Separate device/app runtime, JS/native boundary, storage/network/backend/provider/store/release systems; design timeouts/retries/fallbacks so one failure does not corrupt unrelated state or create retry storms. **Reasoning:** reliability starts with boundaries. **Common wrong answer:** “The app” is one failure domain. **Follow-up:** What is failure isolation for push provider? **Related chapter:** 164/174–180/200.

## Q394 — How would you prevent retry storms from a mobile fleet?
**Expected answer:** Bounded exponential backoff with jitter, server Retry-After/rate limits, request dedup/idempotency, offline-aware queues and remote kill/feature controls. **Reasoning:** millions of clients amplify outages. **Common wrong answer:** Retry every second until success. **Follow-up:** How recover after backend outage? **Related chapter:** 071–080/176–180/200.

## Q395 — What mobile architecture decisions have the highest blast radius?
**Expected answer:** RN/toolchain versions, navigation/root composition, auth/security, persistent data, shared native SDKs, design system, observability, CI/signing/release and backend compatibility policy. **Reasoning:** prioritize governance where change propagates broadly. **Common wrong answer:** Button padding. **Follow-up:** Which deserve ADRs? **Related chapter:** 192/200.

## Q396 — How do you decide whether architecture standardization is working?
**Expected answer:** Lower setup/build/release/incident/upgrade cost, fewer incompatible dependencies, improved quality metrics and team adoption/satisfaction without excessive exception queues. **Reasoning:** standards must produce outcomes. **Common wrong answer:** Count policy documents. **Follow-up:** What signals over-standardization? **Related chapter:** 192/200.

## Q397 — What would you present in a mobile architecture review?
**Expected answer:** Goals/constraints, dependency and runtime boundaries, data/state/navigation/native contracts, security/privacy, failure modes, performance budgets, release/observability, migration plan and alternatives/trade-offs. **Reasoning:** architecture is decision evidence. **Common wrong answer:** Component hierarchy only. **Follow-up:** Which assumptions need validation spikes? **Related chapter:** 191–200.

## Q398 — How would you challenge a proposal to build a custom native framework layer?
**Expected answer:** Ask what measured problem existing RN/platform abstractions fail, ongoing Android/iOS/toolchain ownership cost, API stability, testing, staffing, migration and exit path; prototype the risky requirement first. **Reasoning:** custom infrastructure is permanent responsibility. **Common wrong answer:** Reject custom native code categorically. **Follow-up:** When is it justified? **Related chapter:** 194/199–200.

## Q399 — What is the staff engineer's role during a React Native production crisis?
**Expected answer:** Create shared technical model, prioritize evidence, coordinate product/platform/backend/native owners, control rollout/recovery, communicate risk clearly and ensure systemic follow-up—not personally type every fix. **Reasoning:** staff scope is alignment and system recovery. **Common wrong answer:** Take over all implementation. **Follow-up:** What do you communicate to leadership? **Related chapter:** 187/192/200.

## Q400 — What does staff-level React Native architecture optimize for?
**Expected answer:** Many teams shipping independently with reliable user experience, secure boundaries, measurable performance, reproducible builds/releases, compatible backend/native contracts, maintainable upgrades and controlled failure domains. **Reasoning:** optimize organizational throughput and platform health together. **Common wrong answer:** Maximum code sharing at any cost. **Follow-up:** Which metric would reveal architectural failure first? **Related chapter:** 200.
