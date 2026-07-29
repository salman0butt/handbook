---
title: Form Actions and useFormStatus
description: Learn React 19 function-valued form actions, automatic form behavior, useFormStatus, pending UI, FormData, and progressive enhancement boundaries.
sidebar_position: 3
---

import {
  DecisionTree,
  DiagramArrow,
  DiagramGrid,
  DiagramNode,
  DiagramStack,
  LifecycleBar,
  VisualDiagram,
} from '@site/src/components/handbook/VisualDiagram'

# Form Actions and `useFormStatus`

React 19 extends the browser `<form>` model so the `action` prop can be a function.

<VisualDiagram title="From manual submit plumbing to a form Action" compact>
  <DiagramGrid columns={2}>
    <DiagramNode title="Manual onSubmit flow" tone="slate">`preventDefault` → set submitting → call async work → catch → clear submitting.</DiagramNode>
    <DiagramNode title="Function Action flow" tone="purple">Browser form semantics + `FormData` + React Action lifecycle + local pending state.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

The browser form remains important. React adds coordination around it rather than replacing it.

## Function-valued `action`

```jsx
async function saveProfile(formData) {
  const name = formData.get('name');
  await updateProfile({name});
}

function ProfileForm() {
  return (
    <form action={saveProfile}>
      <input name="name" />
      <button type="submit">Save</button>
    </form>
  );
}
```

When the form submits, React calls the function with `FormData`.

This differs from a traditional URL action:

```html
<form action="/checkout" method="post">
```

Both are valid browser/React models, but they mean different things.

## Keep native form semantics

A function Action is not a reason to abandon semantic HTML. Keep labels, `name` attributes, appropriate input types, submit buttons, browser validation where useful, and server validation for trust boundaries.

```jsx
<form action={signupAction}>
  <label htmlFor="email">Email</label>
  <input id="email" name="email" type="email" required />
  <button>Sign up</button>
</form>
```

## Why `name` matters

`FormData` is created from successful form controls identified by `name`:

```jsx
<input name="email" />
```

```jsx
async function signupAction(formData) {
  const email = formData.get('email');
}
```

An input can be visible while still being absent from `FormData` if it is not represented as a successful named form control.

## Form Actions + `useActionState`

The Action returned by `useActionState` can be passed directly to a form:

```jsx
const initialState = {message: null, error: null};

async function submit(previousState, formData) {
  const email = formData.get('email');

  if (!email) {
    return {message: null, error: 'Email is required'};
  }

  await saveEmail(email);
  return {message: 'Saved', error: null};
}

function NewsletterForm() {
  const [state, formAction, isPending] = useActionState(
    submit,
    initialState,
  );

  return (
    <form action={formAction}>
      <input name="email" type="email" />
      <button disabled={isPending}>Subscribe</button>
      {state.error && <p role="alert">{state.error}</p>}
      {state.message && <p>{state.message}</p>}
    </form>
  );
}
```

<VisualDiagram title="What the form workflow combines" compact>
  <LifecycleBar
    items={[
      { label: 'Browser collects FormData', tone: 'blue' },
      { label: 'Action runs', tone: 'purple' },
      { label: 'Pending state is available', tone: 'orange' },
      { label: 'Action returns result state', tone: 'green' },
      { label: 'UI renders outcome', tone: 'cyan' },
    ]}
  />
</VisualDiagram>

## `useFormStatus`

`useFormStatus` comes from `react-dom`:

```jsx
import {useFormStatus} from 'react-dom';
```

It returns status information for the latest submission of the nearest parent form:

```jsx
const {
  pending,
  data,
  method,
  action,
} = useFormStatus();
```

## Pending submit button

```jsx
function SubmitButton() {
  const {pending} = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting…' : 'Submit'}
    </button>
  );
}

function ContactForm({action}) {
  return (
    <form action={action}>
      <input name="message" />
      <SubmitButton />
    </form>
  );
}
```

## Critical placement rule

`useFormStatus` tracks a **parent** form, not a form returned by the same component.

<VisualDiagram title="useFormStatus lookup" compact>
  <DiagramStack align="center">
    <DiagramNode title="Parent <form>" tone="purple" wide>Owns the submission being tracked.</DiagramNode>
    <DiagramArrow label="contains" />
    <DiagramNode title="SubmitButton" tone="blue">Calls `useFormStatus()`.</DiagramNode>
    <DiagramArrow label="reads latest parent submission" />
    <DiagramNode title="pending · data · method · action" tone="green" wide />
  </DiagramStack>
</VisualDiagram>

This will not track the form rendered by the same component:

```jsx
function Form() {
  const {pending} = useFormStatus(); // 🚩 no parent form

  return (
    <form action={save}>
      <button disabled={pending}>Save</button>
    </form>
  );
}
```

Extract a descendant component instead.

## Submitted data

`data` exposes the `FormData` currently being submitted:

```jsx
function StatusMessage() {
  const {pending, data} = useFormStatus();

  if (!pending || !data) return null;

  return <p>Saving {data.get('displayName')}…</p>;
}
```

This often produces better feedback than a generic spinner.

## `method` and `action`

The status object also includes form submission metadata:

```jsx
const status = useFormStatus();
status.method;
status.action;
```

For function Actions, `status.action` can reference the function used by the parent form.

## `useActionState` pending vs `useFormStatus` pending

<VisualDiagram title="Pending state has different owners" compact>
  <DiagramGrid columns={2}>
    <DiagramNode title="useActionState isPending" tone="purple">Pending state for Actions dispatched by that Hook.</DiagramNode>
    <DiagramNode title="useFormStatus pending" tone="blue">Pending state for the nearest parent form submission.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Use the abstraction that owns the UI concern. A design-system submit button often fits `useFormStatus` because it does not need to know which Action Hook produced the form Action.

## Multiple intents with `formAction`

A button can override a form's Action:

```jsx
<form action={saveAction}>
  <button>Save</button>
  <button formAction={deleteAction}>Delete</button>
</form>
```

This can represent distinct user intents over the same fields. Keep authorization, validation, confirmation, and recovery requirements specific to each operation.

## Validation and trust boundaries

<VisualDiagram title="Client feedback vs server authority" compact>
  <DiagramGrid columns={2}>
    <DiagramNode title="Client validation" tone="cyan">Fast feedback · required fields · formatting · local UX.</DiagramNode>
    <DiagramNode title="Server validation" tone="red">Authorization · ownership · allowed values · business rules · security-sensitive constraints.</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

Browser/client validation improves UX; it is not a security boundary.

Expected validation errors can be returned as structured `useActionState` state and rendered near the relevant field.

## Controlled vs browser-owned fields

React Actions do not make controlled inputs obsolete.

```jsx
<input name="email" defaultValue={initialEmail} />
```

A browser-owned field can remain simple until submission.

```jsx
const [email, setEmail] = useState(initialEmail);

<input
  name="email"
  value={email}
  onChange={event => setEmail(event.target.value)}
/>
```

Use controlled state when rendering must react to every edit.

## Reset behaviour

Successful function-Action form flows can reset uncontrolled browser-owned controls. Controlled values remain driven by React state and must be updated by their owner.

That difference is another reason to make ownership explicit.

## Progressive enhancement

With React Server Components, Server Functions, and framework support, form Actions can participate in progressive enhancement so a form can submit before hydration completes.

A client-only Vite application should not pretend it has Server Function semantics merely because it uses `<form action={fn}>`.

## Production responsibility map

<VisualDiagram title="Production form architecture">
  <DiagramStack align="center">
    <DiagramNode title="Feature Form" tone="purple" wide>Chooses the Action · owns domain result state · renders the fields.</DiagramNode>
    <DiagramArrow />
    <DiagramGrid columns={2}>
      <DiagramNode title="SubmitButton" tone="blue">Uses `useFormStatus` for submission presentation.</DiagramNode>
      <DiagramNode title="FieldError" tone="orange">Renders structured validation state accessibly.</DiagramNode>
    </DiagramGrid>
    <DiagramArrow label="server remains authoritative" />
    <DiagramNode title="Server mutation boundary" tone="red" wide>Re-validates authorization, ownership, data shape, and business rules.</DiagramNode>
  </DiagramStack>
</VisualDiagram>

## Common mistakes

- Calling `useFormStatus` in the component that creates the form instead of a descendant.
- Duplicating pending state that already has one clear owner.
- Forgetting `name` on submitted fields.
- Assuming every function Action is a Server Function.
- Relying only on client/browser validation.
- Treating controlled and browser-owned reset behaviour as the same thing.

## Decision guide

<DecisionTree
  question="Which form primitive owns this concern?"
  items={[
    { label: 'Need Action result state + pending lifecycle?', value: 'useActionState' },
    { label: 'Need generic descendant submit status?', value: 'useFormStatus' },
    { label: 'Need every keystroke to drive rendering?', value: 'Controlled input state' },
    { label: 'Field only matters at submission?', value: 'Browser-owned form control may be simpler' },
    { label: 'Need authoritative validation?', value: 'Server boundary' },
  ]}
/>

## Interview questions

**Junior:** What argument does a function-valued form Action receive?

**Mid-level:** Why does `useFormStatus` need to be called from a descendant of the form rather than the component that returns the form?

**Senior:** How would you divide responsibility between `useActionState`, `useFormStatus`, browser-owned form fields, controlled fields, and server validation?

## References

- https://react.dev/reference/react-dom/components/form
- https://react.dev/reference/react-dom/hooks/useFormStatus
- https://react.dev/reference/react/useActionState

## Next

Continue with **[Optimistic UI with useOptimistic](./use-optimistic.md)**.
