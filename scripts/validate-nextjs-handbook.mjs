import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const nextRoot = path.join(repositoryRoot, 'docs', 'nextjs')
const completionRoot = path.join(nextRoot, 'complete-handbook')
const sidebarPath = path.join(repositoryRoot, 'sidebars.nextjs.js')

const failures = []
const fail = (message) => failures.push(message)

function walk(directory) {
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
    const target = path.join(directory, entry.name)
    return entry.isDirectory() ? walk(target) : [target]
  })
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
let mermaidCount = 0

for (const file of completionDocs) {
  const relativePath = path.relative(repositoryRoot, file)
  const source = fs.readFileSync(file, 'utf8')
  if (source.trim().length < 350) fail(`Thin completion page: ${relativePath}`)
  if (placeholderPattern.test(source)) fail(`Placeholder content in ${relativePath}`)
  if (numericTitlePattern.test(source)) fail(`Visible numeric title prefix in ${relativePath}`)

  const fences = source.match(/^```/gm)?.length ?? 0
  if (fences % 2 !== 0) fail(`Unbalanced code fence in ${relativePath}`)
  mermaidCount += source.match(/```mermaid\s*\n/g)?.length ?? 0

  const slug = source.match(/^slug:\s*(.+)$/m)?.[1]?.trim()
  if (slug) {
    if (slugs.has(slug)) fail(`Duplicate completion slug ${slug}: ${slugs.get(slug)} and ${relativePath}`)
    slugs.set(slug, relativePath)
  }
}

if (mermaidCount < 15) fail(`Expected at least 15 completion-layer Mermaid diagrams, found ${mermaidCount}`)

const baselinePath = path.join(completionRoot, 'version.mdx')
if (fs.existsSync(baselinePath)) {
  const baseline = fs.readFileSync(baselinePath, 'utf8')
  for (const phrase of ['16.2.11', '19.2.8', 'Node.js 24 LTS', 'August 2, 2026', 'App Router', 'Turbopack']) {
    if (!baseline.includes(phrase)) fail(`Version baseline is missing: ${phrase}`)
  }
}

if (!fs.existsSync(sidebarPath)) {
  fail('sidebars.nextjs.js does not exist')
} else {
  const sidebar = fs.readFileSync(sidebarPath, 'utf8')
  const docIds = [...sidebar.matchAll(/doc\('([^']+)'/g)].map((match) => match[1])
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

const report = {
  nextjsDocuments: allDocs.length,
  completionDocuments: completionDocs.length,
  completionSidebarLinks: fs.existsSync(sidebarPath)
    ? [...fs.readFileSync(sidebarPath, 'utf8').matchAll(/doc\('([^']+)'/g)].length
    : 0,
  completionMermaidDiagrams: mermaidCount,
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
