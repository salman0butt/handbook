/** Final handbook sidebars with focused React foundations layered over existing sections. */
const sidebars = require('./sidebars.ai-engineering.js');
const typescriptSidebars = require('./sidebars.typescript.js');
const {appendNextjsSidebar} = require('./sidebars.nextjs.js');
sidebars.typescriptSidebar = typescriptSidebars.typescriptSidebar;
sidebars.nextjsSidebar = appendNextjsSidebar(sidebars.nextjsSidebar);

const category = (label, items, extra = {}) => ({type: 'category', label, items, ...extra});
const doc = (id, label) => ({type: 'doc', id: `react/${id}`, label});
const ref = (id, label) => ({type: 'ref', id: `react/${id}`, label});

const existingReact = sidebars.reactSidebar;
const startHere = existingReact.slice(0, 3);
const advancedReact = existingReact.slice(11);

sidebars.reactSidebar = [
  ...startHere,
  category('React Foundations', [
    category('UI Mental Models', [
      doc('focused-foundations/declarative-vs-imperative-ui', 'Declarative vs Imperative UI'),
      doc('focused-foundations/component-based-architecture', 'Component-Based Architecture'),
    ]),
    category('JSX', [
      doc('focused-foundations/react-elements-and-jsx', 'React Elements and JSX'),
      doc('focused-foundations/jsx-expressions', 'JSX Expressions'),
      doc('focused-foundations/jsx-attributes-and-children', 'JSX Attributes and Children'),
      doc('focused-foundations/fragments', 'Fragments'),
      doc('focused-foundations/conditional-jsx', 'Conditional JSX'),
      doc('focused-foundations/rendering-lists', 'Rendering Lists'),
      doc('focused-foundations/keys-and-identity', 'Keys and Identity'),
    ]),
    category('Components', [
      doc('focused-foundations/function-components', 'Function Components'),
      doc('focused-foundations/props', 'Props'),
      doc('focused-foundations/children-and-composition', 'Children and Composition'),
      doc('focused-foundations/component-purity', 'Component Purity'),
    ]),
    category('Rendering and Identity', [
      doc('focused-foundations/render-and-commit-phases', 'Render and Commit Phases'),
      doc('focused-foundations/reconciliation', 'Reconciliation'),
    ]),
    category('Events and Forms', [
      doc('focused-foundations/event-handling', 'Event Handling'),
      doc('focused-foundations/event-propagation', 'Event Propagation'),
      doc('focused-foundations/controlled-inputs', 'Controlled Inputs'),
      doc('focused-foundations/uncontrolled-inputs-and-file-inputs', 'Uncontrolled Inputs and File Inputs'),
      doc('focused-foundations/form-validation-and-accessibility', 'Form Validation and Accessibility'),
    ]),
    category('State Foundations', [
      doc('hooks/use-state', 'useState'),
      doc('focused-foundations/state-as-a-snapshot', 'State as a Snapshot'),
      doc('focused-foundations/batching-and-functional-updates', 'Batching and Functional State Updates'),
      doc('focused-foundations/updating-objects-and-arrays', 'Updating Objects and Arrays in State'),
      doc('focused-foundations/derived-state', 'Derived State'),
      doc('focused-foundations/lifting-and-colocating-state', 'Lifting and Colocating State'),
      doc('focused-foundations/preserving-and-resetting-state', 'Preserving and Resetting State'),
    ]),
    category('Coverage and Sources', [
      doc('reference/focused-foundations-audit', 'Focused Foundations Audit'),
    ]),
  ], {collapsed: false}),
  category('Built-in Hooks Reference', [
    doc('hooks/built-in-hooks-reference', 'Complete Hooks Map'),
    category('State Hooks', [
      ref('hooks/use-state', 'useState'),
      ref('reducers/use-reducer-and-reducer-design', 'useReducer'),
    ]),
    category('Context Hook', [
      ref('context/context-and-use-context', 'useContext'),
    ]),
    category('Ref Hooks', [
      ref('refs/use-ref', 'useRef'),
      doc('hooks/use-imperative-handle', 'useImperativeHandle'),
    ]),
    category('Effect Hooks', [
      ref('effects/use-effect', 'useEffect'),
      doc('hooks/use-layout-effect', 'useLayoutEffect'),
      doc('hooks/use-insertion-effect', 'useInsertionEffect'),
      ref('effects/use-effect-event', 'useEffectEvent'),
    ]),
    category('Performance and Scheduling Hooks', [
      doc('hooks/use-memo', 'useMemo'),
      doc('hooks/use-callback', 'useCallback'),
      ref('concurrency/use-transition-and-start-transition', 'useTransition'),
      ref('concurrency/use-deferred-value', 'useDeferredValue'),
    ]),
    category('Other and Library Hooks', [
      doc('hooks/use-debug-value', 'useDebugValue'),
      doc('hooks/use-id', 'useId'),
      ref('state-architecture/use-sync-external-store', 'useSyncExternalStore'),
    ]),
    category('Action and Form Hooks', [
      ref('modern-react/use-action-state', 'useActionState'),
      ref('modern-react/use-optimistic', 'useOptimistic'),
      doc('hooks/use-form-status', 'useFormStatus (react-dom)'),
    ]),
    category('Related API', [
      ref('modern-react/use-api-and-resources', 'use(resource) — React API'),
    ]),
  ], {collapsed: false}),
  ...advancedReact,
];

module.exports = sidebars;
