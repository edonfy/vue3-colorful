# Color Picker Visual Redesign Design

**Date:** 2026-03-30

**Status:** Ready for user review

**Goal**

Redesign the color picker's visual language and interaction model around a lighter, more focused default experience while preserving the component library's professional tool feel and existing feature surface.

## Problem

The current picker styling already supports customization and multiple feature sections, but the default experience feels heavier than necessary for a library default skin:

- the main picker body competes visually with input, presets, and recent-color sections
- the pointer, borders, and popover chrome read as more prominent than the selected color itself
- advanced capabilities are always structurally present, even when the user primarily wants to pick a color quickly
- inline and popover modes are consistent, but they do not yet express a strong "focused default, advanced on demand" hierarchy

The redesign should make the picker feel more intentional and modern without turning it into a marketing mockup or removing existing capabilities.

## Chosen Direction

The selected direction is:

- visual base: `Precision Console`
- adjustment: lighter and less dense than the current console-like direction
- default information architecture: `Focus Frame`

This means the new default should feel precise and professional, but with reduced chrome and stronger emphasis on the act of picking a color. Advanced controls remain available, but move into a secondary details layer instead of competing with the primary flow.

## Design

### Primary hierarchy

The default picker layout should resolve into four layers:

1. a very light top edge or header treatment
2. a dominant saturation canvas
3. a compact control rail area for hue and optional alpha
4. a result capsule row that shows the current value and opens secondary details

The first screenful should make the user's task obvious: choose a color, see the result, and optionally expand for precision editing.

### Main picking surface

The saturation area becomes the visual anchor of the component.

It should:

- be slightly larger and visually calmer than the current default
- use softer borders and less obvious container framing
- keep rounded geometry that feels refined rather than playful
- use a more precise pointer treatment, closer to a fine ring cursor than a thick floating disc

The pointer should still remain touch-friendly, but it should visually communicate control and accuracy before decoration.

### Control rails

Hue and alpha should sit close to the saturation surface as compact rails rather than heavy secondary bars.

The rails should:

- remain easy to drag on desktop and touch devices
- read as calibration controls that support the main canvas
- use thinner visual chrome while preserving actual interaction targets
- stay stacked below the canvas in the default layout

When alpha is not shown, the remaining hue rail should still feel balanced rather than oversized.

### Result capsule

The bottom row of the default state should focus on confirmation, not configuration.

It should include:

- a compact live swatch
- the current value, prioritizing the main display format
- a subtle affordance for opening the secondary details layer

This row acts as the default handoff between direct manipulation and precise editing.

### Secondary details layer

The redesign keeps existing capabilities, but collects them into a lighter secondary layer.

The details layer should contain:

- the main text input
- clear action when enabled
- preset colors
- recent colors when enabled

This layer should feel like an extension of the picker, not a separate settings panel. It should visually belong to the same component while clearly reading as secondary.

### Input design

The input becomes a precision tool, not a competing block-level feature.

It should:

- favor a single primary text field presentation
- use subdued uppercase labels and compact spacing
- feel closer to a command field than a generic form control
- show invalid state with restrained emphasis

The invalid-state treatment should remain accessible and discoverable, but it should not collapse the quiet visual rhythm of the component.

### Presets and recent colors

Preset and recent-color sections should be redesigned as lightweight sampling strips inside the secondary layer.

They should:

- use smaller, tighter swatches than the current layout
- keep a clear selected ring without a heavy active state
- visually rank presets above recent colors
- preserve click confidence through brief but restrained confirmation feedback

These sections should support quick reuse without becoming the first thing the user sees.

### Motion and interaction feedback

Motion should support hierarchy and state clarity rather than spectacle.

The redesign should use:

- a soft entrance for the picker body
- short slide-and-fade transitions for the details layer
- minimal pointer scaling, favoring precision over bounce
- concise selection feedback for swatches and buttons

Hover, focus, active, disabled, and readonly states should all remain visibly distinct, especially because the default chrome is intentionally lighter.

### Inline and popover behavior

Inline and popover variants should share one design language.

The difference should be in emphasis, not architecture:

- inline mode should feel like a lightweight tool card
- popover mode should use slightly stronger shadow and boundary definition
- both modes should keep the same internal hierarchy and details-layer behavior

The goal is for users to immediately recognize them as the same component in different contexts.

## Visual Tokens

The design work in `colorful.pen` should define and demonstrate a small token set for the redesign:

- surface colors
- subtle borders
- elevation and shadow
- canvas ring and pointer treatment
- rail styling
- radius scale
- spacing rhythm
- type hierarchy for labels, values, and metadata

These tokens are meant to guide future CSS variable updates without turning the design file into a full implementation spec.

## Accessibility and State Coverage

The redesign must remain implementation-friendly for existing component behavior.

The design file should explicitly show or call out:

- default state
- hover and focus-visible emphasis
- active drag feedback
- disabled state
- readonly state
- invalid input state
- popover open state
- details expanded state

The lighter visual direction must not reduce clarity for keyboard users or low-contrast states.

## `colorful.pen` Deliverables

The design file should contain at least these frames:

1. `Default / Inline`
   Shows the focused default picker in its inline presentation.

2. `Default / Popover`
   Shows the same design language inside the popover shell and trigger relationship.

3. `Expanded Details`
   Shows the secondary details layer with input, presets, recent colors, and clear action.

4. `Interaction Callouts`
   Annotates the key transitions and state changes:
   default to details, pointer behavior, slider behavior, swatch selection, focus, hover, disabled, and readonly.

5. `Style Tokens`
   Captures the visual foundation for surfaces, borders, shadows, rails, rings, spacing, and typography.

An optional dark reference state is allowed, but the primary design direction should be optimized for the light default theme.

## Non-Goals

This redesign does not change:

- the supported color models
- the existing prop-driven feature surface such as `showInput`, `showRecent`, `presets`, `clearable`, and `showAlpha`
- the component architecture in code
- the library's TSX-only implementation constraints

This is a visual and interaction redesign intended to remain compatible with the current product structure.

## Validation

The redesign is successful when:

- the first glance emphasizes picking and confirming a color rather than managing settings
- the default UI feels lighter than the current component while still reading as a professional tool
- advanced controls remain available without dominating the default state
- inline and popover variants clearly belong to the same visual system
- the `colorful.pen` file is detailed enough to guide implementation and discussion without requiring code inspection
