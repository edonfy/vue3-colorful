# Size Baseline

Baseline generated from the current `dist/` artifacts.

| File                     |           Raw |          Gzip |        Brotli |
| ------------------------ | ------------: | ------------: | ------------: |
| `dist/index.cjs`         |     20.15 KiB |      6.27 KiB |      5.60 KiB |
| `dist/index.js`          |     28.44 KiB |      7.24 KiB |      6.35 KiB |
| `dist/tailwind.cjs`      |         887 B |         459 B |         388 B |
| `dist/tailwind.js`       |        1005 B |         438 B |         387 B |
| `dist/vue3-colorful.css` |      7.71 KiB |      2.06 KiB |      1.78 KiB |
| **Total**                | **58.16 KiB** | **16.44 KiB** | **14.50 KiB** |

## Refresh

```bash
pnpm build
pnpm size:baseline
```

## Notes

- Includes public runtime entry files derived from `package.json`.
- Excludes declaration files (`.d.ts`).
- Use `pnpm size` for a terminal-only report.
