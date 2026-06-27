## Why

The Job Details page already renders retry, requeue, and delete buttons, but none of them do anything — the handlers are empty stubs and no delete/cancel API routes exist yet. Additionally, the `ActionButton` component is visually rough: icons are too small, `disabled` styling is applied but clicks still fire, and there's no loading state. Developers using the dashboard can see a job's state but can't act on it, and the buttons look unpolished.

## What Changes

- **Redesign `ActionButton`**: larger icon, proper `disabled` HTML attribute (no click-through), `isLoading` prop with spinner, accessible cursor styles
- Wire up the **retry** action: call the existing `POST /api/queues/:queue/jobs/:id/retry` endpoint from the frontend
- Add a **cancel** action: new API route `DELETE /api/queues/:queue/jobs/:id` that removes a job from the queue
- Add a **promote** action: new API route `POST /api/queues/:queue/jobs/:id/promote` that moves a delayed job into the waiting state
- Buttons are **conditionally enabled** based on job state (retry only for `failed`/`completed`, cancel for `waiting`/`delayed`/`active`, promote only for `delayed`)
- Implement `JobActions.tsx` component (file referenced in the UI, currently empty/missing) using the `useAction` hook
- **Invalidate the job query** after a successful action so the UI reflects the new state immediately

## Capabilities

### New Capabilities

- `job-actions`: Lifecycle actions on a single job (retry, cancel, promote) — frontend wiring, API endpoints, service methods, conditional availability per job state, and a redesigned ActionButton

### Modified Capabilities

<!-- No existing specs yet — this is the first operational capability being added -->

## Impact

- `apps/web/src/components/ActionButton.tsx` — redesign: larger icon, `isLoading` prop, proper `disabled` behavior
- `packages/core/src/services/job.service.ts` — add `cancel()` and `promote()` methods
- `packages/core/src/modules/bullhub.module.ts` — register DELETE and promote POST routes
- `apps/web/src/components/pages/JobDetails/components/JobActions.tsx` — implement the component
- `apps/web/src/components/pages/JobDetails/index.tsx` — replace empty handlers with real action calls
- No public API breaking changes; new routes are additive