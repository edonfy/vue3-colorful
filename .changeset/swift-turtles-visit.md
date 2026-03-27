---
'vue3-colorful': minor
---

Remove the `vue3-colorful/tailwind` subpath and move `ColorPickerPopover` to
`vue3-colorful/popover` so the root entry stays focused on the core picker bundle.

Also add committed recent-color history, keep HEX output opaque when `showAlpha={false}`,
and harden popover rendering for SSR environments.
