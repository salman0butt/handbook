import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import {createRequire} from 'node:module'
import {fileURLToPath} from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const nodeRoot = path.join(root, 'docs', 'nodejs')
const sidebarPath = path.join(root, 'sidebars.nodejs.js')
const finalSidebarPath = path.join(root, 'sidebars.final.js')
const configPath = path.join(root, 'docusaurus.config.js')
const packagePath = path.join(root, 'package.json')
const deployPath = path.join(root, '.github', 'workflows', 'deploy.yml')

const failures = []
const fail = (message) => failures.push(message)

function walk(directory) {
  if (!fs.existsSync(directory)) return []
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
    const target = path.join(directory, entry.name)
    return entry.isDirectory() ? walk(target) : [target]
  })
}

function countSidebar(items) {
  const stats = {categories: 0, links: 0}
  for (const item of items ?? []) {
    if (typeof item === 'string') {
      stats.links += 1
      continue
    }
    if (!item || typeof item !== 'object') continue
    if (item.type === 'category') {
      stats.categories += 1
      const nested = countSidebar(item.items)
      stats.categories += nested.categories
      stats.links += nested.links
    } else if (['doc', 'ref', 'link'].includes(item.type)) {
      stats.links += 1
    }
  }
  return stats
}

if (!fs.existsSync(nodeRoot)) fail('docs/nodejs does not exist')

const allDocs = walk(nodeRoot).filter((file) => /\.(md|mdx)$/.test(file))
if (allDocs.length < 175) fail(`Expected at least 175 Node.js documents, found ${allDocs.length}`)

const requiredFiles = [
  'intro.md',
  'version-baseline.md',
  'roadmap.md',
  'runtime/nodejs-architecture.md',
  'event-loop/event-loop-phases.md',
  'modules/commonjs-and-es-modules.md',
  'async/promises-and-async-await.md',
  'streams/stream-backpressure.md',
  'http/http-server.md',
  'security/security-overview.md',
  'testing/testing-overview.md',
  'performance/performance-overview.md',
  'deployment/deployment-overview.md',
  'architecture/modular-monolith.md',
  'capstones/production-api.md',
  'reference/specification-coverage-2026.md',
]

for (const relative of requiredFiles) {
  if (!fs.existsSync(path.join(nodeRoot, relative))) fail(`Missing required Node.js file: ${relative}`)
}

const focusedPrefixes = [
  'start-here/', 'runtime/', 'event-loop/', 'async/', 'modules/', 'typescript/',
  'core-apis/', 'buffers/', 'streams/', 'filesystem/', 'events/', 'http/',
  'frameworks/', 'api-design/', 'databases/', 'security/', 'reliability/',
  'parallelism/', 'queues/', 'caching/', 'testing/', 'debugging/', 'observability/',
  'performance/', 'configuration/', 'deployment/', 'architecture/', 'distributed/',
  'realtime/', 'integrations/', 'internals/', 'migrations/', 'interviews/', 'capstones/',
]

const focusedDocs = allDocs.filter((file) => {
  const relative = path.relative(nodeRoot, file).replaceAll(path.sep, '/')
  return focusedPrefixes.some((prefix) => relative.startsWith(prefix))
})
if (focusedDocs.length < 69) fail(`Expected at least 69 focused Node.js documents, found ${focusedDocs.length}`)

const placeholderPattern = /^(?:\s*[-*>#]*\s*)?(?:coming soon|lorem ipsum|todo(?:\b|:)|tbd(?:\b|:)|\[placeholder\])\s*[.!-]*\s*$/im
const numericTitlePattern = /^(?:title:\s*|#\s+)['"]?\d+(?:[A-F])?(?:\s*[.–-]\s*\d+)?\s*[.·:-]/im
const slugs = new Map()
const ids = new Map()
let mermaidCount = 0
let focusedMermaidCount = 0

for (const file of allDocs) {
  const relative = path.relative(root, file).replaceAll(path.sep, '/')
  const source = fs.readFileSync(file, 'utf8')
  if (placeholderPattern.test(source)) fail(`Placeholder content in ${relative}`)

  const fences = source.match(/^```/gm)?.length ?? 0
  if (fences % 2 !== 0) fail(`Unbalanced code fence in ${relative}`)

  const diagrams = source.match(/```mermaid\s*\n/g)?.length ?? 0
  mermaidCount += diagrams
  if (focusedDocs.includes(file)) focusedMermaidCount += diagrams

  const slug = source.match(/^slug:\s*(.+)$/m)?.[1]?.trim()
  if (slug) {
    if (slugs.has(slug)) fail(`Duplicate explicit slug ${slug}: ${slugs.get(slug)} and ${relative}`)
    slugs.set(slug, relative)
  }

  const frontmatterId = source.match(/^id:\s*(.+)$/m)?.[1]?.trim()
  const defaultId = path.relative(nodeRoot, file).replaceAll(path.sep, '/').replace(/\.(md|mdx)$/, '').replace(/(^|\/)\d+-/, '$1')
  const id = frontmatterId ?? defaultId
  if (ids.has(id)) fail(`Duplicate document id ${id}: ${ids.get(id)} and ${relative}`)
  ids.set(id, relative)
}

for (const file of focusedDocs) {
  const relative = path.relative(root, file).replaceAll(path.sep, '/')
  const source = fs.readFileSync(file, 'utf8')
  if (source.trim().length < 1200) fail(`Very thin focused page: ${relative}`)
  if (numericTitlePattern.test(source)) fail(`Visible numeric title prefix in ${relative}`)
}

if (focusedMermaidCount < 58) fail(`Expected at least 58 focused Mermaid diagrams, found ${focusedMermaidCount}`)

const capstoneFiles = [
  'node-core-rest-api.md',
  'production-api.md',
  'fastify-api-platform.md',
  'auth-service.md',
  'ecommerce-backend.md',
  'multi-tenant-saas.md',
  'realtime-collaboration.md',
  'job-workflow-platform.md',
  'file-media-service.md',
  'ai-powered-backend.md',
]
const capstoneRoot = path.join(nodeRoot, 'capstones')
for (const name of capstoneFiles) {
  const target = path.join(capstoneRoot, name)
  if (!fs.existsSync(target)) {
    fail(`Missing required capstone: ${name}`)
    continue
  }
  const source = fs.readFileSync(target, 'utf8')
  for (const heading of [
    '## Requirements', '## Architecture', '## Directory Structure', '## Runtime Boundaries',
    '## Database Design', '## API Design', '## Authentication', '## Authorization',
    '## Validation', '## Error Handling', '## Caching', '## Background Jobs',
    '## Security', '## Testing', '## Deployment', '## Observability',
    '## Failure Scenarios', '## Scaling Strategy', '## Extensions',
  ]) {
    if (!source.includes(heading)) fail(`${name} is missing ${heading}`)
  }
}

const baselinePath = path.join(nodeRoot, 'version-baseline.md')
if (fs.existsSync(baselinePath)) {
  const baseline = fs.readFileSync(baselinePath, 'utf8')
  for (const phrase of [
    'August 2, 2026',
    'v24.18.0',
    '11.16.0',
    'v26.5.0',
    'v22.23.1',
    'TypeScript 7.0.2',
    'CommonJS',
    'ES Modules',
    'node:test',
    'Permission Model',
    'Web APIs',
  ]) {
    if (!baseline.includes(phrase)) fail(`Version baseline is missing: ${phrase}`)
  }
}

if (!fs.existsSync(sidebarPath)) {
  fail('sidebars.nodejs.js does not exist')
} else {
  const sidebarSource = fs.readFileSync(sidebarPath, 'utf8')
  const sidebarIds = [...sidebarSource.matchAll(/doc\('([^']+)'/g)].map((match) => match[1])
  if (sidebarIds.length < 69) fail(`Expected at least 69 focused sidebar links, found ${sidebarIds.length}`)
  for (const id of sidebarIds) {
    const md = path.join(nodeRoot, `${id}.md`)
    const mdx = path.join(nodeRoot, `${id}.mdx`)
    if (!fs.existsSync(md) && !fs.existsSync(mdx)) fail(`Focused sidebar references missing document: ${id}`)
  }
  const labels = [...sidebarSource.matchAll(/(?:category|doc)\('[^']+'(?:,\s*'([^']+)')?/g)]
    .map((match) => match[1]).filter(Boolean)
  const numericLabels = labels.filter((label) => /^\d/.test(label))
  if (numericLabels.length) fail(`Numeric focused sidebar labels: ${numericLabels.join(', ')}`)
}

let sidebarStats = {categories: 0, links: 0}
if (!fs.existsSync(finalSidebarPath)) {
  fail('sidebars.final.js does not exist')
} else {
  try {
    const require = createRequire(import.meta.url)
    const sidebars = require(finalSidebarPath)
    sidebarStats = countSidebar(sidebars.nodejsSidebar)
    if (sidebarStats.categories < 28) fail(`Expected at least 28 Node.js sidebar categories, found ${sidebarStats.categories}`)
    if (sidebarStats.links < 175) fail(`Expected at least 175 Node.js sidebar links, found ${sidebarStats.links}`)
  } catch (error) {
    fail(`Unable to evaluate final Node.js sidebar: ${error.message}`)
  }
}

if (!fs.existsSync(packagePath)) {
  fail('package.json does not exist')
} else {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
  if (packageJson.scripts?.['validate:nodejs'] !== 'node scripts/validate-nodejs-handbook.mjs') {
    fail('package.json does not define validate:nodejs correctly')
  }
}

if (!fs.existsSync(configPath)) {
  fail('docusaurus.config.js does not exist')
} else {
  const config = fs.readFileSync(configPath, 'utf8')
  if (!config.includes("{to: '/docs/nodejs/intro', label: 'Node.js'")) {
    fail('Navbar does not use the canonical Node.js entry')
  }
  if (!config.includes("{label: 'Node.js', to: '/docs/nodejs/intro'")) {
    fail('Footer does not use the canonical Node.js entry')
  }
}

if (!fs.existsSync(deployPath) || !fs.readFileSync(deployPath, 'utf8').includes('npm run validate:nodejs')) {
  fail('Permanent GitHub Pages workflow does not run validate:nodejs')
}

const report = {
  nodejsDocuments: allDocs.length,
  focusedDocuments: focusedDocs.length,
  nodejsSidebarCategories: sidebarStats.categories,
  nodejsSidebarLinks: sidebarStats.links,
  nodejsMermaidDiagrams: mermaidCount,
  focusedMermaidDiagrams: focusedMermaidCount,
  capstoneProjects: capstoneFiles.length,
  compatibilityRedirects: 0,
  explicitSlugs: slugs.size,
  validationStatus: failures.length === 0 ? 'passed' : 'failed',
}

console.log(JSON.stringify(report, null, 2))

if (failures.length) {
  console.error('\nNode.js handbook validation failed:')
  for (const message of failures) console.error(`- ${message}`)
  process.exit(1)
}

console.log('\nNode.js handbook validation passed.')
