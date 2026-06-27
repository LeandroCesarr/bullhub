## 1. Types and Interfaces

- [x] 1.1 Add `isLoading` prop to `ActionButtonProps` in `ActionButton.tsx` and update the `button` tv variant to include a `loading` state; do not change component behavior yet — types only
  - **Acceptance:** TypeScript compiles with no errors; `isLoading?: boolean` is present in the interface; no runtime behavior changed
  - **Waiting for validation before continuing**

## 2. ActionButton Redesign

- [x] 2.1 Fix `disabled` prop: set the HTML `disabled` attribute on `<button>` so clicks are blocked at the browser level (currently only a CSS class is applied)
  - **Acceptance:** Clicking a disabled `ActionButton` does not fire `onClick`; the button renders with `disabled` attribute in the DOM
  - **Waiting for validation before continuing**

- [x] 2.2 Implement `isLoading` behavior: replace icon with `Loader2` spinner (`animate-spin`) when `isLoading` is true; also set `disabled` attribute; keep button width stable to avoid layout shift
  - **Acceptance:** Button shows spinner when `isLoading={true}`; click is blocked; layout does not shift between states
  - **Waiting for validation before continuing**

- [x] 2.3 Improve button visuals: increase icon size from 14px to 16px; adjust padding so the button feels substantial; ensure `error` and `foreground` themes still look correct
  - **Acceptance:** Buttons are visually consistent and larger than before; all three themes render correctly
  - **Waiting for validation before continuing**

## 3. Backend — Service Methods

- [x] 3.1 Add `cancel(queueName: string, jobId: string): Promise<void>` to `JobService` — fetches the job and calls `job.remove()`
  - **Acceptance:** Method exists, TypeScript compiles; calling it on a non-existent job throws `NotFoundException`
  - **Waiting for validation before continuing**

- [x] 3.2 Add `promote(queueName: string, jobId: string): Promise<void>` to `JobService` — fetches the job, verifies it is delayed (throws `ConflictException` otherwise), and calls `job.promote()`
  - **Acceptance:** Method exists; non-delayed job throws `ConflictException` with status 409; TypeScript compiles with no errors
  - **Waiting for validation before continuing**

## 4. Backend — API Routes

- [x] 4.1 Register `DELETE /api/queues/:queue/jobs/:id` in `bullhub.module.ts` wired to `job.cancel()`, returning `ApiResponse.noContent()`
  - **Acceptance:** Route exists in the routes array; a DELETE request to a valid job returns 204; a missing job returns 404
  - **Waiting for validation before continuing**

- [x] 4.2 Register `POST /api/queues/:queue/jobs/:id/promote` in `bullhub.module.ts` wired to `job.promote()`, returning `ApiResponse.noContent()`
  - **Acceptance:** Route exists; a POST to a delayed job returns 204; a POST to a non-delayed job returns 409
  - **Waiting for validation before continuing**

## 5. Frontend — JobActions Component

- [x] 5.1 Implement `JobActions.tsx`: accepts a `job: BullhubJob` prop and renders three `ActionButton`s (retry, promote, cancel) with correct `theme` and icon for each
  - **Acceptance:** Component renders without errors; buttons are visible on the page; no logic wired yet
  - **Waiting for validation before continuing**

- [x] 5.2 Wire the retry button using `useAction`: calls `POST /api/queues/:queue/jobs/:id/retry`, passes `isPending` to `isLoading`, invalidates the job query on success
  - **Acceptance:** Clicking retry calls the API; button shows spinner during request; page re-fetches job after success
  - **Waiting for validation before continuing**

- [x] 5.3 Wire the cancel button using `useAction`: calls `DELETE /api/queues/:queue/jobs/:id`, passes `isPending` to `isLoading`, invalidates the job query on success
  - **Acceptance:** Clicking cancel calls the API; button shows spinner during request; page re-fetches after success
  - **Waiting for validation before continuing**

- [x] 5.4 Wire the promote button using `useAction`: calls `POST /api/queues/:queue/jobs/:id/promote`, passes `isPending` to `isLoading`, invalidates the job query on success
  - **Acceptance:** Clicking promote calls the API; button shows spinner during request; page re-fetches after success
  - **Waiting for validation before continuing**

- [x] 5.5 Apply state-based availability rules: retry enabled for `failed`/`completed`; cancel enabled for `waiting`/`delayed`/`active`/`waiting-children`; promote enabled for `delayed` only — pass `disabled` accordingly
  - **Acceptance:** Each button is disabled (non-clickable, visually muted) for states where the action is not allowed; enabled otherwise
  - **Waiting for validation before continuing**

## 6. Frontend — JobDetails Integration

- [x] 6.1 Remove the three empty handler stubs from `JobDetails` and replace the inline `ActionButton` block with `<JobActions job={job} />`
  - **Acceptance:** JobDetails renders correctly; all three buttons appear and are functional; no TypeScript errors
  - **Waiting for validation before continuing**
