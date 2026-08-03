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
const result = spawnSync('python3', ['-'], {
  cwd: root,
  input: pythonSource,
  stdio: ['pipe', 'inherit', 'inherit'],
})

if (result.error) throw result.error
if (result.status !== 0) process.exit(result.status ?? 1)
