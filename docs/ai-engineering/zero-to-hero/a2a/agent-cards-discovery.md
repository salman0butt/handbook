---
id: a2a-agent-cards
title: Agent Cards, Skills & Discovery
---

# Agent Cards, Skills & Discovery

An **Agent Card** is the discovery document for an A2A Server. It advertises identity, service endpoint, capabilities, supported interfaces/authentication and skills.

```mermaid
flowchart TD
  CLIENT[Client agent] --> DISC{Discovery}
  DISC --> WELL[Well-known Agent Card]
  DISC --> REG[Registry/catalog]
  DISC --> CONFIG[Direct configuration]
  WELL --> CARD[Agent Card]
  REG --> CARD
  CONFIG --> CARD
  CARD --> SELECT[Capability / skill selection]
```

```ts
type AgentCardView = {
  name: string;
  description?: string;
  url: string;
  skills: Array<{ id: string; name: string }>;
  capabilities?: { streaming?: boolean; pushNotifications?: boolean };
};
```

Discovery metadata is not authorization. Verify domain/identity, signature where used, trust policy and security requirements before sending confidential data or delegating actions.

## Practice

1. What does the Agent Card tell a client?
2. Name three discovery mechanisms.
3. Why must clients validate security requirements before invocation?
4. How would you cache Agent Cards safely?
