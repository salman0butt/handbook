---
title: Request Bodies, Validation & Content Types
description: Parse JSON, form data, text, binary payloads, validate untrusted input, enforce size and content-type rules, and design safe request contracts.
---

# Request Bodies, Validation & Content Types

Every Route Handler that accepts input needs a clear payload contract.

The core rule is:

```text
HTTP body
→ parse
→ validate
→ authorize
→ transform
→ side effect
```

Never skip directly from `request.json()` to a database write.

## JSON bodies

```ts
export async function POST(request: Request) {
  const body = await request.json()

  return Response.json({ body })
}
```

`request.json()` parses JSON. It does **not** validate your domain schema.

This remains unsafe:

```ts
const body = await request.json()
await db.user.create({ data: body })
```

because the caller controls the keys and values.

## Validate after parsing

Example:

```ts
const result = createProjectSchema.safeParse(
  await request.json(),
)

if (!result.success) {
  return Response.json(
    {
      error: 'INVALID_INPUT',
      fields: result.error.flatten().fieldErrors,
    },
    { status: 400 },
  )
}

const input = result.data
```

The validation layer should define the exact accepted public contract.

## Avoid mass assignment

Bad:

```ts
await db.user.update({
  where: { id: userId },
  data: await request.json(),
})
```

A caller may attempt fields such as:

```json
{
  "name": "Sam",
  "role": "admin",
  "plan": "enterprise"
}
```

Prefer explicit projection:

```ts
const input = schema.parse(await request.json())

await db.user.update({
  where: { id: userId },
  data: {
    name: input.name,
    timezone: input.timezone,
  },
})
```

## Check content type when it matters

If the endpoint only accepts JSON:

```ts
const contentType = request.headers.get('content-type') ?? ''

if (!contentType.toLowerCase().startsWith('application/json')) {
  return Response.json(
    { error: 'UNSUPPORTED_MEDIA_TYPE' },
    { status: 415 },
  )
}
```

Do not assume a body is JSON just because the endpoint is named `/api/*`.

## Malformed JSON

Parsing may fail before validation:

```ts
let body: unknown

try {
  body = await request.json()
} catch {
  return Response.json(
    { error: 'MALFORMED_JSON' },
    { status: 400 },
  )
}
```

Separate:

```text
malformed transport payload
from
well-formed but invalid domain input
```

This improves debugging and client behaviour.

## Form data

```ts
export async function POST(request: Request) {
  const formData = await request.formData()

  const name = formData.get('name')
  const avatar = formData.get('avatar')

  return Response.json({
    hasName: typeof name === 'string',
    hasAvatar: avatar instanceof File,
  })
}
```

Form values may be:

```text
string
File
null
```

Validate the type before use.

## Do not blindly Object.fromEntries multipart data

This can be convenient:

```ts
const values = Object.fromEntries(await request.formData())
```

but you still need to understand:

- repeated keys
- `File` values
- hidden framework/internal fields where applicable
- field size
- expected scalar types

Treat it as a parsing convenience, not validation.

## Repeated fields

```ts
const tags = formData.getAll('tags')
```

Use `getAll()` when the contract permits repeated values.

Then validate:

```ts
const tagNames = tags.filter(
  (value): value is string => typeof value === 'string',
)
```

## Plain text bodies

Webhooks and custom protocols may require raw text:

```ts
const raw = await request.text()
```

This is especially important when a signature is calculated over the exact raw bytes/text.

Do not parse JSON first and then attempt signature verification if the provider signs the original payload.

## Binary bodies

```ts
const bytes = await request.arrayBuffer()
```

or:

```ts
const blob = await request.blob()
```

Binary input requires stronger resource controls:

- size limits
- MIME validation
- storage quotas
- virus/malware scanning where appropriate
- timeouts
- file-type verification

## File uploads

Small request-bound uploads can be handled with `formData()`.

But large user-generated files are often better uploaded directly to dedicated object storage using a signed/temporary upload flow.

Preferred large-file architecture:

```text
browser
  ↓ request upload authorization
Next.js endpoint
  ↓ signed upload target
browser
  ↓ direct upload
object storage
  ↓ returned object key
Next.js mutation
  ↓ save metadata
DB
```

Benefits:

- smaller app-server requests
- fewer timeout risks
- less memory pressure
- storage service handles transfer
- easier multipart/resumable strategies

## Do not trust MIME type alone

An uploaded file may claim:

```text
Content-Type: image/png
```

while containing something else.

For security-sensitive workflows, validate the actual file format using trusted parsers/signatures.

## Size limits

Reject oversized bodies before expensive processing where your runtime/platform makes that possible.

Do not accept:

```text
unbounded JSON
unbounded multipart bodies
unbounded decompression
unbounded XML
```

Resource exhaustion is a security problem.

## Timeouts

Protect downstream systems:

```ts
const controller = new AbortController()
const timeout = setTimeout(() => controller.abort(), 5_000)

try {
  const response = await fetch(upstream, {
    signal: controller.signal,
  })
  // ...
} finally {
  clearTimeout(timeout)
}
```

Deployment/runtime limits are not a substitute for application-level deadlines.

## Validation layers

A useful model:

```text
transport validation
→ content type / parseability / size

domain validation
→ required fields / ranges / enums

authorization
→ may this identity perform this operation?

business invariants
→ is this state transition allowed now?
```

Do not collapse all four into one generic `400` block unless the API intentionally hides details.

## Query vs body

Use query parameters for data that naturally identifies/filter a safe `GET` representation:

```text
GET /api/products?page=2&sort=price
```

Use a body for commands or payloads:

```text
POST /api/orders
```

Avoid sensitive data in URLs when it may be logged, cached, copied, or exposed through browser/history infrastructure.

## Validate URLs before server-side fetch

If a client can supply a URL and your server fetches it, you may create SSRF risk.

Dangerous:

```ts
const { url } = await request.json()
const response = await fetch(url)
```

Attackers may target:

- localhost
- private network services
- cloud metadata endpoints
- internal admin APIs

Prefer:

```text
allow-listed hosts
known provider identifiers
server-owned URL construction
```

## XML and parser safety

If accepting XML or other complex formats, configure parsers safely.

Potential issues include:

- entity expansion
- external entity resolution
- extremely deep structures
- oversized input

Use maintained parsers with dangerous features disabled where appropriate.

## Public error shape

Example:

```ts
return Response.json(
  {
    error: {
      code: 'INVALID_INPUT',
      message: 'The request body is invalid.',
      requestId,
    },
  },
  { status: 400 },
)
```

Keep private details in logs, not the response.

Do not expose:

```text
SQL errors
stack traces
filesystem paths
provider secrets
internal service URLs
raw exception objects
```

## Stable error codes

Machine clients benefit from stable codes:

```text
INVALID_INPUT
NOT_AUTHENTICATED
NOT_AUTHORIZED
RESOURCE_NOT_FOUND
CONFLICT
RATE_LIMITED
UPSTREAM_UNAVAILABLE
```

Human-readable messages may change; machine error codes should be part of the versioned contract.

## Idempotency

Parsing a valid request does not mean processing it twice is safe.

For create/payment/webhook endpoints consider:

```text
idempotency key
unique event ID
DB unique constraint
state transition guard
```

Phase 7 introduced mutation idempotency; Route Handlers expose the same problem to arbitrary HTTP clients.

## Common mistakes

### `request.json()` equals validation

It only parses JSON.

### Passing payload directly to ORM

Creates mass-assignment risk.

### Reading signed webhook JSON before raw verification

May invalidate signature verification.

### Accepting arbitrary URLs for server fetch

Can create SSRF.

### Uploading very large files through app compute by default

Use dedicated object storage when possible.

### Returning raw validation/provider errors

Keep public errors intentional.

## Debugging checklist

1. Capture content type and body size safely.
2. Distinguish parse failure from schema failure.
3. Check repeated multipart fields.
4. Verify `File` versus string types.
5. Reproduce raw-body webhook verification.
6. Test oversized requests.
7. Test malformed JSON.
8. Test unexpected fields for mass-assignment safety.
9. Test SSRF-style URL inputs where relevant.
10. Verify public errors contain no secrets/internal details.

## Interview questions

**Does `request.json()` validate input?**  
No. It parses JSON syntax into JavaScript values. Domain validation still belongs to your application.

**Why might a webhook use `request.text()` instead of `request.json()`?**  
Signature schemes often verify the exact raw payload, so parsing first can change the representation used for verification.

**Why avoid direct large uploads through a Route Handler?**  
They can consume compute, memory, bandwidth, and execution time unnecessarily; direct object-storage uploads are often more scalable.

**What is mass assignment?**  
Allowing client-provided keys to flow directly into persistence/update operations, potentially modifying fields the client should not control.

## Exercise

Implement:

```text
POST /api/profile
```

Requirements:

- JSON only
- 32 KB logical payload limit
- validate `displayName` and `timezone`
- reject unknown mutable fields
- authorize the current user
- return stable error codes
- never expose raw exceptions

Then write the equivalent multipart contract for an avatar upload and decide whether the binary should pass through Next.js or upload directly to object storage.