---
id: exercises-intermediate-061-120
title: Exercises 061–120 — Intermediate
---

# Intermediate Exercises 061–120

## Exercise 61 — Typed Stack Params
**Problem:** Type Home and Details routes. **Expected:** Details requires `itemId`. **Hint:** route param list. **Solution:** define `type RootStackParamList={Home:undefined;Details:{itemId:string}}` and use navigator/screen types. **Explanation:** navigation is a typed contract. **Common mistake:** `navigate('Details' as any)`. **Alternative:** typed navigation hook aliases.

## Exercise 62 — Navigate by ID
**Problem:** Open product details from a row. **Expected:** only product ID travels in params. **Hint:** server state belongs elsewhere. **Solution:** `navigation.navigate('Details',{productId:item.id})`. **Explanation:** params express intent, not entity ownership. **Common mistake:** pass whole mutable product object. **Alternative:** immutable small snapshot only when offline routing requires it.

## Exercise 63 — Auth Route Groups
**Problem:** Show auth stack when logged out and app stack when logged in. **Expected:** protected screens unreachable while anonymous. **Hint:** conditional navigator tree. **Solution:** render route groups based on bootstrapped session state. **Explanation:** navigation structure encodes authorization UX. **Common mistake:** navigate away from protected screen but leave it reachable in history. **Alternative:** root reset after auth transition.

## Exercise 64 — Focus Refetch
**Problem:** Refresh profile when screen regains focus if stale. **Expected:** no unconditional request every focus. **Hint:** focus hook + freshness timestamp or query integration. **Solution:** call refetch only when cache policy says stale. **Explanation:** visibility and freshness are different concepts. **Common mistake:** fetch on every focus. **Alternative:** TanStack Query focus manager integration.

## Exercise 65 — Deep Link Parse
**Problem:** Parse `myapp://product/42`. **Expected:** validated product route intent. **Hint:** never trust string segments. **Solution:** parse URL, match known path, validate ID, return typed intent. **Explanation:** external links are untrusted input. **Common mistake:** direct navigation from arbitrary path. **Alternative:** React Navigation linking config plus validation adapter.

## Exercise 66 — Unknown Deep Link
**Problem:** Handle unsupported link. **Expected:** safe fallback, no crash. **Hint:** explicit default. **Solution:** return `NotFound`/home intent and record diagnostics. **Explanation:** external inputs evolve independently. **Common mistake:** non-null assertions on path params. **Alternative:** open web URL when product policy permits.

## Exercise 67 — Protected Deep Link
**Problem:** User opens protected item link while logged out. **Expected:** login then destination. **Hint:** store pending intent. **Solution:** parse/validate intent, keep it in auth bootstrap state, complete auth, re-authorize, navigate once. **Explanation:** links cannot bypass auth. **Common mistake:** navigate before session state resolves. **Alternative:** backend-generated short-lived handoff token where needed.

## Exercise 68 — Bottom Tab State
**Problem:** Preserve each tab's stack. **Expected:** switching tabs does not recreate all history. **Hint:** nested navigator. **Solution:** each tab owns its stack under bottom-tabs navigator. **Explanation:** navigator nesting models independent histories. **Common mistake:** one stack with tab-looking buttons. **Alternative:** product-specific single-stack architecture if history semantics demand it.

## Exercise 69 — Modal Navigation
**Problem:** Present edit screen modally. **Expected:** platform-appropriate modal transition and back/dismiss. **Hint:** stack presentation option. **Solution:** configure modal group/screen on native stack. **Explanation:** navigation modal is different from arbitrary in-tree overlay. **Common mistake:** global `Modal` for every screen flow. **Alternative:** core Modal for short local overlays.

## Exercise 70 — Navigation State Serialization
**Problem:** Decide whether params containing class instance are safe for restoration. **Expected:** reject non-serializable param. **Hint:** navigation state may persist/deep link. **Solution:** pass ID/primitive DTO. **Explanation:** serializable state is portable/debuggable. **Common mistake:** functions/classes in params. **Alternative:** dependency registry keyed by ID.

## Exercise 71 — FlatList Pagination Guard
**Problem:** `onEndReached` fires twice. **Expected:** one page request. **Hint:** check `hasNextPage` and `isFetchingNextPage`. **Solution:** guard handler before `fetchNextPage`. **Explanation:** scroll callbacks are not exactly-once events. **Common mistake:** rely on threshold alone. **Alternative:** explicit “Load more” control.

## Exercise 72 — Cursor Dedupe
**Problem:** Backend repeats one item across pages. **Expected:** one rendered entity. **Hint:** stable ID map. **Solution:** flatten pages then dedupe by ID while preserving first/server order. **Explanation:** distributed pagination can overlap. **Common mistake:** key warnings ignored. **Alternative:** backend fixes plus defensive client dedupe.

## Exercise 73 — Variable Row Performance
**Problem:** Rows have dynamic text heights. **Expected:** correct scroll behavior. **Hint:** do not fake `getItemLayout`. **Solution:** let list measure rows; optimize row work/images instead. **Explanation:** wrong geometry breaks virtualization operations. **Common mistake:** fixed estimated height passed as exact. **Alternative:** redesign rows to bounded heights if product allows.

## Exercise 74 — Fixed Row getItemLayout
**Problem:** 64px rows need scrollToIndex. **Expected:** O(1)-like offset calculation. **Hint:** include separator. **Solution:** `length=64+separator; offset=length*index`. **Explanation:** list can skip measuring preceding rows. **Common mistake:** forget separator height. **Alternative:** measured layout fallback.

## Exercise 75 — List Row Rerender
**Problem:** Every row rerenders when search input changes. **Expected:** unrelated visible rows remain stable. **Hint:** isolate search state and row props. **Solution:** move search input state above/beside list appropriately, pass stable item/action props, memoize row if profiling justifies. **Explanation:** state placement drives invalidation. **Common mistake:** `useCallback` everywhere without fixing changing context. **Alternative:** selector-based row subscription.

## Exercise 76 — Section Headers
**Problem:** Render grouped transactions with sticky month headers. **Expected:** correct groups. **Hint:** SectionList. **Solution:** derive `{title,data}` by month and configure section header. **Explanation:** grouped virtualization is built in. **Common mistake:** nested scroll views. **Alternative:** flat discriminated row list.

## Exercise 77 — Refresh Error
**Problem:** Pull refresh fails but cached feed exists. **Expected:** cached feed stays visible with non-blocking error. **Hint:** refetch state separate from data state. **Solution:** retain data, end refreshing indicator, show retry banner/toast. **Explanation:** transient refresh failure should not erase usable state. **Common mistake:** set data `[]`. **Alternative:** silent retry with visible stale timestamp.

## Exercise 78 — React Hook Form TextInput
**Problem:** Register RN TextInput with RHF. **Expected:** value/error tracked without manual form reducer. **Hint:** `Controller`. **Solution:** bind `value`, `onChangeText`, `onBlur` from field. **Explanation:** Controller adapts controlled native input. **Common mistake:** pass web `register` props directly to TextInput. **Alternative:** `useController` custom field.

## Exercise 79 — Zod Email Form
**Problem:** Validate email. **Expected:** invalid email error before submit. **Hint:** schema resolver/manual parse. **Solution:** Zod object with email rule integrated into RHF. **Explanation:** schema centralizes field shape. **Common mistake:** regex scattered across UI. **Alternative:** provider/domain-specific email rule.

## Exercise 80 — Server Field Error
**Problem:** API returns `email already used`. **Expected:** field shows server error. **Hint:** `setError`. **Solution:** map normalized server error code to email field. **Explanation:** client schema cannot know uniqueness. **Common mistake:** generic alert only. **Alternative:** form-level error if field mapping is unsafe.

## Exercise 81 — Scroll to First Error
**Problem:** Long form submit fails at hidden field. **Expected:** focus/scroll to first invalid input. **Hint:** refs + form error order. **Solution:** maintain field refs/layout positions, invoke focus/scroll after validation. **Explanation:** mobile error UX must reveal issue. **Common mistake:** error text below viewport only. **Alternative:** form library focus helpers.

## Exercise 82 — Password Visibility Toggle
**Problem:** Add show/hide password control. **Expected:** accessible toggle with state. **Hint:** Pressable + `secureTextEntry`. **Solution:** local boolean toggles masking, expose label/state. **Explanation:** visibility is presentation state. **Common mistake:** clear input on toggle. **Alternative:** platform password manager UI remains enabled.

## Exercise 83 — Form Submission Race
**Problem:** User taps Save three times. **Expected:** one request. **Hint:** mutation pending + server idempotency. **Solution:** disable while pending and send idempotency key for create operation. **Explanation:** UI guard alone cannot handle retries/process races. **Common mistake:** only debounce taps. **Alternative:** server dedupe by client operation ID.

## Exercise 84 — Fetch Timeout
**Problem:** Cancel request after 10s. **Expected:** timeout error distinct from manual cancellation. **Hint:** AbortController + timer. **Solution:** schedule abort, clear timer in finally, map timeout reason. **Explanation:** fetch has no universal implicit timeout policy. **Common mistake:** Promise.race without aborting underlying request. **Alternative:** API client timeout helper.

## Exercise 85 — 401 Refresh Queue
**Problem:** Five requests fail with expired token. **Expected:** one refresh, then retry waiting requests. **Hint:** shared refresh promise. **Solution:** auth client stores in-flight refresh promise; others await it; clear on completion. **Explanation:** prevents refresh stampede. **Common mistake:** each interceptor refreshes independently. **Alternative:** server session/cookie architecture where applicable.

## Exercise 86 — Retry Policy
**Problem:** Retry GET 500 but not 400 validation. **Expected:** bounded retry. **Hint:** classify errors. **Solution:** retry network/selected 5xx with exponential backoff/jitter, no retry for deterministic 4xx. **Explanation:** retry is semantic policy. **Common mistake:** retry every failure 3 times. **Alternative:** user-triggered retry.

## Exercise 87 — Abort Search Requests
**Problem:** Rapid query `c`, `ca`, `cat`. **Expected:** only latest results appear. **Hint:** abort prior request/debounce. **Solution:** debounce input and cancel prior fetch with AbortController. **Explanation:** avoids stale response races. **Common mistake:** only compare text after response while still wasting requests. **Alternative:** TanStack Query keyed queries with cancellation.

## Exercise 88 — Query Key Design
**Problem:** Cache users by page/filter. **Expected:** distinct caches. **Hint:** all result-changing inputs in key. **Solution:** `['users',{cursor,role,search}]` with stable serializable inputs. **Explanation:** key names server state. **Common mistake:** `['users']` for all filters. **Alternative:** key factory helper.

## Exercise 89 — staleTime Choice
**Problem:** Country list almost never changes. **Expected:** long freshness. **Hint:** product semantics. **Solution:** set long `staleTime`, perhaps persisted cache. **Explanation:** freshness is domain-specific. **Common mistake:** global 0 stale time causing refetches. **Alternative:** bundled static data if appropriate.

## Exercise 90 — Query Invalidation
**Problem:** Create task, list should refresh. **Expected:** relevant task-list queries stale/refetch. **Hint:** invalidate by key scope. **Solution:** on mutation success invalidate `['tasks', workspaceId]`. **Explanation:** mutation affects server truth. **Common mistake:** clear entire query cache. **Alternative:** insert server response directly into cache then selective invalidate.

## Exercise 91 — Optimistic Like
**Problem:** Like post instantly then rollback failure. **Expected:** UI fast and consistent. **Hint:** snapshot previous cache. **Solution:** cancel relevant query, snapshot, patch liked/count, rollback on error, reconcile/invalidate on settle. **Explanation:** optimism is speculative state. **Common mistake:** no rollback. **Alternative:** pessimistic update for high-risk actions.

## Exercise 92 — Infinite Query Next Page
**Problem:** Load feed pages from cursor. **Expected:** next cursor drives subsequent request. **Hint:** `getNextPageParam`. **Solution:** return API `nextCursor` or undefined. **Explanation:** cursor belongs to server pagination contract. **Common mistake:** derive cursor from array index. **Alternative:** offset pagination if server only supports it.

## Exercise 93 — AppState Query Focus
**Problem:** Refetch stale queries when app becomes active. **Expected:** no constant polling in background. **Hint:** connect AppState to focus manager/current library guidance. **Solution:** update focus state on active/inactive. **Explanation:** mobile focus differs from browser window focus. **Common mistake:** interval continues blindly in background. **Alternative:** explicit per-feature resume refetch.

## Exercise 94 — Query Persistence
**Problem:** Show last profile offline after restart. **Expected:** persisted cache hydrates then revalidates when online. **Hint:** compatible persistence adapter. **Solution:** persist bounded query cache with version/buster and secure-data policy. **Explanation:** persisted cache is a snapshot, not authority. **Common mistake:** persist tokens/sensitive cache indiscriminately. **Alternative:** domain database.

## Exercise 95 — NetInfo Banner
**Problem:** Show offline banner. **Expected:** connectivity changes reflected. **Hint:** maintained NetInfo library. **Solution:** subscribe via library hook/API, render semantic status. **Explanation:** network signal improves UX but does not guarantee API reachability. **Common mistake:** skip request errors when “online”. **Alternative:** API health state.

## Exercise 96 — AsyncStorage Versioning
**Problem:** persisted settings schema changes. **Expected:** old data migrates. **Hint:** version field. **Solution:** store `{version:2,data...}`, migrate v1 or fallback safely. **Explanation:** local data outlives code versions. **Common mistake:** cast old JSON to new type. **Alternative:** separate migration functions tested independently.

## Exercise 97 — MMKV Decision
**Problem:** choose MMKV for 5 MB JSON blob read on startup. **Expected:** question design, not blindly adopt. **Hint:** synchronous work can block. **Solution:** benchmark; likely normalize/split data or use DB rather than huge sync deserialize. **Explanation:** fast storage API does not erase parse cost. **Common mistake:** “synchronous is always faster UX”. **Alternative:** async hydration + cached summary.

## Exercise 98 — SQLite Schema
**Problem:** notes with tags need searchable persistence. **Expected:** relational schema. **Hint:** notes, tags, join table/index. **Solution:** define normalized tables and indexes for query path. **Explanation:** structured data benefits from database semantics. **Common mistake:** one giant JSON value. **Alternative:** FTS extension/library if current stack supports it.

## Exercise 99 — Secure Credential Adapter
**Problem:** isolate keychain library from app. **Expected:** `CredentialStore` interface. **Hint:** platform adapter. **Solution:** expose `getRefreshToken/setRefreshToken/clear` behind one module. **Explanation:** vendor/native API stays at boundary. **Common mistake:** import keychain library from every feature. **Alternative:** auth service owns adapter directly.

## Exercise 100 — Logout Cleanup
**Problem:** logout should remove sensitive state. **Expected:** credential cleared, query cache reset/sensitive entries removed, stores reset, nav replaced. **Hint:** orchestrated use case. **Solution:** auth logout service performs server revoke best-effort then local teardown. **Explanation:** logout crosses state owners. **Common mistake:** `navigate('Login')` only. **Alternative:** app root reacts to anonymous state.

## Exercise 101 — Custom Scheme Callback
**Problem:** handle `myapp://oauth/callback?code=...&state=...`. **Expected:** validate path/state before exchange. **Hint:** parse URL. **Solution:** compare callback state to stored request state then pass code to auth client. **Explanation:** callback is untrusted. **Common mistake:** exchange any incoming code. **Alternative:** universal/app link callback.

## Exercise 102 — Android App Link Test
**Problem:** test an HTTPS deep link on connected Android device. **Expected:** app route opens if verified/configured. **Hint:** adb VIEW intent. **Solution:** invoke `adb shell am start -W -a android.intent.action.VIEW -d 'https://...'`. **Explanation:** isolates OS routing from app UI. **Common mistake:** only tap links from one messaging app. **Alternative:** Android Studio App Links tooling.

## Exercise 103 — iOS Universal Link Config Review
**Problem:** link fails only on iOS. **Expected:** inspect Associated Domains + AASA + bundle/team IDs. **Hint:** association is signed/configured. **Solution:** verify entitlement, domain file paths/content, installed build identity and device logs. **Explanation:** JS routing can be correct while OS association fails. **Common mistake:** change React Navigation first. **Alternative:** custom scheme as debugging control, not production fix.

## Exercise 104 — Camera Permission State
**Problem:** camera denied then blocked. **Expected:** request only when possible; Settings CTA when blocked. **Hint:** permission library state model. **Solution:** branch on not-determined/denied/blocked/granted and render appropriate UX. **Explanation:** permission states have different next actions. **Common mistake:** request repeatedly on every render. **Alternative:** manual upload flow.

## Exercise 105 — Location Optionality
**Problem:** weather app asks for location. **Expected:** app works without permission. **Hint:** manual city search. **Solution:** present location shortcut plus search fallback. **Explanation:** permissions should not be unnecessary gates. **Common mistake:** blank app on denial. **Alternative:** approximate coarse location if product/legal context supports.

## Exercise 106 — Clipboard Migration
**Problem:** old tutorial imports Clipboard from core. **Expected:** identify outdated API. **Hint:** core coverage audit. **Solution:** use current community replacement package after compatibility review. **Explanation:** Lean Core moved APIs out. **Common mistake:** copy historical import. **Alternative:** platform-specific native module only if package unsuitable.

## Exercise 107 — Share Result Differences
**Problem:** analytics assumes share “success” means content posted. **Expected:** fix assumption. **Hint:** OS share sheets expose limited outcome semantics. **Solution:** log share sheet opened/completed only according to documented platform result, not recipient delivery. **Explanation:** external apps own final action. **Common mistake:** treat API resolution as confirmed post. **Alternative:** server-side share links with click analytics.

## Exercise 108 — AppState Socket Pause
**Problem:** socket reconnect loop continues while backgrounded. **Expected:** pause/release and reconnect on active. **Hint:** lifecycle policy. **Solution:** socket manager observes AppState, closes/suppresses retries in background, resyncs on active. **Explanation:** mobile background is constrained. **Common mistake:** assume infinite JS execution. **Alternative:** native background capability only for justified use case.

## Exercise 109 — KeyboardAvoidingView Screen
**Problem:** submit button hidden by keyboard. **Expected:** usable on iOS/Android. **Hint:** combine scroll + avoidance/insets. **Solution:** test behavior mode per platform and ensure content scrolls to button. **Explanation:** keyboard affects layout differently. **Common mistake:** fixed 300px bottom padding. **Alternative:** keyboard-aware scroll library after current compatibility review.

## Exercise 110 — Gesture Tap vs Scroll
**Problem:** card tap fires while user scrolls list. **Expected:** recognizer cancels tap after movement. **Hint:** use Pressable/native gesture semantics. **Solution:** avoid custom raw touch logic; configure gesture thresholds if using GH. **Explanation:** touch sequences can become scrolls. **Common mistake:** `onTouchEnd` as click. **Alternative:** Tap gesture recognizer.

## Exercise 111 — Pan Swipe Dismiss
**Problem:** swipe card away after threshold. **Expected:** follows finger then settles/dismisses. **Hint:** pan translation + velocity. **Solution:** shared value updates on pan; on end choose spring-back or exit based on threshold. **Explanation:** continuous gesture + state transition. **Common mistake:** React setState every frame. **Alternative:** core Animated/PanResponder for simple case after profiling.

## Exercise 112 — Simultaneous Pinch/Pan
**Problem:** image viewer supports zoom and pan. **Expected:** gestures compose. **Hint:** Gesture Handler composition. **Solution:** combine pinch and pan simultaneous where current API supports; clamp transforms. **Explanation:** recognizer relationships are explicit. **Common mistake:** two independent handlers fighting. **Alternative:** maintained zoom-view library.

## Exercise 113 — Accessibility State
**Problem:** custom checkbox is checked. **Expected:** TalkBack/VoiceOver announces state. **Hint:** role/state. **Solution:** Pressable with checkbox role and `accessibilityState={{checked}}`. **Explanation:** visual tick is not semantic. **Common mistake:** label contains “checked” manually but state missing. **Alternative:** native Switch if behavior matches.

## Exercise 114 — Accessible Error
**Problem:** form error appears after submit. **Expected:** screen-reader user learns about it. **Hint:** focus/announcement semantics. **Solution:** render associated error, focus first invalid field and use appropriate live/announcement mechanism per current API/platform. **Explanation:** dynamic errors need discoverability. **Common mistake:** red border only. **Alternative:** summary at top plus field errors.

## Exercise 115 — RTL Row
**Problem:** settings row has label and chevron. **Expected:** correct layout/icon direction in RTL. **Hint:** start/end semantics and icon review. **Solution:** use flex layout/logical positioning and mirrored directional icon where appropriate. **Explanation:** RTL is semantic direction, not simply `scaleX:-1` whole screen. **Common mistake:** hard-coded `left/right`. **Alternative:** platform/design-system row component.

## Exercise 116 — Native Dependency Checklist
**Problem:** evaluate camera package. **Expected:** documented decision. **Hint:** maintenance, RN 0.86/New Arch, Android/iOS config, permissions, binary/startup, license, tests. **Solution:** score against requirements and test in sample branch. **Explanation:** native package is supply-chain/build commitment. **Common mistake:** choose by GitHub stars only. **Alternative:** build minimal native adapter if requirements justify ownership.

## Exercise 117 — `npx react-native config`
**Problem:** native package does not link. **Expected:** confirm CLI discovery. **Hint:** config command. **Solution:** inspect dependency entry/platform metadata, then Gradle/pod integration. **Explanation:** autolinking has stages. **Common mistake:** manually edit settings.gradle immediately. **Alternative:** package-specific manual config only when docs require.

## Exercise 118 — Metro Reset Scope
**Problem:** JS module resolution stays stale after renaming file. **Expected:** reset Metro cache only. **Hint:** `start --reset-cache`. **Solution:** restart Metro with cache reset; inspect case sensitivity/resolution if persists. **Explanation:** narrow cache intervention. **Common mistake:** delete Pods/Gradle caches. **Alternative:** inspect Metro resolver trace/config.

## Exercise 119 — Gradle vs Metro Failure
**Problem:** `Could not resolve com.foo:bar`. **Expected:** classify as Gradle dependency failure. **Hint:** Maven coordinates. **Solution:** inspect Gradle repositories/dependency graph/version compatibility. **Explanation:** Metro never resolves Maven artifacts. **Common mistake:** `--reset-cache`. **Alternative:** dependency insight task.

## Exercise 120 — Intermediate Integration
**Problem:** Build authenticated paginated contacts app with typed navigation, RHF/Zod form, query cache, secure session and deep link. **Expected:** platform-safe states and tests. **Hint:** combine 61, 63, 71, 78, 85, 88, 99, 103. **Solution:** feature architecture with auth/API/query/navigation adapters and explicit lifecycle. **Explanation:** integration tests boundaries. **Common mistake:** screens own auth refresh/network/storage directly. **Alternative:** repository/use-case layer for larger domain.