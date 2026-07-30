---
id: exercises-beginner-001-060
title: Exercises 001–060 — Beginner
---

# Beginner Exercises 001–060

Solve each problem before opening its solution. Baseline: RN 0.86 + TypeScript + Community CLI.

## Exercise 1 — Hello Native UI
**Problem:** Render a screen with a heading and paragraph using only core primitives. **Expected:** valid native text hierarchy. **Hint:** strings belong inside `Text`. **Solution:** render `<View><Text accessibilityRole="header">Hello</Text><Text>...</Text></View>`. **Explanation:** RN does not render DOM nodes. **Common mistake:** raw string directly inside `View`. **Alternative:** extract a typed `ScreenTitle` component.

## Exercise 2 — Typed Greeting Props
**Problem:** Create `Greeting` with required `name: string`. **Expected:** `<Greeting name="Ada" />` renders `Hello, Ada`. **Hint:** type the props object. **Solution:** `function Greeting({name}: {name:string}) { return <Text>Hello, {name}</Text>; }`. **Explanation:** props are the public component contract. **Common mistake:** `any`. **Alternative:** named `GreetingProps` interface/type.

## Exercise 3 — Optional Subtitle
**Problem:** Add optional subtitle without rendering `undefined`. **Expected:** subtitle appears only when provided. **Hint:** conditional JSX. **Solution:** `{subtitle ? <Text>{subtitle}</Text> : null}`. **Explanation:** absent UI should be represented declaratively. **Common mistake:** empty placeholder view. **Alternative:** `subtitle && <Text>...` when empty string semantics are acceptable.

## Exercise 4 — Press Counter
**Problem:** Increment a count when a button is pressed. **Expected:** count updates exactly once per press. **Hint:** functional state update. **Solution:** `setCount(c => c + 1)`. **Explanation:** updater form uses the latest queued state. **Common mistake:** mutating a variable outside state. **Alternative:** reducer with `{type:'increment'}`.

## Exercise 5 — Toggle with Switch
**Problem:** Build a typed notification toggle. **Expected:** `Switch` mirrors state. **Hint:** `value` + `onValueChange`. **Solution:** `const [enabled,setEnabled]=useState(false); <Switch value={enabled} onValueChange={setEnabled}/>` **Explanation:** controlled native component. **Common mistake:** `defaultValue`-style thinking. **Alternative:** controlled form library for larger forms.

## Exercise 6 — Pressable Feedback
**Problem:** Make a custom button change opacity while pressed. **Expected:** visual feedback and button semantics. **Hint:** Pressable style callback. **Solution:** `<Pressable accessibilityRole="button" style={({pressed})=>[styles.button, pressed&&styles.pressed]}>...`. **Explanation:** pressed state can drive styles without global state. **Common mistake:** tracking pressed in app store. **Alternative:** reusable `Button` component.

## Exercise 7 — Disabled Button
**Problem:** Disable submit when title is empty. **Expected:** no press callback and disabled semantics. **Hint:** trim input. **Solution:** derive `disabled = title.trim().length===0`; pass `disabled` and `accessibilityState={{disabled}}`. **Explanation:** derived state should not be duplicated. **Common mistake:** separate `isDisabled` state synchronized by effect. **Alternative:** schema-derived validity in a form library.

## Exercise 8 — Local Image
**Problem:** Render a bundled image with fixed layout. **Expected:** image displays without network. **Hint:** static `require`. **Solution:** `<Image source={require('../assets/logo.png')} style={{width:80,height:80}} />`. **Explanation:** Metro can resolve static assets. **Common mistake:** dynamic string inside `require`. **Alternative:** imported asset mapping.

## Exercise 9 — Remote Image Failure
**Problem:** Show fallback text if a remote image fails. **Expected:** failure state visible. **Hint:** `onError`. **Solution:** track `failed`; render fallback when true. **Explanation:** network images have error states. **Common mistake:** infinite spinner after failure. **Alternative:** image library placeholder/error API.

## Exercise 10 — Activity Indicator States
**Problem:** Show spinner only during initial load. **Expected:** data remains visible during refresh. **Hint:** distinguish `loading` and `refreshing`. **Solution:** full spinner only if `!data && loading`; use refresh indicator otherwise. **Explanation:** loading states encode user context. **Common mistake:** blanking screen on every refetch. **Alternative:** skeleton for first load.

## Exercise 11 — StyleSheet Card
**Problem:** Create a card using `StyleSheet.create`. **Expected:** padding/radius/layout centralized. **Hint:** styles are JS objects, not CSS strings. **Solution:** define `card:{padding:16,borderRadius:12}`. **Explanation:** RN style properties map to native layout/paint. **Common mistake:** `padding: '16px'`. **Alternative:** design-token helper.

## Exercise 12 — Style Array Override
**Problem:** Base button should become disabled style conditionally. **Expected:** conditional style overrides base. **Hint:** arrays merge left-to-right. **Solution:** `[styles.button, disabled && styles.disabled]`. **Explanation:** precedence is explicit. **Common mistake:** reversed order. **Alternative:** variant function returning style array.

## Exercise 13 — Column Layout
**Problem:** Stack three boxes vertically with spacing. **Expected:** column flow. **Hint:** column is RN flex default. **Solution:** parent `{gap:12}` with child dimensions. **Explanation:** Yoga default main axis is vertical. **Common mistake:** adding `flexDirection:'column'` everywhere unnecessarily. **Alternative:** margin spacing if target version lacks desired gap behavior.

## Exercise 14 — Row Layout
**Problem:** Place avatar and text side-by-side. **Expected:** row alignment centered. **Hint:** `flexDirection:'row'`, `alignItems`. **Solution:** `{flexDirection:'row',alignItems:'center',gap:12}`. **Explanation:** main axis becomes horizontal. **Common mistake:** using absolute positions. **Alternative:** nested row component.

## Exercise 15 — Space Between
**Problem:** Put title left and action right. **Expected:** remaining horizontal space separates them. **Hint:** justify main axis. **Solution:** row + `justifyContent:'space-between'`. **Explanation:** justify works on main axis. **Common mistake:** using `alignItems`. **Alternative:** `title {flex:1}` plus action.

## Exercise 16 — Flex Fill
**Problem:** Make content fill remaining screen below a header. **Expected:** content expands, header keeps natural size. **Hint:** `flex:1`. **Solution:** header + `<View style={{flex:1}} />`. **Explanation:** flex growth consumes available space. **Common mistake:** hard-coded screen height. **Alternative:** explicit grow/shrink/basis for complex layouts.

## Exercise 17 — Center Content
**Problem:** Center empty-state text both axes. **Expected:** centered in available screen. **Hint:** `justifyContent` + `alignItems`. **Solution:** fill container with `flex:1, justifyContent:'center', alignItems:'center'`. **Explanation:** axes depend on flex direction. **Common mistake:** only `textAlign:'center'`. **Alternative:** reusable EmptyState container.

## Exercise 18 — Absolute Badge
**Problem:** Place unread badge at avatar top-right. **Expected:** badge overlays avatar. **Hint:** relative parent + absolute child. **Solution:** avatar wrapper then badge `{position:'absolute',top:-2,right:-2}`. **Explanation:** absolute child leaves normal flex flow. **Common mistake:** screen-coordinate positioning. **Alternative:** row label if overlay harms accessibility.

## Exercise 19 — Aspect Ratio
**Problem:** Build full-width 16:9 thumbnail. **Expected:** height follows width. **Hint:** `aspectRatio`. **Solution:** `{width:'100%',aspectRatio:16/9}`. **Explanation:** one dimension plus ratio determines other. **Common mistake:** reading screen width once. **Alternative:** measured container width.

## Exercise 20 — useWindowDimensions
**Problem:** Render one or two columns based on current width. **Expected:** responds to rotation/window resize. **Hint:** hook updates. **Solution:** `const {width}=useWindowDimensions(); const columns=width>=700?2:1;`. **Explanation:** responsive state derives from window. **Common mistake:** `Dimensions.get` once at module load. **Alternative:** platform/tablet capability heuristic.

## Exercise 21 — Dark Mode Text
**Problem:** Pick text/background from system scheme. **Expected:** updates when scheme changes. **Hint:** `useColorScheme`. **Solution:** derive semantic colors from returned scheme. **Explanation:** theme is derived environment state. **Common mistake:** saving system scheme as duplicated state. **Alternative:** user override + system fallback.

## Exercise 22 — Design Tokens
**Problem:** Replace repeated spacing numbers with tokens. **Expected:** components use semantic scale. **Hint:** immutable object. **Solution:** `const spacing={xs:4,sm:8,md:16,lg:24} as const`. **Explanation:** tokens centralize system decisions. **Common mistake:** token for every one-off value. **Alternative:** semantic component tokens.

## Exercise 23 — TextInput Controlled Value
**Problem:** Bind an input to `name`. **Expected:** typed value updates per edit. **Hint:** `onChangeText`. **Solution:** `<TextInput value={name} onChangeText={setName}/>` **Explanation:** RN provides text directly, unlike browser event target usage. **Common mistake:** `e.target.value`. **Alternative:** form controller.

## Exercise 24 — Secure Password Input
**Problem:** Mask password and configure autofill semantics. **Expected:** secure display, meaningful password metadata. **Hint:** `secureTextEntry`, current RN platform props. **Solution:** use secure entry plus appropriate `autoComplete`/`textContentType`. **Explanation:** masking and OS credential UX are separate concerns. **Common mistake:** assuming masking encrypts storage. **Alternative:** password manager-compatible auth flow.

## Exercise 25 — Submit on Keyboard
**Problem:** Search when user presses keyboard search/submit. **Expected:** one submit callback. **Hint:** `returnKeyType` and `onSubmitEditing`. **Solution:** configure input and call validated search handler. **Explanation:** mobile keyboard can express action intent. **Common mistake:** searching only from a tiny icon. **Alternative:** live debounced search.

## Exercise 26 — Focus Next Input
**Problem:** Move from email to password with keyboard Next. **Expected:** password receives focus. **Hint:** ref. **Solution:** `const passwordRef=useRef<TextInput>(null)` then `.focus()`. **Explanation:** refs are appropriate for imperative focus. **Common mistake:** storing ref target in state. **Alternative:** form library focus API.

## Exercise 27 — Keyboard Dismiss
**Problem:** Add a Done action that dismisses keyboard. **Expected:** keyboard closes without clearing input. **Hint:** `Keyboard.dismiss()`. **Solution:** invoke in button handler. **Explanation:** keyboard visibility is OS UI, not input value. **Common mistake:** blur every input by resetting form. **Alternative:** current input ref `.blur()`.

## Exercise 28 — ScrollView Form
**Problem:** Build a settings form longer than screen. **Expected:** bounded scrolling. **Hint:** screen root + ScrollView content container. **Solution:** `<ScrollView contentContainerStyle={styles.content}>...`. **Explanation:** ScrollView is appropriate for bounded form fields. **Common mistake:** 10k repeated rows in ScrollView. **Alternative:** SectionList for very large settings catalogs.

## Exercise 29 — FlatList Basics
**Problem:** Render 100 contacts. **Expected:** virtualized list with stable keys. **Hint:** `data`, `renderItem`, `keyExtractor`. **Solution:** key by `contact.id`. **Explanation:** identity enables reconciliation/virtualization. **Common mistake:** index key. **Alternative:** SectionList grouped alphabetically.

## Exercise 30 — Empty List State
**Problem:** Show friendly text when no contacts. **Expected:** empty state only for loaded empty data. **Hint:** `ListEmptyComponent`. **Solution:** provide component and distinguish loading. **Explanation:** empty != loading. **Common mistake:** “No contacts” flash before fetch completes. **Alternative:** wrapper conditional.

## Exercise 31 — SectionList
**Problem:** Group contacts by first letter. **Expected:** section headers + rows. **Hint:** transform into `{title,data}`. **Solution:** derive sections and render `SectionList`. **Explanation:** SectionList virtualizes grouped data. **Common mistake:** nested FlatLists per group. **Alternative:** server-provided grouped data.

## Exercise 32 — Pull to Refresh
**Problem:** Add refresh to FlatList. **Expected:** native refresh indicator and no initial-data blanking. **Hint:** `refreshing`, `onRefresh`. **Solution:** pass refresh state/callback. **Explanation:** refresh is distinct from first load. **Common mistake:** set all data to empty before refetch. **Alternative:** explicit `RefreshControl` on compatible scroll container.

## Exercise 33 — Modal Editor
**Problem:** Edit a task in a modal. **Expected:** cancel preserves original; save commits. **Hint:** local draft. **Solution:** initialize draft from selected task and write only on save. **Explanation:** draft state differs from persisted state. **Common mistake:** editing list object directly. **Alternative:** navigation modal screen.

## Exercise 34 — Alert Confirmation
**Problem:** Confirm destructive delete. **Expected:** cancel/delete choices. **Hint:** core `Alert`. **Solution:** show alert and execute deletion only from destructive action. **Explanation:** native alert suits small confirmations. **Common mistake:** deleting before confirmation resolves. **Alternative:** custom accessible modal for complex context.

## Exercise 35 — Share Text
**Problem:** Share a generated invitation. **Expected:** native share sheet. **Hint:** `Share.share`. **Solution:** call with text/message supported by platform. **Explanation:** system share routes to installed apps. **Common mistake:** assuming identical result semantics on both platforms. **Alternative:** copy/link button.

## Exercise 36 — Open URL
**Problem:** Open privacy policy safely. **Expected:** system handles supported URL. **Hint:** `Linking`. **Solution:** validate known HTTPS URL then `Linking.openURL`. **Explanation:** linking crosses app boundary. **Common mistake:** opening arbitrary untrusted scheme. **Alternative:** in-app browser library after security review.

## Exercise 37 — AppState Label
**Problem:** Display current foreground/background state. **Expected:** label updates with lifecycle. **Hint:** subscribe/remove. **Solution:** initialize from `AppState.currentState`, add listener in effect, cleanup `.remove()`. **Explanation:** native subscription lifecycle. **Common mistake:** listener added every render. **Alternative:** reusable `useAppState` hook.

## Exercise 38 — Dimensions Listener
**Problem:** Observe window dimension changes imperatively. **Expected:** state updates and cleanup. **Hint:** `Dimensions.addEventListener`. **Solution:** subscribe in effect and remove returned subscription. **Explanation:** event source exists outside React. **Common mistake:** no cleanup. **Alternative:** `useWindowDimensions` when rendering only.

## Exercise 39 — Timer Cleanup
**Problem:** Show elapsed seconds while mounted. **Expected:** timer stops after unmount. **Hint:** interval ID cleanup. **Solution:** `const id=setInterval(...); return()=>clearInterval(id);`. **Explanation:** effects synchronize timer resource. **Common mistake:** interval created in component body. **Alternative:** animation clock for visual timing.

## Exercise 40 — Derived Full Name
**Problem:** Given first/last state, render full name. **Expected:** always consistent. **Hint:** no effect. **Solution:** `const fullName = \`\${first} \${last}\`.trim()`. **Explanation:** derived state computes during render. **Common mistake:** third state + effect. **Alternative:** memo only if computation expensive.

## Exercise 41 — Reducer Counter
**Problem:** Implement increment/decrement/reset reducer. **Expected:** pure transitions. **Hint:** discriminated action union. **Solution:** switch on action type returning new number/state. **Explanation:** reducers model events. **Common mistake:** side effect inside reducer. **Alternative:** separate `useState` for trivial counter.

## Exercise 42 — Context Theme
**Problem:** Provide theme tokens through context. **Expected:** child reads semantic colors. **Hint:** provider value. **Solution:** create typed context and `useTheme` guard. **Explanation:** context transports cross-tree dependency. **Common mistake:** one context for every app state. **Alternative:** props for local tree.

## Exercise 43 — Avoid Context Rerender
**Problem:** Provider recreates `{theme,toggle}` every parent render. **Expected:** stabilize when inputs unchanged. **Hint:** memoize value if profiling shows broad churn. **Solution:** `useMemo(()=>({theme,toggle}),[theme,toggle])`. **Explanation:** context compares provider value identity. **Common mistake:** memoizing everything before measuring. **Alternative:** split state/actions contexts.

## Exercise 44 — Platform Text
**Problem:** Render platform name. **Expected:** Android/iOS-specific text. **Hint:** `Platform.OS`. **Solution:** conditional/select. **Explanation:** small platform difference fits inline branch. **Common mistake:** platform checks in every layer. **Alternative:** adapter for large differences.

## Exercise 45 — Platform.select Style
**Problem:** Use platform-specific shadow/elevation styles. **Expected:** style chosen per OS. **Hint:** `Platform.select`. **Solution:** merge selected style with common card style. **Explanation:** native visual systems differ. **Common mistake:** assuming CSS box-shadow behavior. **Alternative:** design-system platform implementation.

## Exercise 46 — Platform File Split
**Problem:** Implement `DatePicker` differently per platform. **Expected:** import `./DatePicker` resolves `.ios.tsx`/`.android.tsx`. **Hint:** same exported contract. **Solution:** create two typed files. **Explanation:** resolver selects platform variant. **Common mistake:** consumers importing suffix explicitly. **Alternative:** one component with small branch.

## Exercise 47 — Safe Area Screen
**Problem:** Keep content out of notches/system bars. **Expected:** insets respected. **Hint:** current safe-area library pattern. **Solution:** wrap/apply insets according to library docs. **Explanation:** screen bounds differ from safe content bounds. **Common mistake:** fixed top padding. **Alternative:** navigator-provided header/insets.

## Exercise 48 — StatusBar Theme
**Problem:** Change status bar content style for dark/light screen. **Expected:** readable system icons. **Hint:** `StatusBar` current props. **Solution:** derive bar style from semantic background. **Explanation:** system chrome participates in theme. **Common mistake:** assume same nav/status behavior Android/iOS. **Alternative:** navigation screen options when supported.

## Exercise 49 — Accessibility Label
**Problem:** Icon-only favorite button. **Expected:** screen reader announces purpose/state. **Hint:** label + role + state. **Solution:** Pressable with `accessibilityRole="button"`, label and selected/checked state as appropriate. **Explanation:** icon visual meaning is not semantic. **Common mistake:** label “heart icon”. **Alternative:** visible text button.

## Exercise 50 — Touch Target
**Problem:** Make 20×20 icon easy to tap without enlarging visual. **Expected:** larger hit region. **Hint:** `hitSlop`. **Solution:** add hit slop while preserving layout. **Explanation:** motor accessibility needs adequate target. **Common mistake:** tiny precise target. **Alternative:** larger container Pressable.

## Exercise 51 — Reduced Motion Branch
**Problem:** Skip decorative animation when reduced motion is enabled. **Expected:** state change remains understandable. **Hint:** current AccessibilityInfo reduced-motion capability/listener. **Solution:** derive preference and use immediate transition. **Explanation:** accessibility preference changes motion policy. **Common mistake:** removing feedback entirely. **Alternative:** fade/instant semantic change.

## Exercise 52 — Alert Error State
**Problem:** Replace `console.error` after save failure with UI. **Expected:** user can retry. **Hint:** store error state. **Solution:** render inline error and retry button around async save. **Explanation:** users need actionable failure state. **Common mistake:** spinner forever. **Alternative:** toast plus retained form state.

## Exercise 53 — Async Button Guard
**Problem:** Prevent duplicate submit taps. **Expected:** one in-flight request. **Hint:** pending state. **Solution:** set pending synchronously before await, disable button, reset in finally. **Explanation:** UI can enforce local in-flight guard. **Common mistake:** no server idempotency for duplicate-sensitive create. **Alternative:** mutation library pending state + idempotency key.

## Exercise 54 — Abort Obsolete Fetch
**Problem:** Cancel profile request when user ID changes. **Expected:** old result never overwrites new. **Hint:** AbortController in effect cleanup. **Solution:** new controller per effect; abort cleanup; ignore abort as normal cancellation. **Explanation:** lifecycle cancels stale work. **Common mistake:** treating abort as user error. **Alternative:** TanStack Query cancellation.

## Exercise 55 — Fetch Error Check
**Problem:** Parse only successful HTTP response. **Expected:** 404 becomes typed error. **Hint:** fetch does not reject on every HTTP error. **Solution:** check `response.ok` before parsing/returning expected payload. **Explanation:** transport success differs from HTTP success. **Common mistake:** catch only network failures. **Alternative:** centralized API client.

## Exercise 56 — JSON Runtime Validation
**Problem:** API claims user but returns malformed data. **Expected:** reject invalid payload. **Hint:** Zod `safeParse`. **Solution:** parse unknown JSON through schema and normalize error. **Explanation:** TypeScript types do not validate network data. **Common mistake:** `as User`. **Alternative:** manual type guard.

## Exercise 57 — Local Preference Persistence
**Problem:** Persist chosen theme mode. **Expected:** relaunch restores `system|light|dark`. **Hint:** AsyncStorage and runtime validation. **Solution:** save enum string; read on bootstrap; fallback on invalid value. **Explanation:** persisted data needs schema handling. **Common mistake:** store derived current system scheme. **Alternative:** MMKV-style store after compatibility review.

## Exercise 58 — Secure Token Decision
**Problem:** Decide where refresh token belongs. **Expected:** OS-backed credential storage, not AsyncStorage. **Hint:** threat model. **Solution:** use maintained Keychain/Keystore-backed library. **Explanation:** ordinary persistence is not secret storage. **Common mistake:** “base64 encrypt” token in AsyncStorage. **Alternative:** server session design minimizing token lifetime.

## Exercise 59 — App Secret Decision
**Problem:** Product asks to put privileged API secret in `.env`. **Expected:** reject client-side secret design. **Hint:** mobile binary is distributed. **Solution:** move privileged call/server credential to backend; app uses authenticated constrained endpoint. **Explanation:** bundled values can be extracted. **Common mistake:** obfuscation = secrecy. **Alternative:** provider-issued public mobile client key when designed for exposure.

## Exercise 60 — Beginner Integration
**Problem:** Build a persisted task list with typed props, FlatList, form input, loading/error/empty states and accessible actions. **Expected:** restart-safe beginner app. **Hint:** combine exercises 2, 24, 29, 49, 57. **Solution:** feature component + local state/reducer + storage adapter + stable keys + semantic Pressables. **Explanation:** integration reveals ownership/lifecycle boundaries. **Common mistake:** one 500-line component. **Alternative:** split screen, row, form and repository.