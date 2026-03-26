# Interaction Performance Baseline

These numbers come from the current build artifacts and a jsdom-driven interaction harness.

- Node: `v24.14.0`
- Platform: `darwin`
- Arch: `arm64`

| Scenario               | Iterations |     Total | Avg / op |
| ---------------------- | ---------: | --------: | -------: |
| `mount-default-picker` |         75 | 906.96 ms | 12.09 ms |
| `hue-updates`          |        400 | 124.09 ms |  0.31 ms |
| `saturation-updates`   |        300 |  80.42 ms |  0.27 ms |
| `alpha-updates`        |        300 |  27.68 ms |  0.09 ms |

## Refresh

```bash
pnpm build
pnpm perf:baseline
```

## Notes

- Results are environment-dependent; compare deltas on the same machine or runner when possible.
- Scenarios focus on mount cost plus repeated hue, saturation, and alpha updates.
- Built from `dist/index.js`.
