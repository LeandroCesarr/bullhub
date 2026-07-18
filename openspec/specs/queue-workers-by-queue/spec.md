## Purpose

Defines the per-queue workers endpoint that replaced the global `GET /api/workers` route, avoiding N Redis queries and unfiltered flat results.

---

## Requirements

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
