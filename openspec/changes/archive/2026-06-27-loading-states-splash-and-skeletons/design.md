## Context

The project uses Vite + React with Tailwind v4 and `tw-animate-css`. The logo exists as an SVG at `src/assets/logo.svg` — it is a complex multi-path illustration. The theme is dark-only: `--background: oklch(0.13 0.01 260)` and `--primary: oklch(0.85 0.18 130)` (green). The `Skeleton` component and list skeletons (`JobsListSkeleton`, `QueuesListSkeleton`) are already established patterns in the codebase.

The `index.html` currently has a bare `<div id="root"></div>`. The splashscreen must be inline (no external JS) and disappear automatically once React mounts.

## Goals / Non-Goals

**Goals:**
- Inline splashscreen that appears on the very first paint, before the JS bundle loads
- SVG stroke-dasharray animation: paths are "drawn" progressively, then fill fades in
- JobDetails skeleton that mirrors the exact page structure to avoid layout shift
- Reuse the existing `Skeleton` component

**Non-Goals:**
- React-controlled splashscreen (would cause inverse flash: blank → splash)
- Global loading bars or route progress indicators
- Light theme support (project is dark-only)
- Complex animation libraries or dependencies

## Decisions

### 1. Splashscreen inline in HTML, removed by React's render

**Approach**: the splashscreen lives inside `<div id="root">` as its initial content. When React calls `createRoot(...).render(...)`, the `#root` content is replaced automatically — the splash disappears with no extra removal code.

```html
<div id="root">
  <div id="splash"><!-- inline SVG + styles --></div>
</div>
```

**Why inline HTML?** Avoids FOUC. The splash renders on the very first paint before any JS loads. A React component fallback would cause blank → splash flash, which is worse.

**Discarded alternative**: `React.Suspense` fallback — only works after the bundle loads; does not solve the initial blank flash.

### 2. Stroke-dasharray drawing animation for the logo

The SVG paths receive a stroke-drawing animation using CSS keyframes:

```css
@keyframes bullhub-draw {
  from { stroke-dashoffset: 1200; fill-opacity: 0; }
  80%  { stroke-dashoffset: 0;    fill-opacity: 0; }
  to   { stroke-dashoffset: 0;    fill-opacity: 1; }
}
```

Each `<path>` is styled with:
```css
stroke: oklch(0.85 0.18 130);  /* primary */
stroke-dasharray: 1200;
fill: oklch(0.85 0.18 130);
fill-opacity: 0;
animation: bullhub-draw 1.8s ease-in-out forwards;
```

The value `1200` is intentionally large to cover the longest path in the logo. Paths shorter than `1200` still animate correctly — excess dasharray has no visual effect.

**Discarded alternative**: animating only `opacity` (fade-in) — too subtle, doesn't leverage the logo's detailed linework. The stroke-draw effect adds visual interest that complements the logo's illustration style.

**Why not per-path lengths?** Computing exact path lengths requires JavaScript (`path.getTotalLength()`), which defeats the purpose of a pre-JS splashscreen. Using a uniform large value is the standard CSS-only approach.

### 3. JobDetailsSkeleton as a standalone component

Pattern already established: `JobsListSkeleton` and `QueuesListSkeleton` each live in their section's `components/` directory.

```
JobDetails/index.tsx
  └── if (isFetching && !job) → <JobDetailsSkeleton />
  └── else → real content
```

The skeleton mirrors the exact DOM structure of `JobDetails`:

| Section | Skeleton approach |
|---------|------------------|
| Title + badge | `Skeleton` h-7 w-48 + h-5 w-16 |
| Metadata line | `Skeleton` h-3 w-64 |
| Action buttons | 3 × `Skeleton` h-8 w-20 rounded-md |
| 3-col time grid | `Box.Root` with `Box.Title` (real label) + `Skeleton` content |
| Metadata box | `Box.Root` with 6 label+skeleton pairs in 2-col grid |
| Payload box | `Box.Root` with tall `Skeleton` block |

Using real `Box.Root` / `Box.Title` wrappers ensures the spacing matches the real layout exactly.

## Risks / Trade-offs

- **Skeleton drift**: if the `JobDetails` layout changes, the skeleton may become misaligned. → Mitigation: skeleton lives in the same `components/` directory, making it easy to spot and update together.
- **Stuck splash on bundle error**: if React fails to mount (JS error), the splash stays visible forever. → Acceptable for a developer dashboard; not a critical production surface.
- **SVG inline size**: the logo SVG is ~3KB — negligible impact on the HTML initial size.
- **stroke-dasharray value**: `1200` is a heuristic. If the logo is ever resized significantly, this may need adjustment. → Low risk since the logo is unlikely to change.

## Sequence

```
Browser loads index.html
  │
  ├── First paint → splash visible (logo stroke-drawing animation starts)
  │
  ├── ~1.8s → stroke drawing completes, fill fades in
  │
  ├── JS bundle loads + React mounts
  │
  └── createRoot().render() replaces #root content → splash gone, app visible
```
