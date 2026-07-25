---
title: Forms
description: Learn controlled and uncontrolled fields, FormData, validation, accessibility, file inputs, and the modern React 19 form Action model.
sidebar_position: 1
---

# Forms

Forms combine browser behavior, React state, validation, accessibility, and server interaction. Good React form code starts by understanding the **native form model** before adding libraries.

```text
form controls
    ↓
user input
    ↓
controlled state OR browser-owned values
    ↓
validation
    ↓
submission
    ↓
server/client action
```

## Start with semantic HTML

```jsx
function SignupForm() {
  return (
    <form>
      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" required />

      <button type="submit">Sign up</button>
    </form>
  );
}
```

The browser already provides:

- keyboard behavior;
- labels and focus association;
- form submission;
- validation primitives;
- `FormData`;
- autocomplete;
- accessibility semantics.

React should build on those capabilities rather than replace them unnecessarily.

## Controlled inputs

A controlled input receives its current value from React state.

```jsx
function SearchBox() {
  const [query, setQuery] = useState('');

  return (
    <input
      value={query}
      onChange={event => setQuery(event.target.value)}
    />
  );
}
```

The loop is:

```text
state value
   ↓
input value
   ↓ user types
onChange
   ↓
set state
   ↓
render with new value
```

Controlled inputs are useful when the rest of the UI must react to each change.

## Uncontrolled inputs

An uncontrolled input lets the browser own its live value.

```jsx
<input name="email" defaultValue="ada@example.com" />
```

React sets the initial value, but the browser handles subsequent edits.

This works well when you mainly need the value at submission time.

## Controlled vs uncontrolled

```text
Controlled
value / checked + onChange
React owns current value

Uncontrolled
defaultValue / defaultChecked
browser owns current value
```

Neither is always superior.

Use controlled fields when:

- validation/UI depends on every keystroke;
- multiple components need the current value;
- formatting or dependent fields require immediate state;
- the field is part of a controlled component API.

Use uncontrolled fields when:

- values are mainly needed on submit;
- native form behavior is enough;
- you want simpler code for a large form;
- modern form Actions fit the workflow.

## Do not switch control modes

A text input should not move from uncontrolled to controlled during its lifetime.

Problematic:

```jsx
<input value={user?.name} onChange={handleChange} />
```

If `user?.name` starts as `undefined` and later becomes a string, the input changes control mode.

Prefer a stable string:

```jsx
<input value={user?.name ?? ''} onChange={handleChange} />
```

## Checkboxes

Checkboxes are controlled with `checked`, not with `value`.

```jsx
function NewsletterToggle() {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <label>
      <input
        type="checkbox"
        checked={subscribed}
        onChange={event => setSubscribed(event.target.checked)}
      />
      Subscribe
    </label>
  );
}
```

## Radio buttons

Radio buttons normally share a `name` and represent one choice.

```jsx
function PlanPicker() {
  const [plan, setPlan] = useState('basic');

  return (
    <fieldset>
      <legend>Plan</legend>

      <label>
        <input
          type="radio"
          name="plan"
          value="basic"
          checked={plan === 'basic'}
          onChange={event => setPlan(event.target.value)}
        />
        Basic
      </label>

      <label>
        <input
          type="radio"
          name="plan"
          value="pro"
          checked={plan === 'pro'}
          onChange={event => setPlan(event.target.value)}
        />
        Pro
      </label>
    </fieldset>
  );
}
```

`fieldset` and `legend` help express the relationship between options.

## Textarea

In React, control a textarea with `value` and `onChange`:

```jsx
<textarea value={bio} onChange={event => setBio(event.target.value)} />
```

For an uncontrolled textarea, use `defaultValue`.

## Select

Controlled:

```jsx
<select
  value={country}
  onChange={event => setCountry(event.target.value)}
>
  <option value="pk">Pakistan</option>
  <option value="gb">United Kingdom</option>
</select>
```

Uncontrolled:

```jsx
<select name="country" defaultValue="pk">
  <option value="pk">Pakistan</option>
  <option value="gb">United Kingdom</option>
</select>
```

Do not use `selected` directly on an `<option>` in React. Control selection through `<select value>` or `<select defaultValue>`.

## Multiple inputs with one handler

A small form can use one state object deliberately:

```jsx
const [form, setForm] = useState({
  name: '',
  email: '',
});

function handleChange(event) {
  const {name, value} = event.target;

  setForm(current => ({
    ...current,
    [name]: value,
  }));
}
```

Then:

```jsx
<input name="name" value={form.name} onChange={handleChange} />
<input name="email" value={form.email} onChange={handleChange} />
```

Group fields only when the state model benefits from it. One giant object is not automatically better.

## Traditional `onSubmit`

This works in all React versions:

```jsx
function SearchForm() {
  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const query = formData.get('query');

    console.log(query);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="query" />
      <button type="submit">Search</button>
    </form>
  );
}
```

Use `event.currentTarget` when you want the element whose handler is currently running.

## FormData

`FormData` lets you read successful form controls using their `name` attributes.

```jsx
const formData = new FormData(event.currentTarget);

const email = formData.get('email');
const interests = formData.getAll('interest');
```

For debugging:

```jsx
const values = Object.fromEntries(formData.entries());
```

Be careful: multiple values with the same name require `getAll()` if you need every value.

## Buttons inside forms

A button inside a form is a submit button by default.

Explicit submit button:

```jsx
<button type="submit">Save</button>
```

Non-submit action:

```jsx
<button type="button" onClick={addAddress}>
  Add address
</button>
```

This tiny detail prevents many accidental submissions.

## Validation

Start with native constraints where appropriate:

```jsx
<input
  name="email"
  type="email"
  required
/>
```

Other useful constraints include:

- `minLength` / `maxLength`;
- `min` / `max`;
- `pattern`;
- `required`;
- input `type`.

Client-side validation improves UX, but the server must still validate untrusted input.

## Error messages

A good error should:

- explain what is wrong;
- be associated with the field;
- remain understandable without color alone;
- be announced appropriately when dynamic.

Example:

```jsx
<label htmlFor="email">Email</label>
<input
  id="email"
  aria-describedby={emailError ? 'email-error' : undefined}
/>
{emailError && (
  <p id="email-error" role="alert">
    {emailError}
  </p>
)}
```

Use `role="alert"` deliberately, not for every hint or validation message.

## Touched and dirty are application concepts

React does not provide built-in `touched` or `dirty` state.

They are useful form concepts:

```text
touched = has the user interacted with this field?
dirty = does current value differ from initial value?
```

Libraries such as React Hook Form build APIs around these ideas, but they are ecosystem concepts, not React core APIs.

## File inputs

File inputs are browser-driven. Read selected files from the event or form data.

```jsx
<input type="file" name="avatar" accept="image/*" />
```

On submit:

```jsx
const file = formData.get('avatar');
```

Do not try to control a file input by assigning a normal filename string to `value`.

## React 19+ form Actions

> **React 19+**

Modern React supports passing a function to the `<form action>` prop.

```jsx
function Search() {
  function search(formData) {
    const query = formData.get('query');
    console.log(query);
  }

  return (
    <form action={search}>
      <input name="query" />
      <button type="submit">Search</button>
    </form>
  );
}
```

When `action` receives a function, React runs the submission using the Action model. Successful submissions reset uncontrolled fields.

This is different from traditional `onSubmit` handling.

## Traditional submit vs Action

```text
onSubmit
→ receive event
→ often preventDefault()
→ read FormData manually
→ manage pending/error state yourself

form action={function}
→ receive FormData directly
→ runs using React Action/Transition model
→ integrates with modern pending/error/optimistic APIs
```

Both are valid. The modern React section will cover Actions deeply rather than pretending every form must be rewritten immediately.

## Modern form APIs to learn later

The full React 19 form flow includes:

- form action functions;
- `useActionState`;
- `useFormStatus` from `react-dom`;
- `useOptimistic`;
- Server Functions where supported by a framework;
- progressive enhancement;
- multiple submit actions via `formAction`.

Those APIs deserve dedicated chapters because they change the mutation model, not just form syntax.

## Form architecture

For a complex form, separate concerns:

```text
field rendering
validation rules
submission/mutation
pending state
server errors
navigation/success behavior
```

Do not put every concern into one `handleChange` and one giant component.

## Common mistakes

### Missing `name`

A field without a `name` will not appear as a normal entry in `FormData`.

### Controlling without `onChange`

```jsx
<input value={email} />
```

creates a read-only controlled value unless you intentionally mark it `readOnly`.

### Checkbox uses `value` instead of `checked`

Use `checked` for its selected state.

### Switching controlled/uncontrolled

Keep the control mode stable through the component lifetime.

### Storing every derived validation flag

If a validity value can be calculated from current field state, often calculate it during render.

### Validating only in the browser

Server-side validation remains required for security and integrity.

## Debugging form problems

Ask:

1. Is the field controlled or uncontrolled?
2. Does a controlled field synchronously update its state in `onChange`?
3. Is `checked` used for checkbox/radio state?
4. Does the field have a `name` for FormData?
5. Is a non-submit button missing `type="button"`?
6. Did the component unexpectedly reset because its identity/key changed?
7. Is validation state duplicated instead of derived?

## Production example

```jsx
function ProfileForm({initialProfile, onSave}) {
  const [name, setName] = useState(initialProfile.name);
  const [bio, setBio] = useState(initialProfile.bio);

  const nameError = name.trim() === '' ? 'Name is required.' : null;
  const canSubmit = !nameError;

  function handleSubmit(event) {
    event.preventDefault();

    if (!canSubmit) return;

    onSave({name: name.trim(), bio});
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name</label>
      <input
        id="name"
        value={name}
        onChange={event => setName(event.target.value)}
        aria-describedby={nameError ? 'name-error' : undefined}
      />
      {nameError && <p id="name-error">{nameError}</p>}

      <label htmlFor="bio">Bio</label>
      <textarea
        id="bio"
        value={bio}
        onChange={event => setBio(event.target.value)}
      />

      <button type="submit" disabled={!canSubmit}>
        Save profile
      </button>
    </form>
  );
}
```

The validation value is derived instead of duplicated in state.

## Exercise

Build a checkout contact form containing:

- name;
- email;
- country select;
- delivery radio group;
- terms checkbox;
- optional notes textarea;
- file upload for a supporting document.

First implement it with native FormData and uncontrolled fields. Then convert only the fields that genuinely need live UI coordination to controlled inputs.

## Interview questions

**Junior:** What is the difference between controlled and uncontrolled inputs?

**Mid-level:** Why should a checkbox usually use `checked` rather than `value` for control state?

**Senior:** How do you choose between controlled fields, native FormData, a form library, and React 19 Action-based forms?

## Summary

```text
start with native forms
choose controlled state intentionally
use FormData when browser-owned values are enough
derive validation where possible
keep accessibility and server validation first-class
learn React 19 Actions as a separate modern mutation model
```

## References

- https://react.dev/reference/react-dom/components/form
- https://react.dev/reference/react-dom/components/input
- https://react.dev/reference/react-dom/components/select
- https://react.dev/reference/react-dom/components/textarea

## Next

Next we move into **Effects, refs, and reusable Hooks**, where the central rule is that Effects synchronize React with external systems rather than replace event handlers or derived calculations.