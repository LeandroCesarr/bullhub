## 1. Backend — Model and Services

- [x] 1.1 Add `paused: boolean` field to `BullhubQueue` in `packages/core/src/models/BullhubQueue.ts`, fetching `queue.isPaused()` inside `BullhubQueue.fromBullMQ`

- [x] 1.2 Refactor `WorkerService` in `packages/core/src/services/worker.service.ts`: remove `index()` and add `listByQueue(queueName: string): Promise<BullhubWorker[]>` with a single call to `queue.getWorkers()`

- [x] 1.3 Add `pause`, `resume`, and `drain` methods to `QueueService` in `packages/core/src/services/queue.service.ts`

## 2. Backend — Routes

- [x] 2.1 Update `packages/core/src/modules/bullhub.module.ts`: remove `GET /api/workers` route, add `GET /api/queues/:name/metrics`, `GET /api/queues/:name/workers`, `POST /api/queues/:name/pause`, `POST /api/queues/:name/resume`, `DELETE /api/queues/:name/drain`

## 3. Frontend — Hooks

- [x] 3.1 Create `apps/web/src/hooks/useQueueWorkers.ts` consuming `GET /api/queues/:name/workers`

- [x] 3.2 Create `apps/web/src/hooks/useQueueMetrics.ts` consuming `GET /api/queues/:name/metrics`

- [x] 3.3 Create `apps/web/src/hooks/useQueue.ts` with data + pause, resume, and drain mutations (invalidates `["queues"]` on completion)

## 4. Frontend — QueueDetail Page

- [x] 4.1 Create route `apps/web/src/routes/queues/$queueName.tsx`

- [x] 4.2 Create `apps/web/src/components/pages/QueueDetail/index.tsx` with tabbed layout (Overview, Workers, Jobs) and header with queue name and status badge

- [x] 4.3 Create Overview tab: per-state breakdown cards and activity chart scoped via `useQueueMetrics`

- [x] 4.4 Create Workers tab: worker list via `useQueueWorkers`, replacing the mock in `apps/web/src/components/sections/workersList/index.tsx`

- [x] 4.5 Create Jobs tab: reuse `JobsList` pre-filtered by `queueName`, without `QueueSelector`

- [x] 4.6 Create `QueueActions` component with Pause, Resume, and Drain buttons using `useQueueActions`

## 5. Frontend — Navigation

- [x] 5.1 Make `QueuesListItem` a link to `/queues/:name` in `apps/web/src/components/sections/queuesList/components/QueuesListItem.tsx`

- [x] 5.2 Enable "Queues" item in the sidebar in `apps/web/src/components/Sidebar.tsx`, pointing to `/queues`