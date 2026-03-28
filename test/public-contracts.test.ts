import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

interface PackageExports {
  exports: Record<string, unknown>
  scripts: Record<string, string>
  peerDependencies?: Record<string, string>
  peerDependenciesMeta?: Record<string, { optional?: boolean }>
  types?: string
}

const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8')) as PackageExports
const readme = readFileSync('./README.md', 'utf-8')
const contributing = readFileSync('./CONTRIBUTING.md', 'utf-8')
const sourceIndex = readFileSync('./src/index.ts', 'utf-8')

const getReadmeSection = (heading: string): string => {
  const sectionHeading = `## ${heading}`
  const startIndex = readme.indexOf(sectionHeading)

  if (startIndex === -1) {
    throw new Error(`Missing README section: ${heading}`)
  }

  const nextIndex = readme.indexOf('\n## ', startIndex + sectionHeading.length)

  return readme.slice(startIndex, nextIndex === -1 ? undefined : nextIndex)
}

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

  it('keeps only the popover helper as an optional subpath export', () => {
    expect(packageJson.exports['./popover']).toBeDefined()
    expect(packageJson.exports['./tailwind']).toBeUndefined()
    expect(packageJson.exports['./unocss']).toBeUndefined()
    expect(packageJson.exports['./nuxt']).toBeUndefined()
  })

  it('marks the floating-ui peer as optional for non-popover consumers', () => {
    expect(packageJson.peerDependencies?.['@floating-ui/vue']).toBeDefined()
    expect(packageJson.peerDependenciesMeta?.['@floating-ui/vue']?.optional).toBe(true)
  })

  it('exposes size baseline scripts', () => {
    expect(packageJson.scripts.size).toBe('node ./scripts/size-report.mjs')
    expect(packageJson.scripts['size:check']).toBe('node ./scripts/size-report.mjs --check')
    expect(packageJson.scripts['size:baseline']).toBe('node ./scripts/size-report.mjs --write')
    expect(packageJson.scripts.perf).toBe('node ./scripts/perf-baseline.mjs')
    expect(packageJson.scripts['perf:baseline']).toBe('node ./scripts/perf-baseline.mjs --write')
  })

  it('rewrites declaration imports away from source aliases', () => {
    const declarationEntry = packageJson.types?.replace(/^\.\//, '')

    if (!existsSync('./dist') || !declarationEntry || !existsSync(declarationEntry)) {
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

  it('exports panel components from the source entry without the popover helper', () => {
    expect(sourceIndex).toContain('export { default as ColorPickerPanel }')
    expect(sourceIndex).toContain('export { default as HexColorInput }')
    expect(sourceIndex).toContain('export { default as HwbColorPicker }')
    expect(sourceIndex).not.toContain('export { default as ColorPickerPopover }')
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

  it('keeps the quick-start install path aligned with the popover entrypoint', () => {
    const quickStartSection = getReadmeSection('Quick Start')

    expect(quickStartSection).toContain('### Install')
    expect(quickStartSection).toContain('pnpm add vue3-colorful')
    expect(quickStartSection).toContain('ColorPickerPopover')
    expect(quickStartSection).toContain('pnpm add @floating-ui/vue')
    expect(quickStartSection).toContain("import { HexColorPicker } from 'vue3-colorful'")
    expect(quickStartSection).toContain("import 'vue3-colorful/style.css'")
  })

  it('documents how to choose between the panel, generic picker, and specialized pickers', () => {
    const chooserSection = getReadmeSection('Pick The Right Component')

    expect(chooserSection).toContain('`RgbColorPicker`')
    expect(chooserSection).toContain('`HslColorPicker`')
    expect(chooserSection).toContain('`HsvColorPicker`')
    expect(chooserSection).toContain('`HwbColorPicker`')
    expect(chooserSection).toContain('`CmykColorPicker`')
    expect(chooserSection).toContain('`ColorPicker` / `ColorPickerPanel`')
    expect(chooserSection).toContain('ColorPicker is a compatibility alias')
    expect(chooserSection).toContain('`ColorPickerPopover`')
    expect(chooserSection).toContain('vue3-colorful/popover')
  })

  it('documents release-ready value behavior and common interaction props', () => {
    const commonPropsSection = getReadmeSection('Common Props')

    expect(commonPropsSection).toContain("Blank values still use `''`")
    expect(commonPropsSection).toContain('showRecent')
    expect(commonPropsSection).toContain('clearable')
    expect(commonPropsSection).toContain('disabled')
    expect(commonPropsSection).toContain('readOnly')
    expect(commonPropsSection).toContain('editable')
  })

  it('documents popover imports from the dedicated subpath export', () => {
    expect(readme).toContain("import { ColorPickerPopover } from 'vue3-colorful/popover'")
    expect(readme).not.toContain("import { ColorPickerPopover } from 'vue3-colorful'")
  })
})
