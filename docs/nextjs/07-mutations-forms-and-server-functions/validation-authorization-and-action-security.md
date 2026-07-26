---
title: Validation, Authorization & Action Security
description: Treat every Server Action as a network mutation endpoint with runtime validation, authentication, authorization, CSRF awareness, and safe data handling.
---

# Validation, Authorization & Action Security

A Server Action may look like a local function call, but its security model is closer to an HTTP mutation endpoint.

```text
browser-controlled request
  ↓
Server Action
  ↓
validate
  ↓
authenticate
  ↓
authorize
  ↓
mutate
```

Current Next.js documentation explicitly warns that Server Functions are reachable through direct POST requests, not only through your rendered UI.

## The three checks

Do not collapse these into one:

```text
VALIDATION
Is the input well-formed?

AUTHENTICATION
Who is the caller?

AUTHORIZATION
May this caller perform this operation on this resource?
```

All three may be required.

## Runtime validation

TypeScript does not validate network input.

```ts
'use server'

export async function changeRole(
  userId: string,
  role: 'admin' | 'member',
) {
  // TypeScript cannot prove the runtime request respected this type.
}
```

Validate at runtime:

```ts
const schema = z.object({
  userId: z.string().uuid(),
  role: z.enum(['admin', 'member']),
})
```

Then parse before mutation.

## Validate primitive details

Security bugs often hide in “small” assumptions:

- IDs have correct shape
- strings have length limits
- enum values are known
- numbers are finite and bounded
- dates are valid
- arrays have item/count limits
- file sizes/types are acceptable
- URLs use allowed schemes/hosts

Validation is also resource protection.

## Authenticate inside the action

Bad:

```ts
export async function deleteProject(projectId: string) {
  // UI only renders button for logged-in users
  await db.project.delete({ where: { id: projectId } })
}
```

Better:

```ts
'use server'

export async function deleteProject(projectId: string) {
  const session = await auth()

  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  // ...
}
```

Do not assume a protected page makes every action inside it protected forever.

Actions are separately callable server boundaries.

## Authorize the resource, not just the role

A user may be an authenticated editor but still not own every project.

Weak:

```ts
if (session.user.role !== 'editor') throw new Error('Forbidden')
await db.project.update({ where: { id: projectId }, data })
```

Stronger:

```ts
const project = await db.project.findFirst({
  where: {
    id: projectId,
    organisationId: session.user.organisationId,
  },
  select: { id: true },
})

if (!project) {
  throw new Error('Forbidden')
}
```

Prefer scoped queries that make cross-tenant access structurally difficult.

## Never trust client permission flags

This is presentation state:

```tsx
<DeleteButton canDelete={true} projectId="p1" />
```

This is authoritative enforcement:

```text
current authenticated identity
+
server-side permission check
+
resource scope
```

A user can change client state or send their own request.

## Mass assignment

Dangerous:

```ts
const input = Object.fromEntries(formData)

await db.user.update({
  where: { id: userId },
  data: input,
})
```

A crafted form could include:

```text
role=admin
verified=true
billingPlan=enterprise
```

Select allowed fields explicitly:

```ts
const parsed = profileSchema.parse({
  name: formData.get('name'),
  bio: formData.get('bio'),
})
```

## Overposting and underfetching permissions

A safe mutation API exposes the narrowest operation.

Prefer:

```ts
renameProject(projectId, name)
archiveProject(projectId)
changeProjectOwner(projectId, newOwnerId)
```

over:

```ts
updateProject(projectId, arbitraryObject)
```

Narrow actions reduce accidental privilege expansion.

## CSRF protections

Next.js Server Actions are invoked with POST.

Next.js also compares the request origin with the host domain for Server Action requests. By default, same-origin use is expected.

For reverse-proxy or multi-origin deployments, `serverActions.allowedOrigins` can add trusted origins.

Do not broadly allow origins merely to silence an error.

Example:

```ts
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['app.example.com'],
    },
  },
}
```

Treat this as security configuration.

## Body-size limits

Server Actions have a default request body size limit of **1 MB**.

This exists partly to limit resource consumption.

You can configure `serverActions.bodySizeLimit`, but increasing it changes your attack/resource surface.

Before increasing it for uploads, ask whether the correct architecture is:

```text
browser
  ↓ signed upload URL
object storage
  ↓
small metadata Server Action
```

rather than routing a very large file through your application server.

## File upload validation

For a file mutation, inspect:

```text
size
content type
actual file signature when appropriate
allowed extensions
filename normalization
storage path
virus/malware scanning when relevant
image/document parsing risks
```

Never build a storage path directly from an untrusted filename.

## Secrets

Server Actions can read server secrets, but do not return them.

Bad:

```ts
return {
  ok: true,
  providerResponse,
  apiKey: process.env.PROVIDER_KEY,
}
```

Return minimal public state.

## Expected errors vs exceptions

Expected validation/business outcomes should usually be returned as data:

```ts
return {
  ok: false,
  fieldErrors: {
    email: ['Email is already registered'],
  },
}
```

Unexpected bugs/infrastructure failures can throw and reach the error boundary/observability path.

Do not convert every exception into a friendly validation message; that hides incidents.

## Error detail exposure

Avoid sending database/provider details to the browser:

```ts
catch (error) {
  return { message: String(error) }
}
```

Log server detail with redaction/correlation, return a safe public message.

## Rate limits and abuse

High-risk actions may need:

- per-account throttling
- per-IP throttling
- resource-specific quotas
- CAPTCHA/anti-bot where appropriate
- fraud detection
- audit logs

Examples:

- password/email changes
- invitations
- expensive exports
- payment attempts
- destructive bulk operations

Server Actions do not remove ordinary abuse risks.

## Replay and duplicate requests

Network retries and double submissions can occur.

High-impact mutations should define duplicate behaviour:

```text
create payment
send invitation
create order
provision resource
```

Use idempotency keys, unique constraints, transactions, or state-machine guards as appropriate.

## Authorization after stale UI

Permissions may change between render and click.

Example:

```text
10:00 page renders “Delete”
10:02 admin removes user's permission
10:03 user clicks Delete
```

The action must use current server authority, not the permission snapshot from render time.

## Audit logs

For sensitive actions, record meaningful domain context:

```text
actor
operation
resource
result
timestamp
request/correlation ID
```

Do not log secrets, full tokens, passwords, or unnecessary personal data.

## Safe transaction boundary

If authorization and mutation must be atomic, design for concurrency.

A read-then-write sequence can race:

```text
check permission
  ↓ time gap
permission changes
  ↓
write
```

Depending on domain risk, use transaction/locking/conditional update strategies.

## Common mistakes

### “The button is hidden, so the action is safe”

False. The action is a server endpoint.

### “TypeScript validated it”

False at runtime.

### “The ID came from bind, so it is trusted”

False. Action arguments are client-controlled.

### “Same-origin protection replaces authorization”

False. CSRF mitigation and authorization solve different problems.

### “The user was authorized when page rendered”

Re-check when mutation executes.

## Security review checklist

For every action:

- [ ] Is it actually required to be client-callable?
- [ ] Are all arguments runtime validated?
- [ ] Is identity resolved server-side?
- [ ] Is resource authorization enforced?
- [ ] Is tenant scope explicit?
- [ ] Are writable fields whitelisted?
- [ ] Are returned values safe for the browser?
- [ ] Is duplicate execution safe?
- [ ] Are logs redacted?
- [ ] Does rate limiting apply?
- [ ] Is cache invalidation scoped?
- [ ] Is redirect destination safe?

## Interview questions

**Why must Server Actions re-check authorization?**  
They are reachable through direct client POST requests and UI state is not an authority boundary.

**Does Next.js protect Server Actions from CSRF?**  
It includes same-origin host/origin checks and POST-only action invocation, but application authentication, authorization, validation, and deployment-origin configuration remain your responsibility.

**What is mass assignment?**  
Persisting arbitrary client fields into a model, allowing attackers to modify fields the UI never intended to expose.

**Why is a 1 MB action body limit relevant?**  
It protects server resources and influences upload architecture; raising it should be intentional.

## Exercise

Threat-model these actions:

```text
inviteMember
changeRole
uploadInvoice
cancelSubscription
exportCustomerData
```

For each, define validation, identity, authorization, rate limiting, idempotency, logging, and safe browser response.
