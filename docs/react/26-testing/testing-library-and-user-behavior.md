---
title: Testing React Through User Behavior
description: Build reliable React tests with Testing Library, semantic queries, user interactions, component boundaries, and behavior-focused assertions.
sidebar_position: 1
---

import {
  VisualDiagram,
  DiagramStack,
  DiagramRow,
  DiagramGrid,
  DiagramNode,
  DiagramArrow,
  DecisionTree,
  LifecycleBar,
} from '@site/src/components/handbook/VisualDiagram'

# Testing React Through User Behavior

A React test is strongest when it protects what a user can **perceive and do**, not private implementation details.

<VisualDiagram title="The default component-test contract">
  <DiagramRow>
    <DiagramNode title="Render" tone="blue">Real component tree</DiagramNode>
    <DiagramArrow direction="right" label="find semantically" />
    <DiagramNode title="Interact" tone="purple">Click · type · keyboard · focus</DiagramNode>
    <DiagramArrow direction="right" label="observe" />
    <DiagramNode title="Assert" tone="green">DOM state users can experience</DiagramNode>
  </DiagramRow>
</VisualDiagram>

This keeps tests aligned with roles, names, labels, text, focus, pending states, validation, and visible outcomes.

## Test behavior, not React internals

Weak goals include asserting a private state variable changed, a Hook ran exactly once, or a child was shallow-rendered with a specific internal prop.

Strong goals include:

- a dialog appears after activating its trigger;
- the submit button becomes disabled while work is pending;
- validation feedback is associated with the field;
- focus returns after closing a modal;
- a successful mutation changes the visible list.

<DecisionTree
  question="What should this component test assert?"
  items={[
    { label: 'A user-visible DOM state or interaction changed', value: 'Assert the observable behavior' },
    { label: 'A reusable pure reducer/selector has important domain rules', value: 'Unit-test that pure logic separately' },
    { label: 'Only a private Hook variable or render count changed', value: 'Usually do not make that the contract' },
  ]}
/>

## Testing Library's philosophy

```tsx
import { render, screen } from '@testing-library/react';

it('renders the account name', () => {
  render(<AccountCard name="Aisha" />);
  expect(screen.getByRole('heading', { name: 'Aisha' })).toBeInTheDocument();
});
```

The important part is the semantic query, not the library syntax.

## Query priority

<VisualDiagram title="Prefer queries that follow the accessibility surface">
  <DiagramStack>
    <DiagramNode title="1 · Role + accessible name" tone="green">button, heading, dialog, navigation</DiagramNode>
    <DiagramArrow label="if no suitable role" />
    <DiagramNode title="2 · Label" tone="teal">forms and named controls</DiagramNode>
    <DiagramArrow label="then contextual text" />
    <DiagramNode title="3 · Text / placeholder / display value / alt" tone="blue">when semantically appropriate</DiagramNode>
    <DiagramArrow label="last resort" />
    <DiagramNode title="4 · Test ID" tone="orange">structural hook with no meaningful user-facing selector</DiagramNode>
  </DiagramStack>
</VisualDiagram>

Prefer:

```tsx
screen.getByRole('button', { name: 'Save profile' });
```

over:

```tsx
screen.getByTestId('save-button');
```

## `getBy`, `queryBy`, and `findBy`

<DiagramGrid columns={3}>
  <DiagramNode title="getBy" tone="green">Should exist now. Missing or ambiguous matches throw.</DiagramNode>
  <DiagramNode title="queryBy" tone="orange">Use primarily when asserting absence.</DiagramNode>
  <DiagramNode title="findBy" tone="teal">Should appear asynchronously; await the semantic result.</DiagramNode>
</DiagramGrid>

```tsx
screen.getByRole('button', { name: 'Submit' });
expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
const alert = await screen.findByRole('alert');
```

## Accessible names are part of behavior

```tsx
<button aria-label="Delete invoice">
  <TrashIcon />
</button>
```

```tsx
screen.getByRole('button', { name: 'Delete invoice' });
```

If the name disappears, the test fails in the same area where assistive-technology users would lose the control's meaning.

## Prefer visible labels for forms

```tsx
<label>
  Email
  <input type="email" />
</label>
```

```tsx
screen.getByRole('textbox', { name: 'Email' });
// or
screen.getByLabelText('Email');
```

## Interact the way users do

```tsx
const user = userEvent.setup();
render(<LoginForm />);

await user.type(screen.getByLabelText('Email'), 'aisha@example.com');
await user.type(screen.getByLabelText('Password'), 'correct horse battery staple');
await user.click(screen.getByRole('button', { name: 'Sign in' }));
```

<VisualDiagram title="Why user-event is usually stronger than calling handlers">
  <DiagramRow>
    <DiagramNode title="User intent" tone="blue">keyboard / pointer behavior</DiagramNode>
    <DiagramArrow direction="right" label="browser-like interaction" />
    <DiagramNode title="Rendered wiring" tone="purple">DOM event → React handler</DiagramNode>
    <DiagramArrow direction="right" label="result" />
    <DiagramNode title="Visible contract" tone="green">focus · state · output</DiagramNode>
  </DiagramRow>
</VisualDiagram>

Use `fireEvent` when you specifically need lower-level event dispatch that `user-event` does not model.

## Assert observable state

```tsx
expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
expect(screen.getByRole('dialog')).toBeVisible();
expect(screen.getByLabelText('Email')).toHaveValue('aisha@example.com');
expect(screen.getByRole('alert')).toHaveTextContent('Email is required');
expect(screen.getByRole('tab', { name: 'Billing' })).toHaveAttribute('aria-selected', 'true');
```

## Controlled components: test through the parent contract

```tsx
function ControlledHarness() {
  const [value, setValue] = useState('');
  return <SearchBox value={value} onValueChange={setValue} />;
}
```

Type into the field and assert the visible value. Do not mutate props or private state directly.

## Custom Hooks: test at the most meaningful boundary

If a Hook exists only to support a component, prefer testing through that component. For reusable Hook libraries, a harness is appropriate.

```tsx
function DisclosureHarness() {
  const disclosure = useDisclosure();

  return (
    <>
      <button onClick={disclosure.show}>Open</button>
      {disclosure.open && <div role="dialog">Settings</div>}
    </>
  );
}
```

## Providers belong in test infrastructure

```tsx
function renderApp(ui: React.ReactElement) {
  return render(
    <ThemeProvider>
      <RouterProvider router={router}>{ui}</RouterProvider>
    </ThemeProvider>,
  );
}
```

Keep helpers honest about which providers a feature actually needs.

## Pure reducers can have direct unit tests

```tsx
expect(reducer({ count: 0 }, { type: 'increment' })).toEqual({ count: 1 });
```

<VisualDiagram title="These tests protect different failure modes">
  <DiagramRow>
    <DiagramNode title="Reducer test" tone="blue">Domain transition is correct</DiagramNode>
    <DiagramNode title="Component test" tone="purple">User action dispatches and renders correctly</DiagramNode>
    <DiagramNode title="Browser test" tone="green">Critical journey works in the real platform</DiagramNode>
  </DiagramRow>
</VisualDiagram>

## Mock boundaries, not the application

Good test-double boundaries include network transport, clocks, randomness, unsupported browser APIs, and expensive third-party integrations.

Avoid mocking React itself, every child, every custom Hook, or every module in a feature. Excessive mocking creates confidence in a fake architecture.

<DecisionTree
  question="Should this dependency be mocked?"
  items={[
    { label: 'External network/platform/clock boundary', value: 'Usually a good controlled test double' },
    { label: 'Simple real child/provider needed by the behavior', value: 'Prefer keeping it real' },
    { label: 'Third-party integration is expensive or unavailable in the environment', value: 'Mock the integration boundary, not React internals' },
  ]}
/>

## Network behavior should include failure states

A network-backed component should exercise loading, success, error, retry, cancellation where relevant, and optimistic behavior.

## Snapshot tests are specialized

Large snapshots are easy to approve without understanding the change. Prefer targeted semantic assertions unless the serialized output itself is the behavior you intend to protect.

## Test IDs can be legitimate

Use a `data-testid` when no meaningful semantic selector exists—for example a canvas marker or purely structural rendering hook. Do not add one automatically to every element.

## Strict Mode

Strict Mode can expose purity, Effect, ref, and cleanup assumptions.

Weak when call count is not the product contract:

```tsx
expect(connect).toHaveBeenCalledTimes(1);
```

Stronger:

```tsx
expect(screen.getByText('Connected')).toBeVisible();
```

When protocol call counts genuinely matter, assert them deliberately and account for the test environment.

## Accessibility assertions are behavior assertions

```tsx
expect(screen.getByRole('button', { name: 'Close dialog' })).toBeVisible();
expect(screen.getByLabelText('Password')).toHaveAttribute(
  'aria-describedby',
  expect.stringContaining('password-hint'),
);
```

Semantic tests improve accessibility confidence, but automated tests do not replace keyboard, screen-reader, contrast, and real-browser review for complex widgets.

## Test names should describe contracts

Good:

- `shows validation feedback when email is empty`;
- `returns focus to the trigger after closing the dialog`;
- `keeps previous results visible while new search is pending`;
- `announces a failed save through an alert`.

Avoid names such as `sets isOpen to true` or `calls useEffect` when those are only implementation details.

## Review checklist

1. Can the test locate important UI by role/name or label?
2. Does interaction happen through rendered behavior?
3. Are assertions user-observable?
4. Are mocks placed at real boundaries?
5. Are failure/pending states covered where relevant?
6. Does focus/accessibility behavior have protection?
7. Would an internal refactor leave the test valid if behavior did not change?

## Interview questions

1. What does it mean to test React through user behavior?
2. Why is `getByRole` often stronger than `getByTestId`?
3. When should you use `getBy`, `queryBy`, and `findBy`?
4. Why is `user-event` usually preferable to manually invoking handlers?
5. Which boundaries are reasonable to mock?
6. Why can a reducer unit test and component test both be valuable?

## References

- https://testing-library.com/docs/react-testing-library/intro/
- https://testing-library.com/docs/queries/about/
- https://testing-library.com/docs/user-event/intro/
- https://react.dev/reference/react/act
