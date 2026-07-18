## ADDED Requirements

### Requirement: GET /api/queues/:name/workers returns the queue's workers
The system SHALL expose a route that returns only the workers connected to the specified queue.

#### Scenario: Workers present
- **WHEN** GET /api/queues/:name/workers is called with a valid queue
- **THEN** it returns an array of BullhubWorker with id, name, host, startedAt

#### Scenario: Queue with no workers
- **WHEN** GET /api/queues/:name/workers is called and no workers are connected
- **THEN** it returns an empty array with status 200

#### Scenario: Non-existent queue
- **WHEN** GET /api/queues/:name/workers is called with an unregistered queue
- **THEN** it returns a 404 error

## REMOVED Requirements

### Requirement: GET /api/workers returns all workers
**Reason**: Replaced by the scoped route GET /api/queues/:name/workers. The
previous approach did N Redis queries (one per registered queue) and did not
support filtering by queue without client-side processing.
**Migration**: Use GET /api/queues/:name/workers to get workers for a specific queue.