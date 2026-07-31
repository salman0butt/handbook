---
id: new-architecture-coverage
title: New Architecture Coverage Audit
---

# New Architecture Coverage Audit

**Baseline: React Native 0.86.** New Architecture is the supported/current architecture; React Native 0.82 made it the only architecture path. Legacy Bridge material is historical/migration knowledge only.

| Area | Status | Handbook location |
| --- | --- | --- |
| Why architecture changed | Covered in depth | 144–145 |
| JSI | Covered in depth | 146–147 |
| JavaScript-engine abstraction | Covered | 141–147 |
| Host functions / host objects | Covered | 147 |
| Fabric renderer | Covered in depth | 148–151 |
| Shadow Tree / Shadow Nodes | Covered in depth | 148–150 |
| Yoga layout | Covered | layout chapters + 148–150 |
| Render / commit / mount | Covered in depth | 149 |
| View flattening | Covered | 150 |
| Scheduling / threading | Covered in depth | 151, 198 |
| TurboModules | Covered in depth | 152–156 |
| Lazy native-module loading | Covered | 152 |
| Sync / async native methods | Covered | 153 |
| Native module events/lifecycle | Covered | 153, 156 |
| Codegen | Covered in depth | 154–158 |
| TypeScript/Flow specs | Covered | 154–158 |
| Android generated contracts | Covered | 154–156 |
| iOS generated contracts | Covered | 154–158 |
| Native components | Covered in depth | 157–158 |
| Component props/events/commands | Covered | 157–158 |
| Measurement/layout contract | Covered | 158 |
| C++ role | Covered | 141–159, 198 |
| Event delivery | Covered | native module/component and internals sections |
| Memory/lifetime | Covered | 143, 147, 170 |
| Legacy migration | Covered | 195–196 |

## Current architecture mental model

```text
TypeScript / React 19.2.3
          ↓
React reconciliation / scheduling
          ↓
Fabric renderer → Shadow Tree → Yoga → commit → mount
          ↕
         JSI / C++ runtime interfaces
          ↕
TurboModules + Codegen      Fabric native components + Codegen
          ↕                              ↕
Android Kotlin/Java/JNI     iOS Swift/Objective-C++/native views
          ↓                              ↓
              platform application
```

This is intentionally not summarized as “JS thread → Bridge → native thread.” Modern React Native still has platform UI-thread constraints and JavaScript-runtime execution, but renderer scheduling, JSI/C++ integration, native queues and mount work form a more nuanced system.

## Legacy status

Bridge, BatchedBridge, legacy `NativeModules` and old UIManager concepts remain in the handbook only so engineers can understand older codebases, migrate libraries and interpret historical debugging material. New RN 0.86 work should use the supported TurboModule/Fabric/Codegen path.
