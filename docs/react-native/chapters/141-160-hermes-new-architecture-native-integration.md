---
id: chapters-141-160
title: 141–160 — Hermes, New Architecture, JSI, Fabric, TurboModules & Codegen
---

# 141 — Hermes V1

Hermes is the default JavaScript engine for React Native; RN 0.84 made Hermes V1 the default, and RN 0.86 continues that model. React Native bundles/couples a tested Hermes build rather than asking apps to choose an arbitrary engine version. Hermes is optimized for React Native startup, memory, debugging integration and modern runtime behavior.

```text
Metro/Babel output
      ↓
Hermes compile/load/runtime
      ↓
JavaScript execution
      ↓ JSI
React Native C++ / platform systems
```

Do not independently upgrade an embedded Hermes artifact unless the RN release explicitly supports that configuration.

# 142 — Hermes Compilation, Startup and Source Maps

Production builds transform/bundle JavaScript and prepare it for Hermes execution; exact bytecode/compiler packaging is controlled by React Native build tooling. Startup cost includes native process initialization, runtime creation, bundle loading/evaluation, module initialization and first render. Source maps connect optimized/bundled stack locations back to TypeScript/JavaScript sources and must be uploaded to crash tooling for actionable production traces.

# 143 — Hermes Memory and Garbage Collection

Hermes manages JavaScript heap memory independently from native allocations. A “memory leak” may be retained JS objects, native views/resources, decoded images, C++ objects reachable through JSI, or all of them. GC can reclaim unreachable JavaScript; it cannot release a native resource whose lifetime is still owned by a retained native/JSI object. Profile both sides.

# 144 — Why the Architecture Changed

The legacy bridge serialized/batched messages between JavaScript and native systems and constrained synchronous access, renderer scheduling and type-safe native interfaces. The New Architecture replaces those foundational assumptions with C++ runtime interfaces (JSI), Fabric, TurboModules and Codegen, enabling direct references/calls, modern React scheduling and better native integration.

```text
Legacy: JS → serialized async Bridge → native
Modern: JS ↔ JSI/C++ interfaces ↔ native
```

The goal is not “everything is synchronous”; the goal is a more capable architecture where sync/async/threading choices can match the API.

# 145 — New Architecture Status in RN 0.86

RN 0.82 became New-Architecture-only. In RN 0.86, iOS setup forces Fabric and New Architecture on; attempts to opt out are warned as unsupported. Legacy code continues to be removed. New projects should therefore build native modules/components against TurboModule/Fabric/Codegen mechanisms and treat bridge-only tutorials as migration history.

# 146 — JSI Mental Model

JSI (JavaScript Interface) is a C++ API abstracting interaction with a JavaScript runtime. It lets native/C++ code expose functions/objects and hold runtime-level references without routing every interaction through JSON-like bridge serialization.

```text
Hermes runtime
   ↕ JSI values/functions/objects
C++ integration
   ↕
Kotlin/JNI or ObjC++/Swift/native systems
```

JSI is infrastructure used by React Native and advanced libraries; app developers normally use higher-level TurboModule/Fabric APIs rather than writing raw host objects for ordinary features.

# 147 — JSI Host Functions, Host Objects and Lifetime

A host function exposes native-backed callable behavior into JS; a host object can expose native-backed properties/operations. The hard problems are ownership, runtime lifetime, thread affinity and exception boundaries. Never capture a runtime reference and use it later from an arbitrary thread. Library authors must follow the invocation/scheduling contract provided by React Native rather than treating JSI as a thread-safe global bridge.

# 148 — Fabric Renderer Overview

Fabric is React Native's modern renderer. React reconciliation creates renderer work that produces immutable shadow-tree revisions. Yoga computes layout. Commit prepares a new tree revision; mount translates the committed difference into native view mutations.

```text
React render
   ↓
Fabric Shadow Nodes
   ↓ Yoga layout
Shadow Tree commit
   ↓ diff / mount instructions
Native view hierarchy
```

The shadow tree is not the platform view tree: it is renderer-side data describing the UI.

# 149 — Render, Commit and Mount

**Render** builds/reconciles the React/Fabric representation. **Commit** finalizes a consistent shadow-tree revision and layout. **Mount** applies required native mutations. Keeping these conceptual phases separate explains why React rendering work and actual platform view updates are related but not identical, and why measuring one “render duration” may not reveal native mount/layout cost.

# 150 — Shadow Nodes, Yoga and View Flattening

Shadow nodes hold props/layout/event/emitter relationships used by Fabric. Yoga computes flexbox layout on the shadow tree. View flattening can avoid creating native platform views for layout-only abstractions where safe, reducing hierarchy depth and mount/layout overhead. Do not assume every `<View>` in JSX always equals one persistent UIKit/Android view.

# 151 — Fabric Threading and Synchronous Layout

Modern RN scheduling is more nuanced than “JS thread vs UI thread.” Renderer work can involve JavaScript execution, C++ scheduling/commit work and platform main-thread mounting depending on operation. The architecture enables synchronous layout reads/effects where required for polished interactions while still scheduling expensive work appropriately. Never infer thread affinity from API syntax alone; use documented contracts.

# 152 — TurboModules

TurboModules are the current native-module system. A typed spec declares the JS-facing contract; Codegen creates platform interfaces/glue; native implementation fulfills that contract. Modules can be loaded lazily instead of all being eagerly initialized at startup.

```text
TypeScript spec
   ↓ Codegen
Generated contract/glue
   ↓
Android implementation / iOS implementation
   ↓ JSI/TurboModule system
JavaScript consumer
```

# 153 — TurboModule Sync, Async and Events

Choose synchronous methods only for genuinely fast, deterministic operations because a sync native call can block the caller/runtime path. Use promises/callback-compatible generated forms for I/O and long work. Events need explicit subscription/lifecycle semantics; unsubscribe when listeners are no longer required. Avoid returning giant native data structures synchronously simply because JSI makes direct calls possible.

# 154 — Codegen

Codegen reads supported TypeScript/Flow specs and generates strongly typed native interfaces used by TurboModules and Fabric components. It is integrated with Gradle and CocoaPods/build tooling. Specs are constrained intentionally: not every arbitrary TypeScript type can map safely to multiple native languages/runtimes. Keep specs simple, stable and platform-neutral where possible.

# 155 — TurboModule DeviceInfo Example

A minimal conceptual spec might expose a small native value and async operation:

```ts
import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';

export interface Spec extends TurboModule {
  getDeviceModel(): string;
  getFreeDiskBytes(): Promise<number>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('DeviceInfoModule');
```

Codegen creates the required platform contracts. Android then implements the generated Kotlin/Java-compatible base/interface; iOS implements the generated protocol/base through the currently supported Objective-C++/Swift integration. Keep the public TS wrapper narrower than the generated raw module if normalization/error handling is needed.

# 156 — Native Module Errors, Events and Testing

Translate native failures into stable JS error codes/messages without leaking platform-specific exception text as the product contract. Emit events only for truly push-based native state; query current state separately to avoid missed-event races. Test the TypeScript adapter independently, native implementation unit tests where valuable, and one integration path on both platforms because registration/Codegen failures are build/runtime integration failures.

# 157 — Fabric Native Components

A Fabric native component begins with a typed native-component spec describing props/events/commands. Codegen generates renderer descriptors/interfaces. Android supplies a native view/view manager implementation and iOS supplies the supported native view/component implementation. The renderer owns lifecycle and prop updates; direct imperative commands should be reserved for operations that cannot be modeled declaratively.

# 158 — NativeRatingView Example

Model rating as a prop plus change event, with a command only if there is a true imperative action such as focusing a custom control.

```text
React props
   ↓ Codegen-generated component contract
Fabric component descriptor
   ↓
Android Rating view     iOS native rating view
   ↑ event emitter
React onChangeRating
```

Measurement must cooperate with Fabric/Yoga rather than mutating size behind React's knowledge. Accessibility should expose role/value/adjustable behavior appropriate to each platform.

# 159 — Autolinking Deep Dive

Community CLI discovers React Native dependencies and their platform metadata, then React Native's Gradle settings/app plugins and CocoaPods `use_native_modules!` integrate discovered native packages. `npx react-native config` shows the resolved model. Troubleshoot by checking: package installation → CLI discovery → platform config → generated/native build integration → runtime registration. Manual linking is the exception for custom/nonstandard packages.

# 160 — React Native DevTools and Native Debugging Boundary

React Native DevTools targets modern RN JavaScript/React/runtime inspection, console, network and performance tooling. Android Studio/Logcat/debugger handles Android native failures; Xcode/LLDB handles iOS native failures. A production engineer routes symptoms correctly:

```text
JS exception/render issue → RN DevTools/source maps
Android crash/ANR       → Logcat + native stack/profilers
_iOS crash/watchdog_    → Xcode/Organizer/Instruments
bundle/resolution       → Metro
build/link/signing      → Gradle or Xcode/CocoaPods
```