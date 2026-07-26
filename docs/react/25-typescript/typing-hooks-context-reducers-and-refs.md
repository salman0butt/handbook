---
title: Typing Hooks, Context, Reducers, Forms, and Refs
description: Advanced TypeScript patterns for React state, reducers, context, refs, forms, custom Hooks, and async state machines.
sidebar_position: 2
---

# Typing Hooks, Context, Reducers, Forms, and Refs

React's built-in types are designed to infer most ordinary Hook usage. Explicit types are most useful when the initial value is ambiguous, when state has multiple valid variants, or when a reusable Hook exposes a public API.

> **Mental model:** type the state machine and ownership boundary, not every local expression.

## 1. `useState`: let the initializer teach TypeScript

```tsx
const [count, setCount] = useState(0);
const [open, setOpen] = useState(false);
const [query, setQuery] = useState('');
```

Inference is already precise.

Explicit type arguments help when the initial value does not describe all future states:

```tsx
type User = {
  id: string;
  name: string;
};

const [user, setUser] = useState<User | null>(null);
```

Do not widen state unnecessarily:

```tsx
// Weak: any string is accepted.
const [status, setStatus] = useState<string>('idle');

// Better.
type Status = 'idle' | 'loading' | 'success' | 'error';
const [status, setStatus] = useState<Status>('idle');
```

## 2. Model async state as a discriminated union

Separate booleans often permit contradictory combinations:

```tsx
const [loading, setLoading] = useState(false);
const [error, setError] = useState<Error | null>(null);
const [data, setData] = useState<User[] | null>(null);
```

A state machine is easier to reason about:

```tsx
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

const [state, setState] = useState<AsyncState<User[]>>({ status: 'idle' });
```

Now narrowing follows the UI:

```tsx
if (state.status === 'success') {
  return <UserList users={state.data} />;
}
```

## 3. `useReducer`: type domain events, not setter commands

```tsx
type State = {
  count: number;
};

type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset'; to: number };

const initialState: State = { count: 0 };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: action.to };
  }
}
```

Because `Action` is a discriminated union, each branch gets the correct payload type automatically.

### Exhaustiveness checks

```tsx
function assertNever(value: never): never {
  throw new Error(`Unhandled value: ${JSON.stringify(value)}`);
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: action.to };
    default:
      return assertNever(action);
  }
}
```

If a new action is added and not handled, TypeScript can reveal the missing case.

## 4. Reducer lazy initialization

```tsx
type Settings = {
  theme: 'light' | 'dark';
  compact: boolean;
};

function init(raw: string | null): Settings {
  if (!raw) return { theme: 'light', compact: false };

  const parsed: unknown = JSON.parse(raw);
  return parseSettings(parsed);
}

const [settings, dispatch] = useReducer(reducer, localStorage.getItem('settings'), init);
```

TypeScript does not make `JSON.parse` trustworthy. `parseSettings` still needs runtime validation.

## 5. Context with a real default

```tsx
type Theme = 'light' | 'dark' | 'system';

const ThemeContext = createContext<Theme>('system');
```

The value type is straightforward because the default is meaningful.

## 6. Context without a meaningful default

When a provider is required, model that truthfully:

```tsx
type Session = {
  userId: string;
  email: string;
};

const SessionContext = createContext<Session | null>(null);

export function useSession(): Session {
  const session = useContext(SessionContext);

  if (session === null) {
    throw new Error('useSession must be used inside SessionProvider');
  }

  return session;
}
```

The custom Hook converts `Session | null` into `Session` after a runtime provider check.

This is better than lying to the type system with a fake default object.

## 7. Separate state and dispatch context types

```tsx
type Todo = {
  id: string;
  title: string;
  done: boolean;
};

type TodoAction =
  | { type: 'added'; todo: Todo }
  | { type: 'toggled'; id: string }
  | { type: 'removed'; id: string };

const TodosContext = createContext<Todo[] | null>(null);
const TodoDispatchContext = createContext<React.Dispatch<TodoAction> | null>(null);
```

This mirrors the architectural split between reading state and dispatching events.

## 8. `useRef` for DOM nodes

```tsx
const inputRef = useRef<HTMLInputElement>(null);

function focusInput() {
  inputRef.current?.focus();
}

return <input ref={inputRef} />;
```

The initial `null` is real: the DOM node does not exist before commit and becomes `null` again when detached.

Do not erase that lifecycle with unsafe non-null assertions unless the invariant is genuinely guaranteed at the usage point.

```tsx
inputRef.current!.focus(); // easy to misuse
```

## 9. Mutable refs that are not DOM refs

```tsx
const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
```

or:

```tsx
const latestRequestId = useRef<string | null>(null);
```

Refs are useful for values that must survive renders but do not drive rendering.

## 10. Imperative handles

Prefer narrow handles over exposing a full internal DOM tree.

```tsx
type SearchHandle = {
  focus: () => void;
  selectAll: () => void;
};

type SearchFieldProps = {
  ref?: React.Ref<SearchHandle>;
};

function SearchField({ ref }: SearchFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current?.focus();
    },
    selectAll() {
      inputRef.current?.select();
    },
  }));

  return <input ref={inputRef} type="search" />;
}
```

React 19 lets the ref be received as a normal function-component prop.

## 11. Typed custom Hooks

A custom Hook should expose a coherent domain API.

```tsx
type UseDisclosureResult = {
  open: boolean;
  show: () => void;
  hide: () => void;
  toggle: () => void;
};

function useDisclosure(initial = false): UseDisclosureResult {
  const [open, setOpen] = useState(initial);

  return {
    open,
    show: () => setOpen(true),
    hide: () => setOpen(false),
    toggle: () => setOpen((value) => !value),
  };
}
```

Inference can often provide the return type automatically. An explicit public return type is useful when you want the Hook contract to remain stable even if implementation details change.

## 12. Generic custom Hooks

```tsx
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  const previous = ref.current;
  ref.current = value;
  return previous;
}
```

Be careful: writing refs during render is generally constrained by React's purity rules. This simplified pattern is often shown historically, but production implementations should ensure they respect React's ref/render rules and update timing. A safer Effect-based previous-value Hook can be appropriate when the semantics are explicitly "last committed value".

```tsx
function usePreviousCommitted<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
```

## 13. Generic list selection

```tsx
function useSelection<T extends { id: string }>(items: readonly T[]) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = items.find((item) => item.id === selectedId) ?? null;

  return { selected, selectedId, setSelectedId };
}
```

Type the smallest structural requirement the Hook needs instead of forcing callers into one domain model.

## 14. Forms: DOM values start as strings

```tsx
function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const rawAge = formData.get('age');
}
```

`FormData.get()` returns `FormDataEntryValue | null`, not your domain type.

Validate and convert:

```tsx
if (typeof rawAge !== 'string') {
  throw new Error('Age is required');
}

const age = Number(rawAge);
if (!Number.isFinite(age)) {
  throw new Error('Age must be a number');
}
```

TypeScript cannot infer domain meaning from HTML form fields.

## 15. Typed field names

For application-owned form models:

```tsx
type ProfileForm = {
  displayName: string;
  bio: string;
};

type ProfileField = keyof ProfileForm;

function updateField<K extends ProfileField>(
  form: ProfileForm,
  field: K,
  value: ProfileForm[K],
): ProfileForm {
  return { ...form, [field]: value };
}
```

This can help reusable form infrastructure, but avoid overengineering small forms.

## 16. Action state with TypeScript

```tsx
type SaveState =
  | { status: 'idle' }
  | { status: 'success'; message: string }
  | { status: 'error'; fieldErrors: Record<string, string> };

async function saveProfile(
  previousState: SaveState,
  formData: FormData,
): Promise<SaveState> {
  // validate FormData here
  // perform mutation
  return { status: 'success', message: 'Saved' };
}

const [state, submitAction, isPending] = useActionState(
  saveProfile,
  { status: 'idle' } satisfies SaveState,
);
```

The Action receives runtime data. Strong return types improve UI narrowing, but form inputs still need validation.

## 17. `useOptimistic` and optimistic domain types

```tsx
type Message = {
  id: string;
  text: string;
  sending?: boolean;
};

const [optimisticMessages, addOptimisticMessage] = useOptimistic(
  messages,
  (current: Message[], text: string): Message[] => [
    ...current,
    { id: crypto.randomUUID(), text, sending: true },
  ],
);
```

Model optimistic-only fields explicitly instead of pretending optimistic data is identical to confirmed server data.

## 18. Typed external stores

```tsx
type Store<T> = {
  getSnapshot: () => T;
  subscribe: (listener: () => void) => () => void;
};

function useStore<T>(store: Store<T>): T {
  return useSyncExternalStore(store.subscribe, store.getSnapshot);
}
```

For SSR-capable stores, include a typed server snapshot function as part of the abstraction.

## 19. `useId` does not need a generic

```tsx
const inputId = useId();
```

It returns a string meant for identity relationships such as `htmlFor`, `aria-describedby`, and `aria-labelledby`.

Do not use it for domain IDs, cache keys, or list keys.

## 20. Avoid "type-level architecture astronautics"

These are warning signs:

- five generic parameters for a local component;
- conditional types nobody on the team can explain;
- exposing library internals through public types;
- massive prop unions to avoid writing two components;
- type assertions everywhere to make the abstraction compile.

Types should make the React ownership model clearer, not obscure it.

## 21. Debugging type errors systematically

When TypeScript reports a difficult React error:

1. identify the actual public boundary involved;
2. remove unrelated generic layers;
3. inspect inferred types in the editor;
4. narrow `unknown` instead of asserting;
5. check whether controlled/uncontrolled modes are mixed;
6. check whether `null` is a real lifecycle state;
7. verify whether a native DOM prop type already exists;
8. reduce the problem to a minimal component or Hook.

## Exercise

Build a typed task feature with:

- `Task` domain type;
- discriminated reducer actions;
- state and dispatch contexts;
- custom provider-required Hooks;
- a typed `TaskForm` using `FormData` validation;
- an optimistic `add task` state;
- a ref-based focus method for the title field;
- no `any` and no unsafe type assertions.

Explain which guarantees are compile-time and which still require runtime validation.

## Interview questions

1. When does `useState` need an explicit type argument?
2. Why are discriminated unions better than multiple booleans for async state?
3. How do you make reducer actions exhaustive?
4. Why should a provider-required context often use `T | null` plus a custom Hook?
5. Why is `useRef<HTMLInputElement>(null)` the honest DOM ref type?
6. How should `FormData` be converted into domain data safely?
7. What does TypeScript guarantee for `useActionState`, and what does it not guarantee?
8. How do generics help custom Hooks without overcoupling them to one domain model?

## References

- https://react.dev/learn/typescript
- https://react.dev/reference/react/useReducer
- https://react.dev/reference/react/useContext
- https://react.dev/reference/react/useRef
- https://react.dev/reference/react/useActionState
- https://react.dev/reference/react/useOptimistic
- https://react.dev/reference/react/useSyncExternalStore
