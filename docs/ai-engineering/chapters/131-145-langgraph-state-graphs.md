---
id: chapters-131-145
title: "131–145 — LangGraph TypeScript: State, Nodes & Control Flow"
slug: /ai-engineering/chapters/131-145-langgraph-state-graphs
---

# What LangGraph Is

LangGraph is a low-level orchestration/runtime layer for long-running, stateful workflows and agents. It focuses on explicit state, graph control flow, durable execution, streaming, and human-in-the-loop rather than hiding architecture behind one generic agent abstraction.

Use it when your workflow needs to be visible and controllable as a state machine/graph.

# Why Graphs

A linear chain cannot naturally express branches, loops, parallel work, checkpoints, or approval pauses. A graph makes those transitions first-class.

```text
START → understand → route
                    ├→ retrieve ─┐
                    ├→ tool ─────┼→ validate → answer → END
                    └→ clarify ──┘
```

The graph should reveal product logic, not recreate ordinary function calls as dozens of decorative nodes.

# State

State is the durable data shared across graph steps. Store facts needed for control and continuation: messages, normalized request, retrieval results, proposed actions, approval state, error counters, and final result.

Do not put arbitrary clients or secrets into persistent state. Keep state serializable and evolve its schema deliberately.

# `StateSchema`

Modern LangGraph JavaScript recommends `StateSchema` with Standard Schema-compatible validators such as Zod.

```ts
import { StateSchema, StateGraph, START, END } from "@langchain/langgraph";
import { z } from "zod/v4";

const State = new StateSchema({
  request: z.string(),
  answer: z.string().optional(),
});

const graph = new StateGraph(State)
  .addNode("answer", async (state) => ({ answer: `Received: ${state.request}` }))
  .addEdge(START, "answer")
  .addEdge("answer", END)
  .compile();
```

Legacy `Annotation.Root` remains relevant for migration knowledge but is not the preferred new baseline here.

# Reducers

When multiple node updates target the same state field, a reducer defines how updates combine instead of using simple last-write-wins semantics. Message accumulation and counters are common cases.

Choose reducers that are associative/predictable under parallel execution. Avoid hidden mutation of existing state objects.

# Nodes

A node is a function that reads graph state/context, performs one logical step, and returns a state update or control command.

Good node boundaries correspond to observable responsibilities such as `retrieve`, `proposeRefund`, `humanReview`, or `executeRefund`. Keep model/provider clients behind injected services so nodes can be unit tested.

# Edges

Edges define allowed transitions. Static edges express deterministic flow; conditional edges route based on computed state.

A secure workflow should make dangerous transitions explicit:

```text
propose_write → authorize → human_review → execute_write
```

Do not create a direct model → destructive-tool edge that bypasses policy nodes.

# START & END

`START` is the graph entry boundary and `END` is the terminal boundary. Design a clear output contract at `END`, including terminal error/decline states.

A graph that has no bounded path to termination is an operational risk. Test routes that reach `END` and routes that intentionally interrupt for external input.

# Conditional Routing

Conditional routing is appropriate when state determines the next node: retrieval needed, approval required, tool requested, retry allowed, or task complete.

Keep hard policy conditions deterministic. A model classifier may suggest a route, but tenant authorization or spending limits should be enforced by application logic.

# `Command`

`Command` can combine a state update with control flow and can resume interrupts.

```ts
import { Command } from "@langchain/langgraph";

return new Command({
  update: { status: "validated" },
  goto: "execute",
});
```

Use `new Command({ resume: value })` as input when continuing an interrupted graph. Keep dynamic routing documented because it can be harder to visualize than static edges.

# Graph Compilation

Compilation validates/builds the executable graph and optionally attaches persistence/checkpoint infrastructure.

Separate graph construction from request invocation so tests can compile with in-memory dependencies while production wires durable checkpointers, provider clients, policies, and telemetry.

# Invocation

`invoke` runs until completion, interruption, or failure. Each run should have a correlation/run identity; stateful persistent workflows also need a stable thread identity.

Validate external input before graph entry. Do not pass raw HTTP request objects through state.

# Streaming

Graph streaming exposes state/messages/events as nodes execute, making multi-step work visible to UIs and observability systems.

Translate framework events to a stable application protocol. A UI may display “searching sources,” “waiting for approval,” and text deltas without depending on internal node implementation details.

# Loops & Termination

Agentic flows often loop model → tools → model. Every loop needs bounds: max model calls, max tool calls, elapsed deadline, cost/token budget, repeated-action detection, and terminal recovery.

```text
loop while useful AND within budget
otherwise → safe partial answer / escalation / failure
```

Infinite-loop protection is production functionality, not an optional optimization.

# Parallel Branches

Parallel branches can reduce latency for independent work such as multiple retrieval sources or specialist analyses.

```text
             ┌→ search docs ─┐
request → fan├→ search CRM ──┼→ join → synthesize
             └→ policy lookup┘
```

Define merge/reducer semantics, cancellation behavior, and partial-failure policy. Parallel writes that share side effects require much stronger coordination and are usually a poor default.
