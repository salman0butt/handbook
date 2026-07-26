---
title: React Hook Form Controller, Composition, and Field Arrays
description: Integrate controlled components, FormProvider, useFormContext, useWatch, useFormState, and dynamic field arrays in React Hook Form 7.
sidebar_position: 2
---

# React Hook Form Controller, composition, and field arrays

Native inputs work naturally with `register`.

Complex applications also use controlled component libraries, deeply nested form sections, and dynamic arrays.

That is where React Hook Form's composition APIs matter.

## Controlled components and `Controller`

`Controller` adapts React Hook Form to controlled inputs with custom `value`/`onChange` contracts.

```tsx
import { Controller, useForm } from 'react-hook-form'

function ProfileForm() {
  const { control, handleSubmit } = useForm<ProfileFormValues>({
    defaultValues: {
      birthday: null,
    },
  })

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <Controller
        control={control}
        name="birthday"
        render={({ field, fieldState }) => (
          <DatePicker
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            inputRef={field.ref}
            error={fieldState.error?.message}
          />
        )}
      />

      <button type="submit">Save</button>
    </form>
  )
}
```

Mental model:

```text
React Hook Form control
        │
        ▼
Controller
        │
        ├── value
        ├── onChange
        ├── onBlur
        ├── name
        └── ref
              │
              ▼
controlled UI component
```

## Do not double-register

If `Controller` already manages a field, do not also spread `register()` into that same input.

Bad:

```tsx
<Controller
  name="email"
  control={control}
  render={({ field }) => (
    <input {...field} {...register('email')} />
  )}
/>
```

Use one registration path.

## Transforming values

Controlled components may emit values in a different shape than your form model.

Transform deliberately at the adapter boundary.

```tsx
<Controller
  name="age"
  control={control}
  render={({ field }) => (
    <input
      type="number"
      value={field.value}
      onChange={(event) => field.onChange(Number(event.target.value))}
    />
  )}
/>
```

## Form composition with `FormProvider`

Large forms should not pass every form method through many layers.

```tsx
const methods = useForm<CheckoutForm>({
  defaultValues,
})

return (
  <FormProvider {...methods}>
    <form onSubmit={methods.handleSubmit(onSubmit)}>
      <ShippingSection />
      <BillingSection />
      <button type="submit">Continue</button>
    </form>
  </FormProvider>
)
```

Nested components can use `useFormContext`.

```tsx
function ShippingSection() {
  const { register } = useFormContext<CheckoutForm>()

  return (
    <input
      aria-label="Street"
      {...register('shipping.street')}
    />
  )
}
```

Architecture:

```text
useForm()
   │
   ▼
FormProvider
   │
   ├── ShippingSection → useFormContext
   ├── BillingSection  → useFormContext
   └── ReviewSection   → useFormContext
```

Use context for form coordination, not as permission to make every field depend on every form method.

## `useWatch`

Use `useWatch` when a component needs to react to selected field values.

```tsx
const country = useWatch({
  control,
  name: 'shipping.country',
})
```

Then render dependent UI:

```tsx
{country === 'US' && <StateField />}
```

This isolates value subscription more deliberately than making a high-level form component re-render for every field change.

## `useFormState`

For components that care about form metadata rather than field values, `useFormState` provides targeted form-state subscription.

```tsx
const { isDirty, isSubmitting } = useFormState({ control })
```

A toolbar might subscribe to dirty/submission state without reading all field values.

## Dynamic arrays with `useFieldArray`

Use `useFieldArray` for repeated/dynamic groups.

```tsx
import { useFieldArray, useForm } from 'react-hook-form'

type OrderForm = {
  items: Array<{
    name: string
    quantity: number
  }>
}

function OrderEditor() {
  const { control, register, handleSubmit } = useForm<OrderForm>({
    defaultValues: {
      items: [{ name: '', quantity: 1 }],
    },
  })

  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'items',
  })

  return (
    <form onSubmit={handleSubmit(console.log)}>
      {fields.map((field, index) => (
        <fieldset key={field.id}>
          <input
            aria-label={`Item ${index + 1} name`}
            {...register(`items.${index}.name`)}
          />

          <input
            aria-label={`Item ${index + 1} quantity`}
            type="number"
            {...register(`items.${index}.quantity`, {
              valueAsNumber: true,
            })}
          />

          <button type="button" onClick={() => remove(index)}>
            Remove
          </button>
        </fieldset>
      ))}

      <button
        type="button"
        onClick={() => append({ name: '', quantity: 1 })}
      >
        Add item
      </button>

      <button type="submit">Save</button>
    </form>
  )
}
```

## Field-array identity

`useFieldArray` provides an `id` per generated field row.

Use that stable `field.id` as the React key.

```text
field row identity
      │
      ▼
field.id
      │
      ▼
React key
```

Do not use the array index as the primary key for reorderable/removable rows when stable identity is available.

## Updating arrays

Field-array APIs include operations such as append/remove and other list-management operations.

Choose the operation that matches the intended identity behavior.

If you replace/remount rows unnecessarily, focus, local component state, and controlled widget state can reset.

## Nested reusable components

A reusable field component should keep its external API small.

```tsx
function EmailField({ name }: { name: FieldPath<CheckoutForm> }) {
  const {
    register,
    formState: { errors },
  } = useFormContext<CheckoutForm>()

  return <input {...register(name)} />
}
```

Do not build a "magic field" abstraction that hides validation, accessibility, and domain meaning beyond recognition.

## Conditional fields

Decide whether hidden/unmounted fields should remain part of the form model.

This is a data-model decision, not only a rendering decision.

```text
field hidden
   │
   ├── preserve value
   └── unregister/remove value
```

Choose deliberately based on submission semantics.

## Controlled component architecture

A design-system component should expose accessible primitives that adapters can connect cleanly.

```text
RHF Controller
      │
      ▼
form adapter
      │
      ▼
Design-system Select / DatePicker
      │
      ▼
semantic input behavior
```

Avoid making your entire design system depend directly on React Hook Form unless that coupling is intentional.

## Performance

Large forms can suffer when one root component watches everything.

Prefer localized subscriptions:

```text
Field A → register/useController
Field B → register/useController
Summary → useWatch(selected fields)
Toolbar → useFormState(dirty/submitting)
```

Measure actual slow interactions before adding custom memoization.

## Common mistakes

- double-registering a controlled field;
- using array index keys when field identity can change;
- putting all conditional logic in one giant form component;
- rebuilding domain data into form state without a clear reset/reconciliation policy;
- exposing every `useForm` method through custom component props manually instead of using composition where appropriate.

## Exercise

Build an order form with:

- dynamic line items;
- quantity validation;
- a controlled date picker through `Controller`;
- nested shipping fields through `FormProvider`;
- a summary using `useWatch`;
- dirty/submitting toolbar state using `useFormState`.

## Interview questions

**Mid-level:** When do you need `Controller` instead of `register`?

**Senior:** Why should `field.id` be used as the key in a dynamic field array?

**Senior:** How do `useWatch` and `useFormState` help subscription granularity?

**Staff:** How would you integrate React Hook Form with a shared design system without tightly coupling every component to RHF?

## References

- https://react-hook-form.com/docs/usecontroller/controller
- https://react-hook-form.com/docs/useformcontext
- https://react-hook-form.com/docs/usewatch
- https://react-hook-form.com/docs/useformstate
- https://react-hook-form.com/docs/usefieldarray
