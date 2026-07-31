---
id: community-cli-coverage
title: React Native Community CLI Coverage Audit
---

# React Native Community CLI Coverage Audit

**Baseline:** React Native 0.86 Community Template pins `@react-native-community/cli` **20.1.0**. The CLI project releases independently from React Native; do not override a generated app's CLI packages merely to chase `latest`.

| Official CLI area | Status | Handbook location |
| --- | --- | --- |
| Compatibility | Covered in depth | version baseline, 006–010 |
| `init` | Covered in depth | intro, 006–010 |
| `start` | Covered | 006–010, Metro 136–140 |
| `run-android` | Covered | 006–010, Android 121–130 |
| `run-ios` | Covered | 006–010, iOS 131–135 |
| `build-android` / Android execution | Covered elsewhere | Android/build sections |
| `build-ios` / iOS execution | Covered elsewhere | iOS/build sections |
| `config` | Covered in depth | 006–010, autolinking 159 |
| `doctor` / environment diagnostics | Covered | environment/CLI and debugging |
| `clean` | Covered as targeted troubleshooting | CLI/debugging; never a substitute for diagnosis |
| `info` | Covered as diagnostics | CLI/debugging |
| `bundle` | Covered elsewhere | Metro/release pipeline |
| `codegen` | Covered elsewhere | 154–158 |
| Autolinking | Covered in depth | 159 |
| Configuration | Covered | CLI/autolinking/monorepo sections |
| Plugins | Covered conceptually | CLI architecture; advanced/custom CLI usage is library/platform territory |
| Platforms | Covered | Android/iOS execution plus CLI architecture |
| Metro integration | Covered in depth | 136–140 |
| Native dependency linking | Covered in depth | 159, Android/iOS/CocoaPods/Gradle |

## Project creation

For the React Native 0.86 production baseline the release guidance uses:

```bash
npx @react-native-community/cli@latest init MyProject --version latest
```

Inside a generated project, use its package scripts or the locally resolved CLI rather than installing the old global `react-native-cli` package.

Typical workflow:

```bash
npm start
npm run android
npm run ios
npx react-native doctor
npx react-native config
```

Exact scripts are the generated project's contract; teams may use npm, Yarn or another supported package manager consistently with the lockfile.

## Compatibility warning

The Community CLI README's public compatibility table currently documents CLI `^20.0.0` through React Native `^0.85.0`, while the official React Native 0.86 Community Template itself pins CLI `20.1.0`. That is why this handbook uses the generated 0.86 template as the concrete 0.86 compatibility evidence and does not infer that arbitrary future CLI 20.x releases are automatically safe for an existing app.

## Autolinking mental model

```text
installed package
      ↓
CLI dependency discovery / react-native config
      ↓
Android Gradle integration + iOS CocoaPods integration
      ↓
Codegen/native build where needed
      ↓
module/component present in application binary
```

A package being present in `node_modules` does not prove the native binary was configured successfully.
