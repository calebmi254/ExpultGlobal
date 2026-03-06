# Phase 4 Section 2: Revenue Subsystems Section

## Purpose

This document records the design and implementation details of the **Revenue Subsystems** section on the Expult Global frontend.

It is meant to act as a future reference for:

- the content structure
- the rendering logic
- the layout behavior
- the spacing refinements completed during visual polish
- the animated connector signal added to communicate system interconnectedness

---

## Section Goal

The purpose of this section is to visually explain the main subsystems inside a revenue automation system.

The section is designed to communicate that these subsystems are not isolated tools. They work together as one connected commercial system.

The visual goals were:

1. show five core revenue automation subsystems
2. alternate them left and right around one central vertical spine
3. keep the circles visually prominent
4. connect each subsystem back into one shared system line
5. add a subtle moving signal on the main vertical line to suggest active data flow across the system

---

## Files Involved

### Frontend rendering
- `frontend/src/main.js`

### Frontend styling
- `frontend/src/style.css`

### Documentation added in this phase
- `documentation/phase4_Section2.md`

---

## Content Model

The subsystem content is defined in `frontend/src/main.js` inside the `revenueSubsystems` array.

The current five subsystem entries are:

1. `01` — Lead Capture Systems
2. `02` — Automated Follow-Ups
3. `03` — Sales Funnels
4. `04` — CRM Integration
5. `05` — Payment Automation

Each item contains:

- a number
- a title
- a description

This means future text updates should normally start in the `revenueSubsystems` array rather than in the HTML template.

---

## Rendering Structure

The section is rendered by `renderRevenueSubsystemSection()` in `frontend/src/main.js`.

The section includes:

- a centered heading block
- a short explanatory paragraph
- a `.subsystems-flow` wrapper
- one `.subsystem-step` per subsystem
- a clickable `.subsystem-node` inside each step

Each node contains three visual parts:

1. `.subsystem-copy-block` for title and description
2. `.subsystem-divider` for the short vertical divider next to each circle
3. `.subsystem-circle` for the numbered orb

The steps alternate automatically by index, producing the left-right-left-right-left rhythm.

---

## Interaction Behavior

The section is initialized by `initializeRevenueSubsystemSection()`.

Current behavior includes:

- the first subsystem starts as active
- clicking a subsystem updates the active state
- active and inactive visual states are toggled with CSS classes
- `aria-pressed` is updated for accessibility on each trigger button

This keeps the section visually interactive without introducing a separate content panel.

---

## Core Layout System

The layout is controlled mainly from `frontend/src/style.css`.

### Main spine

The long vertical line connecting the full section is created with:

- `.subsystems-flow::before`

This pseudo-element forms the central vertical system spine.

### Horizontal connectors

Each subsystem step uses:

- `.subsystem-step::before`

These are the horizontal connector lines that tie each step back into the central spine.

### Step alignment

Alternating sides are handled with:

- `.subsystem-step:nth-child(odd)`
- `.subsystem-step:nth-child(even)`

Odd items render on the left side.
Even items render on the right side.

---

## Visual Refinements Completed

The following visual refinements were completed during this section polish.

### 1. Left-side circles moved closer to text and dividers

To reduce the large empty gap on the left side, the odd subsystem node width was tightened.

Implemented rule:

- `.subsystem-step:nth-child(odd) .subsystem-node { width: min(100%, 27rem); }`

Effect:

- circles `01`, `03`, and `05` move leftward
- the gap between the text block, divider, and circle becomes tighter
- the right side remains untouched

### 2. Left-side short dividers normalized

The short vertical divider lines for circles `01`, `03`, and `05` were explicitly matched to the same height used on the right side.

Implemented rule:

- `.subsystem-step:nth-child(odd) .subsystem-divider { height: 3.4rem; }`

Effect:

- the three left-side divider lines visually match the two right-side divider lines
- no right-side layout changes were introduced

---

## Animated Data Signal on the Main Vertical Line

To visually communicate interconnectedness, a small animated signal was added to the central vertical spine.

### Implementation approach

The signal is rendered using:

- `.subsystems-flow::after`

This pseudo-element sits on top of the main vertical line and moves along it.

### Final signal behavior

The signal was intentionally refined to be:

- small rather than bulky
- subtle rather than overpowering
- smooth rather than abrupt
- slow enough to feel like a steady system pulse

### Final signal characteristics

- desktop signal height: `1.45rem`
- mobile signal height: `1.1rem`
- signal width: `0.34rem`
- animation: `subsystemSignal 12.6s cubic-bezier(0.4, 0, 0.2, 1) infinite`

### Animation logic

The `@keyframes subsystemSignal` animation moves the signal:

- from the top of the spine
- down toward the bottom of the spine
- then back into a repeating loop

Opacity is also adjusted during travel so the pulse feels alive without becoming visually heavy.

---

## Motion Accessibility

Reduced-motion support was preserved.

Under `@media (prefers-reduced-motion: reduce)`:

- the circle float animation is disabled
- the moving vertical signal is disabled

This ensures the section remains visually consistent for motion-sensitive users.

---

## Responsive Behavior

On narrower screens (`max-width: 991.98px`), the subsystem section changes from a two-sided timeline into a one-sided stacked flow.

Key responsive behaviors:

- the main vertical line shifts to the left side
- all steps become full-width
- all nodes use the same left-to-right layout
- the horizontal connectors are hidden
- the signal repositions to stay aligned with the moved vertical spine
- the short divider height becomes `2.7rem`

This preserves readability and avoids overcrowding on tablets and mobile screens.

---

## Future Editing Guide

For future updates, use this guide.

### Change subsystem text or order
Edit `revenueSubsystems` in `frontend/src/main.js`.

### Change left-side spacing for circles 1, 3, and 5
Edit the odd-node width rule in `frontend/src/style.css`:

- `.subsystem-step:nth-child(odd) .subsystem-node`

### Change short divider length beside circles
Edit:

- `.subsystem-divider`
- `.subsystem-step:nth-child(odd) .subsystem-divider`

### Change the central spine glow/signal size
Edit:

- `--subsystem-signal-height`
- `.subsystems-flow::after` width, opacity, gradient, and shadow

### Change the signal speed
Edit the animation duration on:

- `.subsystems-flow::after`

### Change signal motion path
Edit:

- `@keyframes subsystemSignal`

### Important caution

Do **not** edit `frontend/dist/` files directly.
Those are generated build artifacts.
Always make source changes in `frontend/src/` and rebuild.

---

## Validation Completed During Section Development

During development of this subsystem section and its refinements, validation included:

- IDE diagnostics on edited CSS
- multiple successful frontend production builds using `npm run build`

These checks confirmed that the subsystem styling changes compiled successfully.

---

## Final Outcome

This subsystem section now provides:

- a clear five-part revenue automation subsystem presentation
- an alternating left/right layout anchored to one shared vertical system line
- improved spacing for the left-side circles and text relationship
- matched short divider lengths on both sides
- a subtle animated data signal moving along the central spine
- responsive behavior for smaller screens
- reduced-motion support for accessibility

This document should be kept as the Phase 4 Section 2 reference for future design updates, refactoring, or UI expansion of the Revenue Subsystems section.