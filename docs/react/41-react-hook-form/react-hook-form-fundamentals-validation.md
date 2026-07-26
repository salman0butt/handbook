---
title: React Hook Form Fundamentals and Validation
description: Learn React Hook Form 7 useForm, register, handleSubmit, formState, validation, default values, accessibility, and server validation.
sidebar_position: 1
---

# React Hook Form fundamentals and validation

This handbook targets **React Hook Form 7.82.0**.

React Hook Form 8 is still beta at this audit point, so this section teaches the current stable v7 API.

React Hook Form manages **form state**, not general application state.

## Mental model

```text
useForm()
│
├── register fields
├── track values
├── validate
├── expose formState
└── handle submission
      │
      ▼
application mutation / action
```

## Why a form library exists

A simple form may need only native HTML + `FormData`.

A complex form often needs:

- field registration;
- validation;
- nested values;
- dirty/touched tracking;
- error state;
- conditional fields;
- dynamic arrays;
- controlled component integration;
- reset/default-value workflows;
- isolated subscriptions.

React Hook Form packages those concerns into a dedicated form model.

## Install

```bash
npm install react-hook-form
```

## Basic `useForm`

```tsx
import { useForm } from 'react-hook-form'

type LoginForm = {
  email: string
  password: string
}

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>()

  async function onSubmit(values: LoginForm) {
    console.log(values)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        {...register('email', {
          required: 'Email is required',
        })}
      />
      {errors.email && (
        <p id="email-error" role="alert">
          {errors.email.message}
        </p>
      )}

      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        {...register('password', {
          required: 'Password is required',
          minLength: {
            value: 8,
            message: 'Use at least 8 characters',
          },
        })}
      />

      <button disabled={isSubmitting} type="submit">
        Sign in
      </button>
    </form>
  )
}
```

## What `register` provides

Conceptually:

```text
register('email')
       │
       ▼
name + ref + event handlers
       │
       ▼
<input ... /> joins form model
```

The current API connects fields through returned props such as `name`, `ref`, `onChange`, and `onBlur`.

## Validation rules

Built-in field rules include common constraints such as:

- `required`;
- `min` / `max`;
- `minLength` / `maxLength`;
- `pattern`;
- custom `validate` functions.

```tsx
<input
  {...register('username', {
    required: 'Username is required',
    validate: (value) =>
      value.trim().length > 2 || 'Use at least 3 characters',
  })}
/>
```

Client validation improves UX. It does not replace server validation.

## `handleSubmit`

```text
submit event
    │
    ▼
React Hook Form validation
    │
    ├── invalid → expose errors
    │
    └── valid   → call onSubmit(values)
```

`handleSubmit` orchestrates validation before your submit callback.

## `formState`

Important form metadata includes concepts such as:

```text
errors
isDirty
dirtyFields
touchedFields
isSubmitting
isSubmitted
isSubmitSuccessful
isValid
isValidating
```

Do not destructure everything automatically. Subscribe to the state the component actually needs.

## Default values

Use `defaultValues` as the form's initial source of truth.

```tsx
const form = useForm<ProfileForm>({
  defaultValues: {
    firstName: '',
    lastName: '',
  },
})
```

Default values matter for reset and dirty-state comparison.

## Async default values

React Hook Form supports async default-value workflows in current v7 APIs.

The important architecture is:

```text
load initial record
      │
      ▼
initialize/reset form values
      │
      ▼
user edits local form draft
      │
      ▼
submit mutation
```

Do not continuously overwrite user edits whenever server data refetches.

## Dirty vs touched

```text
touched
= has the user interacted with this field?

dirty
= does current value differ from the initial/default value?
```

These are different concepts.

## Watch values

For small cases:

```tsx
const plan = watch('plan')
```

For targeted subscription behavior, use APIs such as `useWatch` rather than forcing the entire form owner to respond to every field change.

```text
form control
   │
   ├── field A subscription
   ├── field B subscription
   └── formState subscription
```

Subscription granularity is one of React Hook Form's important architectural advantages.

## Validation schemas

React Hook Form integrates with ecosystem schema libraries through resolver packages.

Examples include Zod, Yup, and others.

Keep the trust boundary clear:

```text
client schema validation
        │
        ▼
better immediate UX
        │
        ▼
server receives untrusted input
        │
        ▼
server validates again
```

A TypeScript type is not runtime validation.

## Accessibility

Keep semantic HTML.

```tsx
<label htmlFor="email">Email</label>
<input
  id="email"
  aria-invalid={Boolean(errors.email)}
  aria-describedby={errors.email ? 'email-error' : undefined}
  {...register('email', { required: 'Email is required' })}
/>
{errors.email && (
  <p id="email-error" role="alert">
    {errors.email.message}
  </p>
)}
```

React Hook Form does not automatically make custom form UIs accessible.

## Server error mapping

A server may reject values that passed client validation.

```text
client validation passes
      │
      ▼
server rejects email as already used
      │
      ▼
map server response to form error
```

Use APIs such as `setError` when a server/domain error belongs to a specific field or the form root.

## Reset

After a successful save, `reset` can establish new default values.

```tsx
reset(savedProfile)
```

This matters because dirty state is compared against defaults.

## Form state vs server mutation state

```text
React Hook Form
├── values
├── field errors
├── dirty/touched
└── form validation

TanStack Query / Server Action / API mutation
├── request
├── server error
├── cache invalidation
└── remote reconciliation
```

Do not force one tool to own both lifecycles.

## Common mistakes

- putting a basic two-field form into a form library without need;
- trusting browser validation on the server;
- forgetting stable/default values for dirty tracking;
- watching the entire form when only one field matters;
- duplicating RHF values into Redux/Zustand on every keystroke;
- treating TypeScript types as validation.

## Exercise

Build a profile form with:

- typed values;
- default values;
- required email validation;
- accessible errors;
- dirty-state save button;
- server-side email uniqueness error mapped back to the field;
- reset after successful save.

## Interview questions

**Junior:** What do `useForm`, `register`, and `handleSubmit` do?

**Mid-level:** What is the difference between dirty and touched state?

**Senior:** Why should server validation still run when React Hook Form validation passes?

**Staff:** How would you prevent a complex form from duplicating ownership across React Hook Form, Redux, and a server-state cache?

## References

- https://react-hook-form.com/docs
- https://react-hook-form.com/docs/useform
- https://www.npmjs.com/package/react-hook-form
