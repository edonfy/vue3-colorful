# Size Baseline

Baseline generated from the current `dist/` artifacts.

| File                     |           Raw |          Gzip |        Brotli |
| ------------------------ | ------------: | ------------: | ------------: |
| `dist/index.cjs`         |     32.66 KiB |      8.76 KiB |      7.84 KiB |
| `dist/index.js`          |     46.17 KiB |      9.93 KiB |      8.81 KiB |
| `dist/tailwind.cjs`      |         887 B |         459 B |         388 B |
| `dist/tailwind.js`       |        1005 B |         438 B |         387 B |
| `dist/vue3-colorful.css` |      9.62 KiB |      2.34 KiB |      2.04 KiB |
| **Total**                | **90.29 KiB** | **21.91 KiB** | **19.45 KiB** |

## Refresh

```bash
pnpm build
pnpm size:baseline
```

## Notes

- Includes public runtime entry files derived from `package.json`.
- Excludes declaration files (`.d.ts`).
- Use `pnpm size` for a terminal-only report.
