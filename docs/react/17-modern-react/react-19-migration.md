---
title: React 19 Migration and Removed APIs
description: A practical React 18-to-19 migration guide covering removed APIs, new JSX transform requirements, ref changes, testing changes, TypeScript changes, and modernization priorities.
sidebar_position: 8
---

# React 19 migration and removed APIs

React 19 is not only a feature release. It also removes deprecated APIs and changes several assumptions that older React codebases may rely on.

A good migration is not:

```text
change package.json
hope tests pass
```

It is:

```text
inventory old patterns
   ↓
upgrade with warnings/codemods
   ↓
replace removed APIs
   ↓
verify rendering + refs + forms + tests + types
   ↓
measure production behavior
```

## Target version

This handbook targets the React **19.2 documentation line** and currently tracks the stable `react` / `react-dom` package patch **19.2.8**.

React's documentation is versioned primarily by major/minor documentation line rather than publishing a separate docs site for every patch.

## New JSX transform is required

React 19 relies on the modern JSX transform for improvements including ref-as-prop behavior.

Old setup assumptions that require importing React purely for JSX should be modernized.

Old style:

```jsx
import React from 'react';

export default function App() {
  return <h1>Hello</h1>;
}
```

Modern environments do not need that import merely to compile JSX.

If your toolchain is old enough to use the legacy transform, update the build setup before treating React 19 as fully supported.

## Removed: `ReactDOM.render`

Old:

```jsx
import ReactDOM from 'react-dom';

ReactDOM.render(<App />, document.getElementById('root'));
```

Modern:

```jsx
import {createRoot} from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

This is not just syntax cleanup. Modern roots are the foundation for current React rendering behavior.

## Removed: `ReactDOM.hydrate`

Old:

```jsx
ReactDOM.hydrate(<App />, container);
```

Modern:

```jsx
import {hydrateRoot} from 'react-dom/client';

hydrateRoot(container, <App />);
```

Hydration deserves its own server-rendering chapter because mismatch handling and streaming behavior are architecture concerns, not merely an API rename.

## Removed: `unmountComponentAtNode`

Old:

```jsx
ReactDOM.unmountComponentAtNode(container);
```

Modern:

```jsx
root.unmount();
```

Keep the root object if your integration needs explicit unmounting.

## Removed: `findDOMNode`

Old class/integration code may contain:

```jsx
ReactDOM.findDOMNode(component);
```

Modern code should use explicit refs to the DOM node that actually needs imperative access.

```jsx
function Input() {
  const inputRef = useRef(null);

  return <input ref={inputRef} />;
}
```

Explicit refs produce clearer ownership than searching through rendered implementation details.

## Removed: string refs

Old:

```jsx
class Form extends React.Component {
  render() {
    return <input ref="email" />;
  }
}
```

Modern:

```jsx
function Form() {
  const emailRef = useRef(null);
  return <input ref={emailRef} />;
}
```

Or use callback refs when setup/cleanup behavior requires them.

## Function component `propTypes` checks removed from React

React 19 no longer performs function-component `propTypes` checking as part of React itself.

Old:

```jsx
function Heading({text}) {
  return <h1>{text}</h1>;
}

Heading.propTypes = {
  text: PropTypes.string,
};
```

Modern applications commonly use TypeScript for static contracts:

```tsx
type HeadingProps = {
  text: string;
};

function Heading({text}: HeadingProps) {
  return <h1>{text}</h1>;
}
```

Runtime validation may still be appropriate at untrusted boundaries, but that is a separate concern from component prop typing.

## Function component `defaultProps` removed behavior

Use JavaScript default parameters.

Old:

```jsx
function Badge({tone}) {
  return <span>{tone}</span>;
}

Badge.defaultProps = {
  tone: 'neutral',
};
```

Modern:

```jsx
function Badge({tone = 'neutral'}) {
  return <span>{tone}</span>;
}
```

Class components still have different legacy behavior, which matters when maintaining older applications.

## Legacy Context removed

Old class APIs such as:

```text
contextTypes
getChildContext
```

are removed.

Use modern Context:

```jsx
const ThemeContext = createContext('light');

function App() {
  return (
    <ThemeContext value="dark">
      <Page />
    </ThemeContext>
  );
}
```

React 19 also allows rendering the Context object itself as the provider rather than requiring `.Provider` in new code.

## `ref` is now a prop for function components

React 19 lets function components receive `ref` directly:

```jsx
function TextInput({ref, ...props}) {
  return <input ref={ref} {...props} />;
}
```

Usage:

```jsx
<TextInput ref={inputRef} />
```

This means new function components no longer need `forwardRef` merely to pass a ref through.

`forwardRef` remains important maintenance knowledge for existing libraries/codebases.

## `element.ref` is deprecated

If code inspects React elements, do not rely on:

```jsx
element.ref
```

React 19 treats ref as a regular prop on the element representation:

```jsx
element.props.ref
```

Element introspection is already an escape hatch. Prefer component APIs that avoid depending on React element internals where possible.

## Ref callback cleanup

React 19 supports ref callback cleanup functions.

```jsx
<div
  ref={node => {
    observe(node);

    return () => {
      unobserve(node);
    };
  }}
/>
```

This affects TypeScript migration because accidental implicit returns from ref callbacks may now look like cleanup functions.

Problematic:

```jsx
<div ref={node => (currentNode = node)} />
```

Safer:

```jsx
<div
  ref={node => {
    currentNode = node;
  }}
/>
```

## `react-dom/test-utils` changes

Import `act` from `react`:

Old:

```jsx
import {act} from 'react-dom/test-utils';
```

Modern:

```jsx
import {act} from 'react';
```

Other low-level `react-dom/test-utils` helpers should not be treated as the modern testing direction.

## `react-test-renderer` deprecated

React 19 deprecates `react-test-renderer`.

Its renderer environment does not closely match how users interact with browser/native UIs, and it encourages implementation-detail testing.

Prefer user-focused testing approaches such as React Testing Library for browser component behavior, with end-to-end tools where appropriate.

We cover this in the testing phase.

## Shallow rendering is legacy-oriented

`react-test-renderer/shallow` was removed from React 19's package surface.

Even when a separate shallow-renderer package is available, treat shallow rendering as maintenance knowledge rather than the default testing strategy.

Prefer tests that exercise meaningful behavior through the rendered UI.

## Strict Mode behavior changed in React 19

Strict Mode remains a development tool, not a production double-render mode.

React 19 includes refinements such as reuse of memoized results during certain development double-render checks and additional ref callback checks.

Do not “fix” Strict Mode warnings by removing Strict Mode or adding flags that hide incorrect cleanup.

Use the behavior to find impurity and missing cleanup.

## Error reporting behavior changed

React 19 changed how render errors are reported to reduce duplicate logging.

Modern roots support error-handling options such as:

```jsx
createRoot(container, {
  onUncaughtError(error, errorInfo) {
    reportError(error, errorInfo);
  },
  onCaughtError(error, errorInfo) {
    reportCaughtError(error, errorInfo);
  },
});
```

If a production monitoring setup depended on errors being re-thrown in older React behavior, verify the integration during migration.

## UMD builds removed

React 19 no longer ships UMD builds as the normal distribution format.

If a legacy page loads React from old UMD script URLs, migrate to a modern ESM/build-tool setup.

Do not assume an old CDN snippet from a React 16 tutorial remains valid for React 19.

## TypeScript: `useRef` requires an argument

React 19 type definitions simplify ref typing and expect an initial argument.

Bad under current types:

```tsx
const ref = useRef();
```

Use an intentional initial value:

```tsx
const ref = useRef<HTMLDivElement | null>(null);
```

or:

```tsx
const ref = useRef<number | undefined>(undefined);
```

## TypeScript: refs are mutable under the modern model

React 19's type direction simplifies the historical split around mutable ref object types.

Code should still treat ref mutation as an escape-hatch mechanism, even though the type system makes the object mutable.

## TypeScript: `ReactElement` props default changed

Code that introspects an unparameterized `ReactElement` should no longer assume props default to `any`.

If element introspection is genuinely necessary, type the expected props explicitly.

Better yet, reconsider whether inspecting arbitrary React element props is the right component API.

## TypeScript: `useReducer` inference

React 19 type guidance generally prefers allowing reducer function types to drive inference rather than passing the older full `React.Reducer<...>` generic shape into `useReducer`.

Good:

```tsx
type State = {count: number};
type Action = {type: 'increment'};

function reducer(state: State, action: Action): State {
  if (action.type === 'increment') {
    return {count: state.count + 1};
  }

  return state;
}

const [state, dispatch] = useReducer(reducer, {count: 0});
```

## React 19 form modernization

A React 18-era form may manually manage pending state:

```jsx
async function handleSubmit(event) {
  event.preventDefault();
  setSubmitting(true);

  try {
    await save(new FormData(event.currentTarget));
  } finally {
    setSubmitting(false);
  }
}
```

This is still valid JavaScript/React.

But React 19 also offers:

- function-valued form Actions;
- `useActionState`;
- `useFormStatus`;
- `useOptimistic`.

Do not mechanically rewrite every form. Adopt the new model where it simplifies the mutation lifecycle.

## React 19.2 additions to know

Beyond the React 19.0 migration itself, the 19.2 documentation line includes important additions such as:

- `<Activity>`;
- `useEffectEvent`;
- `cacheSignal` for Server Components;
- React Performance Tracks;
- server/static rendering improvements including partial pre-rendering APIs.

A migration plan should separate:

```text
required breaking-change fixes
from
optional new feature adoption
```

First get the application correct on React 19. Then adopt newer patterns deliberately.

## Codemods

The React team provides codemods for common migration patterns.

Examples include migrations for:

- old root rendering;
- string refs;
- `act` imports;
- older form-state APIs;
- TypeScript-related React 19 type changes.

Codemods reduce mechanical work, but they do not replace architectural review.

Always:

1. commit or branch first;
2. run codemods;
3. inspect diffs;
4. run type checks/tests/builds;
5. verify runtime behavior.

## Migration order

A practical sequence:

```text
1. inventory dependencies
2. update old React warnings/patterns
3. upgrade React + React DOM
4. update TypeScript React types if used
5. ensure modern JSX transform
6. replace removed root/hydration APIs
7. migrate refs / legacy Context / old prop patterns
8. update tests
9. build and run integration/E2E tests
10. verify SSR/hydration if applicable
11. profile critical flows
12. adopt optional React 19 features gradually
```

## Dependency compatibility

The application may be React-19-ready while a dependency is not.

Audit libraries that:

- depend on private React internals;
- assume legacy root APIs;
- monkey-patch rendering behavior;
- rely on old peer dependency ranges;
- use deprecated test renderers;
- inspect elements/refs in unsupported ways.

Libraries depending on private React internals are especially risky because React does not guarantee those internals as public API.

## Do not confuse deprecation with removal

Use these categories precisely:

```text
removed
→ API no longer supported in React 19

 deprecated
→ still present but migration is recommended

legacy pattern
→ may still work but is not the recommended modern teaching path
```

Examples:

```text
ReactDOM.render          → removed
react-test-renderer      → deprecated
class components         → supported legacy/maintenance knowledge, not removed
forwardRef               → still relevant to older code, ref-as-prop preferred for new React 19 function components
```

## Production migration checklist

Before declaring a React 19 upgrade complete:

- production build passes;
- no removed APIs remain;
- hydration flows are tested;
- error monitoring still captures expected errors;
- forms work under rapid submission;
- refs clean up correctly;
- Strict Mode does not reveal broken side effects;
- TypeScript is clean;
- accessibility regressions are checked;
- bundle/runtime performance is compared;
- major third-party integrations are exercised.

## Interview questions

**Junior:** What replaced `ReactDOM.render` in modern React?

**Mid-level:** Why is `forwardRef` no longer required for new React 19 function components that receive refs?

**Senior:** How would you plan a React 18-to-19 migration for a large application with SSR, TypeScript, old tests, and many third-party libraries?

## References

- https://react.dev/blog/2024/04/25/react-19-upgrade-guide
- https://react.dev/blog/2024/12/05/react-19
- https://react.dev/blog/2025/10/01/react-19-2
- https://react.dev/versions

## Next

The next phase goes deeper into **Suspense, transitions, deferred values, lazy loading, and concurrent rendering**.