---
id: exercises-beginner-001-060
title: Exercises 001–060 — Beginner
---

# Beginner Exercises 001–060

Solve each problem before reading its solution. Baseline: React Native 0.86 + TypeScript + Community CLI.

## Exercise 1 — Hello Native UI
**Problem:** Render a heading and paragraph with core primitives. **Expected result:** valid native text hierarchy. **Hint:** strings belong inside `Text`. **Solution:** render a `View` containing two `Text` components and give the heading an accessibility role. **Explanation:** React Native renders native primitives, not DOM nodes. **Common mistake:** putting a raw string directly inside `View`. **Alternative:** extract a typed `ScreenTitle` component.

## Exercise 2 — Typed Greeting Props
**Problem:** Create `Greeting` with required `name: string`. **Expected result:** passing Ada renders “Hello, Ada”. **Hint:** type the props object. **Solution:** destructure `name` from a typed props object and render it inside `Text`. **Explanation:** props are the component's public contract. **Common mistake:** using `any`. **Alternative:** use a named `GreetingProps` type.

## Exercise 3 — Optional Subtitle
**Problem:** Add an optional subtitle. **Expected result:** no empty placeholder when absent. **Hint:** conditional JSX. **Solution:** render `Text` only when subtitle has a value. **Explanation:** absent UI should be represented declaratively. **Common mistake:** storing separate “show subtitle” state. **Alternative:** accept `subtitle?: string`.

## Exercise 4 — Press Counter
**Problem:** Increment count once per press. **Expected result:** visible count increases predictably. **Hint:** functional state update. **Solution:** update count from the previous state value in the press handler. **Explanation:** updater form reads the latest queued state. **Common mistake:** mutating a normal variable. **Alternative:** reducer with an increment action.

## Exercise 5 — Toggle with Switch
**Problem:** Build a notification toggle. **Expected result:** `Switch` mirrors state. **Hint:** use `value` and `onValueChange`. **Solution:** keep one boolean state and pass its setter to the change callback. **Explanation:** this is a controlled native component. **Common mistake:** duplicating state in two places. **Alternative:** connect it to form state for larger forms.

## Exercise 6 — Pressable Feedback
**Problem:** Change button opacity while pressed. **Expected result:** immediate visual feedback and button semantics. **Hint:** Pressable style callback. **Solution:** return a style array based on the callback's `pressed` value. **Explanation:** transient pressed state does not need global state. **Common mistake:** creating app-store state for a single press. **Alternative:** reusable design-system button.

## Exercise 7 — Disabled Submit
**Problem:** Disable submit when a trimmed title is empty. **Expected result:** press callback cannot fire and disabled semantics are exposed. **Hint:** derive the boolean. **Solution:** compute disabled directly from the current title. **Explanation:** derived state should not be synchronized by an effect. **Common mistake:** separate `isDisabled` state. **Alternative:** derive validity from a schema.

## Exercise 8 — Local Image
**Problem:** Render a bundled logo. **Expected result:** image works without network. **Hint:** static asset resolution. **Solution:** use a static `require` for the asset and explicit dimensions. **Explanation:** Metro includes statically referenced assets. **Common mistake:** dynamic strings inside `require`. **Alternative:** imported asset map.

## Exercise 9 — Remote Image Failure
**Problem:** Show a fallback if an image request fails. **Expected result:** no endless spinner. **Hint:** use image error lifecycle. **Solution:** track a failed boolean from `onError` and render fallback UI. **Explanation:** network images need explicit failure states. **Common mistake:** only handling loading. **Alternative:** maintained image library with placeholder/error support.

## Exercise 10 — Initial Loading vs Refresh
**Problem:** Show a full spinner only before data exists. **Expected result:** existing content stays visible during refresh. **Hint:** distinguish first load from refetch. **Solution:** full-screen loading requires no data plus loading; refresh uses a smaller indicator. **Explanation:** loading state carries user context. **Common mistake:** blanking the screen on every request. **Alternative:** first-load skeleton.

## Exercise 11 — StyleSheet Card
**Problem:** Create a padded rounded card. **Expected result:** styles are centralized. **Hint:** use `StyleSheet.create`. **Solution:** define numeric padding and radius in a named style. **Explanation:** RN style values map to native layout/paint, not CSS text. **Common mistake:** writing `16px`. **Alternative:** design tokens.

## Exercise 12 — Style Array Override
**Problem:** Add a disabled visual style conditionally. **Expected result:** conditional style wins over base values. **Hint:** arrays merge in order. **Solution:** place base style first and conditional override after it. **Explanation:** later style entries override earlier ones. **Common mistake:** reversed order. **Alternative:** typed variant helper.

## Exercise 13 — Column Layout
**Problem:** Stack three boxes vertically. **Expected result:** vertical flow with spacing. **Hint:** column is the default flex direction. **Solution:** use a parent with spacing and children in normal flex flow. **Explanation:** Yoga defaults the main axis to vertical. **Common mistake:** absolute positioning. **Alternative:** margin-based spacing when needed.

## Exercise 14 — Row Layout
**Problem:** Place avatar and text side by side. **Expected result:** centered row alignment. **Hint:** set row direction and cross-axis alignment. **Solution:** use `flexDirection: 'row'` and `alignItems: 'center'`. **Explanation:** changing flex direction changes the main axis. **Common mistake:** using fixed screen coordinates. **Alternative:** reusable identity row.

## Exercise 15 — Space Between
**Problem:** Put a title left and action right. **Expected result:** remaining horizontal space separates them. **Hint:** justify along the main axis. **Solution:** use a row with `justifyContent: 'space-between'`. **Explanation:** justify works on the main axis. **Common mistake:** using only `alignItems`. **Alternative:** make title flex to fill remaining space.

## Exercise 16 — Flex Fill
**Problem:** Fill all space below a fixed header. **Expected result:** content expands while header keeps natural size. **Hint:** `flex: 1`. **Solution:** assign flex growth to the content container. **Explanation:** flex growth consumes available space. **Common mistake:** hard-coded screen height. **Alternative:** explicit grow/shrink/basis in complex layouts.

## Exercise 17 — Center Empty State
**Problem:** Center empty-state text both axes. **Expected result:** centered within available screen. **Hint:** fill parent first. **Solution:** use a flex-fill container with centered main and cross axes. **Explanation:** centering depends on container size. **Common mistake:** only using text alignment. **Alternative:** shared `EmptyState` component.

## Exercise 18 — Absolute Badge
**Problem:** Overlay unread count on an avatar. **Expected result:** badge sits at the top-right of the avatar. **Hint:** positioned child inside a bounded wrapper. **Solution:** give badge absolute top/right offsets relative to its wrapper. **Explanation:** absolute elements leave normal flex flow. **Common mistake:** screen-coordinate placement. **Alternative:** inline badge when overlay hurts readability.

## Exercise 19 — Aspect Ratio
**Problem:** Create a full-width 16:9 thumbnail. **Expected result:** height follows width. **Hint:** `aspectRatio`. **Solution:** set width to full container and ratio to 16/9. **Explanation:** one dimension plus ratio determines the other. **Common mistake:** reading screen width once. **Alternative:** measure the container when layout is more complex.

## Exercise 20 — Responsive Columns
**Problem:** Use one column on narrow windows and two on wide windows. **Expected result:** layout updates on rotation/resizing. **Hint:** `useWindowDimensions`. **Solution:** derive column count from the hook's current width. **Explanation:** the hook reacts to window changes. **Common mistake:** module-level `Dimensions.get`. **Alternative:** combine width with device-class rules.

## Exercise 21 — System Dark Mode
**Problem:** Adapt semantic colors to system appearance. **Expected result:** UI updates when scheme changes. **Hint:** `useColorScheme`. **Solution:** resolve semantic foreground/background tokens from the scheme. **Explanation:** theme is environment-derived state. **Common mistake:** copy system scheme into synchronized state. **Alternative:** user override plus system fallback.

## Exercise 22 — Design Tokens
**Problem:** Replace repeated spacing numbers. **Expected result:** components share a consistent scale. **Hint:** immutable token object. **Solution:** define a small spacing scale and reference tokens by meaning. **Explanation:** tokens centralize design decisions. **Common mistake:** creating a token for every one-off number. **Alternative:** component-level semantic tokens.

## Exercise 23 — Controlled TextInput
**Problem:** Bind an input to `name`. **Expected result:** state updates with each edit. **Hint:** RN passes text directly. **Solution:** pass state to `value` and setter to `onChangeText`. **Explanation:** RN text events differ from browser `event.target.value`. **Common mistake:** DOM event assumptions. **Alternative:** form controller.

## Exercise 24 — Secure Password Entry
**Problem:** Mask password input and support password-manager semantics. **Expected result:** secure visual entry plus useful autofill metadata. **Hint:** masking and autofill are different concerns. **Solution:** enable secure entry and appropriate current autocomplete/content metadata. **Explanation:** masking does not encrypt storage. **Common mistake:** treating hidden characters as secure persistence. **Alternative:** passkeys/OIDC flow where product supports it.

## Exercise 25 — Keyboard Submit
**Problem:** Search when the keyboard submit action is pressed. **Expected result:** validated search fires once. **Hint:** return key plus submit callback. **Solution:** configure a search-like return key and call the same handler used by the visible button. **Explanation:** keyboard action is part of mobile UX. **Common mistake:** separate inconsistent submit logic. **Alternative:** debounced live search.

## Exercise 26 — Focus Next Input
**Problem:** Move from email to password with keyboard Next. **Expected result:** password receives focus. **Hint:** `TextInput` ref. **Solution:** keep a typed ref and call focus from the first input's submit event. **Explanation:** focus is a justified imperative operation. **Common mistake:** storing the ref target in state. **Alternative:** form-library focus helper.

## Exercise 27 — Dismiss Keyboard
**Problem:** Close keyboard without clearing input. **Expected result:** values remain. **Hint:** `Keyboard.dismiss`. **Solution:** call keyboard dismissal from the Done action. **Explanation:** keyboard visibility is separate from text state. **Common mistake:** resetting form to hide keyboard. **Alternative:** blur a specific input ref.

## Exercise 28 — Scrollable Form
**Problem:** Build settings content taller than the screen. **Expected result:** form scrolls and remains usable with keyboard. **Hint:** bounded content fits `ScrollView`. **Solution:** use a screen root plus scroll view and appropriate content container spacing. **Explanation:** ScrollView renders all children and is suitable for modest forms. **Common mistake:** thousands of repeated rows. **Alternative:** `SectionList` for a large catalog.

## Exercise 29 — FlatList Basics
**Problem:** Render 100 contacts. **Expected result:** virtualized rows with stable identity. **Hint:** `data`, `renderItem`, `keyExtractor`. **Solution:** key each row by contact ID. **Explanation:** identity supports reconciliation and virtualization. **Common mistake:** index keys for mutable data. **Alternative:** `SectionList` for alphabetical groups.

## Exercise 30 — Empty List State
**Problem:** Show “No contacts” only after loading finishes. **Expected result:** no false empty-state flash. **Hint:** loading and empty are different states. **Solution:** use list empty UI only when request is resolved and data length is zero. **Explanation:** absence of data during loading is not confirmed emptiness. **Common mistake:** immediate empty message. **Alternative:** wrapper state machine.

## Exercise 31 — SectionList Groups
**Problem:** Group contacts by initial letter. **Expected result:** section headers and virtualized rows. **Hint:** derive section data. **Solution:** transform contacts into objects containing a title and data array, then render a `SectionList`. **Explanation:** grouped data has first-class virtualization support. **Common mistake:** nested FlatLists. **Alternative:** server-provided groups.

## Exercise 32 — Pull to Refresh
**Problem:** Add native refresh behavior to a list. **Expected result:** current rows remain while refresh runs. **Hint:** use `refreshing` and `onRefresh`. **Solution:** pass the current refetch state and callback to the list. **Explanation:** refresh is not initial loading. **Common mistake:** clearing data before refresh. **Alternative:** explicit `RefreshControl`.

## Exercise 33 — Modal Draft Editing
**Problem:** Edit a task without changing saved data until Save. **Expected result:** Cancel restores original implicitly. **Hint:** local draft state. **Solution:** initialize a draft from selected task and commit only on Save. **Explanation:** edit buffer and persisted model have different ownership. **Common mistake:** mutate list object directly. **Alternative:** navigation modal screen.

## Exercise 34 — Delete Confirmation
**Problem:** Confirm destructive delete. **Expected result:** Cancel does nothing; Delete executes once. **Hint:** native `Alert` is enough for simple confirmation. **Solution:** place deletion only in the destructive action callback. **Explanation:** destructive intent should be explicit. **Common mistake:** delete before showing confirmation. **Alternative:** custom accessible confirmation modal.

## Exercise 35 — Share Text
**Problem:** Open the native share sheet for an invitation. **Expected result:** system share UI appears. **Hint:** `Share.share`. **Solution:** pass the invitation text through the core Share API and handle result only where needed. **Explanation:** destination apps are controlled by the OS/user. **Common mistake:** assuming identical result values across platforms. **Alternative:** copy-to-clipboard action using a maintained package.

## Exercise 36 — Open HTTPS URL
**Problem:** Open a privacy-policy URL. **Expected result:** known HTTPS destination opens safely. **Hint:** validate destination. **Solution:** keep the URL controlled/allowlisted and call `Linking.openURL`. **Explanation:** linking crosses an application boundary. **Common mistake:** opening arbitrary untrusted schemes. **Alternative:** reviewed in-app browser library.

## Exercise 37 — AppState Label
**Problem:** Display active/background state. **Expected result:** label updates with app lifecycle. **Hint:** subscribe and remove. **Solution:** initialize from current AppState, subscribe in an effect and remove subscription during cleanup. **Explanation:** native event source lives outside React. **Common mistake:** adding listeners each render. **Alternative:** reusable `useAppState` hook.

## Exercise 38 — Window Change Listener
**Problem:** React to dimension changes imperatively. **Expected result:** state updates and listener is removed. **Hint:** Dimensions subscription. **Solution:** subscribe in an effect and clean up returned subscription. **Explanation:** every external subscription needs lifecycle ownership. **Common mistake:** no cleanup. **Alternative:** `useWindowDimensions` for rendering decisions.

## Exercise 39 — Timer Cleanup
**Problem:** Show elapsed seconds while mounted. **Expected result:** timer stops after unmount. **Hint:** return cleanup from effect. **Solution:** create interval in the effect and clear it in cleanup. **Explanation:** timers are external resources. **Common mistake:** creating interval in component body. **Alternative:** animation clock for visual timing.

## Exercise 40 — Derived Full Name
**Problem:** Render a full name from first and last name state. **Expected result:** always matches current inputs. **Hint:** compute during render. **Solution:** concatenate the two current strings and trim the result. **Explanation:** cheap derived state needs no effect or third state variable. **Common mistake:** synchronize a `fullName` state with `useEffect`. **Alternative:** memoization only if derivation becomes genuinely expensive.

## Exercise 41 — Reducer Counter
**Problem:** Implement increment, decrement and reset actions. **Expected result:** pure state transitions. **Hint:** discriminated action union. **Solution:** switch on action type and return the new value without side effects. **Explanation:** reducers model events and transitions. **Common mistake:** network/logging side effects inside reducer. **Alternative:** `useState` for trivial counters.

## Exercise 42 — Theme Context
**Problem:** Provide theme tokens to nested components. **Expected result:** children consume semantic colors. **Hint:** typed context. **Solution:** create context, provider and a guarded `useTheme` hook. **Explanation:** Context transports scoped cross-tree dependencies. **Common mistake:** putting every app value in one context. **Alternative:** props for local composition.

## Exercise 43 — Context Value Identity
**Problem:** Avoid unnecessary consumer updates caused by recreated provider object. **Expected result:** value identity changes only when its inputs change. **Hint:** memoize deliberately. **Solution:** memoize the provider value from theme and stable actions when profiling shows broad churn. **Explanation:** context propagates when provider value identity changes. **Common mistake:** memoizing blindly. **Alternative:** split state and action contexts.

## Exercise 44 — Platform Name
**Problem:** Render different small text for Android and iOS. **Expected result:** current platform label. **Hint:** `Platform.OS`. **Solution:** branch on the platform value for this tiny difference. **Explanation:** local branches are fine when divergence is small. **Common mistake:** platform checks in every architecture layer. **Alternative:** adapter for larger differences.

## Exercise 45 — Platform-specific Card Shadow
**Problem:** Adapt elevation/shadow implementation per OS. **Expected result:** visual depth suited to platform. **Hint:** `Platform.select`. **Solution:** merge common card styles with the selected platform-specific shadow values. **Explanation:** native paint systems differ. **Common mistake:** copying browser box-shadow assumptions. **Alternative:** design-system card abstraction.

## Exercise 46 — Platform File Split
**Problem:** Implement date picker differently on iOS and Android behind one import. **Expected result:** resolver selects the platform file. **Hint:** `.ios.tsx` and `.android.tsx`. **Solution:** create two files exporting the same typed API and import without suffix. **Explanation:** platform resolution localizes meaningful divergence. **Common mistake:** consumers import suffixed paths. **Alternative:** one component with a small branch.

## Exercise 47 — Safe Area Screen
**Problem:** Keep content away from notches and system bars. **Expected result:** correct insets across modern devices. **Hint:** current safe-area ecosystem pattern. **Solution:** use `react-native-safe-area-context` according to its current API instead of core `SafeAreaView`. **Explanation:** core SafeAreaView is deprecated in the current RN docs. **Common mistake:** fixed top padding. **Alternative:** navigator-managed insets where applicable.

## Exercise 48 — StatusBar Style
**Problem:** Use readable status-bar content on dark/light screens. **Expected result:** platform bar content remains legible. **Hint:** derive style from screen theme. **Solution:** configure `StatusBar` style with semantic theme state and verify modal behavior. **Explanation:** system chrome participates in screen presentation. **Common mistake:** one global style for every screen. **Alternative:** navigator/screen wrapper.

## Exercise 49 — Android Back Handler
**Problem:** Close an open custom panel before leaving the screen. **Expected result:** first back press closes panel; otherwise normal navigation handles back. **Hint:** return whether event was consumed. **Solution:** subscribe only while the panel-owning screen needs custom behavior and remove listener on cleanup. **Explanation:** Android hardware back is platform behavior. **Common mistake:** globally swallowing all back events. **Alternative:** navigation library's supported back APIs.

## Exercise 50 — Basic Permission Request
**Problem:** Request Android camera permission only when user taps Scan. **Expected result:** just-in-time prompt. **Hint:** explain value before system dialog if needed. **Solution:** check/request permission from the user action, handle granted/denied paths and keep the feature usable when denied. **Explanation:** permission UX is part of feature design. **Common mistake:** asking on app startup. **Alternative:** manual code entry fallback.

## Exercise 51 — Loading Button
**Problem:** Prevent duplicate form submission. **Expected result:** one active request and visible progress. **Hint:** derive disabled from pending mutation. **Solution:** disable action while mutation is pending and render an ActivityIndicator or loading label. **Explanation:** UI should reflect operation state. **Common mistake:** double-submit race. **Alternative:** backend idempotency as an additional safety layer.

## Exercise 52 — Error Banner
**Problem:** Show a recoverable API error. **Expected result:** safe message and retry action. **Hint:** separate technical error from user copy. **Solution:** map transport/domain error to a user-facing message and expose retry for retryable failures. **Explanation:** raw server exceptions are not UI contracts. **Common mistake:** showing stack/error object. **Alternative:** field-level error for validation failures.

## Exercise 53 — Abort Obsolete Request
**Problem:** Cancel a fetch when screen changes query or unmounts. **Expected result:** obsolete work does not update UI. **Hint:** AbortController. **Solution:** create controller for the request and abort it in cleanup or when replaced. **Explanation:** cancellation prevents wasted work and stale completion handling. **Common mistake:** only ignoring errors without cancelling. **Alternative:** query library cancellation.

## Exercise 54 — Simple Query Cache
**Problem:** Fetch profile data with TanStack Query. **Expected result:** loading/error/data states and cached reuse. **Hint:** stable query key. **Solution:** use a query keyed by profile/user ID and a typed fetch function. **Explanation:** server state has cache/freshness semantics. **Common mistake:** duplicate fetch state in global client store. **Alternative:** direct fetch for one-off nonshared data.

## Exercise 55 — Query Invalidation
**Problem:** Update profile then refresh cached profile. **Expected result:** latest server state appears after mutation. **Hint:** invalidate by semantic key. **Solution:** on successful mutation invalidate the matching profile query. **Explanation:** invalidation marks server-state cache as needing fresh data. **Common mistake:** invalidating unrelated entire cache. **Alternative:** directly update cache from returned canonical entity.

## Exercise 56 — AsyncStorage Preference
**Problem:** Persist a non-sensitive theme preference. **Expected result:** survives process restart. **Hint:** serialize primitive preference. **Solution:** store the theme mode in normal key-value storage and hydrate it during app bootstrap. **Explanation:** ordinary preferences do not require secure secret storage. **Common mistake:** storing access token there by habit. **Alternative:** MMKV or another suitable preference store.

## Exercise 57 — Secure Token Classification
**Problem:** Decide where an auth refresh token belongs. **Expected result:** secure platform-backed storage choice. **Hint:** distinguish preference from credential. **Solution:** use a maintained Keychain/Keystore-backed secure-storage library and minimize token lifetime. **Explanation:** mobile binaries and normal storage are inspectable. **Common mistake:** hiding token with a bundled encryption key. **Alternative:** avoid long-lived refresh token if auth architecture permits.

## Exercise 58 — Accessibility Label
**Problem:** Make an icon-only close button understandable to a screen reader. **Expected result:** role and label announce purpose. **Hint:** visible icon has no semantic text. **Solution:** expose button role and a concise “Close” accessibility label. **Explanation:** semantics must communicate action, not glyph shape. **Common mistake:** label “X icon”. **Alternative:** visible Close text when design permits.

## Exercise 59 — Large Text Resilience
**Problem:** Make a card remain usable with large accessibility fonts. **Expected result:** no clipped title/action. **Hint:** avoid rigid heights. **Solution:** allow text to wrap/grow and test platform dynamic text sizes. **Explanation:** fixed dimensions often fail accessibility. **Common mistake:** truncate critical actions. **Alternative:** stack layout at larger sizes.

## Exercise 60 — Beginner Integration Screen
**Problem:** Build a settings screen combining theme, notification switch, profile input, save state and accessible rows. **Expected result:** typed local state, responsive layout, correct keyboard behavior, loading/error feedback and persisted non-sensitive preference. **Hint:** keep each state category with its real owner. **Solution:** local form state for draft fields, normal storage for preference, mutation state for save request, semantic Pressable/Switch/TextInput components and safe-area-aware scroll layout. **Explanation:** even a simple screen crosses React, RN, platform UX and persistence concerns. **Common mistake:** one giant global store for every value. **Alternative:** split into feature components once complexity warrants it.
