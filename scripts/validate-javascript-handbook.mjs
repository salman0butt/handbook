import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import {createRequire} from 'node:module'
import {fileURLToPath} from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const javascriptRoot = path.join(root, 'docs', 'javascript')
const sidebarPath = path.join(root, 'sidebars.javascript.js')
const configPath = path.join(root, 'docusaurus.config.js')
const packagePath = path.join(root, 'package.json')
const lockPath = path.join(root, 'package-lock.json')
const deployPath = path.join(root, '.github', 'workflows', 'deploy.yml')
const workflowPath = path.join(root, '.github', 'workflows', 'javascript-handbook.yml')
const exerciseDataPath = path.join(root, 'src', 'data', 'javascriptExercises.js')

const failures = []
const fail = message => failures.push(message)

function walk(directory) {
  if (!fs.existsSync(directory)) return []
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap(entry => {
    const target = path.join(directory, entry.name)
    return entry.isDirectory() ? walk(target) : [target]
  })
}

function countSidebar(items, stats = {categories: 0, links: 0, labels: [], ids: []}) {
  for (const item of items ?? []) {
    if (typeof item === 'string') {
      stats.links += 1
      stats.ids.push(item)
      continue
    }
    if (!item || typeof item !== 'object') continue
    if (item.label) stats.labels.push(item.label)
    if (item.type === 'category') {
      stats.categories += 1
      countSidebar(item.items, stats)
    } else if (['doc', 'ref', 'link'].includes(item.type)) {
      stats.links += 1
      if (item.id) stats.ids.push(item.id)
    }
  }
  return stats
}

function extractRows(source, name) {
  const match = source.match(new RegExp(`const ${name}Rows = \\`([\\s\\S]*?)\\`\\n`))
  if (!match) {
    fail(`Exercise data is missing ${name}Rows`)
    return []
  }
  return match[1].trim().split('\n').map(row => row.trim()).filter(Boolean)
}

if (!fs.existsSync(javascriptRoot)) fail('docs/javascript does not exist')

const allDocs = walk(javascriptRoot).filter(file => /\.(md|mdx)$/.test(file))
if (allDocs.length < 70) fail(`Expected at least 70 JavaScript documents, found ${allDocs.length}`)

const canonicalFiles = [
  'intro.md',
  'version.md',
  'roadmap.md',
  'fundamentals/variables-and-values.md',
  'fundamentals/operators-and-expressions.md',
  'fundamentals/control-flow.md',
  'types/type-system.md',
  'functions/functions.md',
  'scope/scope-and-closures.md',
  'objects/objects.md',
  'prototypes/prototypes-and-inheritance.md',
  'classes/classes.md',
  'arrays/arrays-and-collections.md',
  'async/promises-and-async-await.md',
  'event-loop/event-loop.md',
  'modules/es-modules.md',
  'dom/dom-fundamentals.md',
  'browser/browser-apis.md',
  'errors/error-handling.md',
  'testing/testing-javascript.md',
  'debugging/debugging-javascript.md',
  'performance/performance-overview.md',
  'security/javascript-security.md',
  'internals/execution-context.md',
  'internals/memory-and-garbage-collection.md',
  'patterns/design-patterns.md',
  'architecture/application-architecture.md',
  'interviews/interview-mastery.md',
  'projects/javascript-projects.md',
]

for (const relative of canonicalFiles) {
  if (!fs.existsSync(path.join(javascriptRoot, relative))) fail(`Missing canonical JavaScript file: ${relative}`)
}

const focusedPrefixes = [
  'fundamentals/', 'types/', 'functions/', 'scope/', 'this/', 'objects/', 'prototypes/',
  'classes/', 'arrays/', 'built-ins/', 'iteration/', 'errors/', 'async/', 'event-loop/',
  'modules/', 'dom/', 'browser/', 'events/', 'paradigms/', 'metaprogramming/', 'internals/',
  'performance/', 'security/', 'testing/', 'debugging/', 'tooling/', 'patterns/',
  'architecture/', 'algorithms/', 'interviews/',
]

const focusedDocs = allDocs.filter(file => {
  const relative = path.relative(javascriptRoot, file).replaceAll(path.sep, '/')
  return focusedPrefixes.some(prefix => relative.startsWith(prefix))
})
if (focusedDocs.length < 35) fail(`Expected at least 35 focused JavaScript documents, found ${focusedDocs.length}`)

const placeholderPattern = /^(?:\s*[-*>#]*\s*)?(?:coming soon|lorem ipsum|todo(?:\b|:)|tbd(?:\b|:)|\[placeholder\]|placeholder|to be completed|add example later)\s*[.!-]*\s*$/im
const slugs = new Map()
const ids = new Map()
let mermaidCount = 0

for (const file of allDocs) {
  const relativeToRoot = path.relative(root, file).replaceAll(path.sep, '/')
  const relativeToJs = path.relative(javascriptRoot, file).replaceAll(path.sep, '/')
  const source = fs.readFileSync(file, 'utf8')

  if (placeholderPattern.test(source)) fail(`Placeholder content in ${relativeToRoot}`)
  const fences = source.match(/^```/gm)?.length ?? 0
  if (fences % 2 !== 0) fail(`Unbalanced code fence in ${relativeToRoot}`)
  mermaidCount += source.match(/```mermaid\s*\n/g)?.length ?? 0

  const slug = source.match(/^slug:\s*(.+)$/m)?.[1]?.trim()
  if (slug) {
    if (slugs.has(slug)) fail(`Duplicate explicit slug ${slug}: ${slugs.get(slug)} and ${relativeToRoot}`)
    slugs.set(slug, relativeToRoot)
  }

  const frontmatterId = source.match(/^id:\s*(.+)$/m)?.[1]?.trim()
  const defaultId = relativeToJs.replace(/\.(md|mdx)$/, '')
  const id = frontmatterId ?? defaultId
  if (ids.has(id)) fail(`Duplicate JavaScript document id ${id}: ${ids.get(id)} and ${relativeToRoot}`)
  ids.set(id, relativeToRoot)
}

for (const file of focusedDocs) {
  const relative = path.relative(root, file).replaceAll(path.sep, '/')
  const source = fs.readFileSync(file, 'utf8')
  if (source.trim().length < 1100) fail(`Very thin focused JavaScript page: ${relative}`)
  if (/^(?:title:\s*|#\s+)['"]?\d+(?:\s*[.·:–-])/im.test(source)) {
    fail(`Visible numeric title prefix in focused page: ${relative}`)
  }
}

if (mermaidCount < 15) fail(`Expected at least 15 JavaScript Mermaid diagrams, found ${mermaidCount}`)

const projectFiles = [
  'vanilla-javascript-task-manager.md',
  'accessible-autocomplete-search.md',
  'data-dashboard-filtering-pagination.md',
  'offline-first-notes-application.md',
  'realtime-chat-client.md',
  'form-validation-library.md',
  'event-state-management-library.md',
  'promise-task-queue.md',
  'file-processing-streaming-tool.md',
  'modular-ecommerce-frontend.md',
]
const projectHeadings = [
  '## Goals', '## Requirements', '## User Stories', '## Architecture',
  '## Directory Structure', '## Module Boundaries', '## State Model',
  '## Data Model', '## APIs', '## Validation', '## Error Handling',
  '## Accessibility', '## Security', '## Performance', '## Testing',
  '## Deployment', '## Failure Scenarios', '## Extensions',
  '## Interview Discussion Points',
]
for (const name of projectFiles) {
  const target = path.join(javascriptRoot, 'projects', name)
  if (!fs.existsSync(target)) {
    fail(`Missing required JavaScript project: ${name}`)
    continue
  }
  const source = fs.readFileSync(target, 'utf8')
  if (source.trim().length < 1800) fail(`Project page is too thin: ${name}`)
  for (const heading of projectHeadings) {
    if (!source.includes(heading)) fail(`${name} is missing ${heading}`)
  }
}

let exerciseCounts = {beginner: 0, intermediate: 0, advanced: 0}
let exerciseCount = 0
if (!fs.existsSync(exerciseDataPath)) {
  fail('src/data/javascriptExercises.js does not exist')
} else {
  const source = fs.readFileSync(exerciseDataPath, 'utf8')
  const groups = [
    ['beginner', extractRows(source, 'beginner')],
    ['intermediate', extractRows(source, 'intermediate')],
    ['advanced', extractRows(source, 'advanced')],
  ]
  const titles = new Set()
  for (const [difficulty, rows] of groups) {
    exerciseCounts[difficulty] = rows.length
    exerciseCount += rows.length
    if (rows.length !== 100) fail(`Expected exactly 100 ${difficulty} exercises, found ${rows.length}`)
    for (const [index, row] of rows.entries()) {
      const fields = row.split('|')
      if (fields.length !== 7 || fields.some(field => !field.trim())) {
        fail(`${difficulty} exercise row ${index + 1} must contain seven non-empty fields`)
        continue
      }
      const title = fields[0].trim().toLowerCase()
      if (titles.has(title)) fail(`Duplicate exercise title: ${fields[0].trim()}`)
      titles.add(title)
    }
  }
  if (exerciseCount !== 300) fail(`Expected exactly 300 exercises, found ${exerciseCount}`)
}

for (const exercisePage of [
  'exercises/overview.mdx',
  'exercises/beginner-001-100.mdx',
  'exercises/intermediate-101-200.mdx',
  'exercises/advanced-201-300.mdx',
]) {
  if (!fs.existsSync(path.join(javascriptRoot, exercisePage))) fail(`Missing exercise page: ${exercisePage}`)
}

let interviewMockRoundCount = 0
for (const relative of [
  'mock-interview-practice/01-rounds-1-8.md',
  'mock-interview-practice/02-rounds-9-15.md',
]) {
  const target = path.join(javascriptRoot, relative)
  if (!fs.existsSync(target)) {
    fail(`Missing mock interview file: ${relative}`)
    continue
  }
  interviewMockRoundCount += fs.readFileSync(target, 'utf8').match(/^## Round\s+\d+/gm)?.length ?? 0
}
if (interviewMockRoundCount < 15) fail(`Expected at least 15 mock interview rounds, found ${interviewMockRoundCount}`)

const versionPath = path.join(javascriptRoot, 'version.md')
if (fs.existsSync(versionPath)) {
  const version = fs.readFileSync(versionPath, 'utf8')
  for (const phrase of [
    'August 2, 2026',
    'ECMAScript 2026',
    '17th edition',
    'ECMAScript 2027 draft',
    'Stage 4',
    'Stage 2.7',
    'Temporal',
    'Import attributes',
    'Promise.try',
    'structuredClone',
  ]) {
    if (!version.includes(phrase)) fail(`Canonical version page is missing: ${phrase}`)
  }
}

let sidebarStats = {categories: 0, links: 0, labels: [], ids: []}
if (!fs.existsSync(sidebarPath)) {
  fail('sidebars.javascript.js does not exist')
} else {
  try {
    const require = createRequire(import.meta.url)
    const sidebars = require(sidebarPath)
    sidebarStats = countSidebar(sidebars.javascriptSidebar)
    if (sidebarStats.categories < 25) fail(`Expected at least 25 JavaScript sidebar categories, found ${sidebarStats.categories}`)
    if (sidebarStats.links < 80) fail(`Expected at least 80 JavaScript sidebar links, found ${sidebarStats.links}`)
    const numericLabels = sidebarStats.labels.filter(label => /^\s*\d+(?:\s*[.·:–-])/.test(label))
    if (numericLabels.length) fail(`Visible numeric JavaScript sidebar labels: ${numericLabels.join(', ')}`)
    for (const fullId of sidebarStats.ids.filter(id => id.startsWith('javascript/'))) {
      const id = fullId.slice('javascript/'.length)
      const md = path.join(javascriptRoot, `${id}.md`)
      const mdx = path.join(javascriptRoot, `${id}.mdx`)
      if (!fs.existsSync(md) && !fs.existsSync(mdx)) fail(`JavaScript sidebar references missing document: ${id}`)
    }
  } catch (error) {
    fail(`Unable to evaluate JavaScript sidebar: ${error.message}`)
  }
}

if (!fs.existsSync(packagePath)) {
  fail('package.json does not exist')
} else {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
  if (packageJson.scripts?.['validate:javascript'] !== 'node scripts/validate-javascript-handbook.mjs') {
    fail('package.json does not define validate:javascript correctly')
  }
}
if (!fs.existsSync(lockPath)) fail('package-lock.json is required so npm ci can validate reproducibly')

if (!fs.existsSync(configPath)) {
  fail('docusaurus.config.js does not exist')
} else {
  const config = fs.readFileSync(configPath, 'utf8')
  if (!config.includes("{to: '/docs/javascript/intro', label: 'JavaScript'")) {
    fail('Navbar does not use the canonical JavaScript entry')
  }
  if (!config.includes("{label: 'JavaScript', to: '/docs/javascript/intro'")) {
    fail('Footer does not use the canonical JavaScript entry')
  }
}

if (!fs.existsSync(deployPath) || !fs.readFileSync(deployPath, 'utf8').includes('npm run validate:javascript')) {
  fail('Permanent GitHub Pages workflow does not run validate:javascript')
}
if (!fs.existsSync(workflowPath)) {
  fail('Dedicated JavaScript handbook workflow does not exist')
} else {
  const workflow = fs.readFileSync(workflowPath, 'utf8')
  for (const command of ['npm ci', 'npm run validate:javascript', 'npm run validate:mermaid', 'npm run build']) {
    if (!workflow.includes(command)) fail(`JavaScript workflow is missing: ${command}`)
  }
}

const report = {
  javascriptDocuments: allDocs.length,
  focusedDocuments: focusedDocs.length,
  javascriptSidebarCategories: sidebarStats.categories,
  javascriptSidebarLinks: sidebarStats.links,
  javascriptMermaidDiagrams: mermaidCount,
  projectCount: projectFiles.length,
  exerciseCount,
  beginnerExercises: exerciseCounts.beginner,
  intermediateExercises: exerciseCounts.intermediate,
  advancedExercises: exerciseCounts.advanced,
  interviewMockRoundCount,
  compatibilityRedirects: 0,
  explicitSlugs: slugs.size,
  validationStatus: failures.length === 0 ? 'passed' : 'failed',
}

console.log(JSON.stringify(report, null, 2))

if (failures.length) {
  console.error('\nJavaScript handbook validation failed:')
  for (const message of failures) console.error(`- ${message}`)
  process.exit(1)
}

console.log('\nJavaScript handbook validation passed.')
