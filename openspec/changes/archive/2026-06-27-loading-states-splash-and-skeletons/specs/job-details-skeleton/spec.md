## ADDED Requirements

### Requirement: Skeleton replaces "Loading ..." text in JobDetails

The system SHALL display a structured skeleton in place of the `Loading ...` text while job data is being fetched for the first time.

#### Scenario: Skeleton shown on initial load

- **WHEN** `isFetching` is `true` AND `job` is `undefined`
- **THEN** the `JobDetailsSkeleton` component SHALL be rendered instead of the real content
- **AND** the plain text `Loading ...` SHALL NOT be shown

#### Scenario: Skeleton not shown during background refetch

- **WHEN** `isFetching` is `true` BUT `job` already has data
- **THEN** the real content SHALL remain visible
- **AND** the skeleton SHALL NOT replace the existing content

---

### Requirement: Skeleton mirrors the JobDetails page layout

The `JobDetailsSkeleton` SHALL replicate the visual structure of the job details page to avoid layout shift when real data loads.

#### Scenario: Header section with title, badge, and actions

- **WHEN** the skeleton is displayed
- **THEN** it SHALL contain placeholders for: job title (h1-sized block), status badge, metadata line (id · queue · worker)
- **AND** it SHALL contain 3 button-shaped placeholders in place of the retry, promote, and cancel action buttons

#### Scenario: Three-column time grid

- **WHEN** the skeleton is displayed
- **THEN** it SHALL contain a 3-column grid with `Box.Root` wrappers, each having a real `Box.Title` label and a `Skeleton` placeholder for the value

#### Scenario: Two-column metadata and payload grid

- **WHEN** the skeleton is displayed
- **THEN** it SHALL contain a 2-column grid: one box with 6 label+skeleton pairs in a 2-column sub-grid (mirroring metadata fields), and one box with a tall skeleton block (mirroring the JSON payload viewer)

#### Scenario: Reuses existing Skeleton component

- **WHEN** `JobDetailsSkeleton` is implemented
- **THEN** it SHALL use the `Skeleton` component from `@/components/Skeleton.tsx`
- **AND** it SHALL follow the same visual pattern as `JobsListSkeleton` and `QueuesListSkeleton`
