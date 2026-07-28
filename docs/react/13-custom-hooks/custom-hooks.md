---
title: Custom Hooks
description: Learn how custom Hooks reuse stateful logic, compose Hooks, design stable APIs, avoid fake Hooks, and extract synchronization carefully.
sidebar_position: 1
---

import {
  VisualDiagram,
  DiagramStack,
  DiagramGrid,
  DiagramNode,
  DiagramArrow,
  DecisionTree,
  LifecycleBar,
} from '@site/src/components/handbook/VisualDiagram'

# Custom Hooks

Custom Hooks let you reuse **stateful React logic** between components.

They do not share state automatically. They share the logic that creates, reads, updates, or synchronizes state.

```jsx
function useOnlineStatus() {
  const [online, setOnline] = useState(navigator.onLine);

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

## Mental model

<VisualDiagram title="Custom Hooks reuse behaviour, not one shared state instance" subtitle="Each component call participates in that component's own Hook state and Effect lifecycle.">
  <DiagramGrid columns={2}>
    <DiagramNode title="Component A" tone="blue">calls useOnlineStatus() → its own Hook state + Effect</DiagramNode>
    <DiagramNode title="Component B" tone="purple">calls useOnlineStatus() → its own Hook state + Effect</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

If you need one shared state source, use an ownership model such as lifted state, Context, an external store, or another appropriate shared owner. Extracting a custom Hook alone does not make data global.

## Why custom Hooks exist

Without extraction, a component can mix domain UI with reusable infrastructure.

<VisualDiagram title="Extraction creates a meaningful boundary">
  <DiagramGrid columns={2}>
    <DiagramNode title="Before" tone="red" eyebrow="COMPONENT OWNS EVERYTHING">
      state · Effect · cleanup · browser listener · derived flags · JSX
    </DiagramNode>
    <DiagramNode title="After" tone="green" eyebrow="SEPARATED RESPONSIBILITY">
      useOnlineStatus owns subscription mechanics; component owns UI + domain behaviour
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Good custom Hooks hide mechanics while preserving meaning.

```jsx
const online = useOnlineStatus();
```

The caller understands the concept—online status—without needing to know the event-listener details.

## Naming rule

A custom Hook name starts with `use` because it may call Hooks and must follow the Rules of Hooks.

```jsx
function useOnlineStatus() {}
function useDebouncedValue() {}
function useLocalStorageState() {}
```

Do not prefix ordinary helpers with `use`:

```jsx
function getSortedProducts(products) {
  return [...products].sort(compareProducts);
}
```

## Rules of Hooks still apply

Hooks inside a custom Hook must still be called at the top level and unconditionally.

```jsx
function useFeature(enabled) {
  if (enabled) {
    useEffect(() => {}, []); // ❌ conditional Hook call
  }
}
```

## Custom Hooks compose other Hooks

```jsx
function useDashboardData(userId) {
  const online = useOnlineStatus();
  const preferences = usePreferences(userId);
  const notifications = useNotifications(userId);

  return {online, preferences, notifications};
}
```

<VisualDiagram title="Hook composition" compact>
  <DiagramStack align="center">
    <DiagramNode title="Component" tone="blue" wide />
    <DiagramArrow label="calls" />
    <DiagramNode title="useDashboardData" tone="purple" wide />
    <DiagramArrow label="composes" />
    <DiagramGrid columns={3}>
      <DiagramNode title="useOnlineStatus" tone="cyan" />
      <DiagramNode title="usePreferences" tone="green" />
      <DiagramNode title="useNotifications" tone="orange" />
    </DiagramGrid>
  </DiagramStack>
</VisualDiagram>

Composition is useful when the combined abstraction still represents one coherent concept.

## Inputs and outputs are API design

A custom Hook is an internal function API. Its name, parameters, and return shape should communicate responsibility.

Avoid broad service-locator style APIs:

```jsx
const result = useEverything(user, settings, router, api, theme, flags);
```

Prefer focused contracts:

```jsx
const session = useSession();
const permissions = usePermissions(session.userId);
```

## Tuple or object?

Setter-like APIs can fit a tuple:

```jsx
const [value, setValue] = useLocalStorageState('theme', 'light');
```

Multiple named capabilities often fit an object:

```jsx
const {data, loading, error, reload} = useUserProfile(userId);
```

Choose the shape that makes the consumer contract clearest.

## Hooks hide mechanics, not meaning

<VisualDiagram title="Good abstraction vs hidden behaviour">
  <DiagramGrid columns={2}>
    <DiagramNode title="Good" tone="green">useChatConnection(roomId) clearly says which external system is synchronized.</DiagramNode>
    <DiagramNode title="Risky" tone="red">useDoEverythingWhenUserChanges(user) hides unrelated behaviours and ownership.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Avoid generic lifecycle wrappers such as `useMount`. Prefer domain/external-system names that preserve React's synchronization model.

```jsx
useChatConnection(roomId);
useWindowResize(handler);
useAnalyticsScreen(screenName);
```

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

The Hook owns one restartable synchronization process.

<VisualDiagram title="A synchronization Hook should preserve Effect semantics" compact>
  <LifecycleBar
    items={[
      {label: 'caller provides reactive configuration', tone: 'blue'},
      {label: 'Hook starts synchronization', tone: 'purple'},
      {label: 'configuration changes', tone: 'orange'},
      {label: 'cleanup old process', tone: 'red'},
      {label: 'start new process', tone: 'green'},
    ]}
  />
</VisualDiagram>

## Effect Events inside custom Hooks

React 19.2 can separate subscription configuration from latest callback behaviour.

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

`type` configures the subscription and stays reactive. The latest `listener` behaviour can be called through the Effect Event without forcing a resubscription solely because the callback changed.

## Custom Hooks do not automatically share subscriptions

If two components call a Hook that uses `useState`/`useEffect`, they each own their own Hook lifecycle.

<DecisionTree
  question="Do many consumers need one shared source?"
  items={[
    {label: 'No, each component can own its own lifecycle', value: 'A custom Hook may be enough'},
    {label: 'Yes, one React-tree owner should distribute it', value: 'Consider Context around a shared owner'},
    {label: 'Yes, the source lives outside React or needs subscription semantics', value: 'Consider useSyncExternalStore / an external-store integration'},
  ]}
/>

## Do not extract too early

Extract when the abstraction clarifies a reusable concept, not because a file crossed an arbitrary line count.

Strong signals include repeated synchronization, repeated state-machine behaviour, a reusable browser integration, or infrastructure obscuring the component's purpose.

## API stability matters

Widely used Hooks behave like internal libraries.

```jsx
const {data, status} = useOrders();
```

If the return semantics change, migration cost spreads to every caller. Define responsibility, document inputs/outputs, and evolve the API intentionally.

## Avoid leaking implementation details

Weak:

```jsx
const {user, setUser, setLoading, setError} = useSession();
```

Stronger:

```jsx
const {user, loading, signIn, signOut} = useSession();
```

Consumers should depend on domain capabilities, not every internal setter/ref.

## Testing custom Hooks

Prefer testing the public behaviour through a component when practical. For example, test that an online-status indicator updates when browser online/offline events fire.

Low-level library Hooks may deserve dedicated Hook tests, but keep tests focused on observable contracts.

## Common mistakes

- naming an ordinary helper with `use`;
- hiding unrelated Effects behind one Hook;
- using Hooks as broad service locators;
- returning every internal setter/ref;
- assuming extraction fixes questionable architecture;
- assuming a custom Hook automatically shares state.

## Production example: useDocumentTitle

```jsx
function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
```

This gives a clear name to synchronization with the browser document. In React 19, rendered document metadata APIs may be a better fit for some title/meta use cases; choose based on the actual platform requirement.

## Extraction decision

<DecisionTree
  question="Should this logic become a custom Hook?"
  items={[
    {label: 'It is ordinary pure calculation', value: 'Use a normal function or calculate during render'},
    {label: 'It is repeated stateful / Hook-based behaviour with one clear responsibility', value: 'A custom Hook is a good candidate'},
    {label: 'It combines unrelated domains only to shorten a component', value: 'Do not hide the architecture inside one Hook'},
  ]}
/>

## Exercise

Extract a `useKeyboardShortcut` Hook from repeated keyboard-listener logic. Keep the shortcut configuration reactive, ensure cleanup is correct, and decide whether the latest callback should use normal dependencies or an Effect Event.

## Interview questions

**Junior:** What does a custom Hook reuse?

**Mid-level:** Why do two components calling the same custom Hook not automatically share state?

**Senior:** How do you decide whether a custom Hook is a good abstraction or merely hidden complexity?

## Summary

<VisualDiagram title="Custom Hook summary">
  <LifecycleBar
    items={[
      {label: 'find one coherent stateful behaviour', tone: 'blue'},
      {label: 'extract Hook mechanics', tone: 'purple'},
      {label: 'keep ownership explicit', tone: 'cyan'},
      {label: 'design focused inputs/outputs', tone: 'green'},
      {label: 'share state only through a real shared owner', tone: 'orange'},
    ]}
  />
</VisualDiagram>

## References

- https://react.dev/learn/reusing-logic-with-custom-hooks
- https://react.dev/reference/react
- https://react.dev/reference/react/useEffectEvent

## Next

Continue with **[Context and useContext](../14-context/context-and-use-context.md)**.
