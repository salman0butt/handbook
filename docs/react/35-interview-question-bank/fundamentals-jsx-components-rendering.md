---
title: Fundamentals, JSX, Components, and Rendering Questions
description: React interview questions covering declarative UI, JSX, components, props, rendering, identity, keys, purity, and Strict Mode.
sidebar_position: 2
---

# Fundamentals, JSX, Components, and Rendering Questions

## 1. What is React?

**Strong answer:** React is a library for building user interfaces from components. You describe what the UI should look like for the current state, and React coordinates rendering and committing updates to the host environment such as the browser DOM.

**Follow-ups:** Why is React called declarative? What does React not provide by itself?

**Watch for:** “React is a framework” without qualification, or reducing React to “virtual DOM”.

## 2. What does declarative UI mean?

**Strong answer:** You describe the desired UI for a given state instead of manually issuing DOM mutations for each state transition. React decides how to reconcile the previous output with the next output.

**Follow-ups:** Compare this with imperative DOM manipulation.

## 3. What is a React component?

**Strong answer:** A component is a reusable unit of UI behavior and structure. In modern React, components are usually functions that receive props and return render output such as JSX.

**Follow-ups:** What makes a function a component? Why must component names start with a capital letter in JSX?

## 4. What is a React element?

**Strong answer:** A React element is a description of UI returned from JSX or `createElement`. It is data describing what should be rendered, not a DOM node and not the same thing as a component function.

**Follow-ups:** Component vs element? Element vs DOM node?

## 5. Component vs element — what is the difference?

**Strong answer:** A component is code that produces UI descriptions. An element is one such immutable description used by React during rendering.

## 6. What is JSX?

**Strong answer:** JSX is syntax that lets JavaScript express element trees. It is transformed into calls that create React element descriptions.

**Follow-ups:** Is JSX required? Can browsers execute JSX directly?

## 7. Why must JSX return one root expression?

**Strong answer:** A JavaScript function returns one value. Multiple siblings can be grouped in a Fragment without adding an extra DOM node.

## 8. What is a Fragment?

**Strong answer:** A Fragment groups multiple children without adding an extra host DOM element.

**Follow-ups:** When do you need an explicit `<Fragment key={...}>` instead of `<>...</>`?

## 9. How do JavaScript expressions work inside JSX?

**Strong answer:** Curly braces embed JavaScript expressions. Statements such as `if` cannot be placed directly as expressions, so conditional logic is usually done before return or with expression forms.

## 10. Why is `className` used instead of `class`?

**Strong answer:** React DOM exposes JSX props with JavaScript-oriented names. `className` maps to the DOM class attribute. Modern React also handles many native attributes directly, but the documented prop remains `className`.

## 11. Why is `htmlFor` used on labels?

**Strong answer:** `htmlFor` maps to the HTML `for` attribute and avoids the JavaScript keyword-style property name.

## 12. What are props?

**Strong answer:** Props are inputs passed from a parent to a component. They should be treated as immutable snapshots for a render.

**Follow-ups:** Can a child modify a prop? What should it do if it needs changeable data?

## 13. Why are props read-only?

**Strong answer:** Predictable one-way data flow depends on parents owning the values they pass. Mutating props would create hidden shared mutation and break React's assumptions about purity and update reasoning.

## 14. What is composition in React?

**Strong answer:** Composition builds complex UI by combining smaller components, typically through children, props, slots, or specialized component APIs rather than inheritance-heavy hierarchies.

## 15. Composition vs inheritance in React?

**Strong answer:** Composition is the default reuse mechanism. Inheritance is rarely needed for component behavior because props, children, Hooks, Context, and utility functions provide more explicit reuse.

## 16. What causes a React component to render?

**Strong answer:** Typical triggers include its initial mount, its own state update, a parent rendering it, or a Context value it reads changing. External stores can also schedule updates through their subscription mechanism.

**Follow-ups:** Does a parent render guarantee a DOM update in the child? No.

## 17. Does a component render whenever its props change?

**Strong answer:** Prop changes are one reason a parent may produce a new element for a child, but the deeper model is that React runs component rendering when work reaches that component. Memoization may allow React to skip a render when its comparison says inputs are equivalent.

## 18. What are the render and commit phases?

**Strong answer:** During render, React calculates the next UI and can call components. During commit, React applies the selected changes to the host environment and runs commit-related work such as refs and Effects according to their timing.

**Follow-ups:** Can render be restarted? Can commit be partially abandoned?

## 19. Why must rendering be pure?

**Strong answer:** React may call render logic more than once, pause it, restart it, or abandon it. Pure rendering means the same inputs produce the same output and no externally visible side effects happen during render.

## 20. What is idempotent rendering?

**Strong answer:** Re-running render with the same inputs should produce an equivalent result without accumulating side effects.

## 21. Why is `Math.random()` problematic during render?

**Strong answer:** It makes render output nondeterministic. This can break purity assumptions and may cause hydration differences in server-rendered applications.

## 22. Why is reading the current time during render risky?

**Strong answer:** Time changes independently of React inputs, so the same props/state can produce different output. For server/client rendering this can also create hydration mismatches.

## 23. What is reconciliation?

**Strong answer:** Reconciliation is React's process for comparing the previous rendered tree with the next one to determine what can be preserved and what should be changed, replaced, mounted, or unmounted.

## 24. How does React preserve component state?

**Strong answer:** State is associated with a component's identity at a position in the rendered tree. Matching component type and position, with keys where relevant, lets React preserve state between renders.

## 25. What does changing a component key do?

**Strong answer:** A different key gives React a different identity, so the previous component instance is removed and a new one is mounted with fresh state.

## 26. Why are keys important in lists?

**Strong answer:** Keys let React track sibling identity across insertions, removals, and reordering. Stable keys prevent state from being attached to the wrong item.

## 27. Why is array index often a bad key?

**Strong answer:** If order changes, the same index can now represent a different logical item. React may preserve DOM and state for the wrong item.

**Follow-ups:** When is index acceptable? Static, never-reordered lists with no identity-sensitive state are less risky.

## 28. Why should keys be stable and unique among siblings?

**Strong answer:** Stability lets the same logical item retain identity. Sibling uniqueness lets React distinguish items within the same list.

## 29. Are keys passed to the component as a normal prop?

**Strong answer:** No. `key` is special metadata used by React. If the component needs the same identifier, pass it separately such as `id={item.id}`.

## 30. What is Strict Mode?

**Strong answer:** Strict Mode enables development-only checks that help reveal unsafe side effects, missing cleanup, and other problems that can break under reusable or concurrent rendering assumptions.

## 31. Why does React sometimes render twice in development under Strict Mode?

**Strong answer:** Development checks intentionally re-run certain logic to reveal impure rendering or missing cleanup. It is not the production behavior to optimize around.

## 32. Should you remove Strict Mode because an Effect runs twice in development?

**Strong answer:** Usually no. Fix the Effect so setup and cleanup are correct. The repeated development cycle is often exposing a real lifecycle bug.

## 33. What is one-way data flow?

**Strong answer:** Data generally flows from owners to children through props/context. Children request changes through callbacks/actions rather than secretly mutating parent-owned values.

## 34. What does “UI is a function of state” mean?

**Strong answer:** For a given state and props snapshot, render should describe the corresponding UI. Instead of manually keeping DOM in sync, update state and let React produce the next output.

## 35. Why should components be small?

**Strong answer:** Not because line count itself is a rule, but because clear ownership and responsibilities improve reuse, testing, reasoning, and update scope. Over-fragmentation can also create indirection, so boundaries should match concepts.

## 36. What is the difference between a presentational and stateful component?

**Strong answer:** It is an architectural distinction, not a React API. Presentational components mainly receive data and emit events; stateful components own behavior or coordination. Modern code often mixes these deliberately rather than enforcing rigid categories.

## 37. Can a component return `null`?

**Strong answer:** Yes. Returning `null` means it renders no host UI for that render.

## 38. What happens if you define a component inside another component?

**Strong answer:** A new component function identity is created every parent render. React can treat it as a different component type, causing state reset and extra mounting. Define stable component types outside unless you specifically want a new identity.

## 39. Why should component functions not be called directly?

**Strong answer:** React should control component execution so Hook ordering, ownership, identity, debugging, and scheduling semantics remain correct. Use `<Component />`, not `Component()` as a replacement for rendering a component.

## 40. What is the difference between React tree and DOM tree?

**Strong answer:** The React tree represents component ownership/render relationships. The DOM tree is the host output. Components can produce multiple DOM nodes, no DOM node, or portals that are physically elsewhere while remaining in the same React tree.

## 41. What is the difference between owner and parent?

**Strong answer:** A parent in the rendered tree is the element relationship. Ownership refers to which component created an element. They are often related but conceptually distinct; Owner Stacks help diagnose creation relationships.

## 42. What is a portal and how does it affect the tree?

**Strong answer:** A portal places host content in a different DOM location while keeping it in the same React tree. Context and React event propagation follow the React tree, not the physical DOM placement.

## 43. What is the “virtual DOM” and is it the main reason React is fast?

**Strong answer:** The phrase usually refers to React's in-memory element/tree representation used to calculate updates. Performance comes from many design choices—declarative reconciliation, scheduling, batching, selective updates, Compiler optimizations, and architecture—not simply from having a virtual DOM.

## 44. What is the difference between mount, update, and unmount?

**Strong answer:** Mount creates a component identity in the tree, update re-renders the same preserved identity with new inputs/state, and unmount removes that identity and runs relevant cleanup.

## 45. How would you answer “How does React work?” in a senior interview?

**Strong answer:** Start with declarative components and state snapshots, explain render work producing the next tree, reconciliation preserving/replacing identities, commit applying host mutations, then mention scheduling/concurrency and that private Fiber details are implementation rather than public contracts.

**Watch for:** Diving straight into lane bitmasks or private Fiber fields before explaining the stable public mental model.