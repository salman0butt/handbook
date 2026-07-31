---
id: official-docs-coverage
title: Official React Native Documentation Coverage
---

# Official React Native Documentation Coverage

**Audit date: July 31, 2026 · Production baseline: React Native 0.86.** The current React Native docs and 0.86 release/support material are the authority; upcoming 0.87 behavior is not promoted to stable teaching.

| Official topic | Handbook location | Status |
| --- | --- | --- |
| Introduction / React Native mental model | intro, 001–005 | Covered in depth |
| Get Started Without a Framework / Community CLI | 006–010, version baseline, CLI audit | Covered in depth |
| Environment setup | 001–010, version baseline | Covered in depth |
| Core Components | 011–025, core API audit | Covered in depth |
| Core APIs | component/API chapters + reference/core-api-coverage | Covered in depth |
| JSX / TypeScript | 026–030 | Covered in depth |
| Style / layout / Flexbox | 031–040 | Covered in depth |
| Handling touches / events | 041–044 | Covered |
| State / React hooks / effects | 045–050 + hooks audit | Covered in depth |
| Navigation ecosystem | 051–060 | Covered in depth |
| Lists / virtualization | 061–067 | Covered in depth |
| Forms / keyboard | 068–070, 101–105 | Covered in depth |
| Networking | 071–077 | Covered in depth |
| Server state / caching | 078–080 | Covered in depth |
| Storage / local data | 081–085 | Covered in depth |
| Authentication / mobile security | 086–093, 188 | Covered in depth |
| Deep linking | 091–096 | Covered in depth |
| Permissions / device APIs | 097–105 | Covered in depth |
| Animated / animation guidance | 106–110 | Covered |
| Gesture ecosystem | 106–110 | Covered |
| Accessibility | 111–115, 181 | Covered in depth |
| Platform-specific code | 116–120 | Covered in depth |
| Android native project | 121–130 + Android audit | Covered in depth |
| iOS native project | 131–135 + iOS audit | Covered in depth |
| CocoaPods / Gradle | 121–135 | Covered in depth |
| Metro | 136–140 | Covered in depth |
| Hermes | 141–143 | Covered in depth |
| New Architecture overview | 144–145 | Covered in depth |
| JSI | 146–147 | Covered in depth |
| Fabric / renderer | 148–151 | Covered in depth |
| TurboModules | 152–153, 155–156 | Covered in depth |
| Codegen | 154–158 | Covered in depth |
| Native Modules | 152–156 | Covered in depth |
| Native Components | 157–158 | Covered in depth |
| Autolinking | 159 | Covered in depth |
| React Native DevTools | 160–164 | Covered in depth |
| Debugging | 160–164 + production incidents | Covered in depth |
| Performance | 165–170 + case studies/interviews | Covered in depth |
| Memory | 143, 170–171 | Covered in depth |
| Images | 171 | Covered |
| Files / media | 172–173 | Covered |
| Push notifications | 174–175 | Covered in depth |
| Background execution | 176 | Covered |
| Offline-first | 177–178 | Covered in depth |
| Real-time applications | 179 | Covered |
| Jest / component testing | 180 | Covered |
| E2E / accessibility testing | 181 | Covered |
| App configuration | 182–183 | Covered in depth |
| Android/iOS release | 184 | Covered in depth |
| CI/CD | 185 | Covered in depth |
| OTA update constraints | 186 | Covered |
| Analytics / logging / crashes | 187 | Covered in depth |
| Security | 188 | Covered in depth |
| Internationalization / RTL | 189 | Covered |
| Monorepos / design systems | 190 | Covered |
| Application architecture | 191 | Covered in depth |
| Large-scale / team architecture | 192 | Covered in depth |
| Brownfield integration | 193 | Covered in depth |
| Library development | 194 | Covered in depth |
| Upgrading React Native | 195 | Covered in depth |
| Legacy architecture migration knowledge | 196 | Covered elsewhere / historical |
| Runtime initialization / internals | 197–198 | Covered in depth |
| Senior / staff design reasoning | 199–200 | Covered in depth |
| Release/version support policy | version baseline | Covered in depth |
| Projects | projects + capstone | Covered in depth |
| Practice / interviews | exercises, interview bank, mocks, live coding, incidents | Covered in depth |

## Ecosystem sources intentionally separated from React Native core

React Navigation, TanStack Query, React Hook Form, Zod, Reanimated, Gesture Handler, AsyncStorage/MMKV/secure-storage solutions and E2E tools evolve on their own schedules. The handbook teaches their production roles where appropriate but does not label third-party APIs as React Native core.

## Version-sensitive decisions captured by this audit

- React Native **0.86** is latest stable on this audit date; **0.87** is future, scheduled for August 10, 2026.
- React Native 0.86's official Community Template pins **React 19.2.3**.
- New Architecture is the supported/current architecture; legacy Bridge material is migration history.
- Core `SafeAreaView` is deprecated; `react-native-safe-area-context` is the recommended direction.
- Core `Clipboard` is removed and requires a community package.
- `InteractionManager` is deprecated; new code should use current scheduling primitives suited to the workload.
- JavaScriptCore is no longer the bundled normal fallback; deliberate JSC use requires the community-maintained package.

No major current documentation category is intentionally omitted; detailed status for Core APIs, hooks, Community CLI, New Architecture, Android and iOS is split into the dedicated reference audits.
