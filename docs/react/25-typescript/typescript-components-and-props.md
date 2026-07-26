---
title: React with TypeScript — Components, Props, Children, and Events
description: Type React components from first principles through reusable prop contracts, children, DOM props, events, and React 19 ref-as-prop patterns.
sidebar_position: 1
---

# React with TypeScript — Components, Props, Children, and Events

TypeScript is most valuable in React when it describes **component contracts** clearly enough that invalid UI states become difficult to express.

The goal is not to add type annotations everywhere. The goal is to let inference handle simple cases and add explicit types where they communicate ownership, variants, events, boundaries, and reusable APIs.

> **Mental model:** TypeScript checks the program before it runs. React still owns runtime rendering, state, Effects, Suspense, and DOM behavior.

## 1. Setup

React's official TypeScript guide expects React's type definitions and a TypeScript configuration that supports DOM APIs and JSX.

```bash
npm install --save-dev typescript @types/react @types/react-dom
```

A typical application config includes strict checking and modern JSX support:

```json
{
  "compilerOptions": {
    "strict": true,
    "jsx": "react-jsx",
    "lib": ["DOM", "DOM.Iterable", "ES2023"],
    "moduleResolution": "Bundler",
    "noEmit": true
  }
}
```

Frameworks and build tools may generate a more specific configuration. Follow their integration rather than copying configuration blindly.

Files containing JSX use the `.tsx` extension.

## 2. Prefer inference for local implementation details

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount((value) => value + 1)}>
      {count}
    </button>
  );
}
```

TypeScript already knows:

- `count` is a `number`;
- `setCount` accepts a number or updater function;
- the button's `onClick` receives the appropriate React event.

Adding explicit annotations to every local variable usually adds noise instead of safety.

## 3. Props are the component's public contract

```tsx
type UserCardProps = {
  name: string;
  email: string;
  isOnline?: boolean;
};

function UserCard({ name, email, isOnline = false }: UserCardProps) {
  return (
    <article>
      <h2>{name}</h2>
      <a href={`mailto:${email}`}>{email}</a>
      <p>{isOnline ? 'Online' : 'Offline'}</p>
    </article>
  );
}
```

Use either `type` or `interface` consistently with your team. Both work well for React props.

### Optional prop does not automatically mean optional behavior

```tsx
type AvatarProps = {
  src?: string;
};
```

This says callers may omit `src`. Your component must still define what omission means.

```tsx
function Avatar({ src }: AvatarProps) {
  if (!src) {
    return <DefaultAvatar />;
  }

  return <img src={src} alt="" />;
}
```

The type system describes the valid input shape. The component defines the behavior.

## 4. Model variants with discriminated unions

Avoid prop combinations that create contradictory states.

Weak API:

```tsx
type AlertProps = {
  loading?: boolean;
  error?: string;
  message?: string;
};
```

This permits nonsense such as loading, error, and success content at the same time.

Better:

```tsx
type AlertProps =
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'success'; message: string };

function Alert(props: AlertProps) {
  switch (props.status) {
    case 'loading':
      return <p>Loading…</p>;
    case 'error':
      return <p role="alert">{props.error}</p>;
    case 'success':
      return <p>{props.message}</p>;
  }
}
```

This mirrors React's state-modeling principle: make impossible UI combinations impossible to represent.

## 5. Callback props describe events in your component API

```tsx
type SearchBoxProps = {
  value: string;
  onValueChange: (value: string) => void;
};

function SearchBox({ value, onValueChange }: SearchBoxProps) {
  return (
    <input
      type="search"
      value={value}
      onChange={(event) => onValueChange(event.currentTarget.value)}
    />
  );
}
```

Notice the abstraction boundary:

- inside the component, the browser gives React a change event;
- outside the component, consumers receive the domain value they care about.

Do not expose a DOM event merely because the implementation happens to use an `<input>` unless callers actually need that event.

## 6. Type DOM events when extracting handlers

Inline handlers are usually inferred:

```tsx
<input onChange={(event) => console.log(event.currentTarget.value)} />
```

Extracted handlers may need an explicit type:

```tsx
function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
  console.log(event.currentTarget.value);
}
```

Useful event types include:

```tsx
React.MouseEvent<HTMLButtonElement>
React.ChangeEvent<HTMLInputElement>
React.FormEvent<HTMLFormElement>
React.KeyboardEvent<HTMLInputElement>
React.FocusEvent<HTMLInputElement>
```

You can also type the complete handler:

```tsx
const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
  console.log(event.currentTarget.value);
};
```

### Prefer `currentTarget` when you mean the element owning the handler

```tsx
function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  const form = event.currentTarget;
}
```

`target` is the deepest origin of an event. `currentTarget` is the element whose handler is currently running.

## 7. Children types

### Any renderable React content

```tsx
type PanelProps = {
  title: string;
  children: React.ReactNode;
};
```

`ReactNode` covers the normal things React can render: elements, strings, numbers, fragments, nullish content, and more.

### Require a React element

```tsx
type SingleChildProps = {
  children: React.ReactElement;
};
```

This is narrower than `ReactNode`.

Do not assume TypeScript can reliably enforce that children are specifically `<li>` elements or one particular component type. JSX element typing does not provide that kind of runtime child validation in a robust way.

## 8. Render props

```tsx
type DataState<T> =
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'success'; data: T };

type DataViewProps<T> = {
  state: DataState<T>;
  children: (data: T) => React.ReactNode;
};

function DataView<T>({ state, children }: DataViewProps<T>) {
  if (state.status === 'loading') return <p>Loading…</p>;
  if (state.status === 'error') return <p role="alert">{state.error.message}</p>;
  return <>{children(state.data)}</>;
}
```

Callers get domain-specific inference:

```tsx
<DataView state={usersState}>
  {(users) => users.map((user) => <UserCard key={user.id} {...user} />)}
</DataView>
```

## 9. Reuse native DOM prop contracts instead of recreating HTML

A reusable button should usually accept normal button props.

```tsx
type ButtonProps = React.ComponentPropsWithoutRef<'button'> & {
  tone?: 'primary' | 'secondary';
};

function Button({ tone = 'primary', className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`button button--${tone} ${className ?? ''}`}
    />
  );
}
```

This automatically includes properties such as:

- `type`;
- `disabled`;
- `onClick`;
- `aria-*`;
- `data-*`;
- standard button attributes.

### Avoid weakening native contracts

```tsx
// Too broad for a real button API.
type BadButtonProps = {
  onClick?: (...args: any[]) => void;
  [key: string]: any;
};
```

Use existing React DOM types whenever the component truly wraps a native element.

## 10. React 19: `ref` can be a normal prop for function components

React 19 supports passing `ref` to function components without requiring `forwardRef` as the default new-code pattern.

```tsx
type TextInputProps = React.ComponentPropsWithRef<'input'> & {
  label: string;
};

function TextInput({ label, ref, ...props }: TextInputProps) {
  return (
    <label>
      {label}
      <input ref={ref} {...props} />
    </label>
  );
}
```

You can also declare the ref explicitly:

```tsx
type SearchInputProps = {
  ref?: React.Ref<HTMLInputElement>;
  value: string;
  onValueChange: (value: string) => void;
};
```

Use the narrowest imperative surface you can. A ref should not become a substitute for normal data flow.

## 11. Style props

```tsx
type BoxProps = {
  style?: React.CSSProperties;
};
```

`CSSProperties` gives editor completion and validates known CSS properties.

Prefer semantic component props over exposing giant style objects when the design system has a fixed API.

```tsx
type StackProps = {
  gap?: 'xs' | 'sm' | 'md' | 'lg';
  align?: 'start' | 'center' | 'end' | 'stretch';
  children: React.ReactNode;
};
```

## 12. Component return types

In modern TypeScript + React code, return type inference is usually sufficient:

```tsx
function EmptyState() {
  return <p>No results</p>;
}
```

When you need an explicit contract, use a type appropriate to the actual API rather than mechanically annotating every component.

```tsx
function renderStatus(status: Status): React.ReactNode {
  // ...
}
```

## 13. Defaults belong in JavaScript parameter syntax

For function components in React 19, use normal JavaScript defaults:

```tsx
type BadgeProps = {
  tone?: 'neutral' | 'success' | 'danger';
};

function Badge({ tone = 'neutral' }: BadgeProps) {
  return <span data-tone={tone}>{tone}</span>;
}
```

Do not design new function-component APIs around `defaultProps`.

## 14. Controlled and uncontrolled prop contracts

A component may intentionally support either controlled or uncontrolled usage. Make the modes explicit.

```tsx
type ControlledProps = {
  value: string;
  defaultValue?: never;
  onValueChange: (value: string) => void;
};

type UncontrolledProps = {
  value?: never;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

type TextFieldProps = (ControlledProps | UncontrolledProps) & {
  label: string;
};
```

This prevents callers from accidentally passing both `value` and `defaultValue`.

Use this pattern when the distinction is genuinely part of the public API; do not make simple components excessively clever.

## 15. Do not confuse compile-time types with runtime validation

This is safe only for data TypeScript already controls:

```tsx
function Profile({ user }: { user: User }) {
  return <h1>{user.name}</h1>;
}
```

But data crossing a runtime boundary still needs validation:

```tsx
const response = await fetch('/api/user');
const unknownData: unknown = await response.json();

const user = UserSchema.parse(unknownData);
```

Important runtime boundaries include:

- network responses;
- local storage;
- URL parameters;
- Server Function arguments;
- form data;
- postMessage events;
- third-party scripts.

Type assertions do not validate runtime data:

```tsx
const user = (await response.json()) as User; // assertion, not validation
```

## 16. Common mistakes

### Using `any` to silence design problems

```tsx
function handle(data: any) {
  // Type safety ends here.
}
```

Prefer `unknown` at untrusted boundaries, then narrow or validate it.

### Typing implementation details instead of the public contract

A `<Select>` caller should usually care about `value` and `onValueChange`, not the exact DOM event used internally.

### Boolean-prop explosion

```tsx
<Button primary danger loading compact rounded />
```

Prefer explicit variants when combinations matter.

### Reimplementing native HTML prop types

Use `ComponentPropsWithoutRef<'button'>`, `ComponentPropsWithRef<'input'>`, and related React utility types when wrapping native elements.

### Treating TypeScript as accessibility validation

A correctly typed `<div onClick={...}>` can still be an inaccessible control. Semantic correctness is a separate concern.

## 17. Production checklist

Before publishing a reusable component API, ask:

1. What does the caller need to provide?
2. Which states are valid?
3. Can a discriminated union remove invalid combinations?
4. Should the component expose domain values or DOM events?
5. Does it wrap a native element whose props should be reused?
6. Is `ref` intentionally part of the API?
7. Are runtime inputs validated at trust boundaries?
8. Do semantic HTML and accessibility constraints still hold?

## Exercise

Build a typed `<AsyncButton>` with these requirements:

- all standard `<button>` props;
- `status: 'idle' | 'pending' | 'success' | 'error'`;
- disallow `onClick` while a separate `action` prop is supplied;
- preserve normal `aria-*` props;
- expose a React 19 ref prop;
- show how callers get useful inference.

Then explain which constraints TypeScript can enforce and which still require runtime behavior or accessibility tests.

## Interview questions

1. When should React code rely on TypeScript inference instead of explicit annotations?
2. What is the difference between `ReactNode` and `ReactElement`?
3. Why are discriminated unions useful for component state and variants?
4. Why might a component expose `onValueChange(value)` instead of `onChange(event)`?
5. How do `ComponentPropsWithoutRef` and `ComponentPropsWithRef` help design-system components?
6. How does React 19 change the common ref typing story for function components?
7. Why is `as User` not equivalent to validating unknown API data?
8. How would you type controlled and uncontrolled modes so callers cannot mix them accidentally?

## References

- https://react.dev/learn/typescript
- https://react.dev/reference/react-dom/components/common
- https://react.dev/reference/react-dom/components/input
- https://www.typescriptlang.org/docs/handbook/2/types-from-types.html
