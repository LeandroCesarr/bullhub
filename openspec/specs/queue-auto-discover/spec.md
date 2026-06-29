# Queue Auto-Discover

## Purpose

Describes how Bullhub automatically discovers BullMQ queues from Redis at startup, so callers do not need to enumerate queues explicitly.

## Requirements

### Requirement: Queues are discovered automatically from Redis on startup
When `discover` is set in `BullhubOptions`, the system SHALL scan Redis for existing BullMQ queues and register them automatically, without requiring the caller to list them explicitly.

#### Scenario: Discovery with default prefix
- **WHEN** `createBullhub` is called with `discover: true` and no explicit `queues`
- **THEN** the system scans Redis using the pattern `bull:*:id`
- **AND** all found queue names are available via `GET /api/queues`

#### Scenario: Discovery with custom prefix
- **WHEN** `createBullhub` is called with `discover: { prefix: "myapp" }`
- **THEN** the system scans Redis using the pattern `myapp:*:id`
- **AND** discovered queues are constructed with `prefix: "myapp"`

#### Scenario: No queues found in Redis
- **WHEN** `discover` is enabled and Redis has no matching keys
- **THEN** `createBullhub` resolves successfully with an empty queue list
- **AND** `GET /api/queues` returns an empty array

#### Scenario: Redis scan error during discovery
- **WHEN** Redis is unreachable during the discovery scan
- **THEN** `createBullhub` rejects with a descriptive error

### Requirement: Explicit queues and discovered queues are merged
When both `queues` and `discover` are provided, the system SHALL combine them into a single deduplicated list.

#### Scenario: No overlap between explicit and discovered queues
- **WHEN** `queues: [{ name: "manual" }]` and `discover: true` are both set
- **AND** Redis contains `bull:auto:id`
- **THEN** both `"manual"` and `"auto"` are visible in `GET /api/queues`

#### Scenario: Discovered queue name matches an explicit queue
- **WHEN** `queues: [{ name: "shared", prefix: "custom" }]` and `discover: { prefix: "custom" }` are set
- **AND** Redis contains `custom:shared:id`
- **THEN** `"shared"` appears only once in `GET /api/queues`
- **AND** the explicit entry's configuration takes precedence

### Requirement: `createBullhub` resolves only after discovery completes
The system SHALL ensure discovery is fully resolved before any route handler can be invoked.

#### Scenario: Startup awaits discovery
- **WHEN** `createBullhub` is called with `discover: true`
- **THEN** it returns `Promise<BullhubContext>`
- **AND** the promise resolves only after the Redis scan completes

### Requirement: Backward compatibility — explicit `queues` still works
When `discover` is not set, the system SHALL behave exactly as before.

#### Scenario: Existing callers unaffected
- **WHEN** `createBullhub` is called with only `queues: [{ name: "my-queue" }]`
- **THEN** no Redis scan occurs and the queue list is static

#### Scenario: Neither `queues` nor `discover` provided
- **WHEN** `createBullhub` is called with neither option
- **THEN** the system starts with an empty queue list without error
