---
title: Context API Production Patterns
description: Apply Context deliberately with reducers, read/write boundaries, provider scope, performance analysis, testing, and migration criteria.
sidebar_position: 2
---

# Context API production patterns

The React handbook already covers `createContext`, `useContext`, provider lookup, value identity, provider architecture, and reducer + Context in depth.

This chapter connects those core chapters directly to the state-management ecosystem.

## The model to keep

```text
State owner
useState / useReducer
        │
        ▼
Provider
        │
        ▼
Context channel
        │
        ▼
Consumers
```

Context is not a store by itself. A provider may own state, but the Context object is the distribution channel.

## Basic production pattern

```tsx
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from 'react'

type Theme = 'light' | 'dark'

type ThemeContextValue = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState<Theme>('light')

  const value = useMemo(
    () => ({ theme, setTheme }),
    [theme],
  )

  return <ThemeContext value={value}>{children}</ThemeContext>
}

export function useTheme() {
  const value = useContext(ThemeContext)

  if (value === null) {
    throw new Error('useTheme must be used inside ThemeProvider')
  }

  return value
}
```

Do not add `useMemo` automatically. Use it when provider renders unrelated to the value are meaningful and profiling shows broad consumer work matters.

## Provider scope is state scope

Bad default:

```text
App
└── GiantAppProvider
    └── everything
```

Better:

```text
App
├── AuthProvider
│   └── Router
│
├── Storefront
│   └── CartProvider
│       ├── Products
│       └── Checkout
│
└── Admin
    └── AdminPreferencesProvider
```

Place the provider around the smallest subtree that genuinely shares the dependency.

## Context + reducer

Use a reducer when the important problem is **state transition design**.

```tsx
type CartItem = {
  id: string
  name: string
  quantity: number
}

type CartAction =
  | { type: 'itemAdded'; item: Omit<CartItem, 'quantity'> }
  | { type: 'itemRemoved'; id: string }
  | { type: 'quantityChanged'; id: string; quantity: number }

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'itemAdded':
      return [...state, { ...action.item, quantity: 1 }]

    case 'itemRemoved':
      return state.filter((item) => item.id !== action.id)

    case 'quantityChanged':
      return state.map((item) =>
        item.id === action.id
          ? { ...item, quantity: action.quantity }
          : item,
      )

    default:
      return state
  }
}
```

Architecture:

```text
UI event
   │
   ▼
dispatch(action)
   │
   ▼
reducer(currentState, action)
   │
   ▼
next state
   │
   ▼
provider publishes value
   │
   ▼
consumers update
```

## Split read and write contexts

When some components only dispatch and others only read state, separating the channels can improve API clarity.

```tsx
const CartStateContext = createContext<CartItem[] | null>(null)
const CartDispatchContext = createContext<React.Dispatch<CartAction> | null>(null)
```

```text
CartProvider
├── CartStateContext
│   └── components that read cart state
│
└── CartDispatchContext
    └── components that only send commands
```

This does not automatically solve all rendering concerns, but it avoids forcing dispatch-only consumers to depend on the full state value.

## Context is not a selector API

This:

```tsx
const { theme } = useContext(AppContext)
```

does not mean the component subscribes only to `theme`.

The component reads the Context value.

If the value changes because another property changed, the Context consumer participates in that update.

If fine-grained subscriptions matter, consider:

- splitting Contexts;
- moving state closer to consumers;
- Zustand selectors;
- Redux selectors;
- a custom external store with `useSyncExternalStore`.

## Context is not a server cache

Bad architecture:

```text
ProductsProvider
├── fetch products
├── retry requests
├── cache results
├── track stale time
├── refetch on focus
├── invalidate after mutations
└── manage pagination
```

At this point you are rebuilding a server-state system.

Prefer TanStack Query or a framework-native server data/cache solution when remote data lifecycle is the real problem.

## Context vs Redux Toolkit

Prefer Context when:

- state belongs to a coherent subtree;
- update logic is not broadly cross-feature;
- you do not need a central event log/middleware ecosystem;
- dependencies naturally follow the component tree.

Consider Redux Toolkit when:

- many features coordinate through shared state;
- action-driven transitions are useful across domains;
- tooling/middleware/traceability matters;
- normalized entity state or structured async workflows matter.

## Context vs Zustand

Prefer Context when:

- provider scope expresses the architecture well;
- updates are not extremely frequent;
- consumer groups can share the same value boundary.

Consider Zustand when:

- independent selector subscriptions matter;
- non-React code needs store access;
- store lifetime should not depend on one provider tree;
- you want a focused external store with low ceremony.

## Testing Context

Test behavior through a provider rather than testing implementation details of the Context object.

```tsx
function renderWithTheme(ui: React.ReactNode) {
  return render(
    <ThemeProvider>
      {ui}
    </ThemeProvider>,
  )
}
```

Then assert user-visible behavior:

```tsx
it('changes the visible theme', async () => {
  const user = userEvent.setup()

  renderWithTheme(<ThemeSettings />)

  await user.click(screen.getByRole('button', { name: /dark/i }))

  expect(screen.getByText(/current theme: dark/i)).toBeInTheDocument()
})
```

## Debugging checklist

When Context feels wrong, ask:

1. Is the provider above the consumer?
2. Is there a nearer provider shadowing the value?
3. Is one giant Context coupling unrelated domains?
4. Is provider value identity changing frequently?
5. Are consumers actually expensive?
6. Should state be local instead?
7. Is this server state?
8. Do consumers need selectors?
9. Must non-React code read/write the state?

## Migration trigger

Do not migrate from Context to Redux or Zustand because the code "looks big."

Migrate because a concrete requirement appears:

```text
Context architecture
      │
      ├── independent slices needed
      ├── high-frequency updates
      ├── cross-root access
      ├── non-React subscribers
      ├── event/middleware requirements
      └── tooling/traceability requirements
             │
             ▼
      external store may fit better
```

## Interview questions

**Junior:** Does Context create state?

**Mid-level:** Why does destructuring one field from a Context value not create a selector subscription?

**Senior:** When would you split Contexts versus move to an external store?

**Staff:** How would you prove that replacing Context with Redux Toolkit or Zustand is worth the migration cost?

## References

- https://react.dev/reference/react/createContext
- https://react.dev/reference/react/useContext
- https://react.dev/learn/scaling-up-with-reducer-and-context
- See also: Context and `useContext`, Context Architecture and Performance, and reducer + Context chapters earlier in this handbook.
