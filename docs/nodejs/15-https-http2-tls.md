---
title: HTTP/2, HTTPS & TLS
---

# HTTP/2, HTTPS & TLS

TLS authenticates peers and protects transport confidentiality/integrity. HTTPS is HTTP over TLS. HTTP/2 multiplexes logical streams over a connection and changes connection-level performance/failure behavior.

## Trust chain

```text
client trusts CA/root
        ↓
validates certificate chain
        ↓
checks hostname + validity
        ↓
negotiates TLS parameters
        ↓
encrypted application traffic
```

A private key must never be committed or logged. Certificate rotation is an operational process: deploy new material safely, reload/restart without downtime, and monitor expiry.

## SNI and ALPN

SNI lets a client indicate the hostname during TLS negotiation so a server/proxy can select a certificate. ALPN negotiates application protocols such as HTTP/2.

## Reverse proxy architecture

Common production topology:

```text
Internet
  ↓
CDN / load balancer / ingress
  ↓ TLS termination or passthrough
Node service
```

Terminating TLS upstream can simplify certificates and DDoS controls, but Node must then trust forwarding metadata only from known proxies. Never accept arbitrary `X-Forwarded-*` headers as identity/security facts.

## HTTP/2

HTTP/2 uses streams within a session. A single connection can carry concurrent requests, which improves some workloads but creates shared connection failure and flow-control considerations. Backpressure still matters at stream and connection layers.

## Production checklist

- current TLS policy/ciphers through supported Node/OpenSSL;
- automated cert rotation;
- hostname verification for outbound TLS;
- sensible handshake/request timeouts;
- observability for handshake failures and certificate expiry;
- explicit proxy trust model.
