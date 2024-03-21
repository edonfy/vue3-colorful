/* eslint-env node */

const { edonfy } = require('@edonfy/eslint-config')

module.exports = edonfy({
  vue: true,
  ts: true,
  rules: {
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/ban-ts-comment': 0,
  }
})