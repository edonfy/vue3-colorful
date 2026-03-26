/* global console, process */

import { readFileSync, statSync, writeFileSync } from 'node:fs'
import { resolve, relative } from 'node:path'
import { gzipSync, brotliCompressSync, constants as zlibConstants } from 'node:zlib'
import { format, resolveConfig } from 'prettier'

const workspaceRoot = process.cwd()
const packageJson = JSON.parse(readFileSync(resolve(workspaceRoot, 'package.json'), 'utf-8'))

const markdownOutputPath = resolve(workspaceRoot, 'docs/size-baseline.md')

const formatMarkdown = async (markdown) => {
  const prettierConfig = (await resolveConfig(markdownOutputPath)) ?? {}

  return format(markdown, {
    ...prettierConfig,
    filepath: markdownOutputPath,
    parser: 'markdown',
  })
}

const getRuntimeFiles = () => {
  const files = new Set()

  if (typeof packageJson.main === 'string') {
    files.add(packageJson.main)
  }

  if (typeof packageJson.module === 'string') {
    files.add(packageJson.module)
  }

  const exportsField = packageJson.exports
  if (exportsField && typeof exportsField === 'object') {
    for (const value of Object.values(exportsField)) {
      if (typeof value === 'string') {
        files.add(value)
        continue
      }

      if (value && typeof value === 'object') {
        for (const target of Object.values(value)) {
          if (typeof target === 'string') {
            files.add(target)
            continue
          }

          if (target && typeof target === 'object') {
            for (const nestedTarget of Object.values(target)) {
              if (typeof nestedTarget === 'string' && !nestedTarget.endsWith('.d.ts')) {
                files.add(nestedTarget)
              }
            }
          }
        }
      }
    }
  }

  return [...files]
    .filter((file) => !file.endsWith('.d.ts'))
    .map((file) => file.replace(/^\.\//, ''))
    .sort()
}

const formatBytes = (bytes) => {
  if (bytes < 1024) {
    return `${bytes} B`
  }

  return `${(bytes / 1024).toFixed(2)} KiB`
}

const getSizeRow = (file) => {
  const absolutePath = resolve(workspaceRoot, file)
  const content = readFileSync(absolutePath)
  const raw = statSync(absolutePath).size
  const gzip = gzipSync(content, { level: 9 }).length
  const brotli = brotliCompressSync(content, {
    params: {
      [zlibConstants.BROTLI_PARAM_QUALITY]: 11,
    },
  }).length

  return {
    file,
    raw,
    gzip,
    brotli,
  }
}

const rows = getRuntimeFiles().map(getSizeRow)

const totals = rows.reduce(
  (accumulator, row) => {
    return {
      raw: accumulator.raw + row.raw,
      gzip: accumulator.gzip + row.gzip,
      brotli: accumulator.brotli + row.brotli,
    }
  },
  { raw: 0, gzip: 0, brotli: 0 }
)

const toMarkdown = () => {
  const lines = [
    '# Size Baseline',
    '',
    'Baseline generated from the current `dist/` artifacts.',
    '',
    '| File | Raw | Gzip | Brotli |',
    '| --- | ---: | ---: | ---: |',
    ...rows.map((row) => {
      return `| \`${row.file}\` | ${formatBytes(row.raw)} | ${formatBytes(row.gzip)} | ${formatBytes(row.brotli)} |`
    }),
    `| **Total** | **${formatBytes(totals.raw)}** | **${formatBytes(totals.gzip)}** | **${formatBytes(totals.brotli)}** |`,
    '',
    '## Refresh',
    '',
    '```bash',
    'pnpm build',
    'pnpm size:baseline',
    '```',
    '',
    '## Notes',
    '',
    `- Includes public runtime entry files derived from \`${relative(workspaceRoot, resolve(workspaceRoot, 'package.json'))}\`.`,
    '- Excludes declaration files (`.d.ts`).',
    '- Use `pnpm size` for a terminal-only report.',
    '',
  ]

  return `${lines.join('\n')}`
}

const generatedMarkdown = await formatMarkdown(toMarkdown())

const printTable = () => {
  const header = ['File', 'Raw', 'Gzip', 'Brotli']
  const body = rows.map((row) => [
    row.file,
    formatBytes(row.raw),
    formatBytes(row.gzip),
    formatBytes(row.brotli),
  ])

  body.push([
    'Total',
    formatBytes(totals.raw),
    formatBytes(totals.gzip),
    formatBytes(totals.brotli),
  ])

  const widths = header.map((column, index) => {
    return Math.max(column.length, ...body.map((row) => row[index].length))
  })

  const formatRow = (row) =>
    row
      .map((cell, index) => {
        return cell.padEnd(widths[index])
      })
      .join('  ')

  console.log(formatRow(header))
  console.log(widths.map((width) => '-'.repeat(width)).join('  '))
  body.forEach((row) => {
    console.log(formatRow(row))
  })
}

if (process.argv.includes('--check')) {
  const currentMarkdown = readFileSync(markdownOutputPath, 'utf-8')
  const normalizedCurrentMarkdown = await formatMarkdown(currentMarkdown)

  if (normalizedCurrentMarkdown !== generatedMarkdown) {
    console.error('Size baseline is out of date. Run `pnpm build && pnpm size:baseline`.')
    process.exit(1)
  }

  console.log(`Size baseline matches ${relative(workspaceRoot, markdownOutputPath)}`)
} else if (process.argv.includes('--write')) {
  writeFileSync(markdownOutputPath, generatedMarkdown)
  console.log(`Wrote size baseline to ${relative(workspaceRoot, markdownOutputPath)}`)
} else {
  printTable()
}
