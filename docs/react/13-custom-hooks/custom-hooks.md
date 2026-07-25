---
title: Custom Hooks
description: Learn how custom Hooks reuse stateful logic, compose Hooks, design stable APIs, avoid fake Hooks, and extract synchronization carefully.
sidebar_position: 1
---

# Custom Hooks

Custom Hooks let you reuse **stateful React logic** between components.

They do not share state automatically. They share the logic that creates and manages state.

```jsx
function useOnlineStatus() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    function handleOnline() {
      setOnline(true);
    }

    function handleOffline() {
      setOnline(false);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return online;
}
```

Usage:

```jsx
function StatusBadge() {
  const online = useOnlineStatus();
  return <span>{online ? 'Online' : 'Offline'}</span>;
}
```

## Mental model

```text
Component A
   ↓ calls
useOnlineStatus()
   ↓
its own state + Effects

Component B
   ↓ calls
useOnlineStatus()
   ↓
its own state + Effects
```

The Hook reuses behavior, not a single shared state instance.

## Why custom Hooks exist

Without extraction, components can accumulate repeated stateful infrastructure:

```text
Component
├── state
├── Effect
├── cleanup
├── event listener
├── derived flags
└── JSX
```

A custom Hook can create a clearer boundary:

```text
useOnlineStatus
├── state
├── subscription
└── cleanup

Component
└── JSX + domain behavior
```

## Naming rule

A custom Hook name starts with `use`.

```jsx
function useOnlineStatus() {}
function useDebouncedValue() {}
function useLocalStorageState() {}
```

This tells React tooling and readers that the function may call Hooks and must follow the Rules of Hooks.

## Do not prefix ordinary helpers with use

Bad:

```jsx
function useSortedProducts(products) {
  return [...products].sort(compareProducts);
}
```

This function does not use Hooks.

Prefer:

```jsx
function getSortedProducts(products) {
  return [...products].sort(compareProducts);
}
```

Or calculate directly during render when simple.

The `use` prefix has semantic meaning.

## Rules of Hooks still apply

Inside a custom Hook:

```jsx
function useFeature() {
  const [value, setValue] = useState(0);
  useEffect(() => {}, []);
}
```

Hooks must still be called:

- at the top level;
- unconditionally;
- from React components or custom Hooks.

Bad:

```jsx
function useFeature(enabled) {
  if (enabled) {
    useEffect(() => {}, []); // ❌ conditional Hook call
  }
}
```

## A custom Hook can call other custom Hooks

```jsx
function useDashboardData(userId) {
  const online = useOnlineStatus();
  const preferences = usePreferences(userId);
  const notifications = useNotifications(userId);

  return {
    online,
    preferences,
    notifications,
  };
}
```

This is composition.

Custom Hooks can form application-level abstractions while still using React's primitive Hooks underneath.

## Inputs and outputs are API design

A custom Hook is a function API.

Badly designed:

```jsx
const result = useEverything(user, settings, router, api, theme, flags);
```

This may hide too many responsibilities.

Prefer focused contracts:

```jsx
const session = useSession();
const permissions = usePermissions(session.userId);
```

The Hook name, parameters, and return shape should communicate one responsibility.

## Return values versus objects

Tuple can fit setter-like APIs:

```jsx
const [value, setValue] = useLocalStorageState('theme', 'light');
```

Object can fit multiple named capabilities:

```jsx
const {
  data,
  loading,
  error,
  reload,
} = useUserProfile(userId);
```

Choose the shape that makes usage clear.

## Example: useOnlineStatus

```jsx
function useOnlineStatus() {
  const [online, setOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    function update() {
      setOnline(navigator.onLine);
    }

    window.addEventListener('online', update);
    window.addEventListener('offline', update);

    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  return online;
}
```

The Hook owns synchronization with the browser network-status API.

## Example: useDebouncedValue

```jsx
function useDebouncedValue(value, delay) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
```

Usage:

```jsx
const debouncedQuery = useDebouncedValue(query, 300);
```

But ask whether debouncing is actually the right UX/performance tool. A custom Hook does not automatically make a pattern correct.

## Example: useLocalStorageState

```jsx
function useLocalStorageState(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored === null ? initialValue : JSON.parse(stored);
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
```

This is useful in a client-only environment, but production code should consider:

- server rendering where `localStorage` does not exist;
- schema/version migrations;
- JSON errors;
- cross-tab synchronization;
- storage quota;
- sensitive data.

Custom Hooks should not hide platform constraints.

## Hooks hide mechanics, not meaning

Good abstraction:

```jsx
const online = useOnlineStatus();
```

The component cares about online status, not listener setup/cleanup.

Risky abstraction:

```jsx
useDoEverythingWhenUserChanges(user);
```

This hides multiple unrelated side effects and makes the component's behavior difficult to see.

## Avoid generic lifecycle wrappers

Bad:

```jsx
function useMount(callback) {
  useEffect(() => {
    callback();
  }, []);
}
```

This encourages lifecycle thinking rather than synchronization thinking.

A better custom Hook describes the domain or external system:

```jsx
useChatConnection(roomId);
useWindowResize(handler);
useAnalyticsScreen(screenName);
```

The abstraction should preserve the correct React mental model.

## Custom Hook for synchronization

```jsx
function useChatConnection(roomId) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();

    return () => connection.disconnect();
  }, [roomId]);
}
```

Usage:

```jsx
function ChatRoom({roomId}) {
  useChatConnection(roomId);
  return <h1>{roomId}</h1>;
}
```

The component communicates intent: this room needs a chat connection.

## Effect Events inside custom Hooks

React 19.2 lets a custom Hook separate reactive subscription configuration from latest callback behavior.

```jsx
function useWindowEvent(type, listener) {
  const onEvent = useEffectEvent(listener);

  useEffect(() => {
    function handleEvent(event) {
      onEvent(event);
    }

    window.addEventListener(type, handleEvent);
    return () => window.removeEventListener(type, handleEvent);
  }, [type]);
}
```

Now changing the callback implementation does not necessarily require removing and re-adding the browser listener.

Do not use this to hide genuine dependencies. `type` still configures the external subscription and remains reactive.

## State is not shared between Hook callers

```jsx
function A() {
  const online = useOnlineStatus();
}

function B() {
  const online = useOnlineStatus();
}
```

Each call has its own Hook state/effect lifecycle.

If you need one shared external subscription across many components, consider architecture such as:

- Context around a shared owner;
- external store + `useSyncExternalStore`;
- framework/server-state cache;
- a deliberately shared module/service with React integration.

Custom Hook extraction alone does not make data global.

## Do not extract too early

Three repeated lines do not automatically require a Hook.

Extract when the abstraction clarifies a reusable concept.

Good signals:

- repeated synchronization logic;
- repeated state machine behavior;
- a reusable browser/platform integration;
- a domain concept used by multiple components;
- a component is obscured by infrastructure details.

Weak signal:

- "the component is 80 lines long."

Line count is not architecture.

## Custom Hook API stability

Changing a Hook return shape affects every caller.

Example:

```jsx
const {data, status} = useOrders();
```

If the Hook later returns very different semantics, migration cost spreads across the app.

Treat widely used custom Hooks like internal libraries:

- define responsibility;
- document inputs/outputs;
- avoid leaking implementation details;
- evolve APIs intentionally.

## Avoid leaking setters unnecessarily

Potentially weak API:

```jsx
const {user, setUser, setLoading, setError} = useSession();
```

This exposes internal state mechanics.

Stronger domain API:

```jsx
const {
  user,
  loading,
  signIn,
  signOut,
} = useSession();
```

Consumers depend on behavior rather than internal state structure.

## Testing custom Hooks

Prefer testing behavior through a component using the Hook when practical.

For example, test that an online-status indicator updates after browser online/offline events.

This verifies the user-visible contract rather than internal Hook implementation.

For low-level library Hooks, dedicated Hook test utilities may be useful, but keep tests focused on public behavior.

## Common mistakes

### Mistake: custom Hook that does not use Hooks

Use a normal helper instead.

### Mistake: hiding unrelated Effects

One Hook should have a coherent responsibility.

### Mistake: using Hooks as service locators

```jsx
const everything = useApp();
```

This often creates invisible coupling and broad re-render dependencies.

### Mistake: returning implementation details

Prefer domain operations over exposing every setter/ref.

### Mistake: thinking extraction fixes architecture

Moving questionable logic from a component into `useSomething` does not make it correct.

## Production example: useDocumentTitle

```jsx
function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
```

Usage:

```jsx
function InvoicePage({invoice}) {
  useDocumentTitle(`Invoice ${invoice.number}`);

  return <InvoiceDetails invoice={invoice} />;
}
```

The Hook gives a clear name to synchronization with the browser document.

Note: React 19 has built-in document metadata support for rendered `<title>`, `<meta>`, and related tags. Later modern-React chapters will cover when those built-ins are a better approach than a custom Effect Hook.

## Exercise

Extract a `useKeyboardShortcut` Hook from this repeated logic:

```jsx
useEffect(() => {
  function handleKeyDown(event) {
    if (event.ctrlKey && event.key === 'k') {
      onOpenSearch();
    }
  }

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [onOpenSearch]);
```

Requirements:

- accept shortcut configuration;
- accept a callback;
- avoid unnecessary listener re-subscription when only callback behavior changes;
- keep genuine subscription configuration reactive.

## Interview questions

**Junior:** What does a custom Hook reuse?

**Mid-level:** Why does calling the same custom Hook twice not share state?

**Senior:** What makes a custom Hook a strong architectural abstraction rather than merely code moved out of a component?

## Summary

```text
Custom Hooks reuse stateful behavior.
They compose React Hooks into meaningful APIs.
They do not automatically share state.
They should clarify intent, not hide complexity blindly.
```

## References

- https://react.dev/learn/reusing-logic-with-custom-hooks
- https://react.dev/reference/rules/rules-of-hooks
- https://react.dev/reference/react/useEffectEvent

## Next

Next we move into **Context, reducers, and deliberate shared-state architecture**.
