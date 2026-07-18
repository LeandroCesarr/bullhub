## Why

The current dashboard offers an aggregated view of all queues but doesn't allow
inspecting a specific queue in depth — there's no way to see a state breakdown,
an isolated activity chart, responsible workers, or to run actions like pausing
without leaving the context. Additionally, `GET /api/workers` iterates over all
queues in N Redis calls and returns everything flat, making a per-queue workers
tab unviable without client-side filtering.

## What Changes

**Backend (`@bullhub/core`)**
- **BREAKING** Remove `GET /api/workers` — replaced by a scoped route
- New route `GET /api/queues/:name/workers` — workers for the specific queue
- New route `GET /api/queues/:name/metrics` — activity chart per queue
- New route `POST /api/queues/:name/pause` — pause queue
- New route `POST /api/queues/:name/resume` — resume queue
- New route `DELETE /api/queues/:name/drain` — clear waiting jobs (with confirmation on the front end)
- `WorkerService.index()` → `WorkerService.listByQueue(queueName)` (single call, no N queries)

**Frontend (`apps/web`)**
- New route `/queues/:queueName` with `QueueDetailPage`
- Tabbed layout: **Overview**, **Workers**, **Jobs**
- Overview tab: status badge (paused/active), state breakdown cards
  (active, waiting, delayed, failed, completed), scoped activity chart
- Workers tab: real list via `GET /api/queues/:name/workers` (replaces mock)
- Jobs tab: pre-filtered `JobsList`, without `QueueSelector`
- `QueuesListItem` becomes a navigable link to `/queues/:name`
- "Queues" item in the sidebar enabled (currently commented out)
- New hooks `useQueue(queueName)` and `useQueueActions(queueName)`

## Capabilities

### New Capabilities
- `queue-detail-page`: Dedicated queue page with Overview, Workers, and Jobs tabs,
  navigation via sidebar and clickable QueuesListItem
- `queue-actions`: Management actions (pause, resume, drain) with API routes
  and UI with confirmation for destructive actions
- `queue-workers-by-queue`: `GET /api/queues/:name/workers` route replacing the
  global `GET /api/workers`, with `WorkerService` refactored to a single call

### Modified Capabilities
*(none)*

## Impact

- **`packages/core/src/modules/bullhub.module.ts`** — removes global workers route,
  adds 5 new scoped routes
- **`packages/core/src/services/worker.service.ts`** — refactors `index()` into
  `listByQueue(queueName)`
- **`packages/core/src/services/queue.service.ts`** — `pause`, `resume`,
  `drain`, `getMetricsByQueue` methods
- **`apps/web/src/routes/queues/$queueName.tsx`** — new route file
- **`apps/web/src/components/pages/QueueDetail/`** — new page directory
- **`apps/web/src/hooks/useQueue.ts`**, **`useQueueActions.ts`**,
  **`useQueueWorkers.ts`** — new hooks
- **`apps/web/src/components/Sidebar.tsx`** — enable "Queues" item
- **`apps/web/src/components/sections/queuesList/components/QueuesListItem.tsx`**
  — becomes a link
- **`apps/web/src/components/sections/workersList/`** — replace mock with real data