---
id: projects-06-10
title: Projects 06–10 — Chat, Maps, Camera, Offline Notes & Push
---

# Project 6 — Chat / Real-Time Application

**Requirements:** conversations, message history, real-time delivery, optimistic send, reconnect/resync, unread indicators and attachment placeholder. **Architecture:** query cache for history + WebSocket service + outbox/repository + auth adapter.

**Setup/implementation:** load older messages with cursor pagination, create client message IDs, enqueue sends with idempotency key, reconcile server IDs/ordering, reconnect with exponential backoff and resync by last server sequence. Keep socket singleton ownership above individual screens while subscriptions are feature-scoped.

**Android/iOS:** backgrounding can suspend/kill sockets; use push for wake/user notification and resync on foreground. **Errors/loading:** show sending/failed states per message and retry idempotently. **Testing:** ordering, duplicates, reconnect, offline outbox, auth expiry. **Performance:** inverted/virtualized list, bounded message objects, media thumbnails. **Accessibility:** announce new messages without overwhelming screen-reader users. **Security:** TLS, server authorization per conversation, secure token storage, no secrets in payload logs. **Acceptance:** no duplicate sends across reconnect; history catches up after 10-minute background. **Senior review:** What is authoritative ordering? How do you prevent retry duplication?

---

# Project 7 — Maps + Location Application

**Requirements:** map, current location opt-in, nearby results, marker selection, route-to-detail, permission handling and cached last search. **Architecture:** map/native library behind platform adapter → location service → query layer → feature UI.

**Setup/implementation:** choose a maintained RN 0.86-compatible map/location library; request location only after user intent; debounce viewport search; use server geospatial query; represent permission as a state machine. Avoid storing every map-camera movement in global React state.

**Android/iOS:** configure manifest/Info.plist usage descriptions, background location only if product truly needs it, provider keys per platform/environment. **Errors/loading:** distinguish location unavailable from API failure; allow manual search without permission. **Testing:** permission adapter, viewport query debounce, deep link to result. **Performance:** limit marker count/clustering, memoize marker models only if measured. **Accessibility:** offer list alternative for map-only content. **Security/privacy:** minimize location retention and analytics precision. **Acceptance:** app remains useful when location denied; repeated panning does not flood API. **Senior review:** When is background location justified and what OS/battery/privacy costs follow?

---

# Project 8 — Camera / Media Application

**Requirements:** camera preview, capture photo, gallery pick, crop/preview flow, upload with progress/cancel and retry. **Architecture:** native camera/media adapter → local file domain → upload service → server media record.

**Setup/implementation:** choose current New-Architecture-compatible camera/media packages, gate camera/photos permissions, keep captured media as file URIs rather than base64, downscale/compress intentionally, use multipart streaming-capable upload where library/server supports it.

**Android/iOS:** test camera lifecycle on background/foreground, limited photo-library access, orientation, physical devices and low storage. **Errors/loading:** permission denied, camera unavailable, capture failure, upload failure with retained local file/retry. **Testing:** adapter mocks + integration on device; upload cancellation. **Performance:** stop camera session when hidden; bound preview image dimensions. **Accessibility:** all capture/retake controls labeled and focusable. **Security:** strip/handle EXIF/location metadata according to product policy; validate media server-side. **Acceptance:** no camera session remains active after navigation; large photos do not OOM. **Senior review:** Why is base64 risky for large media?

---

# Project 9 — Offline Notes Application

**Requirements:** create/edit/delete notes offline, tags/search, sync to server, conflict handling and sync status. **Architecture:** SQLite/local database as immediate source → mutation log/outbox → sync engine → server; UI observes local repository.

**Setup/implementation:** assign UUID/client IDs, track local revision/server version, queue idempotent operations, transactionally apply server acknowledgements, define conflict rule such as field-level merge or explicit conflict copy. Full-text search can stay local.

**Android/iOS:** process death must not lose pending operations; network transitions trigger bounded sync, not infinite background JS. **Errors/loading:** sync failures visible without blocking local editing. **Testing:** migration, crash during sync, duplicate ack, conflict, offline restart. **Performance:** indexes for search/tag queries; paginate large note sets. **Accessibility:** sync state is text/semantic, not color-only. **Security:** secure server auth; choose database encryption only after threat model/library audit. **Acceptance:** edit 20 notes offline, kill app, relaunch, reconnect and converge without lost edits. **Senior review:** Define your conflict model and why.

---

# Project 10 — Push Notification Application

**Requirements:** register device token, request permission at meaningful moment, receive foreground notifications, route taps from background/killed state, token refresh and per-user preferences. **Architecture:** backend → FCM/APNs → native notification library → intent router → navigation/auth bootstrap.

**Setup/implementation:** choose a maintained bare-RN notification stack compatible with RN 0.86, configure APNs/FCM native projects, upload installation token to backend with app/platform/environment metadata, make routing payload contain stable route/entity intent rather than raw navigation state.

**Android/iOS:** Android channels/permission behavior and iOS authorization/APNs credentials differ. Test killed-state tap and token changes. **Errors/loading:** registration failure must not block app; server retries invalidation; remove invalid tokens. **Testing:** intent parser/router, auth-gated routing, notification preference API. **Performance:** minimal startup work before routing. **Accessibility:** notification text meaningful; in-app foreground banner focus behavior tested. **Security:** no sensitive plaintext payloads; backend authorizes target recipients. **Acceptance:** tap routes exactly once to correct authorized screen from all lifecycle states. **Senior review:** Why is a device token not the same as a user ID?