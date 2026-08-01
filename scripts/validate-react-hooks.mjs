import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');
const fail = (message) => {
  console.error(`FAIL ${message}`);
  process.exitCode = 1;
};

const sidebar = read('sidebars.final.js');
const config = read('docusaurus.config.js');
const mobileCss = read('src/css/mobile-dark-mode.css');

const requiredHooks = [
  'useState',
  'useReducer',
  'useContext',
  'useRef',
  'useImperativeHandle',
  'useEffect',
  'useLayoutEffect',
  'useInsertionEffect',
  'useEffectEvent',
  'useMemo',
  'useCallback',
  'useTransition',
  'useDeferredValue',
  'useDebugValue',
  'useId',
  'useSyncExternalStore',
  'useActionState',
  'useOptimistic',
  'useFormStatus',
];

for (const hook of requiredHooks) {
  if (!sidebar.includes(hook)) {
    fail(`${hook} is missing from the Built-in Hooks Reference navigation.`);
  }
}

if (!sidebar.includes("category('Built-in Hooks Reference'")) {
  fail('The Built-in Hooks Reference category is missing.');
}

const dedicatedLessons = [
  ['useId', 'docs/react/hooks/use-id.md'],
  ['useImperativeHandle', 'docs/react/hooks/use-imperative-handle.md'],
  ['useLayoutEffect', 'docs/react/hooks/use-layout-effect.md'],
  ['useInsertionEffect', 'docs/react/hooks/use-insertion-effect.md'],
  ['useDebugValue', 'docs/react/hooks/use-debug-value.md'],
  ['useMemo', 'docs/react/hooks/use-memo.md'],
  ['useCallback', 'docs/react/hooks/use-callback.md'],
  ['useFormStatus', 'docs/react/hooks/use-form-status.md'],
];

for (const [hook, relativePath] of dedicatedLessons) {
  if (!fs.existsSync(path.join(root, relativePath))) {
    fail(`${relativePath} does not exist.`);
    continue;
  }

  const lesson = read(relativePath);
  const requiredMarkers = [
    `# ${hook}`,
    '```mermaid',
    '```tsx',
    'Common mistakes',
    'Interview explanation',
    'Official reference',
  ];

  for (const marker of requiredMarkers) {
    if (!lesson.includes(marker)) {
      fail(`${relativePath} is missing required section or marker: ${marker}`);
    }
  }
}

const overview = read('docs/react/hooks/built-in-hooks-reference.md');
for (const hook of requiredHooks) {
  if (!overview.includes(`\`${hook}\``)) {
    fail(`Complete hook map does not document ${hook}.`);
  }
}

const configMarkers = [
  "disableSwitch: false",
  "respectPrefersColorScheme: true",
  "require.resolve('./src/css/mobile-dark-mode.css')",
];

for (const marker of configMarkers) {
  if (!config.includes(marker)) {
    fail(`Docusaurus mobile dark-mode configuration is missing: ${marker}`);
  }
}

const cssMarkers = [
  '@media screen and (max-width: 996px)',
  "[class*='colorModeToggle']",
  'min-width: 44px',
  "[data-theme='dark'] .navbar-sidebar",
];

for (const marker of cssMarkers) {
  if (!mobileCss.includes(marker)) {
    fail(`Mobile dark-mode stylesheet is missing: ${marker}`);
  }
}

if (!process.exitCode) {
  console.log(
    `PASS ${requiredHooks.length} React and React DOM hooks are navigable; ` +
      `${dedicatedLessons.length} previously bundled hooks have focused lessons; ` +
      'mobile dark mode follows system preference and exposes an accessible toggle.',
  );
}
