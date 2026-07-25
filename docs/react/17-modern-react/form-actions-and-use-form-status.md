---
title: Form Actions and useFormStatus
description: Learn React 19 function-valued form actions, automatic form behavior, useFormStatus, pending UI, FormData, and progressive enhancement boundaries.
sidebar_position: 3
---

# Form Actions and `useFormStatus`

React 19 extends the browser `<form>` model so the `action` prop can be a function.

That gives forms a React-aware mutation lifecycle without requiring every form to manually wire:

```text
onSubmit
preventDefault
setSubmitting(true)
try/catch
setSubmitting(false)
```

The browser form remains important. React adds coordination around it.

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

This is different from the traditional string URL form action:

```html
<form action="/checkout" method="post">
```

React supports both browser-native URL actions and function Actions, but they represent different programming models.

## Keep native form semantics

A function Action does not mean you should abandon semantic HTML.

Keep:

- `<form>`;
- `<label>`;
- `name` attributes;
- correct input types;
- submit buttons;
- browser validation where appropriate;
- server validation for trust boundaries.

Example:

```jsx
<form action={signupAction}>
  <label htmlFor="email">Email</label>
  <input id="email" name="email" type="email" required />
  <button>Sign up</button>
</form>
```

## Why `name` matters

`FormData` is built from successful form controls identified by `name`.

```jsx
<input name="email" />
```

Then:

```jsx
async function signupAction(formData) {
  const email = formData.get('email');
}
```

An input without `name` may be visually present but absent from `FormData`.

## Form Actions and `useActionState`

The Action returned by `useActionState` can be passed directly to a form:

```jsx
import {useActionState} from 'react';

const initialState = {
  message: null,
  error: null,
};

async function submit(previousState, formData) {
  const email = formData.get('email');

  if (!email) {
    return {
      message: null,
      error: 'Email is required',
    };
  }

  await saveEmail(email);

  return {
    message: 'Saved',
    error: null,
  };
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

This pattern combines:

```text
browser form data
+
Action execution
+
Action result state
+
pending state
```

## `useFormStatus`

`useFormStatus` comes from `react-dom`:

```jsx
import {useFormStatus} from 'react-dom';
```

It returns information about the latest submission of the nearest parent form:

```jsx
const {
  pending,
  data,
  method,
  action,
} = useFormStatus();
```

## Pending submit button

A common pattern is to make the submit button its own component:

```jsx
function SubmitButton() {
  const {pending} = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting…' : 'Submit'}
    </button>
  );
}
```

Then place it inside the form:

```jsx
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

`useFormStatus` tracks a **parent** form.

This does not work:

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

The Hook is called before the returned `<form>` exists as its parent in the React tree.

Extract a child:

```jsx
function SubmitButton() {
  const {pending} = useFormStatus();
  return <button disabled={pending}>Save</button>;
}

function Form() {
  return (
    <form action={save}>
      <SubmitButton />
    </form>
  );
}
```

## Reading the submitted data

`useFormStatus` can expose the `FormData` currently being submitted:

```jsx
function StatusMessage() {
  const {pending, data} = useFormStatus();

  if (!pending || !data) {
    return null;
  }

  return <p>Saving {data.get('displayName')}…</p>;
}
```

This can make pending UI more informative than a generic spinner.

## `method` and `action`

The returned status also contains form submission metadata.

```jsx
const status = useFormStatus();

status.method;
status.action;
```

For function Actions, `status.action` can reference the function used by the parent form. If the form uses a URI action instead, this field is not the same model.

## `useActionState` pending vs `useFormStatus` pending

Both can expose pending state, but their scope differs.

```text
useActionState isPending
  → pending state for that Hook's dispatched Actions

useFormStatus pending
  → pending state for the nearest parent form submission
```

Use the abstraction that owns the UI concern.

A form-level design-system submit button often fits `useFormStatus` well because it does not need to know which Action Hook produced the form Action.

## `formAction` on buttons

HTML supports controls that override a form's action. React can also use function Actions there.

Conceptually:

```jsx
<form action={saveAction}>
  <button>Save</button>
  <button formAction={deleteAction}>Delete</button>
</form>
```

This lets related operations share fields while representing distinct user intents.

Use this carefully when actions have significantly different confirmation, validation, or authorization requirements.

## Expected validation errors

A common pattern is returning validation state from `useActionState`:

```jsx
async function createAccount(previousState, formData) {
  const username = formData.get('username');

  if (typeof username !== 'string' || username.length < 3) {
    return {
      success: false,
      fieldErrors: {
        username: 'Use at least 3 characters',
      },
    };
  }

  await saveAccount({username});

  return {
    success: true,
    fieldErrors: {},
  };
}
```

Then render errors near the relevant field and provide an accessible summary where appropriate.

## Client validation does not replace server validation

Never treat browser validation as a security boundary.

```text
client validation
→ faster feedback

server validation
→ authoritative trust boundary
```

The server must still validate:

- authorization;
- allowed values;
- ownership;
- business rules;
- security-sensitive constraints.

## Controlled vs browser-owned fields

React 19 Actions do not make controlled inputs obsolete.

Choose based on interaction needs.

Browser-owned field:

```jsx
<input name="email" defaultValue={initialEmail} />
```

Controlled field:

```jsx
const [email, setEmail] = useState(initialEmail);

<input
  name="email"
  value={email}
  onChange={event => setEmail(event.target.value)}
/>
```

Use controlled state when rendering must react to every edit. Use browser-owned values when the form can remain simpler until submission.

## Form reset behavior

Function Action forms can reset uncontrolled form controls after successful Action completion in relevant React form flows.

Do not confuse that with resetting controlled state. Controlled values are still driven by React state and must be updated by their owner.

This distinction is another reason to know who owns each form value.

## Progressive enhancement

When React Server Components, Server Functions, and framework support are involved, form Actions can participate in progressive enhancement so a form can still submit before hydration completes.

That capability depends on the server/framework environment.

A client-only Vite application should not pretend it has Server Function semantics just because it uses `<form action={fn}>`.

## Accessibility

Pending forms should communicate state without destroying context.

Useful techniques include:

- disabling only the relevant submit control when duplicate submission is unsafe;
- changing button text to a meaningful pending label;
- using `aria-live` for submission result messages when appropriate;
- associating field errors with inputs;
- preserving focus intentionally after errors;
- avoiding inaccessible custom div-based controls.

## Common mistakes

### Calling `useFormStatus` in the component that creates the form

It needs a parent form, so extract a descendant component.

### Duplicating pending state

If `useFormStatus` already represents the exact form submission state, another local `isSubmitting` boolean may be unnecessary.

### Forgetting `name`

Without `name`, a field is not represented in `FormData` the way you expect.

### Assuming function Actions are Server Functions

A function-valued form Action can exist in client code. `'use server'` has different requirements and belongs to the Server Components/Server Functions architecture.

### Relying only on client validation

The server remains authoritative.

## Production pattern

A reusable form system might separate responsibilities like this:

```text
Feature Form
  ├── chooses Action
  ├── owns domain result state
  └── renders fields

SubmitButton
  └── useFormStatus for pending presentation

FieldError
  └── renders structured validation state
```

This keeps visual form primitives independent from feature mutation logic.

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