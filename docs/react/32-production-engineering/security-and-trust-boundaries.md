---
title: Security and Trust Boundaries in React
description: Production React security across HTML rendering, Server Functions, authentication, authorization, serialization, secrets, URLs, and third-party code.
sidebar_position: 1
---

# Security and Trust Boundaries in React

React prevents many accidental DOM injection problems by escaping ordinary text values, but **React is not a security boundary by itself**.

A secure React application still needs deliberate control over:

- untrusted HTML;
- Server Function arguments;
- authentication and authorization;
- secrets;
- URLs and redirects;
- data serialization;
- uploads;
- third-party scripts;
- browser storage;
- dependency supply chain;
- logging and telemetry.

A senior engineer thinks in **trust boundaries** rather than assuming that TypeScript, a component boundary, or `'use server'` makes input safe.

## Start with a trust map

For a full-stack React application:

```text
browser input
    ↓ untrusted
Client Component
    ↓ network boundary
Server Function / API
    ↓ validate + authenticate + authorize
application service
    ↓
database / third-party systems
```

Every boundary asks:

1. What data can the caller control?
2. What identity is authenticated?
3. What action is authorized?
4. What must be validated?
5. What may be returned to the client?
6. What must never be logged or serialized?

## JSX text is escaped by default

This is normally safe as text:

```jsx
function Comment({ message }) {
  return <p>{message}</p>;
}
```

If `message` contains:

```html
<script>alert('xss')</script>
```

React renders it as text rather than executing it as markup.

That default is important.

Do not bypass it unless you deliberately need HTML.

## `dangerouslySetInnerHTML` is a trust boundary

This API is named to make the risk explicit:

```jsx
<div dangerouslySetInnerHTML={{ __html: html }} />
```

If `html` is attacker-controlled, embedded code/event attributes can execute.

React's documentation explicitly warns to use it only with trusted and sanitized data.

### Safer pattern

```text
untrusted rich text
→ parse/sanitize using an audited sanitizer
→ produce trusted sanitized HTML
→ render sanitized result
```

Do not "sanitize" with regex.

HTML parsing has too many edge cases.

## Prefer structured rendering when possible

Instead of accepting arbitrary HTML:

```jsx
<Article html={cmsHtml} />
```

prefer structured data:

```js
{
  type: 'paragraph',
  children: [
    { type: 'text', value: 'Hello' },
    { type: 'link', href: '/docs', value: 'docs' }
  ]
}
```

Then map only supported structures to components.

This reduces the attack surface and improves accessibility/control.

## Server Functions are remotely callable server entry points

A function marked with `'use server'` runs on the server, but its arguments can come from the client.

Treat every argument as untrusted.

Bad:

```js
'use server';

export async function deleteProject(projectId) {
  await db.project.delete({ where: { id: projectId } });
}
```

This checks no identity and no permission.

Better conceptually:

```js
'use server';

export async function deleteProject(rawProjectId) {
  const user = await requireAuthenticatedUser();
  const projectId = parseProjectId(rawProjectId);

  const project = await db.project.findUniqueOrThrow({
    where: { id: projectId },
  });

  if (project.ownerId !== user.id) {
    throw new UnauthorizedError();
  }

  await db.project.delete({ where: { id: projectId } });
}
```

The server must enforce authorization even if the client UI hides the Delete button.

## Authentication is not authorization

These are different questions.

```text
authentication
→ who are you?

authorization
→ are you allowed to perform this action on this resource?
```

Being logged in does not mean a user can mutate any record whose ID they send.

Object-level authorization is essential.

## Never trust hidden fields

This is not authorization:

```jsx
<input type="hidden" name="ownerId" value={user.id} />
```

A client can change submitted values.

Use authenticated server identity to determine ownership.

```js
const user = await requireAuthenticatedUser();
```

## TypeScript does not validate runtime input

This signature:

```ts
async function updateUser(input: UpdateUserInput) {}
```

does not guarantee network input matches `UpdateUserInput`.

At runtime, validate boundary input.

```ts
const input = updateUserSchema.parse(rawInput);
```

Validation should cover:

- types;
- ranges;
- lengths;
- formats;
- enum membership;
- required fields;
- business invariants.

## Validation is not authorization

A valid project ID may still refer to another user's project.

```text
validation
→ is this structurally acceptable?

authorization
→ may this user act on this resource?
```

You need both.

## Server Components and secrets

Server Components can access server-only resources, but anything serialized into Client Component props crosses the server/client boundary.

Bad:

```jsx
<ClientPanel user={{
  id: user.id,
  internalToken: user.internalToken,
}} />
```

If a value reaches client props, assume the browser/user can inspect it.

Only pass what the client needs.

## `'use client'` expands the client boundary

A `'use client'` module and its client dependency graph are bundled for client execution.

Do not import server-only modules into that graph.

Examples of server-only concerns:

- database clients;
- private credentials;
- filesystem secrets;
- signing keys;
- privileged service SDKs.

Framework tooling often helps enforce this, but architecture should make the boundary obvious.

## Environment variables

Never assume an environment variable is private simply because it came from a server process.

If build tooling substitutes it into a client bundle, it becomes public.

Use framework conventions for server-only vs client-exposed environment variables and review generated bundles for sensitive data leaks.

## URLs are input too

Attackers can control:

- query strings;
- path parameters;
- redirect targets;
- href values from CMS/data;
- image/resource URLs.

Validate redirects:

Bad:

```js
redirect(searchParams.next);
```

Better:

- allow only internal paths;
- or validate against an allow-list of origins;
- reject dangerous schemes/protocols.

## Avoid `javascript:` and unsafe scheme handling

When rendering user-controlled links, validate the protocol.

Prefer structured URL parsing:

```js
const url = new URL(rawUrl, allowedBase);
```

Then enforce your allowed origin/scheme policy.

## CSRF and Server Functions

Frameworks may provide protections around Server Function transport, forms, and request handling, but application code still needs to understand its framework's CSRF model.

Do not invent ad-hoc assumptions such as:

> It uses POST, therefore it is safe.

Review framework-specific protections for:

- origin checking;
- cookies;
- same-site policy;
- CSRF tokens where needed;
- credentialed cross-origin requests.

## XSS can bypass your auth model

If an attacker executes JavaScript in your origin, they can often act with the user's session.

That is why XSS prevention protects more than visual integrity.

Key defenses include:

- avoid raw HTML;
- sanitize when raw HTML is necessary;
- Content Security Policy where feasible;
- safe URL handling;
- audited third-party scripts;
- dependency hygiene;
- no secrets in client code.

## Third-party scripts are high trust

A script loaded into your origin can generally access what your application can access in that origin.

Treat analytics, chat, A/B testing, session replay, and tag manager integrations as security-sensitive dependencies.

Review:

- who controls the script;
- what data it receives;
- whether subresource integrity is applicable;
- whether CSP restricts execution;
- whether it can be isolated;
- whether it is necessary on sensitive pages.

## Session replay needs privacy design

Session replay tools may capture:

- form input;
- DOM text;
- URLs;
- customer identifiers.

Configure masking/redaction deliberately.

Never assume the vendor automatically knows what your application considers sensitive.

## Browser storage is not a secret vault

Anything accessible to client JavaScript can be read by malicious JavaScript executing in the same origin.

Avoid storing long-lived high-value secrets in `localStorage` simply because it is convenient.

Authentication storage strategy depends on your backend/framework threat model.

## File uploads are hostile input

Client checks improve UX but are not security enforcement.

Server-side validation may need:

- file size limits;
- content/type inspection;
- safe storage paths;
- malware scanning;
- image transcoding;
- access control;
- download content-disposition rules.

Never trust only the file extension or browser MIME type.

## Avoid exposing internal errors

Bad fallback:

```text
SQLSTATE[42P01] relation internal_users does not exist at /srv/app/db.ts:94
```

That leaks implementation details.

User-facing response:

```text
We couldn't complete this request. Reference: RQ-84J2K
```

Server telemetry keeps the detailed stack and correlation ID.

## Error reporting must redact secrets

Never log entire:

- request bodies;
- cookies;
- authorization headers;
- payment details;
- password fields;
- access tokens;
- private form drafts.

Create an allow-list of telemetry fields instead of a block-list that will eventually miss something.

## Optimistic UI is not authorization

This:

```jsx
addOptimisticItem(item);
```

only changes local presentation.

The server mutation must independently validate and authorize the actual request.

Optimistic UI can lie temporarily; the server is authoritative.

## Client validation is UX, server validation is enforcement

Use HTML constraints and client validation for fast feedback:

```jsx
<input type="email" required />
```

But enforce the same critical rules on the server.

Attackers do not need to use your UI.

## Dependency security

React applications commonly ship hundreds of transitive packages.

Production practices:

- commit lockfiles;
- review dependency updates;
- use vulnerability scanning;
- remove abandoned dependencies;
- minimize packages with install scripts;
- pin sensitive framework/RSC integrations when version compatibility requires it;
- monitor compromised-package advisories.

## Security review checklist for a feature

Before shipping a new mutation or rich-content feature, ask:

1. What input is user-controlled?
2. Where is runtime validation?
3. Where is authentication checked?
4. Where is resource authorization checked?
5. Does any HTML bypass React escaping?
6. Are URLs validated?
7. Are secrets crossing into client bundles/props?
8. Are errors redacted?
9. Does telemetry contain sensitive data?
10. What third-party scripts see this page?
11. What happens if a request is replayed?
12. Is the operation idempotent where needed?

## Senior principle: trust is directional

A useful rule:

```text
client → server
always untrusted

server → client
public to that user/browser

external HTML/script/data
untrusted until validated/sanitized according to context
```

## Interview questions

### Does React prevent XSS?

React escapes ordinary text interpolation, which blocks many accidental injection cases, but unsafe HTML, URLs, scripts, third-party code, and server boundaries still require security engineering.

### Are Server Function arguments trusted because React serializes them?

No. React explicitly documents them as client-controlled input. Validate and authorize on the server.

### Does TypeScript protect Server Functions from malformed input?

No. TypeScript is compile-time tooling and does not validate arbitrary runtime network data.

### Is hiding an admin button authorization?

No. Authorization must be enforced on the server mutation/resource access.

## Exercise

Design a secure rich-text publishing flow.

Requirements:

- authenticated author;
- authorization per document;
- runtime validation;
- safe rich-text representation or sanitization;
- no secrets in client props;
- safe preview;
- idempotent publish mutation;
- telemetry without article private content;
- Error Boundary for unexpected editor crashes;
- explicit business-state errors for validation failures.

## References

- https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html
- https://react.dev/reference/rsc/use-server
- https://react.dev/reference/rsc/server-functions
- https://react.dev/reference/rsc/server-components
- https://react.dev/reference/react-dom/components/form
