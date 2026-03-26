# Interaction Performance Baseline

These numbers come from the current build artifacts and a jsdom-driven interaction harness.

- Node: `v24.14.0`
- Platform: `darwin`
- Arch: `arm64`

| Scenario               | Iterations |     Total | Avg / op |
| ---------------------- | ---------: | --------: | -------: |
| `mount-default-picker` |         75 | 110.69 ms |  1.48 ms |
| `hue-updates`          |        400 |  17.29 ms |  0.04 ms |
| `saturation-updates`   |        300 |   8.55 ms |  0.03 ms |
| `alpha-updates`        |        300 |   7.71 ms |  0.03 ms |

## Refresh

```bash
pnpm build
pnpm perf:baseline
```

## Notes

- Results are environment-dependent; compare deltas on the same machine or runner when possible.
- Scenarios focus on mount cost plus repeated hue, saturation, and alpha updates.
- Built from `dist/index.js`.
