# Size Baseline

Baseline generated from the current `dist/` artifacts.

| File                     |           Raw |          Gzip |        Brotli |
| ------------------------ | ------------: | ------------: | ------------: |
| `dist/index.cjs`         |     31.97 KiB |      9.05 KiB |      8.11 KiB |
| `dist/index.js`          |     44.93 KiB |     10.31 KiB |      9.12 KiB |
| `dist/tailwind.cjs`      |         887 B |         459 B |         388 B |
| `dist/tailwind.js`       |        1005 B |         438 B |         387 B |
| `dist/vue3-colorful.css` |     10.47 KiB |      2.40 KiB |      2.10 KiB |
| **Total**                | **89.22 KiB** | **22.64 KiB** | **20.08 KiB** |

## Refresh

```bash
pnpm build
pnpm size:baseline
```

## Notes

- Includes public runtime entry files derived from `package.json`.
- Excludes declaration files (`.d.ts`).
- Use `pnpm size` for a terminal-only report.
