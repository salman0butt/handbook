import {readdir, readFile} from 'node:fs/promises';
import path from 'node:path';
import {JSDOM} from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'https://handbook.local/',
});

const browserGlobals = {
  window: dom.window,
  document: dom.window.document,
  navigator: dom.window.navigator,
  Element: dom.window.Element,
  HTMLElement: dom.window.HTMLElement,
  SVGElement: dom.window.SVGElement,
  Node: dom.window.Node,
  DOMParser: dom.window.DOMParser,
};

// Node.js 24 exposes navigator as a getter-only global. Define the browser-like
// globals explicitly instead of assigning to them so the validator works on
// current Node.js releases as well as older supported versions.
for (const [name, value] of Object.entries(browserGlobals)) {
  Object.defineProperty(globalThis, name, {
    value,
    configurable: true,
    writable: true,
  });
}

// Mermaid and DOMPurify must be imported only after the browser-like globals exist.
const {default: mermaid} = await import('mermaid');

const docsRoot = path.resolve('docs');
const mermaidFence = /```mermaid[^\n]*\n([\s\S]*?)\n```/g;

async function collectMarkdownFiles(directory) {
  const entries = await readdir(directory, {withFileTypes: true});
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectMarkdownFiles(absolutePath));
    } else if (/\.mdx?$/.test(entry.name)) {
      files.push(absolutePath);
    }
  }

  return files;
}

mermaid.initialize({
  startOnLoad: false,
  securityLevel: 'strict',
});

const files = await collectMarkdownFiles(docsRoot);
const failures = [];
let diagramCount = 0;

for (const file of files) {
  const markdown = await readFile(file, 'utf8');
  let match;
  let diagramIndex = 0;

  while ((match = mermaidFence.exec(markdown)) !== null) {
    diagramIndex += 1;
    diagramCount += 1;
    const source = match[1].trim();

    try {
      await mermaid.parse(source);
    } catch (error) {
      failures.push({
        file: path.relative(process.cwd(), file),
        diagramIndex,
        message: error instanceof Error ? error.message : String(error),
        source,
      });
    }
  }
}

if (failures.length > 0) {
  console.error(`Mermaid validation failed for ${failures.length} of ${diagramCount} diagrams.\n`);

  for (const failure of failures) {
    console.error(`--- ${failure.file} (diagram ${failure.diagramIndex}) ---`);
    console.error(failure.message);
    console.error(failure.source);
    console.error();
  }

  process.exit(1);
}

console.log(`PASS ${diagramCount} Mermaid diagrams parsed successfully across ${files.length} Markdown files.`);
