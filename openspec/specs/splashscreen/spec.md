# Spec: Splashscreen

## Purpose

Defines the splashscreen displayed on the browser's first paint before the JavaScript bundle loads, eliminating the blank-screen flash and providing an animated logo introduction using inline HTML and CSS only.

## Requirements

### Requirement: Splashscreen renders before React mounts

The system SHALL display a splashscreen with the project logo on the browser's first paint, before the JavaScript bundle loads, eliminating the blank-screen flash.

#### Scenario: First paint shows splashscreen

- **WHEN** the browser loads `index.html`
- **THEN** the splashscreen SHALL be visible immediately without depending on the JS bundle
- **AND** the background SHALL use the theme background color (`oklch(0.13 0.01 260)`)
- **AND** the logo SHALL be displayed centered on the screen

#### Scenario: Splashscreen disappears after React mounts

- **WHEN** React mounts and replaces the content of `#root`
- **THEN** the splashscreen SHALL disappear with no explicit removal code
- **AND** the transition SHALL occur without flickering

#### Scenario: Splashscreen works without external JS

- **WHEN** the JS bundle has not yet loaded
- **THEN** the splashscreen SHALL render using only inline HTML and CSS
- **AND** no external file or runtime dependency SHALL be required

---

### Requirement: Logo stroke-drawing animation

The project logo SHALL animate using a CSS stroke-dasharray drawing effect during the splashscreen, tracing the SVG path outlines progressively and then fading in the fill.

#### Scenario: Stroke drawing animation plays on load

- **WHEN** the splashscreen is displayed
- **THEN** the SVG paths SHALL animate from `stroke-dashoffset: <full-length>` to `stroke-dashoffset: 0`
- **AND** the fill SHALL fade in after the stroke drawing completes (at ~80% of animation duration)
- **AND** the total animation duration SHALL be between 1.5s and 2s

#### Scenario: Animation uses primary theme color

- **WHEN** the logo animation plays
- **THEN** both stroke and fill SHALL use the primary color (`oklch(0.85 0.18 130)`)

#### Scenario: Animation defined as inline CSS keyframes

- **WHEN** the JS bundle is not available
- **THEN** the animation SHALL work using only `@keyframes` defined in an inline `<style>` tag in the HTML
- **AND** no dependency on Tailwind, tw-animate-css, or any JS library SHALL be required
