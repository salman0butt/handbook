---
title: Project 4 — Real-Time WebSocket Platform
---

# Project 4 — Real-Time WebSocket Platform

Build a multi-room operations dashboard with authenticated WebSockets, heartbeats, reconnect/resync, horizontal scaling, backpressure, tests, and metrics.

## Requirements

Authenticate upgrade/connection, authorize room subscriptions, assign connection IDs, implement heartbeat deadlines, bounded outgoing queues, sequence numbers, reconnect snapshot/resume, and pub/sub fan-out across replicas.

## Architecture

```text
browser clients
      ↓
load balancer
  ┌────┴────┐
WS replica A WS replica B
  └────┬────┘
     pub/sub
        ↓
 domain event source
```

## Runtime model

Each socket is a long-lived handle. Message callbacks run on a replica's JS thread. Pub/sub and persistence are external I/O. Serialization/compression can become CPU bottlenecks.

## Milestones

Single-replica connection lifecycle → authz → rooms → heartbeat → reconnect/resync → Redis/broker fan-out → backpressure → load test.

## Acceptance criteria

Stale clients are disconnected; unauthorized subscriptions fail; reconnect after missed messages reaches correct current state; a slow client cannot grow memory unbounded; event broadcast works across two replicas; `SIGTERM` drains/closes predictably.

## Security

Short-lived credentials, per-message schema validation, resource-level authz, origin policy for browser use where appropriate, connection/message rate limits, max payload, no tokens in logs.

## Performance

Measure active connections, messages/s, bytes/s, event-loop delay, per-connection queue depth, broadcast latency, pub/sub latency, serialization CPU, RSS per 10k connections.

## Testing

Invalid upgrade, expired token, forbidden room, heartbeat timeout, reconnect after gap, duplicate event, out-of-order event, pub/sub outage, slow client, rolling deployment.

## Failure modes

Replica crash, broker unavailable, LB idle timeout, network partition, reconnect thundering herd, message ordering mismatch, huge broadcast fan-out.

## Observability

Connections opened/closed by reason, active rooms, queue pressure/disconnects, heartbeat RTT, message validation failures, reconnect/resync count.

## Deployment

Multiple replicas behind connection-aware LB; shared pub/sub; readiness stops new upgrades; rolling restart closes old connections gradually.

## Common mistakes

Treating socket as authenticated forever, no resync protocol, unbounded send buffer, relying on sticky sessions for shared state, global broadcast loops with huge JSON serialization.

## Stretch goals

Binary protocol, edge gateways, per-room partitioning, presence with TTL, replay log.

## Interview questions

How do you scale WebSockets horizontally? What is stateful about a connection? How do backpressure and reconnect semantics interact?

## Design review

Explain correctness if one replica misses a pub/sub message and then clients reconnect.
