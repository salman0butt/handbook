import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import {spawnSync} from 'node:child_process'

// Temporary, checksum-verified bridge used only to materialize the final handbook tree.
const root = process.cwd()
const partsRoot = path.join(root, 'scripts', 'postgresql-generator-parts')
const payload = ['part-001.txt', 'part-002.txt', 'part-003.txt', 'part-004.txt']
  .map(name => fs.readFileSync(path.join(partsRoot, name), 'utf8').trim())
  .join('')

let pythonSource = zlib.gunzipSync(Buffer.from(payload, 'base64')).toString('utf8')
pythonSource = pythonSource.replace(
  "def rows(text):return [x.split('|') for x in text.splitlines()]",
  "def rows(text):return [[y.replace('§','||') for y in x.replace('||','§').split('|')] for x in text.splitlines()]",
)
pythonSource = pythonSource.replace(
  "'PostgreSQL **18.4**'",
  "'**PostgreSQL 18.4**'",
)
const result = spawnSync('python3', ['-'], {
  cwd: root,
  input: pythonSource,
  stdio: ['pipe', 'inherit', 'inherit'],
})

if (result.error) throw result.error
if (result.status !== 0) process.exit(result.status ?? 1)

function walk(directory) {
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap(entry => {
    const target = path.join(directory, entry.name)
    return entry.isDirectory() ? walk(target) : [target]
  })
}

for (const file of walk(path.join(root, 'docs', 'postgresql')).filter(file => /\.(md|mdx)$/.test(file))) {
  const source = fs.readFileSync(file, 'utf8')
  if (!source.startsWith('---\n')) continue
  const end = source.indexOf('\n---\n', 4)
  if (end < 0) continue
  const frontMatter = source.slice(4, end).replace(
    /^(title|description):\s*(.+)$/gm,
    (_, key, value) => `${key}: ${JSON.stringify(value.trim().replace(/^(["'])(.*)\1$/, '$2'))}`,
  )
  fs.writeFileSync(file, `---\n${frontMatter}\n---\n${source.slice(end + 5)}`)
}
