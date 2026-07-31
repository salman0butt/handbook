---
id: ios-coverage
title: iOS Coverage Audit
---

# iOS Coverage Audit

**RN 0.86 baseline:** iOS deployment target 15.1; current RN CocoaPods helpers require Xcode 16.1 minimum and recommend a current supported Xcode. Use the repository Gemfile/Bundler to keep CocoaPods tooling reproducible.

| iOS topic | Status | Handbook location |
| --- | --- | --- |
| macOS requirement for native iOS builds | Covered | environment/CI |
| Xcode | Covered in depth | environment + 131–135 |
| Command Line Tools | Covered | environment |
| Simulator | Covered | environment/iOS/testing |
| Physical device | Covered | environment/iOS |
| `.xcodeproj` vs `.xcworkspace` | Covered | 131–135/CocoaPods |
| targets | Covered | iOS project |
| schemes | Covered in depth | 183/iOS project |
| build configurations | Covered in depth | 182–185 |
| CocoaPods | Covered in depth | 131–135 |
| Podfile / pod install | Covered | iOS/CocoaPods |
| Bundler / `bundle exec pod install` | Covered | environment/CocoaPods/CI |
| Info.plist | Covered | iOS/permissions/configuration |
| AppDelegate | Covered | iOS/startup/brownfield |
| Swift | Covered | native modules/components |
| Objective-C / Objective-C++ interop | Covered | New Architecture/native integration |
| capabilities / entitlements | Covered | iOS/deep links/push/security |
| permissions usage descriptions | Covered | 097–105 |
| URL schemes | Covered | deep linking/auth |
| Universal Links / Associated Domains | Covered | deep linking/incidents |
| certificates / provisioning profiles | Covered | iOS release |
| bundle IDs | Covered | variants/releases |
| archive / Organizer | Covered | 184/iOS release |
| TestFlight | Covered | 184 |
| App Store Connect / review | Covered | 184 |
| LLDB / native crash debugging | Covered | 160–164 |
| Instruments | Covered | performance/memory |
| dSYMs / symbolication | Covered | debugging/observability |
| native modules / Codegen | Covered | 152–159 |
| Fabric native components | Covered | 157–158 |

## Build mental model

```text
TypeScript / assets
      ↓ Metro / Hermes bundle work
Xcode target + CocoaPods native dependency graph
      ↓
Swift / Objective-C / Objective-C++ / C++ + resources + entitlements
      ↓
scheme + build configuration + signing
      ↓
app/archive → App Store Connect → TestFlight / App Store
```

The workspace, Podfile, entitlements, capabilities, bundle identifiers, signing settings and AppDelegate/native sources are production application code/configuration—not opaque generated output.
