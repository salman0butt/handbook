---
title: WebSockets & Real-Time Systems
---

# WebSockets & Real-Time Systems

A WebSocket upgrades an HTTP connection into a long-lived bidirectional message channel. Long-lived connections turn connection lifecycle into application state.

```text
HTTP handshake/upgrade
      ↓
authenticate connection
      ↓
subscribe rooms/topics
      ↓
messages + heartbeats
      ↓
disconnect / reconnect / resync
```

## Heartbeats

TCP can remain apparently open through broken middleboxes/network paths. Application/protocol pings and deadlines detect stale connections and free resources.

## Reconnect semantics

Clients reconnect. Define whether they resume from sequence/cursor, request a fresh snapshot, or may miss transient messages. “Reconnect automatically” without resynchronization can show incorrect state.

## Horizontal scaling

With multiple Node replicas, a connection exists on one process. Shared room/topic events need routing via broker/pub-sub or a gateway architecture.

```text
clients → load balancer → WS replicas
                         ↕
                    pub/sub broker
```

Sticky sessions can reduce routing complexity but do not solve cross-replica broadcasts/state ownership.

## Backpressure

A slow client can accumulate outbound data. Bound per-connection queues, drop/coalesce low-value messages, or disconnect clients that cannot keep up. One slow socket must not consume unbounded memory.

## Security

Authenticate the connection and authorize each sensitive subscription/action. Rotate/expire credentials, rate-limit messages, cap payloads, validate schemas, and protect against connection floods.
