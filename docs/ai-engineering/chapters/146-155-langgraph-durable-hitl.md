---
id: chapters-146-155
title: LangGraph Durability, Persistence & HITL
---

# Checkpoints

A checkpointer persists graph state at execution boundaries so a run can continue after process restarts, pauses, or failures.

```text
node A → checkpoint → node B → checkpoint → interrupt
                                  ↓
                           durable state store
```

In-memory checkpointers are useful for development; production workflows that must survive restarts require a durable backend appropriate to the deployment.

# Thread Identity

Persistent LangGraph execution uses a `thread_id` as the pointer to a conversation/workflow history.

```ts
const config = { configurable: { thread_id: run.threadId } };
```

Treat thread IDs as internal resource identifiers. Authorize access to a thread through your application’s user/tenant model; possession of an ID must not grant data access.

# Persistence & State Evolution

Persisted state outlives a deployment. Schema changes therefore need migration/version strategy. Add compatible fields with defaults where possible, version breaking shapes, and test resuming old checkpoints after upgrades.

Do not persist ephemeral credentials or provider client instances. Persist references/authorized intent, then resolve short-lived credentials at execution time.

# Interrupts

`interrupt()` pauses execution and surfaces a JSON-serializable payload to the caller. A checkpointer and stable thread ID let the workflow wait indefinitely for external input.

```ts
import { interrupt } from "@langchain/langgraph";

const decision = interrupt({
  kind: "approval",
  action: state.proposedAction,
});
```

Interrupts are ideal for approval, missing information, review/edit, and escalation.

# Resume with `Command`

Resume an interrupted run using the same thread identity and `Command({ resume: ... })`.

```ts
import { Command } from "@langchain/langgraph";

await graph.invoke(
  new Command({ resume: { approved: true } }),
  config,
);
```

Validate the human/external response before converting it into a resume payload.

# Interrupt Replay & Idempotency

A critical LangGraph rule: when an interrupted node resumes, the node restarts from its beginning, so code before `interrupt()` can run again.

Therefore:

```text
BAD: execute refund → interrupt for confirmation
GOOD: prepare refund → interrupt → execute idempotent refund
```

Any unavoidable pre-interrupt effect must itself be idempotent. This is a workflow correctness issue, not framework trivia.

# Durable Execution

Durability means useful work and state can survive transient failures/process changes without starting the entire task from zero.

Design node effects so replay is safe. External writes need idempotency keys; reads should tolerate repetition; non-deterministic values such as current time/random IDs should be captured deliberately when they affect state transitions.

# Retries & Error Routing

Retries belong near the failing boundary and must classify errors. A transient provider timeout may retry; invalid tool arguments should route back to correction; authorization denial should not retry; repeated model/tool loops should terminate or escalate.

Model error state explicitly so observability can distinguish recovered and terminal failures.

# Subgraphs

Subgraphs encapsulate reusable workflows such as retrieval, compliance review, or approval/execution. They reduce monolithic graph complexity and allow teams to own bounded orchestration components.

Keep subgraph inputs/outputs typed and narrow. Avoid sharing every parent-state field by default; explicit boundaries reduce accidental coupling and data leakage.

# Long-Running Production Workflows

A production graph may wait minutes or days, use background workers, resume after human approval, and outlive one server process.

Architecture:

```text
API → create run → durable graph/checkpoints
                 ↓
             worker queue
                 ↓
        model / retrieval / tools
                 ↓
        interrupt or terminal state
                 ↓
        event stream / status API
```

Set deadlines, retention, cancellation semantics, deployment compatibility, audit trails, and ownership for abandoned runs. LangGraph supplies orchestration primitives; your platform still owns authentication, authorization, tenancy, queues, storage reliability, and incident response.
