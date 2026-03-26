import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

interface PackageExports {
  exports: Record<string, unknown>
  scripts: Record<string, string>
}

const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8')) as PackageExports
const readme = readFileSync('./README.md', 'utf-8')
const contributing = readFileSync('./CONTRIBUTING.md', 'utf-8')

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

  it('documents the exported stylesheet path consistently', () => {
    expect(readme).toContain("import 'vue3-colorful/style.css'")
    expect(readme).not.toContain("import 'vue3-colorful/dist/vue3-colorful.css'")
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
})
