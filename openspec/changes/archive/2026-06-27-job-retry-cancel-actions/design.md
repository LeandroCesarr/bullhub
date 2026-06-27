## Context

The Job Details page renders three action buttons (retry, requeue, delete) that are currently inert — their `onClick` handlers are empty stubs. The backend already has a `retry` service method and route. What's missing is: a `cancel` service method + route, a `promote` service method + route, and frontend wiring for all three. The `ActionButton` component also lacks a loading state and doesn't prevent clicks when disabled.

The project follows a strict layered architecture: UI → hooks → api client → adapter → service → BullMQ. All new code must respect this separation.

## Goals / Non-Goals

**Goals:**
- Implement retry, cancel, and promote (delayed → waiting) as functional operations from the Job Details page
- Redesign `ActionButton` to support `isLoading` and properly disable click events
- Conditionally render/enable each button based on the current job state
- Invalidate the job query cache after a successful action so the page self-updates
- Keep all state transitions consistent with what BullMQ allows

**Non-Goals:**
- Bulk actions across multiple jobs
- Confirmation dialogs before destructive actions (out of scope for now)
- Toast/notification system (can be added later; for now the query invalidation is the feedback)
- Undo capability

## Decisions

### 1. Action availability per state

Each action is only enabled for states where BullMQ allows it:

| Action  | Allowed states               |
|---------|------------------------------|
| retry   | `failed`, `completed`        |
| cancel  | `waiting`, `delayed`, `active`, `waiting-children` |
| promote | `delayed`                    |

**Rationale:** The backend already throws `ConflictException` for invalid state transitions. Disabling buttons in the UI prevents unnecessary round-trips and gives immediate feedback.

### 2. `ActionButton` redesign

Current problems:
- `disabled` prop applies CSS class but does not set the HTML `disabled` attribute — clicks still fire
- No loading state
- Icon is too small (14px) and padding is tight

New props:
```ts
interface ActionButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  icon: LucideIcon;
  label: string;
  theme?: "primary" | "foreground" | "error";
  iconClassName?: string;
  isLoading?: boolean;   // shows spinner, disables click
  disabled?: boolean;    // greys out, disables click
}
```

When `isLoading` is true, the icon is replaced with a spinner (`Loader2` with `animate-spin`) and the button is disabled. This keeps the size stable (no layout shift).

**Alternative considered:** Separate `LoadingButton` component. Rejected — `ActionButton` is the only button type in the design; adding a variant is cleaner than a second component.

### 3. `JobActions` component owns action logic

`JobActions.tsx` receives the job and wraps each action using the existing `useAction` hook. `JobDetails` passes the job down and renders `JobActions` — no business logic stays in `JobDetails`.

```
JobDetails
  └── JobActions (retry, cancel, promote handlers + availability logic)
        └── ActionButton (presentational only)
```

**Rationale:** `JobDetails` is already large. Extracting action logic into a focused component is consistent with SRP and the existing file structure (components in `components/`).

### 4. API client calls

Three endpoints used from the frontend:

| Action  | Method | Path                                        |
|---------|--------|---------------------------------------------|
| retry   | POST   | `/api/queues/:queue/jobs/:id/retry`          |
| cancel  | DELETE | `/api/queues/:queue/jobs/:id`               |
| promote | POST   | `/api/queues/:queue/jobs/:id/promote`        |

All return `204 No Content` on success. The frontend calls `queryClient.invalidateQueries` on the job key after success.

### 5. Backend: cancel maps to BullMQ `job.remove()`

BullMQ's `Job.remove()` method deletes the job from the queue regardless of state. This is the correct primitive for a "cancel" operation. No custom state management needed.

**Promote** maps to BullMQ's `Job.promote()` which is only valid for delayed jobs — the service method will throw `ConflictException` if the job isn't delayed.

## Risks / Trade-offs

- **Active job cancel**: BullMQ allows removing an active job, but the worker processing it will not be interrupted — it will finish execution and then fail to update the job state (the job no longer exists). This is acceptable behavior for a dashboard; users should understand that canceling active jobs only removes the record, not the running process. → No mitigation needed, but should be noted in UI tooltip/docs later.
- **Stale UI after cancel**: After canceling a job, the job detail page will show a 404 (job gone). The current `useJob` hook does not handle 404 gracefully. → Mitigation: add a redirect-to-back behavior on 404 in `useJob` or `JobDetails` (can be a follow-up; for now the page will show an error state).
- **Race conditions**: If two users act on the same job simultaneously, the second action may get a `ConflictException`. The `useAction` hook propagates this as an error — no special handling needed.

## Sequence Diagram

```
User clicks "retry"
    │
    ▼
JobActions.handleRetry()
    │ useAction.execute()
    ▼
ApiClient.request(POST, queues/:queue/jobs/:id/retry)
    │
    ▼
Hono adapter → route handler
    │
    ▼
JobService.retry(queueName, jobId)
    │ job.isFailed() / job.isCompleted()
    │ throws ConflictException if not allowed
    ▼
BullMQ job.retry()
    │
    ▼ 204 No Content
ApiClient resolves
    │
    ▼
queryClient.invalidateQueries(["jobs", queue, id])
    │
    ▼
useJob re-fetches → UI shows updated state
```
