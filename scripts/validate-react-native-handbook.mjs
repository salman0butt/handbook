import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import {createRequire} from 'node:module'
import {fileURLToPath} from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const docsRoot = path.join(root, 'docs', 'react-native')
const failures = []
const fail = message => failures.push(message)
const walk = directory => fs.existsSync(directory) ? fs.readdirSync(directory, {withFileTypes: true}).flatMap(entry => { const target = path.join(directory, entry.name); return entry.isDirectory() ? walk(target) : [target] }) : []
const allDocs = walk(docsRoot).filter(file => /\.(md|mdx)$/.test(file))
if (!fs.existsSync(docsRoot)) fail('docs/react-native does not exist')

const required = [
  "intro.md",
  "version.md",
  "roadmap.md",
  "getting-started/environment-setup.md",
  "getting-started/community-cli.md",
  "getting-started/project-structure.md",
  "core/components.md",
  "core/react-hooks.md",
  "styling/layout.md",
  "forms/forms.md",
  "lists/large-data.md",
  "navigation/navigation-fundamentals.md",
  "state/state-management.md",
  "networking/api-architecture.md",
  "storage/offline-first.md",
  "platform/platform-specific.md",
  "permissions/permissions.md",
  "device/device-apis.md",
  "notifications/push-notifications.md",
  "lifecycle/background-work.md",
  "animations/animations-gestures.md",
  "media/images-media.md",
  "android/android-fundamentals.md",
  "ios/ios-fundamentals.md",
  "native-modules/native-modules.md",
  "architecture/new-architecture.md",
  "metro/metro-bundling.md",
  "hermes/hermes.md",
  "application-architecture/application-architecture.md",
  "reliability/error-handling.md",
  "testing/testing-react-native.md",
  "debugging/debugging.md",
  "performance/performance.md",
  "accessibility/accessibility.md",
  "security/mobile-security.md",
  "webview/webview.md",
  "authentication/authentication.md",
  "observability/analytics-observability.md",
  "internationalization/internationalization.md",
  "build/build-configuration.md",
  "cicd/ci-cd.md",
  "deployment/store-deployment.md",
  "upgrades/upgrading.md",
  "monorepos/monorepos.md",
  "library-development/library-development.md",
  "interviews/interview-preparation.md",
  "projects/react-native-projects.md",
  "projects/community-cli-task-manager.md",
  "projects/authentication-profile-application.md",
  "projects/ecommerce-mobile-application.md",
  "projects/offline-first-notes-application.md",
  "projects/realtime-chat-application.md",
  "projects/location-maps-application.md",
  "projects/camera-media-upload-application.md",
  "projects/push-notification-application.md",
  "projects/native-module-integration-project.md",
  "projects/production-mobile-application.md",
  "exercises/overview.mdx",
  "exercises/beginner-001-100.mdx",
  "exercises/intermediate-101-200.mdx",
  "exercises/advanced-201-300.mdx"
]
for (const relative of required) if (!fs.existsSync(path.join(docsRoot, relative))) fail(`Missing React Native file: ${relative}`)

const placeholderPattern = /^(?:\s*[-*>#]*\s*)?(?:coming soon|lorem ipsum|todo(?:\b|:)|tbd(?:\b|:)|\[placeholder\]|placeholder|to be completed|add example later)\s*[.!-]*\s*$/im
const ids = new Map()
const slugs = new Map()
let mermaid = 0
for (const file of allDocs) {
  const source = fs.readFileSync(file, 'utf8')
  const relative = path.relative(docsRoot, file).replaceAll(path.sep, '/')
  if (placeholderPattern.test(source)) fail(`Placeholder content in ${relative}`)
  if ((source.match(/^```/gm)?.length ?? 0) % 2) fail(`Unbalanced code fence in ${relative}`)
  mermaid += source.match(/```mermaid\s*\n/g)?.length ?? 0
  const explicitSlug = source.match(/^slug:\s*(.+)$/m)?.[1]?.trim()
  if (explicitSlug) { if (slugs.has(explicitSlug)) fail(`Duplicate slug ${explicitSlug}`); slugs.set(explicitSlug, relative) }
  const explicitId = source.match(/^id:\s*(.+)$/m)?.[1]?.trim()
  const dir = path.posix.dirname(relative)
  const defaultId = relative.replace(/\.(md|mdx)$/, '')
  const id = explicitId ? (dir === '.' ? explicitId : `${dir}/${explicitId}`) : defaultId
  if (ids.has(id)) fail(`Duplicate document id ${id}: ${ids.get(id)} and ${relative}`)
  ids.set(id, relative)
}
if (allDocs.length < 90) fail(`Expected at least 90 React Native documents, found ${allDocs.length}`)
if (mermaid < 50) fail(`Expected at least 50 Mermaid diagrams, found ${mermaid}`)
for (const page of ["getting-started/environment-setup.md", "getting-started/community-cli.md", "getting-started/project-structure.md", "core/components.md", "core/react-hooks.md", "styling/layout.md", "forms/forms.md", "lists/large-data.md", "navigation/navigation-fundamentals.md", "state/state-management.md", "networking/api-architecture.md", "storage/offline-first.md", "platform/platform-specific.md", "permissions/permissions.md", "device/device-apis.md", "notifications/push-notifications.md", "lifecycle/background-work.md", "animations/animations-gestures.md", "media/images-media.md", "android/android-fundamentals.md", "ios/ios-fundamentals.md", "native-modules/native-modules.md", "architecture/new-architecture.md", "metro/metro-bundling.md", "hermes/hermes.md", "application-architecture/application-architecture.md", "reliability/error-handling.md", "testing/testing-react-native.md", "debugging/debugging.md", "performance/performance.md", "accessibility/accessibility.md", "security/mobile-security.md", "webview/webview.md", "authentication/authentication.md", "observability/analytics-observability.md", "internationalization/internationalization.md", "build/build-configuration.md", "cicd/ci-cd.md", "deployment/store-deployment.md", "upgrades/upgrading.md", "monorepos/monorepos.md", "library-development/library-development.md", "interviews/interview-preparation.md"]) {
  const source = fs.readFileSync(path.join(docsRoot, page), 'utf8')
  if (source.length < 4500) fail(`Focused page is too thin: ${page}`)
}

const projectHeadings = ["## Goals", "## Requirements", "## User Stories", "## Architecture", "## Directory Structure", "## Module Boundaries", "## Screen Map", "## Navigation Flow", "## State Model", "## Data Model", "## APIs", "## Persistence", "## Offline Behavior", "## Android Configuration", "## iOS Configuration", "## Permissions", "## Validation", "## Error Handling", "## Accessibility", "## Security", "## Performance", "## Testing", "## Build Configuration", "## CI/CD", "## Deployment", "## Failure Scenarios", "## Extensions", "## Interview Discussion Points"]
const projectFiles = ["community-cli-task-manager.md", "authentication-profile-application.md", "ecommerce-mobile-application.md", "offline-first-notes-application.md", "realtime-chat-application.md", "location-maps-application.md", "camera-media-upload-application.md", "push-notification-application.md", "native-module-integration-project.md", "production-mobile-application.md"]
for (const name of projectFiles) {
  const source = fs.readFileSync(path.join(docsRoot, 'projects', name), 'utf8')
  if (source.length < 7000) fail(`Project page is too thin: ${name}`)
  for (const heading of projectHeadings) if (!source.includes(heading)) fail(`${name} missing ${heading}`)
}

const dataSource = fs.readFileSync(path.join(root, 'src', 'data', 'reactNativeExercises.js'), 'utf8')
function rows(name) {
  const marker = String.fromCharCode(96)
  const pattern = 'const ' + name + 'Rows = ' + marker + '([\\s\\S]*?)' + marker
  const match = dataSource.match(new RegExp(pattern))
  if (!match) { fail(`Missing ${name}Rows`); return [] }
  return match[1].trim().split('\n').filter(Boolean)
}
const counts = {}
const titles = new Set()
let total = 0
for (const name of ['beginner','intermediate','advanced']) {
  const group = rows(name)
  counts[name] = group.length
  total += group.length
  if (group.length !== 100) fail(`Expected exactly 100 ${name} exercises, found ${group.length}`)
  for (const row of group) {
    const fields = row.split('|')
    if (fields.length !== 13 || fields.some(field => !field.trim())) fail(`Invalid ${name} exercise row`)
    const title = fields[0].toLowerCase()
    if (titles.has(title)) fail(`Duplicate exercise title: ${fields[0]}`)
    titles.add(title)
  }
}
if (total !== 300) fail(`Expected exactly 300 exercises, found ${total}`)

const mocks = fs.readFileSync(path.join(docsRoot, 'mock-interview-practice', 'mock-interviews-01-15.md'), 'utf8').match(/^# Round \d+/gm)?.length ?? 0
if (mocks < 15) fail(`Expected at least 15 mock interview rounds, found ${mocks}`)
const version = fs.readFileSync(path.join(docsRoot, 'version.md'), 'utf8')
for (const phrase of ['August 3, 2026', 'React Native **0.86.x**', '@react-native-community/cli@latest init MyProject --version latest', 'Node.js', 'JDK', 'Android SDK', 'Xcode', 'CocoaPods', 'Hermes', 'Fabric', 'TurboModules', 'JSI', 'Codegen', 'Metro']) if (!version.includes(phrase)) fail(`Version page missing: ${phrase}`)

function countSidebar(items, stats = {categories: 0, links: 0, labels: [], ids: []}) {
  for (const item of items ?? []) {
    if (typeof item === 'string') { stats.links++; stats.ids.push(item); continue }
    if (!item || typeof item !== 'object') continue
    if (item.label) stats.labels.push(item.label)
    if (item.type === 'category') { stats.categories++; countSidebar(item.items, stats) }
    else if (['doc','ref','link'].includes(item.type)) { stats.links++; if (item.id) stats.ids.push(item.id) }
  }
  return stats
}
let sidebar = {categories:0, links:0, labels:[], ids:[]}
try {
  const require = createRequire(import.meta.url)
  sidebar = countSidebar(require(path.join(root, 'sidebars.react-native.js')).reactNativeSidebar)
  if (sidebar.categories < 14) fail(`Expected at least 14 sidebar categories, found ${sidebar.categories}`)
  if (sidebar.links < 75) fail(`Expected at least 75 sidebar links, found ${sidebar.links}`)
  const numeric = sidebar.labels.filter(label => /^\s*\d+(?:\s*[.·:–-])/.test(label))
  if (numeric.length) fail(`Numeric sidebar labels: ${numeric.join(', ')}`)
  for (const id of sidebar.ids.filter(id => id.startsWith('react-native/'))) {
    const relative = id.slice('react-native/'.length)
    if (!ids.has(relative)) fail(`Sidebar references missing document: ${relative}`)
  }
} catch (error) { fail(`Unable to evaluate sidebar: ${error.message}`) }

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))
if (packageJson.scripts?.['validate:react-native'] !== 'node scripts/validate-react-native-handbook.mjs') fail('package.json missing validate:react-native')
if (!fs.existsSync(path.join(root, 'package-lock.json'))) fail('package-lock.json is required')
const config = fs.readFileSync(path.join(root, 'docusaurus.config.js'), 'utf8')
if (!config.includes("{to: '/docs/react-native/intro', label: 'Mobile'")) fail('Navbar does not use canonical React Native entry')
if (!config.includes("{label: 'React Native', to: '/docs/react-native/intro'")) fail('Footer does not use canonical React Native entry')
const deploy = fs.readFileSync(path.join(root, '.github', 'workflows', 'deploy.yml'), 'utf8')
if (!deploy.includes('npm run validate:react-native')) fail('Pages workflow missing React Native validation')
const workflowPath = path.join(root, '.github', 'workflows', 'react-native-handbook.yml')
if (!fs.existsSync(workflowPath)) fail('Dedicated React Native workflow missing')
else {
  const workflow = fs.readFileSync(workflowPath, 'utf8')
  for (const command of ['npm ci','npm run validate:react-native','npm run validate:typescript','npm run validate:javascript','npm run validate:nodejs','npm run validate:nextjs','npm run validate:mermaid','npm run build']) if (!workflow.includes(command)) fail(`Workflow missing ${command}`)
}

const report = {
  reactNativeDocuments: allDocs.length,
  focusedDocuments: 43,
  sidebarCategories: sidebar.categories,
  sidebarLinks: sidebar.links,
  mermaidDiagrams: mermaid,
  projectCount: projectFiles.length,
  exerciseCount: total,
  beginnerExercises: counts.beginner,
  intermediateExercises: counts.intermediate,
  advancedExercises: counts.advanced,
  mockInterviewRounds: mocks,
  validationStatus: failures.length ? 'failed' : 'passed',
}
console.log(JSON.stringify(report, null, 2))
if (failures.length) {
  console.error('\nReact Native handbook validation failed:')
  for (const message of failures) console.error('- ' + message)
  process.exit(1)
}
console.log('\nReact Native handbook validation passed.')
