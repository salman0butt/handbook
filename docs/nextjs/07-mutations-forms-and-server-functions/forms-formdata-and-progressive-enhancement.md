---
title: Forms, FormData & Progressive Enhancement
description: Build mutation forms with Server Actions, FormData, bind, formAction, progressive enhancement, and accessible submission behaviour.
---

# Forms, `FormData` & Progressive Enhancement

React forms are the most direct interface to Server Actions.

```text
user edits fields
  ↓
<form action={serverAction}>
  ↓
FormData
  ↓
Server Action
  ↓
validation + mutation
  ↓
updated UI / returned state / redirect
```

The form remains an HTML form, but React extends the `action` prop so it can receive a function.

## Basic Server Action form

```tsx
import { createPost } from './actions'

export function CreatePostForm() {
  return (
    <form action={createPost}>
      <label htmlFor="title">Title</label>
      <input id="title" name="title" required />
      <button type="submit">Create post</button>
    </form>
  )
}
```

```ts
'use server'

export async function createPost(formData: FormData) {
  const title = formData.get('title')
  // validate and mutate
}
```

When React invokes the action from a form, `FormData` is supplied automatically.

## `FormData` is untyped input

This:

```ts
const title = formData.get('title')
```

returns a `FormDataEntryValue | null`.

Do not immediately assert:

```ts
const title = formData.get('title') as string
```

and treat that as validation.

Instead parse deliberately:

```ts
const rawTitle = formData.get('title')

if (typeof rawTitle !== 'string') {
  return { ok: false, message: 'Invalid title' }
}

const title = rawTitle.trim()
```

For larger forms, use a schema validator.

## `Object.fromEntries(formData)`

For many fields:

```ts
const raw = Object.fromEntries(formData)
```

This can be convenient, but Next.js action forms may include framework-generated `$ACTION_...` entries.

Therefore:

- do not persist the raw object blindly
- validate only known fields
- strip unknown fields
- never spread raw form input directly into an ORM update

Bad:

```ts
await db.user.update({
  where: { id },
  data: Object.fromEntries(formData),
})
```

That creates a mass-assignment risk.

## Progressive enhancement

A key advantage of Server Action forms is that they work without waiting for client JavaScript when used from Server Components.

Conceptually:

```text
HTML arrives
  ↓
form is usable
  ↓
user submits before hydration
  ↓
server handles action
```

This means critical form flows can remain functional under:

- slow JavaScript
- hydration delays
- partial client failure

Client Components also queue Server Action submissions while JavaScript is still loading and prioritize hydration.

## Native validation is still useful

Use HTML constraints for immediate UX:

```tsx
<input
  name="email"
  type="email"
  required
  maxLength={254}
/>
```

But browser validation is not security.

The server must still validate:

```text
requiredness
shape
type
length
enum/range
business rules
permissions
```

## Passing additional arguments with `bind`

Sometimes the action needs context not represented as an editable field.

```tsx
import { updateUser } from './actions'

export function ProfileForm({ userId }: { userId: string }) {
  const updateUserWithId = updateUser.bind(null, userId)

  return (
    <form action={updateUserWithId}>
      <input name="name" />
      <button>Save</button>
    </form>
  )
}
```

```ts
'use server'

export async function updateUser(
  userId: string,
  formData: FormData,
) {
  // validate userId too
}
```

`bind` supports progressive enhancement.

## Hidden fields are not secret

Alternative:

```tsx
<input type="hidden" name="userId" value={userId} />
```

This value is visible and editable by the user.

But the same security rule applies to `bind` arguments too:

> every action argument is client-controlled.

Never treat either mechanism as authorization.

## Multiple actions in one form

A form can expose multiple mutation intents with `formAction`:

```tsx
<form action={saveDraft}>
  <input name="title" />
  <textarea name="body" />

  <button type="submit">Save draft</button>
  <button type="submit" formAction={publishPost}>
    Publish
  </button>
</form>
```

This can be clearer than one giant action with many branches.

Use separate domain actions when they have different:

- permissions
- validation
- side effects
- revalidation
- audit requirements

## Submitter values

You can also use named submit buttons:

```tsx
<button name="intent" value="draft">Save draft</button>
<button name="intent" value="publish">Publish</button>
```

Then validate the intent as an enum on the server.

## Programmatic submission

Use the browser's form semantics instead of bypassing them:

```tsx
'use client'

export function Editor() {
  function handleKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) {
    if (
      (event.metaKey || event.ctrlKey) &&
      event.key === 'Enter'
    ) {
      event.preventDefault()
      event.currentTarget.form?.requestSubmit()
    }
  }

  return <textarea name="body" onKeyDown={handleKeyDown} />
}
```

`requestSubmit()` preserves validation and the normal form submission path.

Calling an action manually from arbitrary code can be correct, but forms should use form semantics when the user is actually submitting form data.

## `next/form` vs HTML `<form>`

Next.js also provides `next/form`.

Use it mainly when the form represents **navigation/search URL state**:

```tsx
import Form from 'next/form'

export function Search() {
  return (
    <Form action="/search">
      <input name="q" />
      <button>Search</button>
    </Form>
  )
}
```

A string action behaves like GET navigation with Next.js client navigation/prefetch integration.

When `action` is a Server Action function, `next/form` behaves like a React mutation form.

For ordinary mutation forms, native `<form action={serverAction}>` is often sufficient.

## Files in `FormData`

A file input contributes a `File` object:

```tsx
<input type="file" name="avatar" accept="image/*" />
```

```ts
const avatar = formData.get('avatar')

if (!(avatar instanceof File)) {
  // invalid/missing
}
```

Do not trust:

- filename
- MIME type alone
- extension alone
- client-provided dimensions

And remember Server Actions have a request body size limit. Large uploads may belong in a dedicated upload flow or direct object-storage architecture.

## Form reset behaviour

React forms submitted successfully through an Action can reset uncontrolled fields automatically depending on the form/action workflow.

For controlled forms, explicit client state still determines values.

Do not assume every form should reset. A failed validation should usually preserve user input.

## Accessibility

Mutation forms should expose:

- labels
- instructions
- field-level errors
- form-level errors
- pending state
- success state where useful

Example:

```tsx
<label htmlFor="email">Email</label>
<input
  id="email"
  name="email"
  aria-describedby="email-error"
/>
<p id="email-error">{state.errors?.email?.[0]}</p>
```

For important submission feedback:

```tsx
<p aria-live="polite">{state.message}</p>
```

Avoid aggressively announcing every keystroke validation error.

## Forms are not authorization boundaries

Even if the UI renders:

```tsx
{canDelete && (
  <form action={deleteProject}>
    <button>Delete</button>
  </form>
)}
```

`deleteProject` must re-check authorization.

The action can be invoked by a crafted request.

## Common mistakes

### Treating TypeScript as runtime validation

Types disappear at runtime.

### Trusting hidden inputs

They are client-controlled.

### Persisting `Object.fromEntries(formData)` directly

Whitelist/validate fields instead.

### Replacing form semantics with `onClick`

You lose built-in keyboard, validation, accessibility, and progressive-enhancement behaviour.

### Putting every mutation into one mega-action

Prefer domain-specific boundaries.

## Debugging checklist

If a form action behaves incorrectly:

1. Inspect actual `FormData` entries.
2. Confirm every field has a `name`.
3. Confirm submit button/formAction intent.
4. Check validation output.
5. Check progressive-enhancement behaviour with slow/disabled JS.
6. Verify client and server error display.
7. Confirm duplicate submissions are safe.
8. Confirm resource IDs are authorized server-side.
9. Check upload size/type constraints.
10. Test keyboard-only submission.

## Interview questions

**Why use a form action instead of `onSubmit` + fetch by default?**  
It integrates HTML form semantics, progressive enhancement, React Action state, and Next.js server mutation/UI refresh behaviour directly.

**Is `FormData` typed?**  
No. It is runtime client input and must be parsed and validated.

**Is `bind` safer than a hidden input?**  
It avoids exposing the value in rendered HTML, but its argument still crosses the client/server action boundary and must not be trusted for authorization.

**When is `next/form` especially useful?**  
For search/navigation forms whose string action maps form fields into URL search parameters with Next.js navigation behaviour.

## Exercise

Build an invoice form with:

- create draft
- save changes
- publish
- attachment upload
- field errors
- progressive enhancement

Document which values come from fields, which use `bind`, how each is validated, and which permissions each action enforces.
