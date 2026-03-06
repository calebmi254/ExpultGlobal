# Phase 5: Other Services Section

## Purpose

This document records the full design and implementation work completed for the **Other Services offered** section on the Expult Global landing page.

The goal of this phase was not only to add more service cards, but to make this section feel visually consistent with the premium style already established on the homepage.

This file is meant to document:

- what the section is for
- what content was added
- how it is rendered
- how the visual design was refined
- how the card fade effect was implemented without harming readability
- what responsive behavior was added
- what final validation was completed

---

## Phase Goal

The purpose of this phase was to build a new landing-page section titled **Other Services offered:**.

The section needed to communicate that Expult Global offers additional business systems beyond the main Revenue Automation Systems section.

The required UX goals were:

1. use a **card-based layout**
2. show **6 cards total**
3. arrange them as **2 rows by 3 columns** on desktop
4. make the **6th card** a CTA for custom services
5. give the cards a **fading/disappearing downward feel**
6. keep the **content fully readable** while only the card shell fades
7. match the existing premium Expult Global visual language

---

## Files Involved

### Frontend rendering
- `frontend/src/main.js`

### Frontend styling
- `frontend/src/style.css`

### Documentation added in this phase
- `documentation/phase5_OtherServices.md`

---

## What Was Built

The landing page now includes a dedicated **Other Services offered** section placed directly after the Revenue Subsystems section.

The section now contains 6 cards:

1. `01` — AI-Powered Customer Support
2. `02` — Business Process Automation
3. `03` — High-Converting Websites
4. `04` — Data & Intelligence Systems
5. `05` — Custom Software Development
6. `06` — Freely Contact Us for Custom Services

This gives the page a complete second service block that expands Expult Global's offerings while preserving strong CTA visibility.

---

## Content Model Added

The section content is defined in `frontend/src/main.js`.

Two main structures were added for this phase:

### 1. `serviceCardIcons`

An icon map was added to hold inline SVGs used throughout the service cards.

The icon set includes:

- `support`
- `automation`
- `web`
- `data`
- `custom`
- `cta`
- `feature`
- `value`

This allows each service card to have a distinct icon while keeping the rendering logic consistent.

### 2. `otherServices`

The service card data array was added and expanded to support the richer UI.

Service entries now use fields such as:

- `number`
- `tone`
- `icon`
- `category`
- `title`
- `description`
- `itemLabel`
- `items`
- `businessValue`
- `ctaNote`
- `ctaLabel`

The CTA card uses the same overall structure but switches from a business-value block to a CTA note and contact button.

---

## Rendering Structure

The section is rendered through `renderOtherServicesSection()` in `frontend/src/main.js`.

It was inserted into the landing page immediately after `renderRevenueSubsystemSection()` inside the main app render flow.

The final section structure includes:

- `.services-section`
- `.services-layout`
- `.services-heading`
- `.services-grid`
- `.service-card`
- `.service-card-shell`
- `.service-card-head`
- `.service-card-description`
- `.service-feature-list`
- `.service-card-value`
- `.service-card-footer`

This structure separates the card surface from the content so that the visual fade can affect only the shell and not the text.

---

## Major UI Refinements Completed

The section was not left in a basic first-pass state. It was redesigned to better match the premium visual quality of the rest of the site.

### 1. Reduced left and right padding

To make the cards feel larger and more premium, the section width was expanded.

This was done through `.services-layout`, which narrows the horizontal gutters and allows the card grid to use more of the available screen width.

### 2. Centered heading block

The heading and description were explicitly centered using `.services-heading`.

This gives the section a more intentional presentation and aligns it with the visual rhythm of the rest of the landing page.

### 3. Smaller description text

The service descriptions were reduced in visual dominance so the cards scan better.

This helps the titles, icons, and structured feature rows carry more of the visual hierarchy.

### 4. Icon-led card headers

Each card now begins with a strong header area containing:

- an icon badge
- the service number
- the category label
- the service title

This immediately gives the section more visual identity and makes the cards feel more designed rather than plain text blocks.

### 5. Better examples/includes presentation

The original chip-style approach was replaced with a more structured feature-row layout using `.service-feature-list` and `.service-feature-item`.

This improves scanability and makes the examples feel more integrated into the card design.

### 6. Elegant business value integration

Instead of placing the business value inside another heavy box, it is now integrated as a clean lower section within the card using:

- `.service-card-value`
- `.service-card-value-icon`
- `.service-card-value-copy`

This creates a more refined finish and removes the "boxes on boxes" feeling.

### 7. CTA card refinement

The 6th card was turned into a stronger conversion card with:

- a dedicated CTA icon
- a clearer custom-service message
- use-case bullet rows
- a short CTA note
- a button wired to the existing contact modal

The CTA button was later adjusted so **Freely Contact Us** is centered rather than left-aligned.

---

## Fade Effect Implementation

One of the most important requirements was that the cards should feel like they fade out downward, while the text content remains unaffected.

That was implemented by separating the card into two layers:

### Content layer

All text, icons, labels, and buttons remain in the normal content layer and stay fully readable.

### Shell layer

The visual card surface is handled by `.service-card-shell` and its pseudo-elements.

The shell uses:

- gradients
- glow accents
- masked opacity
- border and shadow overlays

The bottom fade is controlled through mask gradients so the card background visually dissolves downward without reducing text clarity.

### Stronger fade on the second row

Cards in the lower row use a stronger shell fade through the `nth-child(n + 4)` rule.

This creates the intended progressive fade effect across the grid while keeping the CTA card visually strong enough to remain a conversion anchor.

---

## Tone System Added

A tone-based color system was introduced so different cards can have subtle accent variation while remaining within the same warm premium brand family.

Tone classes added include:

- `.service-card-support`
- `.service-card-automation`
- `.service-card-web`
- `.service-card-data`
- `.service-card-custom`
- `.service-card-cta`

These classes control accent glow and shell coloring through CSS custom properties.

---

## Responsive Behavior

The section was built to remain usable across desktop, tablet, and mobile.

### Desktop
- `3` columns
- `2` rows

### Tablet
- `2` columns

### Mobile
- `1` column

Additional mobile refinements were added so the redesign still behaves correctly on small screens, including:

- single-column feature lists
- adjusted spacing
- updated shell fade values
- narrower icon badge sizing
- full-width CTA button behavior on mobile

---

## Branding and Copy Updates Completed

As part of finishing this section, the service copy inside the new section was updated from **Expult Tech** to **Expult Global**.

This includes:

- the service descriptions
- the CTA card description
- the section intro paragraph
- the section accessibility label

This keeps the section consistent with the current brand naming.

---

## Interaction Behavior

The CTA card button opens the existing contact modal using the already established Bootstrap modal pattern.

The button uses:

- `data-bs-toggle="modal"`
- `data-bs-target="#contactModal"`

This means the Other Services section reuses the existing contact workflow rather than adding duplicate contact logic.

---

## Validation Completed

After implementation and refinement, the section was validated in the frontend workflow.

Validation performed:

- editor diagnostics on `frontend/src/main.js`
- editor diagnostics on `frontend/src/style.css`
- production frontend build with `npm run build`

Final verified result:

- no diagnostics errors in the modified files
- Vite production build completed successfully

This confirms the section is integrated cleanly into the current frontend build.

---

## Final Outcome

Phase 5 successfully delivered a premium **Other Services offered** section that:

- expands the landing page service narrative
- adds 6 polished service cards
- includes a dedicated CTA card for custom services
- uses icons to improve visual identity
- reduces gutter space so the cards feel larger
- centers the heading for stronger section presentation
- integrates business value more elegantly
- preserves readable content while the card shell fades downward
- remains responsive across desktop, tablet, and mobile
- keeps branding aligned to **Expult Global**

This section is now complete and documented as the next major landing-page phase after the Revenue Subsystems section.