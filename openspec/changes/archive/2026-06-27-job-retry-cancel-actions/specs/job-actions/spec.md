## ADDED Requirements

### Requirement: Retry action

The system SHALL allow a user to retry a job that is in `failed` or `completed` state by clicking a "retry" button on the Job Details page. The backend SHALL re-enqueue the job via BullMQ's `job.retry()`. On success, the job detail view SHALL refresh to reflect the new state.

#### Scenario: Retry a failed job

- **WHEN** the job status is `failed`
- **THEN** the retry button SHALL be enabled
- **AND WHEN** the user clicks retry
- **THEN** a POST request SHALL be sent to `/api/queues/:queue/jobs/:id/retry`
- **AND** the response status SHALL be 204
- **AND** the job query SHALL be invalidated so the UI re-fetches the updated state

#### Scenario: Retry a completed job

- **WHEN** the job status is `completed`
- **THEN** the retry button SHALL be enabled
- **AND WHEN** the user clicks retry
- **THEN** a POST request SHALL be sent to `/api/queues/:queue/jobs/:id/retry`
- **AND** the response status SHALL be 204

#### Scenario: Retry button disabled for non-retryable states

- **WHEN** the job status is `waiting`, `active`, or `delayed`
- **THEN** the retry button SHALL be disabled and non-clickable

#### Scenario: Retry while action is in-flight

- **WHEN** the user has clicked retry and the request is pending
- **THEN** the retry button SHALL show a loading spinner and be non-clickable

---

### Requirement: Cancel action

The system SHALL allow a user to cancel a job in `waiting`, `delayed`, `active`, or `waiting-children` state by clicking a "cancel" button. The backend SHALL remove the job from the queue via BullMQ's `job.remove()`. On success, the job detail view SHALL refresh.

#### Scenario: Cancel a waiting job

- **WHEN** the job status is `waiting`
- **THEN** the cancel button SHALL be enabled
- **AND WHEN** the user clicks cancel
- **THEN** a DELETE request SHALL be sent to `/api/queues/:queue/jobs/:id`
- **AND** the response status SHALL be 204
- **AND** the job query SHALL be invalidated

#### Scenario: Cancel an active job

- **WHEN** the job status is `active`
- **THEN** the cancel button SHALL be enabled
- **AND WHEN** the user clicks cancel
- **THEN** a DELETE request SHALL be sent to `/api/queues/:queue/jobs/:id`
- **AND** the response status SHALL be 204

#### Scenario: Cancel a delayed job

- **WHEN** the job status is `delayed`
- **THEN** the cancel button SHALL be enabled

#### Scenario: Cancel button disabled for terminal states

- **WHEN** the job status is `completed` or `failed`
- **THEN** the cancel button SHALL be disabled and non-clickable

#### Scenario: Cancel while action is in-flight

- **WHEN** the user has clicked cancel and the request is pending
- **THEN** the cancel button SHALL show a loading spinner and be non-clickable

---

### Requirement: Promote action

The system SHALL allow a user to promote a `delayed` job to the `waiting` state by clicking a "promote" button. The backend SHALL call BullMQ's `job.promote()`. On success, the job detail view SHALL refresh.

#### Scenario: Promote a delayed job

- **WHEN** the job status is `delayed`
- **THEN** the promote button SHALL be enabled
- **AND WHEN** the user clicks promote
- **THEN** a POST request SHALL be sent to `/api/queues/:queue/jobs/:id/promote`
- **AND** the response status SHALL be 204
- **AND** the job query SHALL be invalidated

#### Scenario: Promote button disabled for non-delayed states

- **WHEN** the job status is anything other than `delayed`
- **THEN** the promote button SHALL be disabled and non-clickable

#### Scenario: Promote while action is in-flight

- **WHEN** the user has clicked promote and the request is pending
- **THEN** the promote button SHALL show a loading spinner and be non-clickable

#### Scenario: Backend rejects promote for non-delayed job

- **WHEN** a POST request is sent to `/api/queues/:queue/jobs/:id/promote` for a non-delayed job
- **THEN** the response status SHALL be 409
- **AND** the response body SHALL contain an error message

---

### Requirement: ActionButton loading and disabled states

The `ActionButton` component SHALL support `isLoading` and `disabled` props that both prevent click events and provide distinct visual feedback.

#### Scenario: Loading state prevents interaction

- **WHEN** `isLoading` is `true`
- **THEN** the button SHALL render a spinner in place of the icon
- **AND** the HTML `disabled` attribute SHALL be set on the button element
- **AND** user clicks SHALL not fire the `onClick` handler

#### Scenario: Disabled state prevents interaction

- **WHEN** `disabled` is `true`
- **THEN** the button SHALL apply a muted visual style
- **AND** the HTML `disabled` attribute SHALL be set on the button element
- **AND** user clicks SHALL not fire the `onClick` handler

#### Scenario: Default enabled state

- **WHEN** neither `isLoading` nor `disabled` is `true`
- **THEN** the button SHALL be fully interactive and show its icon with label
