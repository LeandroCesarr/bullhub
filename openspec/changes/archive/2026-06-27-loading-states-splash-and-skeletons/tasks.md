## 1. Types and Interfaces

- [x] 1.1 Define the `JobDetailsSkeleton` component in a new file `apps/web/src/components/pages/JobDetails/components/JobDetailsSkeleton.tsx` — export only the component signature with no props; do not implement any JSX yet
  - **Acceptance:** File exists, TypeScript compiles, `export const JobDetailsSkeleton: FC = () => null` as placeholder
  - **Waiting for validation before continuing**

## 2. Splashscreen — Styles and Animation

- [x] 2.1 Add an inline `<style>` block to `apps/web/index.html` defining: `#splash` fullscreen centered layout (position fixed, flex, dark background `#0d0e12`), the `@keyframes bullhub-draw` animation (stroke-dashoffset from 1200 to 0 at 80%, then fill-opacity from 0 to 1 at 100%), and the `.bullhub-logo path` rule applying stroke, stroke-dasharray, fill, and animation
  - **Acceptance:** With JS disabled in the browser, the dark fullscreen background and animation keyframes are defined in the page source
  - **Waiting for validation before continuing**

## 3. Splashscreen — Logo Markup

- [x] 3.1 Insert the project SVG logo inline inside `<div id="splash">` within `#root` in `index.html`; apply class `bullhub-logo` to the `<svg>`, set `width="80"`, remove any hardcoded `fill` attributes from the SVG paths so the CSS controls color
  - **Acceptance:** Opening the page, the logo animates — paths are drawn stroke-first, then fill fades in; the splash disappears once React mounts
  - **Waiting for validation before continuing**

## 4. JobDetails Skeleton — Header

- [x] 4.1 Implement the header section of `JobDetailsSkeleton`: a flex row with title placeholder (`Skeleton` h-7 w-48), status badge placeholder (`Skeleton` h-5 w-16 rounded-full), metadata line placeholder (`Skeleton` h-3 w-64), and 3 button-shaped placeholders (`Skeleton` h-8 w-20 rounded-md) aligned to the right
  - **Acceptance:** Skeleton header visually matches the layout of the real `JobDetails` header
  - **Waiting for validation before continuing**

## 5. JobDetails Skeleton — Time Grid

- [x] 5.1 Add the 3-column time grid to `JobDetailsSkeleton` using `Box.Root` / `Box.Title` / `Box.Content` with real labels ("created", "finished at", "duration") and `Skeleton` blocks as values
  - **Acceptance:** Grid of 3 equal columns with labeled boxes containing skeleton placeholders; proportions match the real layout
  - **Waiting for validation before continuing**

## 6. JobDetails Skeleton — Metadata and Payload Grid

- [x] 6.1 Add the 2-column grid to `JobDetailsSkeleton`: left box (metadata) uses a 2-column sub-grid with 6 `Skeleton` label+value pairs; right box (payload) has a single tall `Skeleton` block filling the available height
  - **Acceptance:** Grid of 2 equal columns; metadata has 6 labeled rows; payload has a solid skeleton block
  - **Waiting for validation before continuing**

## 7. Integration

- [x] 7.1 Replace `return <>Loading ...</>` in `apps/web/src/components/pages/JobDetails/index.tsx` with `return <JobDetailsSkeleton />` and add the import
  - **Acceptance:** Navigating to a job details URL shows the skeleton during the first fetch; content renders without layout shift once data arrives
  - **Waiting for validation before continuing**
