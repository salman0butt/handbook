---
title: Action State, Pending UI & Form Status
description: Use useActionState and useFormStatus to model validation results, pending state, expected errors, and accessible form feedback around Server Actions.
---

# Action State, Pending UI & Form Status

Server Actions need a client UX contract.

A mutation usually has more states than:

```text
idle → success
```

Real forms need:

```text
idle
pending
validation failure
business-rule failure
success
unexpected failure
```

React provides `useActionState` and `useFormStatus` for these workflows.

## `useActionState`

```tsx
'use client'

import { useActionState } from 'react'
import { createUser } from './actions'

const initialState = {
  message: '',
  errors: {},
}

export function SignupForm() {
  const [state, formAction, pending] = useActionState(
    createUser,
    initialState,
  )

  return (
    <form action={formAction}>
      <input name="email" type="email" />
      <p>{state.message}</p>
      <button disabled={pending}>
        {pending ? 'Creating…' : 'Create account'}
      </button>
    </form>
  )
}
```

The hook returns:

```text
current state
wrapped action dispatcher
pending boolean
```

## Action signature changes

When used with `useActionState`, the action receives previous state first:

```ts
'use server'

export async function createUser(
  previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  // ...
}
```

Do not forget that `FormData` is now the second argument.

## Return expected errors as state

Example:

```ts
type FormState = {
  message: string
  errors?: {
    email?: string[]
    name?: string[]
  }
}

export async function createUser(
  previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = schema.safeParse({
    email: formData.get('email'),
    name: formData.get('name'),
  })

  if (!parsed.success) {
    return {
      message: 'Please fix the highlighted fields.',
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  // mutate
  return { message: 'Account created.' }
}
```

Expected errors are ordinary result data.

## Do not use exceptions for routine validation

Bad:

```ts
if (!email) {
  throw new Error('Email required')
}
```

This treats expected user input as an application exception.

Prefer structured action state.

Throw for unexpected failures such as:

```text
database outage
programming invariant broken
unexpected provider failure
```

## `useFormStatus`

`useFormStatus` reads the status of its parent form.

```tsx
'use client'

import { useFormStatus } from 'react-dom'

export function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Saving…' : 'Save'}
    </button>
  )
}
```

Then:

```tsx
<form action={saveProfile}>
  <input name="name" />
  <SubmitButton />
</form>
```

The status hook must run in a component **inside** the form whose status it observes.

## React 19 form status data

React 19 exposes more than `pending` through form status, including information such as submitted data, method, and action reference.

Use the smallest information needed for UI feedback.

Do not turn form status into a global mutation store.

## `useActionState` vs `useFormStatus`

Use `useActionState` when you need:

```text
server-returned result
validation errors
message/result state
pending state tied to action state
```

Use `useFormStatus` when a nested component only needs:

```text
parent form pending/status
```

Example:

```text
Form component
  → useActionState for errors/result

SubmitButton child
  → useFormStatus for pending
```

They can coexist.

## Accessible error output

Field-level errors should be connected to fields:

```tsx
<input
  id="email"
  name="email"
  aria-invalid={Boolean(state.errors?.email)}
  aria-describedby="email-error"
/>

{state.errors?.email && (
  <p id="email-error">
    {state.errors.email[0]}
  </p>
)}
```

For form-level results:

```tsx
<p aria-live="polite">{state.message}</p>
```

Do not depend only on colour.

## Preserve user input on failure

Uncontrolled form fields naturally retain values when the action returns validation state in the same form flow.

Avoid resetting the form when validation fails.

For controlled forms, make sure returned server state does not accidentally overwrite the user's draft.

## Pending state should match mutation scope

Bad UX:

```text
click save in one row
→ disable entire application
```

Better:

```text
row action
→ row-level pending
```

Use the boundary that owns the mutation.

## Disable vs allow repeat submission

Disabling a button can improve UX, but it is not an idempotency guarantee.

The network may retry; multiple tabs may submit; scripted requests can repeat.

Therefore:

```text
pending UI
≠
server duplicate protection
```

## Pending text and layout

Avoid large layout shifts:

```tsx
<button disabled={pending}>
  <span className="button-label">
    {pending ? 'Saving…' : 'Save'}
  </span>
</button>
```

For slow destructive actions, communicate clearly:

```text
Deleting…
Processing payment…
Publishing…
```

## Programmatic actions with `useActionState`

If the dispatcher is called outside a form Action prop, invoke it in an Action/Transition context:

```tsx
import { startTransition, useActionState } from 'react'

const [state, action, pending] = useActionState(save, initial)

function handleClick() {
  startTransition(() => {
    action(payload)
  })
}
```

If you call an async action outside its expected transition, React cannot provide the same pending/action semantics reliably.

## Queued action state

`useActionState` actions use previous state as input, which can imply ordering/queuing.

That is useful for stateful action sequences, but do not assume it is a parallel RPC mechanism.

For high-frequency independent events, evaluate whether another architecture is more appropriate.

## Success state vs redirect

If an action redirects on success:

```ts
revalidatePath('/projects')
redirect('/projects')
```

there may be no need to return a success message to the current form because navigation ends that flow.

If the user stays on the page, return a useful success result or refresh the relevant UI.

Choose one UX contract intentionally.

## Expected business errors

Examples:

```text
email already used
coupon expired
inventory changed
plan limit reached
name conflict
```

Model these explicitly:

```ts
return {
  status: 'error',
  code: 'NAME_CONFLICT',
  message: 'That project name is already in use.',
}
```

Do not leak raw database constraint text.

## Unexpected errors

Unexpected failures should reach observability and error boundaries when appropriate.

Pattern:

```ts
try {
  await mutate()
} catch (error) {
  if (isKnownBusinessError(error)) {
    return toPublicState(error)
  }

  throw error
}
```

This keeps incidents visible.

## Form-level state type

A discriminated union often scales well:

```ts
type FormState =
  | { status: 'idle' }
  | { status: 'error'; message: string; errors?: FieldErrors }
  | { status: 'success'; message: string }
```

Keep state serializable and public.

## Common mistakes

### Reading `useFormStatus` in the same component that creates the form

Move the status consumer into a descendant.

### Forgetting the previous-state argument

`useActionState` changes the action signature.

### Throwing validation errors

Return expected errors as state.

### Treating disabled buttons as duplicate protection

Server idempotency is separate.

### Returning raw exceptions

Return safe public state; log private detail server-side.

## Debugging checklist

1. Confirm `useActionState` action signature.
2. Confirm returned state matches `initialState` shape/type.
3. Confirm form uses the wrapped action, not the original action.
4. Confirm `useFormStatus` is inside the correct form.
5. Check pending state on slow network.
6. Check validation errors preserve field input.
7. Check screen-reader announcement behaviour.
8. Test unexpected failures separately from validation errors.
9. Check repeated submissions.
10. Test redirect and non-redirect success flows.

## Interview questions

**What does `useActionState` add to a Server Action form?**  
A state/result channel plus pending state around the Action, allowing structured validation and business outcomes to render in the client UI.

**When would you use `useFormStatus` instead?**  
For a nested component that only needs the status of its parent form, such as a reusable submit button.

**Should validation failures throw?**  
Usually no. Expected form/business errors should be returned as action state; unexpected failures should remain exceptions.

**Does `pending` solve duplicate submissions?**  
No. It is UI feedback, not a server-side idempotency guarantee.

## Exercise

Build a signup form with:

- field validation
- server business error
- pending button
- accessible error associations
- success message
- unexpected error path

Then explain which states are returned and which failures are thrown.
