---
id: chapters-081-100
title: 081–100 — Storage, Authentication, Deep Links, Permissions & Device APIs
---

# 081 — Storage Categories

Choose storage by data semantics:

```text
preferences / ordinary persisted state → AsyncStorage / MMKV-style KV
secrets / credentials                 → Keychain / Android Keystore-backed storage
structured offline domain data       → SQLite / database layer
temporary derived data                → cache
files / media                         → filesystem
```

Persistence is not security. A fast key-value store is not automatically appropriate for tokens, and secure credential storage is not a replacement for a relational offline database.

# 082 — AsyncStorage

AsyncStorage is a community package for asynchronous persistent key-value data. Values are strings, so object serialization/deserialization is your responsibility. Use it for non-secret preferences, small cached state, onboarding markers, and similar data. Version persisted schemas and handle corruption/migration. Avoid reading large serialized application state synchronously during every render path.

# 083 — MMKV and High-Performance Key-Value Storage

MMKV-style libraries use native storage designed for fast key-value access and can expose synchronous APIs through modern native integration. That can simplify boot-time preferences but also makes it easy to block important execution paths with large values or excessive serialization. Verify current RN/New Architecture compatibility before adopting, benchmark realistic data, and still separate secret storage from ordinary persistence unless the library's security model explicitly meets your needs.

# 084 — Keychain and Android Keystore Concepts

On iOS, Keychain Services stores credentials/keys under OS protection policies. Android Keystore manages cryptographic keys and can back credential-encryption strategies. React Native usually accesses these through a maintained native library. Understand device-lock/accessibility policies, backup behavior, biometric gating, key invalidation, and migration before assuming “stored securely” ends the security design.

# 085 — SQLite and Local Databases

Use SQLite or a higher-level local database when data has relationships, queries, indexes, migrations, and offline synchronization requirements. Design schema versions and migrations like server databases. Keep UI components away from raw SQL by using repository/domain boundaries, and test process restarts, partial migrations, low storage, and large datasets.

# 086 — File Storage and Cache Lifecycles

Files can live in app-private documents, cache directories, temporary directories, or user-visible/shared locations depending on platform APIs. Cache data may be deleted by the OS. User-created documents should have explicit lifecycle/backups. Never persist sensitive content into public/shared locations by accident. Large media needs streaming/chunking decisions rather than converting everything to huge base64 strings.

# 087 — Authentication Architecture

Authentication proves or establishes identity; authorization decides what the identity may do. Mobile login commonly exchanges user credentials or OAuth authorization for short-lived access tokens plus a longer-lived refresh/session mechanism. The backend remains the security authority.

```text
user → identity provider/API → tokens/session
                    ↓
secure device credential store
                    ↓
API client → authorized requests
```

# 088 — Login, Signup and Session Bootstrap

Keep authentication state as a small state machine: bootstrapping, anonymous, authenticated, refreshing, signed-out/expired. At startup, read secure credentials, validate/refresh if needed, then choose the navigation tree. Avoid flashing protected screens before session bootstrap completes. Signup often transitions into verification/onboarding rather than assuming immediate full authorization.

# 089 — Refresh Tokens and Rotation

Refresh tokens should be protected more strongly than short-lived access tokens. Prefer server-side rotation/reuse detection where supported. Coordinate concurrent refresh requests, clear credentials on unrecoverable refresh failure, and distinguish network unavailability from invalid session. Offline mode may keep cached data visible without pretending the session has been revalidated.

# 090 — OAuth, OIDC and PKCE

For public mobile clients, Authorization Code + PKCE prevents a stolen authorization code from being useful without the verifier. Use the system browser/authentication session rather than embedding provider login in an arbitrary WebView. Validate `state`, issuer/audience/nonce as appropriate, and route the callback through verified deep-link/universal-link mechanisms.

# 091 — Biometrics

Biometrics are a local user-presence mechanism, not an identity provider by themselves. A common pattern is to protect access to a locally stored key/credential, then use the server session normally. Plan fallback, biometric enrollment changes, device passcode requirements, lockout, and what happens after reinstall/device migration.

# 092 — Why Bundled Secrets Are Not Secret

A mobile binary is distributed to users. Strings, API keys, native constants, environment files compiled into the app, JavaScript bundles, and embedded assets can be extracted or observed. Therefore **a secret bundled inside a mobile application is not truly secret**. Put privileged credentials server-side and give the app only public identifiers or constrained client credentials designed for exposure.

# 093 — Custom URI Schemes

Custom schemes such as `myapp://callback` are simple but can be claimed by another app on some platforms and need careful security handling. Use them for controlled cases and prefer verified HTTPS association mechanisms for sensitive links when possible. Parse inputs as untrusted data and route only known paths/params.

# 094 — Android App Links

Android App Links use HTTPS URLs plus intent filters and domain verification so the OS can associate a web domain with your app. The app manifest defines matching hosts/paths and the website publishes Digital Asset Links metadata. Test install state, verification, multiple flavors/package IDs, browser fallback, and adb link invocation.

# 095 — iOS Universal Links

Universal Links associate HTTPS domains with iOS apps using Associated Domains entitlements plus the website's apple-app-site-association file. They open the app when association and routing conditions match and otherwise behave as web links. Test exact bundle/team identifiers, caching/association propagation, multiple environments, and cold-start versus already-running callbacks.

# 096 — Deep Links with Navigation and Auth

A link can arrive when the app is killed, backgrounded, or foregrounded. React Navigation can map links to routes, but your app still needs authorization policy. A link to a protected screen should be captured as intent, complete auth if necessary, validate access, then navigate. Do not let external URLs directly bypass feature guards.

# 097 — Permission Architecture

Permissions exist because native capabilities cross privacy/security boundaries. Separate declaration from runtime request: Android uses manifest declarations and runtime permission APIs for applicable dangerous permissions; iOS requires usage-description keys and system prompts. Request at the moment of user intent, explain value first when needed, and handle denial without trapping the user.

# 098 — Permission States and UX

Real apps distinguish not-determined/requestable, granted, denied, blocked/permanently denied, and platform-specific limited states. A denied permission might be requestable again; a blocked state may require opening Settings. Do not spam prompts on launch. Provide an alternate path where possible and make Settings guidance specific.

# 099 — Camera, Photos, Location and Microphone

These APIs are typically supplied by maintained native libraries, not React Native core. Every integration combines permission state, native lifecycle, device availability, OS configuration, and result/error modeling. Camera/location can be expensive in battery and privacy terms; stop native sessions/listeners when not needed. Photo access may be limited to selected assets on modern OS versions.

# 100 — Linking, Share, Clipboard, Haptics, Files and Sensors

React Native core includes APIs such as `Linking`, `Share`, and `Vibration`; clipboard moved out of core to a community package. Haptics, advanced files/media, device information, and many sensors usually require third-party native libraries. Treat each library as native code in your binary: audit maintenance, RN 0.86 compatibility, permissions, native configuration, binary impact, platform behavior, and failure handling before adoption.