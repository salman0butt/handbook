---
title: Optimistic UI & Mutation Concurrency
description: Use useOptimistic for immediate feedback while designing rollback, concurrency, ordering, and authoritative server reconciliation correctly.
---

# Optimistic UI & Mutation Concurrency

Optimistic UI shows the expected result **before the server confirms it**.

```text
user intent
  ↓
optimistic state immediately
  ↓
server mutation
  ↓
confirmed server state or failure recovery
```

React's `useOptimistic` supports this pattern inside Actions.

## Basic `useOptimistic`

```tsx
'use client'

import { useOptimistic } from 'react'
import { sendMessage } from './actions'

export function Thread({
  messages,
}: {
  messages: Message[]
}) {
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, text: string) => [
      ...state,
      { id: `optimistic-${Date.now()}`, text, pending: true },
    ],
  )

  async function formAction(formData: FormData) {
    const text = String(formData.get('message') ?? '')
    addOptimisticMessage(text)
    await sendMessage(text)
  }

  return (
    <>
      {optimisticMessages.map((message) => (
        <p key={message.id}>{message.text}</p>
      ))}

      <form action={formAction}>
        <input name="message" />
        <button>Send</button>
      </form>
    </>
  )
}
```

The optimistic reducer should be pure.

## Optimistic state is a projection, not authority

Never treat optimistic state as proof that the mutation succeeded.

```text
optimistic UI
  = predicted presentation

server/database
  = authoritative state
```

This distinction matters for:

- payments
- inventory
- permissions
- uniqueness
- collaboration
- quotas

## Good candidates

Optimistic UI is strongest when:

```text
high expected success rate
low rollback cost
clear user intent
fast reconciliation
```

Examples:

- likes
- toggles
- reordering
- adding a comment
- marking a task complete

## Weak candidates

Be cautious with:

- irreversible payments
- destructive deletes
- permission grants
- legal confirmations
- inventory-sensitive checkout
- operations with frequent business-rule rejection

You can still provide pending feedback without pretending success.

## The server may normalize the result

Client prediction:

```text
name = "  New Project  "
```

Server result:

```text
name = "New Project"
slug = "new-project"
updatedAt = server timestamp
```

Optimistic UI must reconcile to authoritative returned/rendered data.

## Failure recovery

If the action fails, React's optimistic state should resolve back toward the base state after the Action ends.

But UX still needs to explain failure.

Pattern:

```text
optimistic visual change
  ↓
server rejects
  ↓
optimistic projection disappears
  ↓
show useful error
```

Do not silently snap back without context for meaningful operations.

## Temporary IDs

For optimistic creation, the client may need a temporary identifier.

```ts
const optimisticId = crypto.randomUUID()
```

But the database may create a different authoritative ID.

Model reconciliation explicitly:

```text
client temp ID
  ↓
server create
  ↓
real ID
  ↓
new server render/result replaces optimistic item
```

Do not persist assumptions about the temporary ID.

## Multiple optimistic updates

Suppose the user clicks “Like” three times quickly or toggles a state repeatedly.

You now have ordering questions:

```text
intent A
intent B
intent C
```

Are these:

- additive operations?
- replacements?
- toggles?
- cancellable?

Design the server contract accordingly.

## Prefer intent-based mutations

For concurrency-sensitive operations, this may be safer:

```ts
incrementQuantity(itemId, 1)
```

than:

```ts
setQuantity(itemId, clientQuantity)
```

But for some domains, absolute state with version checks is safer.

The correct choice depends on conflict semantics.

## Lost updates

Classic race:

```text
Client A reads version 4
Client B reads version 4
A writes version 5
B writes based on version 4
```

Possible solutions:

- optimistic concurrency version columns
- conditional updates
- database transactions
- row locking
- merge rules
- event sourcing for suitable domains

React optimistic UI does not solve database concurrency.

## Version-aware mutation

```ts
await db.document.updateMany({
  where: {
    id,
    version: expectedVersion,
  },
  data: {
    body,
    version: { increment: 1 },
  },
})
```

If zero rows update, return a conflict state.

The UI can then:

- refetch/re-render
- show conflict
- offer merge/retry

## Optimistic delete

Removing an item immediately can feel fast.

But if delete fails, restoring the exact prior position/state may be awkward.

For high-risk deletes, consider:

```text
pending deletion state
→ server confirms
→ remove permanently
```

instead of immediate disappearance.

## Combine with `useActionState`

Optimistic presentation and action result state solve different problems.

```text
useOptimistic
  → predicted UI

useActionState
  → returned result/error + pending
```

They can work together.

## Revalidation after optimistic mutation

After the server commits, invalidate/refresh the authoritative server data so the next render confirms:

```text
optimistic projection
  ↓
write
  ↓
updateTag / revalidateTag / revalidatePath / refresh as appropriate
  ↓
server render
  ↓
confirmed state
```

Do not maintain two permanent competing sources of truth.

## Read-your-own-writes

For cached data where the user must see their own write immediately, `updateTag` can expire the relevant tag inside a Server Action.

Use this when immediate consistency is the product requirement.

If slight staleness is acceptable, `revalidateTag(tag, 'max')` may be more appropriate.

## Pending vs optimistic

Pending UI:

```text
Save → Saving…
```

Optimistic UI:

```text
Save → UI already shows new value
```

Use optimistic state only when the product benefits from prediction.

## Duplicate clicks

Optimistic UI can make duplicate clicks more dangerous because the interface appears fast.

Still design:

- disabled/pending states where useful
- idempotency
- unique constraints
- state-machine transitions

## Queued Actions

React Action state may queue mutations that depend on previous state.

Do not assume client invocation order equals arbitrary distributed transaction ordering across tabs/devices/services.

Server-side invariants remain authoritative.

## Collaboration

In multi-user systems:

```text
my optimistic edit
+
remote user's edit
+
server reconciliation
```

can conflict.

Define:

- last-write-wins?
- field merge?
- explicit conflict?
- CRDT/OT for collaborative editing?

Optimistic UI is presentation; collaboration strategy is domain architecture.

## Common mistakes

### Using optimistic UI for every mutation

Prediction has product and correctness costs.

### Treating optimistic state as success

Wait for authoritative confirmation.

### No visible rollback error

Users need to know why state reverted.

### Ignoring server normalization

Always reconcile with the actual result.

### Assuming React solves concurrent writes

Database/domain concurrency needs its own mechanism.

## Debugging checklist

1. Slow the network deliberately.
2. Force server rejection.
3. Submit twice rapidly.
4. Test two browser tabs.
5. Test stale version conflict.
6. Inspect optimistic temporary IDs.
7. Confirm authoritative server data replaces prediction.
8. Confirm revalidation is scoped correctly.
9. Confirm pending and optimistic indicators are understandable.
10. Test screen-reader feedback for failure/recovery.

## Interview questions

**What does `useOptimistic` solve?**  
Immediate predicted UI during an Action while the authoritative mutation completes.

**Does optimistic UI remove the need for pending state?**  
No. Pending state can still communicate that confirmation is in progress.

**How do you handle concurrent updates?**  
With domain/database strategies such as version checks, conditional writes, transactions, or merge rules; optimistic UI alone is not concurrency control.

**When should you avoid optimistic UI?**  
When failure is common, rollback is confusing, or the operation is high-risk and should not appear successful before confirmation.

## Exercise

Design optimistic UX for:

```text
like post
rename task
reorder cards
delete customer
submit payment
```

For each, decide:

- optimistic or pending-only
- rollback UX
- server concurrency strategy
- revalidation strategy
- idempotency requirement
