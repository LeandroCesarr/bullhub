## Why

The dashboard has two poor loading states: the initial page shows an empty `<div id="root"></div>` while JS loads (white flash), and the job details page renders a plain `Loading ...` text while data is fetched. These states hurt the perceived quality of the product — especially critical for an open-source library where first impressions matter.

## What Changes

- **Splashscreen**: replace the empty flash in `index.html` with an inline splashscreen featuring the project logo with a stroke-dasharray drawing animation; automatically removed when React mounts
- **Logo animation**: SVG paths animate using `stroke-dashoffset` — a "drawing" effect that traces the logo outline, then fades in the fill
- **JobDetails skeleton**: replace `Loading ...` with a structured skeleton that mirrors the actual page layout — header with title/badge/action buttons, three time boxes, metadata+payload grid
- No public API breaking changes; all changes are purely UI-side

## Capabilities

### New Capabilities

- `splashscreen`: Inline initial loading screen in HTML with an animated logo, automatically removed after React mounts
- `job-details-skeleton`: Structured skeleton for the job details page that mirrors the real layout

### Modified Capabilities

## Impact

- `apps/web/index.html` — add inline splashscreen with styles and SVG logo
- `apps/web/src/components/pages/JobDetails/index.tsx` — replace `Loading ...` with `<JobDetailsSkeleton />`
- `apps/web/src/components/pages/JobDetails/components/JobDetailsSkeleton.tsx` — new component
- Does not affect the public package API
