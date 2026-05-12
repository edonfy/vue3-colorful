# Size Baseline

Baseline generated from the current `dist/` artifacts.

| File                     |           Raw |         Gzip |       Brotli |
| ------------------------ | ------------: | -----------: | -----------: |
| `dist/index.cjs`         |      1.49 KiB |        616 B |        536 B |
| `dist/index.js`          |      1.73 KiB |        636 B |        557 B |
| `dist/popover.cjs`       |      4.89 KiB |     1.85 KiB |     1.62 KiB |
| `dist/popover.js`        |      6.55 KiB |     2.12 KiB |     1.84 KiB |
| `dist/vue3-colorful.css` |      9.82 KiB |     2.38 KiB |     2.06 KiB |
| **Total**                | **24.48 KiB** | **7.57 KiB** | **6.59 KiB** |

## Refresh

```bash
pnpm build
pnpm size:baseline
```

## Notes

- Includes public runtime entry files derived from `package.json`.
- Excludes declaration files (`.d.ts`).
- Use `pnpm size` for a terminal-only report.
