---
title: React Hook Form Fundamentals and Validation
description: Learn React Hook Form 7 useForm, register, handleSubmit, formState, validation, default values, accessibility, and server validation.
sidebar_position: 1
---

import {
  DiagramArrow,
  DiagramGrid,
  DiagramNode,
  DiagramRow,
  DiagramStack,
  LifecycleBar,
  VisualDiagram,
} from '@site/src/components/handbook/VisualDiagram'

# React Hook Form fundamentals and validation

This handbook targets **React Hook Form 7.82.0**.

React Hook Form 8 is still beta at this audit point, so this section teaches the current stable v7 API.

React Hook Form manages **form state**, not general application state.

## Mental model

<VisualDiagram title="React Hook Form owns the form workflow">
  <DiagramStack align="center">
    <DiagramNode title="useForm()" tone="red" wide>Creates the form controller and subscription model.</DiagramNode>
    <DiagramArrow />
    <DiagramGrid columns={3}>
      <DiagramNode title="register fields" tone="blue" />
      <DiagramNode title="track values" tone="cyan" />
      <DiagramNode title="validate" tone="orange" />
      <DiagramNode title="formState" tone="purple" />
      <DiagramNode title="submission" tone="green" />
      <DiagramNode title="dynamic fields" tone="slate" />
    </DiagramGrid>
    <DiagramArrow label="valid submit" />
    <DiagramNode title="Application mutation / action" tone="green" wide />
  </DiagramStack>
</VisualDiagram>

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

<VisualDiagram title="How register connects an input" compact>
  <DiagramStack align="center">
    <DiagramNode title="register('email')" tone="red" />
    <DiagramArrow label="returns field props" />
    <DiagramNode title="name + ref + onChange + onBlur" tone="blue" />
    <DiagramArrow label="spread onto input" />
    <DiagramNode title="Input joins the form model" tone="green" />
  </DiagramStack>
</VisualDiagram>

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

<VisualDiagram title="Submission validation flow" compact>
  <DiagramStack align="center">
    <DiagramNode title="Submit event" tone="blue" />
    <DiagramArrow label="handleSubmit runs validation" />
    <DiagramRow>
      <DiagramNode title="Invalid" tone="red">Expose field/form errors.</DiagramNode>
      <DiagramNode title="Valid" tone="green">Call `onSubmit(values)`.</DiagramNode>
    </DiagramRow>
  </DiagramStack>
</VisualDiagram>

`handleSubmit` orchestrates validation before your submit callback.

## `formState`

Important form metadata includes concepts such as:

<VisualDiagram title="Important formState signals">
  <DiagramGrid columns={4}>
    <DiagramNode title="errors" tone="red" />
    <DiagramNode title="isDirty" tone="orange" />
    <DiagramNode title="dirtyFields" tone="orange" />
    <DiagramNode title="touchedFields" tone="cyan" />
    <DiagramNode title="isSubmitting" tone="purple" />
    <DiagramNode title="isSubmitted" tone="slate" />
    <DiagramNode title="isSubmitSuccessful" tone="green" />
    <DiagramNode title="isValid / isValidating" tone="blue" />
  </DiagramGrid>
</VisualDiagram>

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

<LifecycleBar
  items={[
    { label: 'load initial record', tone: 'blue' },
    { label: 'initialize/reset defaults', tone: 'cyan' },
    { label: 'user edits local draft', tone: 'orange' },
    { label: 'submit mutation', tone: 'green' },
  ]}
/>

Do not continuously overwrite user edits whenever server data refetches.

## Dirty vs touched

<VisualDiagram title="Dirty and touched are different">
  <DiagramGrid columns={2}>
    <DiagramNode title="touched" tone="cyan">Has the user interacted with this field?</DiagramNode>
    <DiagramNode title="dirty" tone="orange">Does the current value differ from the default value?</DiagramNode>
  </DiagramGrid>
</VisualDiagram>

These are different concepts.

## Watch values

For small cases:

```tsx
const plan = watch('plan')
```

For targeted subscription behavior, use APIs such as `useWatch` rather than forcing the entire form owner to respond to every field change.

<VisualDiagram title="Fine-grained form subscriptions" compact>
  <DiagramStack align="center">
    <DiagramNode title="Form control" tone="red" wide />
    <DiagramArrow label="subscribes independently" />
    <DiagramRow>
      <DiagramNode title="Field A" tone="blue" />
      <DiagramNode title="Field B" tone="cyan" />
      <DiagramNode title="formState" tone="purple" />
    </DiagramRow>
  </DiagramStack>
</VisualDiagram>

Subscription granularity is one of React Hook Form's important architectural advantages.

## Validation schemas

React Hook Form integrates with ecosystem schema libraries through resolver packages.

Examples include Zod, Yup, and others.

Keep the trust boundary clear:

<VisualDiagram title="Client validation is UX, not authority" compact>
  <DiagramStack align="center">
    <DiagramNode title="Client schema validation" tone="blue">Fast feedback and better UX.</DiagramNode>
    <DiagramArrow />
    <DiagramNode title="Server receives untrusted input" tone="orange" />
    <DiagramArrow label="validate again" />
    <DiagramNode title="Authoritative server validation" tone="green" />
  </DiagramStack>
</VisualDiagram>

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

<LifecycleBar
  items={[
    { label: 'client validation passes', tone: 'blue' },
    { label: 'server rejects domain rule', tone: 'red' },
    { label: 'map response to form error', tone: 'orange' },
  ]}
/>

Use APIs such as `setError` when a server/domain error belongs to a specific field or the form root.

## Reset

After a successful save, `reset` can establish new default values.

```tsx
reset(savedProfile)
```

This matters because dirty state is compared against defaults.

## Form state vs server mutation state

<VisualDiagram title="Separate form draft ownership from server mutation lifecycle">
  <DiagramGrid columns={2}>
    <DiagramNode title="React Hook Form" tone="red">
      Values · field errors · dirty/touched · local form validation.
    </DiagramNode>
    <DiagramNode title="Query / Server Action / API mutation" tone="orange">
      Request · server error · cache invalidation · remote reconciliation.
    </DiagramNode>
  </DiagramGrid>
</VisualDiagram>

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
