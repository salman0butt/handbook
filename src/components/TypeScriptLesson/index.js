import React from 'react';
import {CATEGORY_DESCRIPTIONS, DEFINITIONS, OFFICIAL} from './data';
import {examples} from './examples';

export {CATEGORY_DESCRIPTIONS} from './data';

const h = React.createElement;

function Code({children}) {
  return h('pre', null, h('code', {className: 'language-ts'}, children));
}

function list(tag, items, key) {
  return h(tag, {key}, ...items.map((item, index) => h('li', {key: `${key}-${index}`}, item)));
}

const SECTION_HEADINGS = [
  'What the concept is',
  'Why the concept exists',
  'Beginner mental model',
  'JavaScript runtime behavior',
  'TypeScript compile-time behavior',
  'Basic TypeScript example',
  'Practical application',
  'Incorrect design',
  'Safer design',
  'Inference and compiler diagnostics',
  'Common mistakes',
  'Debugging guidance',
  'Performance implications',
  'API and library design implications',
  'Production considerations',
  'Interview explanation',
  'Summary',
  'Practice exercises',
  'Official references',
];

export default function TypeScriptLesson({topic, category}) {
  const description = CATEGORY_DESCRIPTIONS[category] ?? 'designing safer JavaScript systems';
  const definition = DEFINITIONS[topic] ?? `${topic} is part of ${category.toLowerCase()}: ${description}.`;
  const [basic, practical, incorrect, correct] = examples(topic, category);
  const references = OFFICIAL[category] ?? [['TypeScript Handbook', 'https://www.typescriptlang.org/docs/handbook/intro.html']];
  const bodies = [
    h('p', null, definition),
    h('p', null, `It makes the relationship between JavaScript behavior and the checker explicit. Used well, ${topic} reduces duplicated assumptions, improves editor feedback, and makes changes safer at module and team boundaries.`),
    h('p', null, `Think of ${topic} as a contract between code that produces a value and code that consumes it. The contract should prevent invalid operations without becoming harder to understand than the runtime behavior it models.`),
    h('p', null, 'JavaScript executes the emitted program. Prototype lookup, coercion, mutation, scheduling, module loading, I/O, and exceptions still follow JavaScript and platform rules. TypeScript adds no runtime validation unless the implementation performs it.'),
    h('p', null, `The checker combines ${topic} with contextual types, control flow, declarations, and compiler options. It reports diagnostics and powers editor tooling; it does not execute the program.`),
    h(React.Fragment, null, h(Code, null, basic), h('p', null, 'Hover important expressions and compare inferred types with declared contracts.')),
    h(React.Fragment, null, h(Code, null, practical), h('p', null, 'Keep contracts close to the boundary that owns them. Prefer inference locally and named types for important reusable boundaries.')),
    h(React.Fragment, null, h(Code, null, incorrect), h('p', null, 'This loses information, hides uncertainty, or promises something runtime code has not proved.')),
    h(React.Fragment, null, h(Code, null, correct), h('p', null, 'The safer form preserves evidence. Isolate unavoidable assertions behind validation or a function that documents the invariant.')),
    h('p', null, 'Identify the actual type, expected type, and first incompatible member. Decide whether the implementation, model, or boundary assumption is wrong before changing the final assignment. Preserve relevant compiler options in minimal reproductions.'),
    list('ul', [
      'Treating a static contract as runtime validation.',
      'Adding any, a broad assertion, or a non-null assertion before identifying the broken assumption.',
      'Duplicating a contract instead of deriving it from the source of truth.',
      'Exposing implementation, database, or framework internals as a public API.',
      'Building a clever type that is harder to maintain than the bug it prevents.',
    ], 'mistakes'),
    h('p', null, 'Start with npx tsc --noEmit --pretty false. Use --showConfig for configuration, --traceResolution for imports, and --extendedDiagnostics for performance. Confirm editor and CI versions match, then reduce the problem to the smallest failing declaration and assignment.'),
    h('p', null, `Most uses of ${topic} have no direct runtime cost because types are erased. Runtime schemas, imports, object creation, and emitted helpers do have costs. Huge unions, recursive conditional types, repeated mapped transformations, and large declaration surfaces can slow checking.`),
    h('p', null, 'Public contracts should be stable, readable, and easy to infer. Avoid leaking private implementation details or enormous computed types. Test both accepted and rejected consumer usage.'),
    h('p', null, 'Run type checking as a separate CI gate even when a bundler strips TypeScript syntax. Validate external data at runtime, pin a compiler range, review release notes, and verify module behavior against the deployment runtime.'),
    h('p', null, `Explain ${topic} in three parts: runtime behavior, compile-time behavior, and one trade-off. Use a minimal example, then connect it to an API or production boundary.`),
    list('ul', [definition, 'Static types improve feedback but do not replace runtime checks.', 'Preserve inference and make invalid states harder to represent.', 'Fix the underlying relationship before using an escape hatch.'], 'summary'),
    list('ol', [
      'Make the basic example reject an invalid value.',
      'Create a runtime case requiring a guard or schema.',
      `Explain how ${topic} affects a function or module boundary.`,
      'Write a negative type test with @ts-expect-error.',
      'Describe a bug caused by confusing static and runtime guarantees.',
    ], 'exercises'),
    h('ul', null, ...references.map(([label, url]) => h('li', {key: url}, h('a', {href: url}, label)))),
  ];

  const children = [];
  SECTION_HEADINGS.forEach((heading, index) => {
    children.push(h('h2', {key: `heading-${index}`}, heading));
    children.push(h(React.Fragment, {key: `body-${index}`}, bodies[index]));
  });
  return h(React.Fragment, null, ...children);
}
