import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'

const root = process.cwd()
const payloadDir = path.join(root, 'scripts', 'postgresql-payload')
const chunkNames = fs.readdirSync(payloadDir)
  .filter(name => /^chunk-\d+[a-z]*\.txt$/.test(name))
  .sort((a, b) => a.localeCompare(b, 'en', {numeric: true}))
const encoded = chunkNames
  .map(name => fs.readFileSync(path.join(payloadDir, name), 'utf8').trim())
  .join('')
const mapping = JSON.parse(zlib.gunzipSync(Buffer.from(encoded, 'base64')).toString('utf8'))

for (const [relative, content] of Object.entries(mapping)) {
  const target = path.join(root, relative)
  fs.mkdirSync(path.dirname(target), {recursive: true})
  fs.writeFileSync(target, content)
}

const packagePath = path.join(root, 'package.json')
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
pkg.scripts['validate:postgresql'] = 'node scripts/validate-postgresql-handbook.mjs'
fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n')

const deployPath = path.join(root, '.github', 'workflows', 'deploy.yml')
let deploy = fs.readFileSync(deployPath, 'utf8')
if (!deploy.includes('npm run validate:postgresql')) {
  const anchor = "      - name: Validate React Native handbook\n        run: npm run validate:react-native\n"
  deploy = deploy.replace(anchor, anchor + "\n      - name: Validate PostgreSQL handbook\n        run: npm run validate:postgresql\n")
}
fs.writeFileSync(deployPath, deploy)

const dataPath = path.join(root, 'src', 'data', 'handbooks.js')
let data = fs.readFileSync(dataPath, 'utf8')
data = data.replace(
  "name: 'SQL & PostgreSQL', icon: 'PG', status: 'In Review', intro: '/docs/postgresql/intro'",
  "name: 'SQL & PostgreSQL', icon: 'PG', status: 'Complete', intro: '/docs/postgresql/intro'"
)
data = data.replace("/docs/postgresql/24-27-select-filter-sort-pagination", "/docs/postgresql/sql-foundations/core-sql")
data = data.replace("/docs/postgresql/68-74-query-planning-explain-performance", "/docs/postgresql/performance/explain-query-planning")
data = data.replace("/docs/postgresql/82-90-wal-recovery-replication-ha", "/docs/postgresql/operations/replication-ha")
fs.writeFileSync(dataPath, data)

console.log(JSON.stringify({
  generatedFiles: Object.keys(mapping).length,
  payloadChunks: chunkNames.length,
  baseline: 'PostgreSQL 18.4',
  researchDate: 'August 3, 2026'
}, null, 2))
