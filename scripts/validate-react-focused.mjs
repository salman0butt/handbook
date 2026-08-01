import {readFile, readdir} from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('docs/react/focused-foundations');
const sidebarPath = path.resolve('sidebars.final.js');
const expected = [
  "declarative-vs-imperative-ui",
  "component-based-architecture",
  "react-elements-and-jsx",
  "jsx-expressions",
  "jsx-attributes-and-children",
  "fragments",
  "conditional-jsx",
  "rendering-lists",
  "keys-and-identity",
  "function-components",
  "props",
  "children-and-composition",
  "component-purity",
  "render-and-commit-phases",
  "reconciliation",
  "event-handling",
  "event-propagation",
  "controlled-inputs",
  "uncontrolled-inputs-and-file-inputs",
  "form-validation-and-accessibility",
  "state-as-a-snapshot",
  "batching-and-functional-updates",
  "updating-objects-and-arrays",
  "derived-state",
  "lifting-and-colocating-state",
  "preserving-and-resetting-state"
];

const requiredHeadings = [
  '## What it is',
  '## Why it exists',
  '## Beginner mental model',
  '## How React handles it',
  '## TypeScript example',
  '## Common mistakes',
  '## Debugging guidance',
  '## Performance implications',
  '## Accessibility and security',
  '## Production considerations',
  '## Interview explanation',
  '## Summary',
  '## Practice exercises',
];

const files = (await readdir(root)).filter((name) => name.endsWith('.md')).sort();
const actual = files.map((name) => name.replace(/\.md$/, ''));

const failures = [];
for (const slug of expected) {
  if (!actual.includes(slug)) failures.push(`Missing focused lesson: ${slug}`);
}
for (const slug of actual) {
  if (!expected.includes(slug)) failures.push(`Unexpected focused lesson: ${slug}`);
}

const sidebar = await readFile(sidebarPath, 'utf8');

for (const slug of expected) {
  const file = path.join(root, `${slug}.md`);
  const source = await readFile(file, 'utf8');

  if (!/^---\n[\s\S]*?\n---\n/.test(source)) failures.push(`${slug}: invalid or missing frontmatter`);
  if (/^title:\s*(?:chapter\s+)?\d+/im.test(source)) failures.push(`${slug}: numeric title prefix`);
  if (!/```mermaid\n[\s\S]+?\n```/.test(source)) failures.push(`${slug}: missing Mermaid diagram`);
  if (!/```tsx\n[\s\S]+?\n```/.test(source)) failures.push(`${slug}: missing TypeScript/TSX example`);

  for (const heading of requiredHeadings) {
    if (!source.includes(heading)) failures.push(`${slug}: missing section "${heading}"`);
  }

  const practice = source.split('## Practice exercises')[1] ?? '';
  const exerciseCount = (practice.match(/^\d+\.\s/gm) ?? []).length;
  if (exerciseCount < 3) failures.push(`${slug}: expected at least 3 exercises`);

  if (!sidebar.includes(`focused-foundations/${slug}`)) {
    failures.push(`${slug}: missing from sidebars.final.js`);
  }
}

if (failures.length > 0) {
  console.error(`React focused-foundations validation failed with ${failures.length} problem(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`PASS ${expected.length} focused React lessons include diagrams, TypeScript examples, production guidance, exercises, and sidebar entries.`);
