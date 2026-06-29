## Why

Today, Bullhub requires users to explicitly enumerate their queues in `BullhubOptions.queues` — a manual step that introduces friction during setup and becomes a maintenance burden as queues are added or removed in the application. Auto-discover removes this requirement by scanning Redis for existing BullMQ queues, letting the dashboard stay in sync automatically.

## What Changes

- New `discover` option in `BullhubOptions` that enables automatic queue scanning via Redis `SCAN`
- `queues` becomes optional when `discover: true` is set
- A new `QueueDiscoveryService` handles Redis key scanning and filtering
- `BullhubClient` gains the ability to register queues dynamically after initialization
- Periodic re-scanning keeps the queue list fresh as queues appear or disappear
- `apps/api/src/index.ts` updated to support the `discover` flag via env var (`BULLMQ_AUTO_DISCOVER=true`)

## Capabilities

### New Capabilities
- `queue-auto-discover`: Automatically scans Redis to discover BullMQ queues and registers them in the client, with optional periodic refresh and prefix filtering.

### Modified Capabilities
*(none — no existing spec-level requirements change)*

## Impact

- **`@bullhub/core`** — new public API surface (`discover` option, `QueueDiscoveryService`); non-breaking because `queues` still works as before
- **`packages/core/src/types/bullhub.d.ts`** — `BullhubOptions.queues` becomes optional when `discover` is provided
- **`packages/core/src/clients/bullmq.client.ts`** — gains `registerQueue` / `unregisterQueue` for dynamic management
- **`packages/core/src/modules/bullhub.module.ts`** — wires discovery lifecycle (start/stop)
- **`apps/api/src/index.ts`** — reads `BULLMQ_AUTO_DISCOVER` env var
- No frontend changes required; the existing `/api/queues` route reflects whatever is registered in the client
