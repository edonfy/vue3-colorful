/* global clearTimeout, console, document, process, setTimeout */

import { existsSync, writeFileSync } from 'node:fs'
import { resolve, relative } from 'node:path'
import { performance } from 'node:perf_hooks'
import { JSDOM } from 'jsdom'

const workspaceRoot = process.cwd()
const distEntryPath = resolve(workspaceRoot, 'dist/index.js')
const markdownOutputPath = resolve(workspaceRoot, 'docs/perf-baseline.md')

if (!existsSync(distEntryPath)) {
  console.error('Missing `dist/index.js`. Run `pnpm build` before `pnpm perf`.')
  process.exit(1)
}

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost',
})
const { window } = dom

const assignGlobal = (key, value) => {
  Object.defineProperty(globalThis, key, {
    value,
    configurable: true,
    writable: true,
  })
}

for (const key of [
  'window',
  'document',
  'navigator',
  'HTMLElement',
  'SVGElement',
  'Node',
  'Element',
  'Event',
  'MouseEvent',
  'KeyboardEvent',
  'CustomEvent',
]) {
  assignGlobal(key, window[key])
}

assignGlobal('requestAnimationFrame', (callback) => setTimeout(() => callback(Date.now()), 0))
assignGlobal('cancelAnimationFrame', (id) => clearTimeout(id))
assignGlobal('getComputedStyle', window.getComputedStyle.bind(window))

const { mount } = await import('@vue/test-utils')
const { nextTick } = await import('vue')
const { ColorPicker } = await import(distEntryPath)

const createPickerWrapper = () =>
  mount(ColorPicker, {
    attachTo: document.body,
    props: {
      modelValue: '#3b82f6',
      showAlpha: true,
      showInput: true,
      presets: ['#3b82f6', '#10b981', '#f59e0b'],
      colorLabel: 'Perf',
    },
  })

const round = (value) => Number(value.toFixed(2))

const measureScenario = async (name, iterations, run) => {
  await run(Math.min(iterations, 10))

  const start = performance.now()
  await run(iterations)
  const totalMs = performance.now() - start

  return {
    name,
    iterations,
    totalMs: round(totalMs),
    avgMs: round(totalMs / iterations),
  }
}

const scenarios = [
  {
    name: 'mount-default-picker',
    iterations: 75,
    run: async (iterations) => {
      for (let index = 0; index < iterations; index += 1) {
        const wrapper = createPickerWrapper()
        wrapper.unmount()
      }
    },
  },
  {
    name: 'hue-updates',
    iterations: 400,
    run: async (iterations) => {
      const wrapper = createPickerWrapper()
      const hue = wrapper.findComponent({ name: 'Hue' })

      for (let index = 0; index < iterations; index += 1) {
        hue.vm.$emit('change', index % 360)
        if (index % 25 === 24) {
          await nextTick()
        }
      }

      await nextTick()
      wrapper.unmount()
    },
  },
  {
    name: 'saturation-updates',
    iterations: 300,
    run: async (iterations) => {
      const wrapper = createPickerWrapper()
      const saturation = wrapper.findComponent({ name: 'Saturation' })

      for (let index = 0; index < iterations; index += 1) {
        saturation.vm.$emit('change', {
          s: index % 100,
          v: 100 - (index % 100),
        })
        if (index % 20 === 19) {
          await nextTick()
        }
      }

      await nextTick()
      wrapper.unmount()
    },
  },
  {
    name: 'alpha-updates',
    iterations: 300,
    run: async (iterations) => {
      const wrapper = createPickerWrapper()
      const alpha = wrapper.findComponent({ name: 'Alpha' })

      for (let index = 0; index < iterations; index += 1) {
        alpha.vm.$emit('change', (index % 100) / 100)
        if (index % 20 === 19) {
          await nextTick()
        }
      }

      await nextTick()
      wrapper.unmount()
    },
  },
]

const rows = []
for (const scenario of scenarios) {
  rows.push(await measureScenario(scenario.name, scenario.iterations, scenario.run))
}

const environment = {
  node: process.version,
  platform: process.platform,
  arch: process.arch,
}

const toMarkdown = () => {
  const lines = [
    '# Interaction Performance Baseline',
    '',
    'These numbers come from the current build artifacts and a jsdom-driven interaction harness.',
    '',
    `- Node: \`${environment.node}\``,
    `- Platform: \`${environment.platform}\``,
    `- Arch: \`${environment.arch}\``,
    '',
    '| Scenario | Iterations | Total | Avg / op |',
    '| --- | ---: | ---: | ---: |',
    ...rows.map((row) => {
      return `| \`${row.name}\` | ${row.iterations} | ${row.totalMs} ms | ${row.avgMs} ms |`
    }),
    '',
    '## Refresh',
    '',
    '```bash',
    'pnpm build',
    'pnpm perf:baseline',
    '```',
    '',
    '## Notes',
    '',
    '- Results are environment-dependent; compare deltas on the same machine or runner when possible.',
    '- Scenarios focus on mount cost plus repeated hue, saturation, and alpha updates.',
    `- Built from \`${relative(workspaceRoot, distEntryPath)}\`.`,
    '',
  ]

  return lines.join('\n')
}

const printTable = () => {
  const header = ['Scenario', 'Iterations', 'Total', 'Avg / op']
  const body = rows.map((row) => [
    row.name,
    String(row.iterations),
    `${row.totalMs} ms`,
    `${row.avgMs} ms`,
  ])
  const widths = header.map((column, index) =>
    Math.max(column.length, ...body.map((row) => row[index].length))
  )

  const formatRow = (row) => row.map((cell, index) => cell.padEnd(widths[index])).join('  ')

  console.log(formatRow(header))
  console.log(widths.map((width) => '-'.repeat(width)).join('  '))
  body.forEach((row) => {
    console.log(formatRow(row))
  })
}

if (process.argv.includes('--write')) {
  writeFileSync(markdownOutputPath, toMarkdown())
  console.log(`Wrote interaction baseline to ${relative(workspaceRoot, markdownOutputPath)}`)
} else {
  printTable()
}
