## Purpose

Defines the dedicated queue detail page at `/queues/:queueName`, its Overview/Workers/Jobs tabs, and the sidebar navigation that leads into it.

---

## Requirements

### Requirement: /queues/:queueName route exists and displays the detail page
The system SHALL render the QueueDetailPage when navigating to /queues/:queueName.

#### Scenario: Navigation via QueuesListItem
- **WHEN** the user clicks a queue list item on the dashboard
- **THEN** they are redirected to the matching /queues/:queueName

#### Scenario: Direct URL navigation
- **WHEN** the user accesses /queues/:queueName directly
- **THEN** the page loads with the queue name in the header

#### Scenario: Non-existent queue
- **WHEN** the queueName in the URL doesn't match any registered queue
- **THEN** the page displays a queue-not-found message

### Requirement: Page displays queue status (active/paused)
The system SHALL display a visible status badge indicating whether the queue is paused or active.

#### Scenario: Active queue
- **WHEN** the queue is not paused
- **THEN** the badge displays "active" with a success color

#### Scenario: Paused queue
- **WHEN** the queue is paused
- **THEN** the badge prominently displays "paused" with a warning color

### Requirement: Overview tab displays job breakdown by state
The system SHALL display cards with individual counts per state: active, waiting, delayed, failed, completed.

#### Scenario: Queue with jobs in multiple states
- **WHEN** the Overview tab is active
- **THEN** cards for active, waiting, delayed, failed, and completed are displayed with their counts

#### Scenario: Empty queue
- **WHEN** all states have a count of zero
- **THEN** the cards display zero without error

### Requirement: Overview tab displays activity chart scoped to the queue
The system SHALL display the ActivityMetricsChart with data from GET /api/queues/:name/metrics.

#### Scenario: Data available
- **WHEN** the Overview tab loads
- **THEN** the chart displays completed and failed counts for the last 24h for that specific queue

### Requirement: Workers tab displays the queue's workers
The system SHALL display the worker list via GET /api/queues/:name/workers.

#### Scenario: Active workers
- **WHEN** the Workers tab is selected
- **THEN** it lists workers with name, host, and uptime

#### Scenario: No workers
- **WHEN** no worker is connected to the queue
- **THEN** it displays a "No workers" message

### Requirement: Jobs tab displays the queue's job list
The system SHALL display the JobsList pre-filtered by the queue, without QueueSelector.

#### Scenario: Jobs available
- **WHEN** the Jobs tab is selected
- **THEN** it displays the queue's jobs with pagination and state filtering

### Requirement: Sidebar displays a link to Queues
The system SHALL display the "Queues" item in the sidebar as a navigable link.

#### Scenario: Active item in the sidebar
- **WHEN** the user is on /queues/:queueName
- **THEN** the Queues item in the sidebar is in the active state
