## 1. Types

- [x] 1.1 Add `BullhubDiscoverOptions` interface and update `BullhubOptions` in `packages/core/src/types/bullhub.d.ts`: make `queues` optional and add `discover?: boolean | BullhubDiscoverOptions`

## 2. Discovery Service

- [x] 2.1 Create `packages/core/src/services/queue-discovery.service.ts` with a `QueueDiscoveryService` class that exposes `discover(prefix: string): Promise<BullhubOptionsQueue[]>`, scanning Redis via `SCAN MATCH {prefix}:*:id` and extracting queue names from matching keys

## 3. Async Module

- [x] 3.1 Update `packages/core/src/modules/bullhub.module.ts`: make `createBullhub` return `Promise<BullhubContext>`, instantiate `QueueDiscoveryService` when `discover` is set, merge discovered queues with explicit `opts.queues`, and pass the final list to `BullhubClient`

## 4. Hono Adapter

- [x] 4.1 Update `packages/hono-adapter/src/index.ts`: make `registerBullhub` async and `await createBullhub(opts)`

## 5. API Server

- [x] 5.1 Update `apps/api/src/index.ts`: wrap startup in an async IIFE and pass `discover: process.env.BULLMQ_AUTO_DISCOVER === 'true' ? { prefix: process.env.BULLMQ_PREFIX ?? 'bull' } : undefined` to `registerBullhub`