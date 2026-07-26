---
title: Advanced TypeScript Component API Design
description: Design reusable React component APIs with generics, variants, polymorphism, composition, type-safe callbacks, and maintainable library boundaries.
sidebar_position: 3
---

# Advanced TypeScript Component API Design

Advanced React TypeScript is not about making types as clever as possible. It is about expressing component contracts that remain understandable as a design system or product grows.

> **Mental model:** a good component type describes the UI contract at the same abstraction level as the component itself.

## 1. Start with domain intent

Weak API:

```tsx
type ProductRowProps = {
  data: any;
  onAction: (...args: any[]) => void;
};
```

Better:

```tsx
type Product = {
  id: string;
  name: string;
  priceCents: number;
};

type ProductRowProps = {
  product: Product;
  onSelect: (productId: Product['id']) => void;
};
```

The API now communicates ownership and intent.

## 2. Generic list components

```tsx
type ListProps<T> = {
  items: readonly T[];
  getKey: (item: T) => React.Key;
  renderItem: (item: T) => React.ReactNode;
};

function List<T>({ items, getKey, renderItem }: ListProps<T>) {
  return (
    <ul>
      {items.map((item) => (
        <li key={getKey(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}
```

Usage preserves inference:

```tsx
<List
  items={users}
  getKey={(user) => user.id}
  renderItem={(user) => user.name}
/>
```

Avoid requiring callers to specify generic arguments when inference can do the work.

## 3. Generic selection components

```tsx
type SelectListProps<T> = {
  items: readonly T[];
  value: T | null;
  onChange: (next: T) => void;
  getKey: (item: T) => React.Key;
  renderLabel: (item: T) => React.ReactNode;
};
```

Be careful with object identity. If selection semantics are really ID-based, type that directly instead of pretending the whole object is the identity.

```tsx
type SelectByIdProps<T extends { id: string }> = {
  items: readonly T[];
  selectedId: string | null;
  onSelectedIdChange: (id: string) => void;
};
```

Type design should reinforce the same identity model React uses conceptually.

## 4. Variants with unions

```tsx
type ButtonProps =
  | {
      kind: 'button';
      onClick: () => void;
      href?: never;
    }
  | {
      kind: 'link';
      href: string;
      onClick?: never;
    };
```

This can be appropriate when the semantic element truly changes.

However, do not create one mega-component for every possible interactive element. Sometimes two small components are clearer:

```tsx
<Button />
<LinkButton />
```

## 5. Polymorphic `as` props: use sparingly

A simplified polymorphic pattern:

```tsx
type BoxOwnProps = {
  gap?: number;
};

type BoxProps<E extends React.ElementType> = BoxOwnProps &
  Omit<React.ComponentPropsWithRef<E>, keyof BoxOwnProps | 'as'> & {
    as?: E;
  };

function Box<E extends React.ElementType = 'div'>({
  as,
  gap,
  style,
  ...props
}: BoxProps<E>) {
  const Component = as ?? 'div';

  return (
    <Component
      {...props}
      style={{ ...style, display: 'flex', gap }}
    />
  );
}
```

This is powerful but can become difficult to maintain.

Ask first:

- Does the component genuinely need arbitrary element substitution?
- Will semantic requirements remain correct for every `as` value?
- Does ref typing remain useful?
- Is a smaller set of explicit variants easier?

A polymorphic type cannot guarantee semantic accessibility.

## 6. Reuse native prop types with `Omit`

Suppose your design system wants its own `size` prop for an input:

```tsx
type TextInputProps = Omit<
  React.ComponentPropsWithRef<'input'>,
  'size'
> & {
  size?: 'sm' | 'md' | 'lg';
};
```

Use `Omit` only where your component intentionally changes a native contract.

Do not casually shadow native meanings.

## 7. Prefer composition over huge generic prop matrices

Overloaded API:

```tsx
<DataTable
  editable
  selectable
  expandable
  sortable
  virtualized
  treeMode
  serverMode
/>
```

Composition can produce clearer ownership:

```tsx
<Table>
  <SelectableRows />
  <SortableHeader />
</Table>
```

TypeScript should support the architecture, not compensate for an overgrown API.

## 8. Compound components

```tsx
type TabsContextValue = {
  value: string;
  setValue: (value: string) => void;
};

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Tabs components must be inside <Tabs>');
  return context;
}
```

Compound components can create expressive APIs:

```tsx
<Tabs value={tab} onValueChange={setTab}>
  <Tabs.List>
    <Tabs.Trigger value="details">Details</Tabs.Trigger>
    <Tabs.Trigger value="reviews">Reviews</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Panel value="details">...</Tabs.Panel>
</Tabs>
```

Types help with props, but they do not by themselves enforce correct keyboard semantics, ARIA relationships, or structural placement. Runtime/context checks and accessibility behavior still matter.

## 9. Callback variance and domain boundaries

Prefer the smallest useful callback contract.

```tsx
type RowProps = {
  onDelete: (id: string) => void;
};
```

Instead of:

```tsx
type RowProps = {
  onDelete: (event: React.MouseEvent, row: Row, index: number) => void;
};
```

The latter exposes implementation details and makes consumers more coupled.

## 10. Expose read-only input when callers should not mutate

```tsx
type TableProps<T> = {
  rows: readonly T[];
};
```

`readonly` communicates ownership: the table reads the collection; it does not own permission to mutate it.

Likewise:

```tsx
type Config = Readonly<{
  pageSize: number;
  compact: boolean;
}>;
```

This complements React's immutability model.

## 11. Use `satisfies` to validate without widening away useful literals

```tsx
const routes = {
  home: '/',
  settings: '/settings',
} satisfies Record<string, string>;
```

For reducer state or variants:

```tsx
const initialState = {
  status: 'idle',
  items: [],
} satisfies State;
```

`satisfies` checks compatibility while often preserving more useful inferred information than a broad annotation.

## 12. Avoid unsafe assertions in component libraries

```tsx
const value = props.value as T;
```

An assertion shifts responsibility from the compiler to you.

If a generic design requires repeated casts, reconsider whether the abstraction accurately models runtime behavior.

## 13. Public types should be stable

A library component should expose public concepts, not internal implementation structures.

Bad:

```tsx
type DatePickerProps = {
  internalReducerState: InternalDatePickerState;
};
```

Better:

```tsx
type DatePickerProps = {
  value: Date | null;
  onValueChange: (value: Date | null) => void;
};
```

This gives maintainers freedom to change the internal reducer later.

## 14. Export types intentionally

Useful exports may include:

```tsx
export type ButtonProps = ...;
export type SelectOption = ...;
```

Do not automatically export every internal helper type.

A smaller public type surface is easier to evolve.

## 15. Event handler aliases for reusable APIs

When a component deliberately mirrors a native event:

```tsx
type InputProps = {
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};
```

When it abstracts the DOM:

```tsx
type InputProps = {
  onValueChange?: (value: string) => void;
};
```

Choose based on the component's level of abstraction.

## 16. Ref contracts should match the ownership boundary

A thin wrapper may expose the underlying element:

```tsx
type ButtonProps = React.ComponentPropsWithRef<'button'>;
```

A complex widget may expose a custom handle:

```tsx
type DialogHandle = {
  focusInitial: () => void;
};
```

Do not expose DOM internals merely because TypeScript can type them.

## 17. HOCs: preserve types, but prefer Hooks/composition for new architecture

A generic HOC can be typed, but complexity rises quickly:

```tsx
function withLoading<P extends object>(
  Component: React.ComponentType<P>,
) {
  return function WithLoading(props: P & { loading: boolean }) {
    if (props.loading) return <p>Loading…</p>;

    const { loading: _loading, ...rest } = props;
    return <Component {...(rest as P)} />;
  };
}
```

Notice the assertion pressure.

For many modern use cases, composition or custom Hooks produce simpler type boundaries.

HOCs still matter for maintaining existing libraries and cross-cutting wrappers, so understand them without making them the default architecture.

## 18. Component factories and Hook factories need care

React's compiler-aware lint rules include checks around component and Hook factories because dynamic definitions can undermine stable identity or static analysis.

Prefer stable module-level component definitions:

```tsx
function UserRow({ user }: { user: User }) {
  return <li>{user.name}</li>;
}
```

Instead of creating component types during render:

```tsx
function Screen() {
  function UserRow() {
    // New component identity every Screen render.
    return <li>...</li>;
  }

  return <UserRow />;
}
```

Type correctness does not make unstable React identity correct.

## 19. Server/client serialization changes API design

At an RSC client boundary, props must be serializable according to the framework/React transport contract.

A TypeScript type such as this may compile:

```tsx
type ClientWidgetProps = {
  onSave: () => void;
};
```

But a normal function cannot simply cross a Server Component → Client Component serialization boundary. Server Functions have their own supported transport semantics.

Again: compile-time assignability is not the same as runtime transport capability.

## 20. Test your type surface

For a reusable package, consider type-level examples or compile-time tests that prove:

- valid calls compile;
- invalid prop combinations fail;
- generics infer as intended;
- refs point at the correct type;
- exported types remain backward compatible.

Runtime tests are still required for rendering and behavior.

## 21. API design review checklist

For every reusable component, ask:

1. What is the abstraction level: DOM wrapper, design-system primitive, or domain component?
2. Are invalid prop combinations representable?
3. Are callbacks domain-oriented or leaking implementation details?
4. Can native prop contracts be reused?
5. Does generic inference work without explicit type arguments?
6. Is polymorphism genuinely needed?
7. Does the ref expose too much?
8. Are public types stable enough to version?
9. Do server/client runtime boundaries match the types?
10. Is the type system making the component easier to understand?

## Exercise

Design a typed reusable `DataTable<T>` API with:

- read-only rows;
- stable `getRowId` identity;
- generic column definitions;
- typed selection by ID;
- optional render functions;
- a ref exposing only `focusFirstRow()`;
- no `any`;
- no requirement for callers to write `<DataTable<User>>` explicitly;
- clear explanation of what accessibility behavior types cannot enforce.

## Interview questions

1. When are generics useful in React component APIs?
2. Why might `readonly T[]` be better than `T[]` for props?
3. When is a polymorphic `as` prop worth the type complexity?
4. Why should callbacks expose domain concepts instead of DOM implementation details?
5. What is the benefit of `satisfies` for configuration and state objects?
6. Why are repeated `as T` assertions often a smell in generic components?
7. How do RSC serialization boundaries reveal limits of compile-time typing?
8. Why can a simpler pair of components be better than one highly polymorphic component?

## References

- https://react.dev/learn/typescript
- https://react.dev/reference/react
- https://react.dev/reference/rules/components-and-hooks-must-be-pure
- https://www.typescriptlang.org/docs/handbook/2/generics.html
