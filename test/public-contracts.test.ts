import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

interface PackageExports {
  exports: Record<string, unknown>
  scripts: Record<string, string>
}

const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8')) as PackageExports
const readme = readFileSync('./README.md', 'utf-8')
const contributing = readFileSync('./CONTRIBUTING.md', 'utf-8')
const sourceIndex = readFileSync('./src/index.ts', 'utf-8')

const collectDeclarationFiles = (directoryPath: string): string[] => {
  const declarationFiles: string[] = []

  for (const entry of readdirSync(directoryPath)) {
    const entryPath = join(directoryPath, entry)
    const entryStats = statSync(entryPath)

    if (entryStats.isDirectory()) {
      declarationFiles.push(...collectDeclarationFiles(entryPath))
      continue
    }

    if (entryPath.endsWith('.d.ts')) {
      declarationFiles.push(entryPath)
    }
  }

  return declarationFiles
}

describe('Public contracts', () => {
  it('exports the public stylesheet path', () => {
    expect(packageJson.exports['./style.css']).toBe('./dist/vue3-colorful.css')
  })

  it('keeps only the tailwind helper as an optional subpath export', () => {
    expect(packageJson.exports['./tailwind']).toBeDefined()
    expect(packageJson.exports['./unocss']).toBeUndefined()
    expect(packageJson.exports['./nuxt']).toBeUndefined()
  })

  it('exposes size baseline scripts', () => {
    expect(packageJson.scripts.size).toBe('node ./scripts/size-report.mjs')
    expect(packageJson.scripts['size:check']).toBe('node ./scripts/size-report.mjs --check')
    expect(packageJson.scripts['size:baseline']).toBe('node ./scripts/size-report.mjs --write')
    expect(packageJson.scripts.perf).toBe('node ./scripts/perf-baseline.mjs')
    expect(packageJson.scripts['perf:baseline']).toBe('node ./scripts/perf-baseline.mjs --write')
  })

  it('rewrites declaration imports away from source aliases', () => {
    if (!existsSync('./dist')) {
      return
    }

    const distDeclarationFiles = collectDeclarationFiles('./dist')

    expect(distDeclarationFiles.length).toBeGreaterThan(0)

    for (const filePath of distDeclarationFiles) {
      const declarationSource = readFileSync(filePath, 'utf-8')

      expect(declarationSource).not.toContain("'@/")
      expect(declarationSource).not.toContain('"@/')
      expect(declarationSource).not.toContain("'~/")
      expect(declarationSource).not.toContain('"~/')
    }
  })

  it('documents the exported stylesheet path consistently', () => {
    expect(readme).toContain("import 'vue3-colorful/style.css'")
    expect(readme).not.toContain("import 'vue3-colorful/dist/vue3-colorful.css'")
  })

  it('exports ColorPickerPanel from the source entry', () => {
    expect(sourceIndex).toContain('export { default as ColorPickerPanel }')
    expect(sourceIndex).toContain('export { default as HexColorInput }')
    expect(sourceIndex).toContain('export { default as HwbColorPicker }')
  })

  it('does not document removed ecosystem entrypoints', () => {
    expect(readme).not.toContain('vue3-colorful/nuxt')
    expect(readme).not.toContain('vue3-colorful/unocss')
  })

  it('documents contribution constraints for TSX-only development', () => {
    expect(contributing).toContain('TSX')
    expect(contributing).toContain('pnpm')
    expect(contributing).toContain('.vue')
  })

  it('documents disabled, clearable, and panel usage', () => {
    expect(readme).toContain('ColorPickerPanel')
    expect(readme).toContain('clearable')
    expect(readme).toContain('disabled')
  })

  it('documents the object value API', () => {
    expect(readme).toContain('valueType')
    expect(readme).toContain('RgbColor')
    expect(readme).toContain('HsvaColor')
  })

  it('documents the feature matrix and integration examples', () => {
    expect(readme).toContain('Feature Matrix')
    expect(readme).toContain('Integration Examples')
    expect(readme).toContain('HexColorInput')
    expect(readme).toContain('HwbColorPicker')
  })
})
