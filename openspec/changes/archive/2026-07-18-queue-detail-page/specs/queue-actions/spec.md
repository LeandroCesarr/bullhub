## ADDED Requirements

### Requirement: User can pause a queue
The system SHALL pause the queue via POST /api/queues/:name/pause and update the status in the UI.

#### Scenario: Pause an active queue
- **WHEN** the user clicks "Pause" while the queue is active
- **THEN** POST /api/queues/:name/pause is called
- **AND** the status badge changes to "paused"
- **AND** the Pause button becomes disabled and Resume becomes enabled

#### Scenario: Pause an already paused queue
- **WHEN** the queue is already paused
- **THEN** the Pause button is disabled

#### Scenario: Error while pausing
- **WHEN** POST /api/queues/:name/pause returns an error
- **THEN** the queue status does not change and the error is visible to the user

### Requirement: User can resume a paused queue
The system SHALL resume the queue via POST /api/queues/:name/resume.

#### Scenario: Resume a paused queue
- **WHEN** the user clicks "Resume" while the queue is paused
- **THEN** POST /api/queues/:name/resume is called
- **AND** the status badge changes to "active"
- **AND** the Resume button becomes disabled and Pause becomes enabled

#### Scenario: Resume an already active queue
- **WHEN** the queue is already active
- **THEN** the Resume button is disabled

### Requirement: User can drain waiting jobs from the queue
The system SHALL remove all waiting jobs via DELETE /api/queues/:name/drain,
requiring confirmation before executing.

#### Scenario: Drain with confirmation
- **WHEN** the user clicks "Drain" and confirms the action
- **THEN** DELETE /api/queues/:name/drain is called
- **AND** the waiting count is updated to zero

#### Scenario: Drain cancelled by the user
- **WHEN** the user clicks "Drain" but cancels the confirmation
- **THEN** no request is made and the queue remains unchanged

#### Scenario: Queue with no waiting jobs
- **WHEN** the user clicks "Drain" while waiting equals zero
- **THEN** the action executes without error and the count remains zero