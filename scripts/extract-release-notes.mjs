/* global console, process */

import { readFileSync, writeFileSync } from 'node:fs'

function parseArguments(argv) {
  const args = {
    fallbackSource: undefined,
    output: undefined,
    source: undefined,
    version: undefined,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const option = argv[index]
    const value = argv[index + 1]

    if (option === '--version') {
      args.version = value
      index += 1
      continue
    }

    if (option === '--source') {
      args.source = value
      index += 1
      continue
    }

    if (option === '--fallback-source') {
      args.fallbackSource = value
      index += 1
      continue
    }

    if (option === '--output') {
      args.output = value
      index += 1
      continue
    }

    throw new Error(`Unknown option: ${option}`)
  }

  if (
    typeof args.version !== 'string' ||
    typeof args.source !== 'string' ||
    typeof args.output !== 'string'
  ) {
    throw new Error(
      'Usage: node scripts/extract-release-notes.mjs --version <version> --source <path> --output <path> [--fallback-source <path>]'
    )
  }

  return args
}

function normalizeLineEndings(content) {
  return content.replace(/\r\n/g, '\n')
}

function extractReleaseNotes(content, version) {
  const normalizedContent = normalizeLineEndings(content)
  const headingPattern = new RegExp(`^## ${version}(?:\\s|$|\\()`)
  const lines = normalizedContent.split('\n')
  const sectionLines = []
  let capture = false

  for (const line of lines) {
    if (!capture && headingPattern.test(line)) {
      capture = true
      continue
    }

    if (capture && line.startsWith('## ')) {
      break
    }

    if (capture) {
      sectionLines.push(line)
    }
  }

  const releaseNotes = sectionLines.join('\n').trim()

  return releaseNotes.length > 0 ? `${releaseNotes}\n` : null
}

function resolveReleaseNotes({ fallbackSource, source, version }) {
  const primaryNotes = extractReleaseNotes(readFileSync(source, 'utf8'), version)

  if (primaryNotes != null) {
    return primaryNotes
  }

  if (typeof fallbackSource === 'string') {
    const fallbackNotes = extractReleaseNotes(readFileSync(fallbackSource, 'utf8'), version)

    if (fallbackNotes != null) {
      return fallbackNotes
    }
  }

  return null
}

try {
  const args = parseArguments(process.argv.slice(2))
  const releaseNotes = resolveReleaseNotes(args)

  if (releaseNotes == null) {
    const checkedSources =
      typeof args.fallbackSource === 'string'
        ? `${args.source} and ${args.fallbackSource}`
        : args.source

    throw new Error(`Could not find changelog entry for ${args.version} in ${checkedSources}`)
  }

  writeFileSync(args.output, releaseNotes)
} catch (error) {
  const message = error instanceof Error ? error.message : String(error)

  console.error(message)
  process.exitCode = 1
}
