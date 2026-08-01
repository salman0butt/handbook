import {readFile, readdir} from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const root = process.cwd();
const manifest = require('./typescript-curriculum-manifest.js');
const failures = [];
const numeric = /^(?:chapter\s+)?\d+(?:[A-Za-z])?(?:\s*[–-]\s*\d+)?(?:[.\s:—–-]|$)/i;
const placeholder = /\b(?:TODO|TBD|coming soon)\b/i;
const requiredHeadings = [
  'What the concept is', 'Why the concept exists', 'Beginner mental model',
  'JavaScript runtime behavior', 'TypeScript compile-time behavior',
  'Basic TypeScript example', 'Practical application', 'Incorrect design',
  'Safer design', 'Inference and compiler diagnostics', 'Common mistakes',
  'Debugging guidance', 'Performance implications',
  'API and library design implications', 'Production considerations',
  'Interview explanation', 'Summary', 'Practice exercises', 'Official references',
];
const dynamicImport = "import DynamicTypeScriptDoc from '@site/src/components/TypeScriptLesson/Dynamic';";

async function collect(dir) {
  const out = [];
  for (const entry of await readdir(dir, {withFileTypes: true})) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await collect(file));
    else if (/\.mdx?$/.test(entry.name)) out.push(file);
  }
  return out;
}

function frontmatterTitle(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const line = match[1].split('\n').find((value) => /^title:\s*/.test(value));
  if (!line) return null;
  const raw = line.replace(/^title:\s*/, '').trim();
  try { return JSON.parse(raw); } catch { return raw.replace(/^['"]|['"]$/g, ''); }
}

function scan(items, ids, labels) {
  for (const item of items) {
    if (typeof item === 'string') { ids.add(item); continue; }
    if (!item || typeof item !== 'object') continue;
    if (item.label) labels.push(item.label);
    if ((item.type === 'doc' || item.type === 'ref') && item.id) ids.add(item.id);
    if (item.type === 'category') {
      if (item.link?.type === 'doc') ids.add(item.link.id);
      scan(item.items ?? [], ids, labels);
    }
  }
}

const entries = [];
for (const category of manifest.categories) {
  entries.push({
    id: `typescript/${category.slug}/index`,
    path: `docs/typescript/${category.slug}/index.md`,
    title: category.name,
    kind: 'category',
  });
  for (const [title, route, kind] of category.topics) {
    entries.push({
      id: `typescript/${route}`,
      path: kind === 'core' ? `docs/typescript/${route}.md` : `docs/typescript/${route}.mdx`,
      title,
      category: category.name,
      kind,
    });
  }
}

const docs = await collect(path.join(root, 'docs/typescript'));
const actual = new Set(docs.map((file) => path.relative(root, file).replaceAll(path.sep, '/')));
const expected = new Set([...entries.map((entry) => entry.path), ...manifest.legacyPaths]);
if (manifest.categoryCount !== 59) failures.push('Expected 59 categories');
if (manifest.topicCount !== 661) failures.push('Expected 661 focused topics');
if (entries.length !== 720) failures.push(`Expected 720 manifest entries, found ${entries.length}`);
if (expected.size !== 734) failures.push(`Expected 734 unique document paths, found ${expected.size}`);
if (actual.size !== expected.size) failures.push(`Expected ${expected.size} TypeScript files, found ${actual.size}`);
for (const file of expected) if (!actual.has(file)) failures.push(`Missing ${file}`);

const lessonComponent = await readFile(path.join(root, 'src/components/TypeScriptLesson/index.js'), 'utf8');
const dynamicComponent = await readFile(path.join(root, 'src/components/TypeScriptLesson/Dynamic.js'), 'utf8');
for (const heading of requiredHeadings) if (!lessonComponent.includes(`'${heading}'`)) failures.push(`Lesson component missing ${heading}`);
if (!dynamicComponent.includes("h('h1'")) failures.push('Dynamic lesson component must render an H1');
if (!dynamicComponent.includes("h(Head")) failures.push('Dynamic lesson component must set an exact document title');

let mermaidCount = 0;
for (const entry of entries) {
  const markdown = await readFile(path.join(root, entry.path), 'utf8');
  if (numeric.test(entry.title)) failures.push(`${entry.path}: numeric visible title`);
  if (placeholder.test(markdown)) failures.push(`${entry.path}: placeholder language`);
  if (((markdown.match(/^```/gm) ?? []).length % 2) !== 0) failures.push(`${entry.path}: unbalanced fences`);
  mermaidCount += (markdown.match(/```mermaid/g) ?? []).length;
  if (entry.kind === 'core') {
    const title = frontmatterTitle(markdown);
    if (!title) failures.push(`${entry.path}: missing core title`);
    if ((markdown.match(/^# .+$/gm) ?? []).length !== 1) failures.push(`${entry.path}: expected one H1`);
  } else {
    if (!markdown.includes(dynamicImport)) failures.push(`${entry.path}: missing dynamic document import`);
    if (!markdown.includes('<DynamicTypeScriptDoc />')) failures.push(`${entry.path}: missing dynamic document renderer`);
  }
}
if (mermaidCount < 18) failures.push(`Expected at least 18 focused Mermaid diagrams, found ${mermaidCount}`);

for (const legacyPath of manifest.legacyPaths) {
  const markdown = await readFile(path.join(root, legacyPath), 'utf8');
  const title = frontmatterTitle(markdown);
  if (!title) failures.push(`${legacyPath}: missing title`);
  else if (numeric.test(title)) failures.push(`${legacyPath}: numeric title`);
  if ((markdown.match(/^# .+$/gm) ?? []).length !== 1) failures.push(`${legacyPath}: expected one H1`);
}

const sidebar = require('../sidebars.typescript.js');
const ids = new Set();
const labels = [];
scan(sidebar.typescriptSidebar ?? [], ids, labels);
for (const entry of entries) if (!ids.has(entry.id)) failures.push(`Sidebar missing ${entry.id}`);
for (const label of labels) if (numeric.test(label)) failures.push(`Numeric sidebar label: ${label}`);
if ((sidebar.typescriptSidebar ?? []).length !== 59) failures.push('Expected 59 sidebar categories');

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`PASS TypeScript handbook: 59 categories, 661 focused topics, 734 Markdown/MDX files, ${ids.size} sidebar links, ${mermaidCount} focused diagrams.`);
