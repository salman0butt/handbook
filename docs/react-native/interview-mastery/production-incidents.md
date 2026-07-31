---
id: production-incidents
title: Production Incident Exercises
---

# Production Incident Exercises

Use the same investigation loop every time:

```text
observe → reproduce → isolate JS/native/platform → inspect logs
       → formulate falsifiable hypothesis → test → fix → validate → prevent recurrence
```

Candidates should name the exact evidence they want before proposing a fix.

## Incident 1 — Android works in debug but crashes in release

**Observe:** crash begins after a new release; debug remains healthy. **Reproduce:** install the exact signed release variant on an affected device. **Isolate:** startup before/after JS root, R8/minification, environment config, native SDK initialization. **Inspect:** Logcat/Play crash stack, version/build, R8 mapping/native symbols. **Hypotheses:** class removed/renamed by R8; release-only config missing; native SDK fails under release init. **Test:** disable one factor on a controlled branch, deobfuscate stack, inspect generated config. **Fix:** supported keep rule/config/library update, not blanket minification disable unless temporary. **Validate:** release build + affected OS/device + rollout canary. **Prevent:** CI release build/smoke, mapping upload and dependency regression test.

## Incident 2 — iOS builds locally but fails CI

**Observe:** developer archive succeeds; CI compile/pod/sign step fails. **Reproduce:** compare exact Xcode/Ruby/Bundler/Pods/Node lock/toolchain and scheme. **Isolate:** dependency install vs compile vs signing. **Inspect:** CI job log, `Podfile.lock`, Gemfile.lock, selected Xcode, provisioning identity, workspace/scheme. **Hypotheses:** CI Xcode mismatch; unpinned CocoaPods; missing private credential/capability; wrong scheme. **Test:** pin toolchain and run clean archive. **Fix:** project-controlled Bundler/Xcode image/signing config. **Validate:** fresh runner. **Prevent:** toolchain manifest plus scheduled image-upgrade compatibility jobs.

## Incident 3 — FlatList drops frames on low-end Android

**Observe:** scroll jank appears on media-heavy feed only on lower-tier devices. **Reproduce:** release build with production-like rows/network/cache. **Isolate:** JS render, native layout/mount, image decode, memory/GC. **Inspect:** RN/native performance traces, row render counts, image dimensions, frame timings. **Hypotheses:** oversized images; heavy row render; too-large window; synchronous JS work. **Test:** resize images, isolate row, alter one list setting at a time. **Fix:** measured bottleneck—CDN sizing, row ownership, virtualization tuning, deferred work. **Validate:** frame metrics across target tiers. **Prevent:** feed performance budget and representative-device test.

## Incident 4 — Hermes crash only in production

**Observe:** fatal runtime/native trace tied to Hermes after deployment. **Reproduce:** exact bundle/build, device/OS and user path. **Isolate:** JS exception vs Hermes/native integration vs corrupted/incompatible OTA bundle. **Inspect:** symbolicated native crash, Hermes source map, binary and OTA runtime IDs. **Hypotheses:** incompatible OTA calls native API absent from binary; library JSI lifetime bug; optimized code exposes invalid assumption. **Test:** roll back OTA for cohort, reproduce without suspect library, compare runtime compatibility. **Fix:** compatible bundle/native library lifecycle change. **Validate:** exact production artifact. **Prevent:** OTA runtime gates, native integration tests and artifact provenance.

## Incident 5 — Deep links work on Android but not iOS

**Observe:** verified Android App Link routes correctly; iOS Universal Link opens browser/app home. **Reproduce:** real iPhone, installed production-like build, exact HTTPS link. **Isolate:** association domain/capability vs native delivery vs navigation parsing. **Inspect:** Associated Domains entitlement, AASA response/path rules, signing team/bundle ID, app logs. **Hypotheses:** entitlement missing in Release; AASA mismatch/cache; route not handled at bootstrap. **Test:** verify domain file and signed entitlements, launch via link with clean install. **Fix:** correct associated domain/AASA/native integration and intent queue. **Validate:** cold/warm/background states. **Prevent:** pre-release link matrix for every environment.

## Incident 6 — Push notification opens the wrong screen

**Observe:** tap sometimes routes to stale order or duplicates navigation. **Reproduce:** foreground/background/killed states with known payload IDs. **Isolate:** payload generation, native tap event, initial notification, navigation readiness/dedup. **Inspect:** correlation ID, payload, event timestamps, route intent consumption. **Hypotheses:** old closure uses stale ID; both initial and event callback process same notification; unvalidated fallback route. **Test:** log typed intent creation/consumption, force killed-state sequence. **Fix:** one validated route-intent pipeline with dedupe and readiness queue. **Validate:** state matrix on both platforms. **Prevent:** push contract tests and idempotent navigation handler.

## Incident 7 — CocoaPods update breaks build

**Observe:** `pod install/update` changes graph and compilation fails. **Reproduce:** clean checkout with lockfile then controlled update. **Isolate:** deployment target, pod version constraints, module/header settings, RN compatibility. **Inspect:** resolver error/compile log, Podfile.lock diff, podspec requirements. **Hypotheses:** transitive pod raised deployment target; incompatible major SDK; stale repo not primary unless resolver says so. **Test:** narrow update or pin supported version and clean DerivedData only when relevant. **Fix:** compatible dependency set / target change justified by product policy. **Validate:** simulator + device/archive. **Prevent:** lockfiles, Renovate-like controlled PRs and native build CI.

## Incident 8 — Gradle conflict after installing native package

**Observe:** dependency resolution or duplicate class error. **Reproduce:** affected variant from clean Gradle state. **Isolate:** plugin config vs Maven dependency graph vs resource/manifest merge. **Inspect:** Gradle dependency insight, exact modules/versions, manifest merger if applicable. **Hypotheses:** two SDKs require incompatible transitive versions; package expects different AGP/Kotlin/RN baseline. **Test:** supported aligned version/exclusion with compile/runtime tests. **Fix:** upgrade/downgrade package or explicit compatible constraint. **Validate:** all flavors, debug/release, R8. **Prevent:** native dependency admission/compatibility matrix.

## Incident 9 — Memory keeps increasing after navigation

**Observe:** repeated open/close screen grows resident memory and eventually OOMs. **Reproduce:** scripted navigation loop with stable data. **Isolate:** JS heap vs native images/views/C++/SDK resources. **Inspect:** Hermes heap/React ownership, Android Studio or Instruments allocations, listeners/timers/subscriptions, image cache. **Hypotheses:** retained event callback closes over screen; native camera/player not released; huge images retained. **Test:** remove one resource class and compare steady-state curve. **Fix:** lifecycle cleanup/ownership boundary/cache policy. **Validate:** memory returns toward plateau after many loops. **Prevent:** resource wrapper tests and memory regression scenario.

## Incident 10 — RN upgrade breaks multiple native modules

**Observe:** compile/codegen/runtime failures after RN minor upgrade. **Reproduce:** inventory failures by package/platform on upgrade branch. **Isolate:** template/toolchain changes, New Architecture API, codegen specs, third-party compatibility. **Inspect:** release notes, Upgrade Helper/template diff, library support matrices/issues, Gradle/Pod compile logs. **Hypotheses:** library supports old RN only; manual native customization lost; toolchain pin incompatible. **Test:** update one dependency/integration at a time. **Fix:** supported library versions/migrations or replace abandoned dependency. **Validate:** critical native feature matrix + release builds/performance. **Prevent:** regular RN cadence and SDK governance.

## Incident 11 — Android ANR after analytics SDK rollout

**Observe:** ANRs rise only in new release, concentrated at startup. **Reproduce:** cold start on slow device/network. **Isolate:** main-thread native initialization. **Inspect:** ANR traces, startup spans, SDK changelog. **Hypothesis:** SDK performs blocking disk/network work on main thread. **Test:** defer/disable SDK initialization. **Fix:** async/deferred supported initialization or SDK replacement. **Validate:** startup/ANR cohort metrics. **Prevent:** startup budget for every shared SDK.

## Incident 12 — iOS watchdog terminations after adding database migration

**Observe:** app is terminated during launch after update for users with large old databases. **Reproduce:** restore realistic historical database and launch release build. **Isolate:** migration duration and main-thread/blocking startup. **Inspect:** termination reason, Instruments/time profile, migration logs. **Hypothesis:** synchronous schema/data rewrite exceeds launch responsiveness. **Test:** measure by database size and move/decompose allowed work. **Fix:** bounded/versioned migration strategy with progress/deferred work where data model permits. **Validate:** worst supported dataset. **Prevent:** migration benchmarks using historical snapshots.

## Interview requirement

A strong response never starts with “clear caches/reinstall everything.” Cache cleaning can be a controlled experiment for a demonstrated stale-artifact problem, but production debugging should preserve evidence and classify the failure domain first.
