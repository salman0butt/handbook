import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const nextRoot = path.join(repositoryRoot, 'docs', 'nextjs')
const completionRoot = path.join(nextRoot, 'complete-handbook')
const sidebarPath = path.join(repositoryRoot, 'sidebars.nextjs.js')
const finalSidebarPath = path.join(repositoryRoot, 'sidebars.final.js')
const configPath = path.join(repositoryRoot, 'docusaurus.config.js')
const packagePath = path.join(repositoryRoot, 'package.json')

const failures = []
const fail = (message) => failures.push(message)

function walk(directory) {
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
    const target = path.join(directory, entry.name)
    return entry.isDirectory() ? walk(target) : [target]
  })
}

function countSidebarItems(items) {
  const stats = {categories: 0, links: 0}
  for (const item of items ?? []) {
    if (typeof item === 'string') {
      stats.links += 1
      continue
    }
    if (!item || typeof item !== 'object') continue
    if (item.type === 'category') {
      stats.categories += 1
      const nested = countSidebarItems(item.items)
      stats.categories += nested.categories
      stats.links += nested.links
    } else if (item.type === 'doc' || item.type === 'ref' || item.type === 'link') {
      stats.links += 1
    }
  }
  return stats
}

if (!fs.existsSync(nextRoot)) fail('docs/nextjs does not exist')
if (!fs.existsSync(completionRoot)) fail('Next.js completion layer does not exist')

const allDocs = fs.existsSync(nextRoot)
  ? walk(nextRoot).filter((file) => /\.(md|mdx)$/.test(file))
  : []
const completionDocs = fs.existsSync(completionRoot)
  ? walk(completionRoot).filter((file) => /\.(md|mdx)$/.test(file))
  : []

if (allDocs.length < 150) fail(`Expected at least 150 Next.js documents, found ${allDocs.length}`)
if (completionDocs.length < 47) fail(`Expected at least 47 completion documents, found ${completionDocs.length}`)

const requiredFiles = [
  'index.mdx',
  'version.mdx',
  'roadmap.mdx',
  'setup/index.mdx',
  'styling/index.mdx',
  'state-management/index.mdx',
  'request-and-configuration/index.mdx',
  'data-platform/index.mdx',
  'typescript-accessibility/index.mdx',
  'platform-patterns/index.mdx',
  'pages-router-and-migration/index.mdx',
  'production-patterns/index.mdx',
  'capstones/index.mdx',
  'reference/index.mdx',
  'reference/completion-matrix.mdx',
]

for (const relativePath of requiredFiles) {
  if (!fs.existsSync(path.join(completionRoot, relativePath))) {
    fail(`Missing required completion file: ${relativePath}`)
  }
}

const placeholderPattern = /^(?:\s*[-*>#]*\s*)?(?:coming soon|lorem ipsum|todo(?:\b|:)|tbd(?:\b|:)|\[placeholder\])\s*[.!-]*\s*$/im
const numericTitlePattern = /^(?:title:\s*|#\s+)['"]?\d+(?:[A-F])?(?:\s*[.–-]\s*\d+)?\s*[.·:-]/im
const slugs = new Map()
let completionMermaidCount = 0
let nextjsMermaidCount = 0

for (const file of allDocs) {
  const source = fs.readFileSync(file, 'utf8')
  nextjsMermaidCount += source.match(/```mermaid\s*\n/g)?.length ?? 0
}

for (const file of completionDocs) {
  const relativePath = path.relative(repositoryRoot, file)
  const source = fs.readFileSync(file, 'utf8')
  if (source.trim().length < 350) fail(`Thin completion page: ${relativePath}`)
  if (placeholderPattern.test(source)) fail(`Placeholder content in ${relativePath}`)
  if (numericTitlePattern.test(source)) fail(`Visible numeric title prefix in ${relativePath}`)

  const fences = source.match(/^```/gm)?.length ?? 0
  if (fences % 2 !== 0) fail(`Unbalanced code fence in ${relativePath}`)
  completionMermaidCount += source.match(/```mermaid\s*\n/g)?.length ?? 0

  const slug = source.match(/^slug:\s*(.+)$/m)?.[1]?.trim()
  if (slug) {
    if (slugs.has(slug)) fail(`Duplicate completion slug ${slug}: ${slugs.get(slug)} and ${relativePath}`)
    slugs.set(slug, relativePath)
  }
}

if (completionMermaidCount < 15) {
  fail(`Expected at least 15 completion-layer Mermaid diagrams, found ${completionMermaidCount}`)
}

const baselinePath = path.join(completionRoot, 'version.mdx')
if (fs.existsSync(baselinePath)) {
  const baseline = fs.readFileSync(baselinePath, 'utf8')
  for (const phrase of ['16.2.11', '19.2.8', 'Node.js 24 LTS', 'August 2, 2026', 'App Router', 'Turbopack']) {
    if (!baseline.includes(phrase)) fail(`Version baseline is missing: ${phrase}`)
  }
}

let completionSidebarLinks = 0
if (!fs.existsSync(sidebarPath)) {
  fail('sidebars.nextjs.js does not exist')
} else {
  const sidebar = fs.readFileSync(sidebarPath, 'utf8')
  const docIds = [...sidebar.matchAll(/doc\('([^']+)'/g)].map((match) => match[1])
  completionSidebarLinks = docIds.length
  if (docIds.length < 47) fail(`Expected at least 47 completion sidebar links, found ${docIds.length}`)
  for (const id of docIds) {
    const md = path.join(completionRoot, `${id}.md`)
    const mdx = path.join(completionRoot, `${id}.mdx`)
    if (!fs.existsSync(md) && !fs.existsSync(mdx)) fail(`Sidebar references missing completion document: ${id}`)
  }

  const numericLabels = [...sidebar.matchAll(/category\('([^']+)'|doc\('[^']+',\s*'([^']+)'/g)]
    .map((match) => match[1] ?? match[2])
    .filter((label) => /^\d/.test(label))
  if (numericLabels.length > 0) fail(`Numeric prefixes found in completion sidebar labels: ${numericLabels.join(', ')}`)
}

let nextjsSidebarStats = {categories: 0, links: 0}
if (!fs.existsSync(finalSidebarPath)) {
  fail('sidebars.final.js does not exist')
} else {
  try {
    const require = createRequire(import.meta.url)
    const sidebars = require(finalSidebarPath)
    nextjsSidebarStats = countSidebarItems(sidebars.nextjsSidebar)
  } catch (error) {
    fail(`Unable to evaluate final Next.js sidebar: ${error.message}`)
  }
}

const compatibilityRoutes = [
  '/nextjs/intro',
  '/nextjs/version',
  '/nextjs/roadmap',
  '/nextjs/complete-handbook',
  '/docs/nextjs/app-router/app-directory',
  '/docs/nextjs/routing/dynamic-routes',
  '/docs/nextjs/server-components/server-components',
  '/docs/nextjs/caching/cache-layers',
  '/docs/nextjs/rendering/static-rendering',
  '/docs/nextjs/server-functions/server-actions',
  '/docs/nextjs/route-handlers/route-handlers',
  '/docs/nextjs/authentication/authentication-overview',
  '/docs/nextjs/deployment/deployment-overview',
]

if (!fs.existsSync(configPath)) {
  fail('docusaurus.config.js does not exist')
} else {
  const config = fs.readFileSync(configPath, 'utf8')
  if (!config.includes('@docusaurus/plugin-client-redirects')) {
    fail('Docusaurus client redirect plugin is not configured')
  }
  for (const route of compatibilityRoutes) {
    if (!config.includes(`'${route}'`)) fail(`Missing compatibility route: ${route}`)
  }
  const canonicalNavTarget = "{to: '/docs/nextjs/intro', label: 'Next.js'"
  const navigationTargets = config.split(canonicalNavTarget).length - 1
  if (navigationTargets !== 2) {
    fail(`Expected navbar and footer to use the canonical Next.js entry, found ${navigationTargets} matches`)
  }
}

if (!fs.existsSync(packagePath)) {
  fail('package.json does not exist')
} else {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
  if (packageJson.dependencies?.['@docusaurus/plugin-client-redirects'] !== '3.10.2') {
    fail('The Docusaurus redirect plugin must be pinned to 3.10.2')
  }
}

const report = {
  nextjsDocuments: allDocs.length,
  nextjsSidebarCategories: nextjsSidebarStats.categories,
  nextjsSidebarLinks: nextjsSidebarStats.links,
  nextjsMermaidDiagrams: nextjsMermaidCount,
  completionDocuments: completionDocs.length,
  completionSidebarLinks,
  completionMermaidDiagrams: completionMermaidCount,
  compatibilityRoutes: compatibilityRoutes.length,
  uniqueCompletionSlugs: slugs.size,
  status: failures.length === 0 ? 'passed' : 'failed',
}

console.log(JSON.stringify(report, null, 2))

if (failures.length > 0) {
  console.error('\nNext.js handbook validation failed:')
  for (const message of failures) console.error(`- ${message}`)
  process.exit(1)
}

console.log('\nNext.js handbook validation passed.')
