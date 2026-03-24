import js from '@eslint/js'
import ts from 'typescript-eslint'
import vue from 'eslint-plugin-vue'
import prettier from 'eslint-config-prettier'
import storybook from 'eslint-plugin-storybook'
import vitest from 'eslint-plugin-vitest'
import globals from 'globals'

export default ts.config(
  js.configs.recommended,
  ...ts.configs.recommended,
  ...vue.configs['flat/recommended'],
  prettier,
  {
    plugins: {
      storybook,
    },
    rules: {
      ...storybook.configs.recommended.rules,
    },
  },
  {
    files: ['test/**/*.ts'],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**', 'stats.html', 'coverage/**', 'storybook-static/**'],
  },
  {
    files: ['**/*.{js,ts,vue,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        parser: ts.parser,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'vue/multi-word-component-names': 'off',
      'vue/prop-name-casing': 'off',
      'vue/require-default-prop': 'off',
    },
  }
)
