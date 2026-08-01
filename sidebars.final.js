/** Final handbook sidebars with focused React foundations layered over existing sections. */
const sidebars = require('./sidebars.ai-engineering.js');

const category = (label, items, extra = {}) => ({type: 'category', label, items, ...extra});
const doc = (id, label) => ({type: 'doc', id: `react/${id}`, label});

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
  ...advancedReact,
];

module.exports = sidebars;
