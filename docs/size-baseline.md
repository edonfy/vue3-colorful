# Size Baseline

Baseline generated from the current `dist/` artifacts.

| File                     |           Raw |          Gzip |        Brotli |
| ------------------------ | ------------: | ------------: | ------------: |
| `dist/index.cjs`         |     33.46 KiB |      8.94 KiB |      8.01 KiB |
| `dist/index.js`          |     47.28 KiB |     10.17 KiB |      9.00 KiB |
| `dist/tailwind.cjs`      |         887 B |         459 B |         388 B |
| `dist/tailwind.js`       |        1005 B |         438 B |         387 B |
| `dist/vue3-colorful.css` |      9.62 KiB |      2.34 KiB |      2.04 KiB |
| **Total**                | **92.20 KiB** | **22.33 KiB** | **19.80 KiB** |

## Refresh

```bash
pnpm build
pnpm size:baseline
```

## Notes

- Includes public runtime entry files derived from `package.json`.
- Excludes declaration files (`.d.ts`).
- Use `pnpm size` for a terminal-only report.
