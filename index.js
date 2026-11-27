/* eslint @typescript-eslint/no-require-imports: 0 */
const unusedImports = require('eslint-plugin-unused-imports')
const tseslint = require('typescript-eslint')
const react = require('eslint-plugin-react')
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended')
const eslintPluginImportX = require('eslint-plugin-import-x')
const jsxA11y = require('eslint-plugin-jsx-a11y')
const reactHook = require('eslint-plugin-react-hooks')
const eslintCompat = require('@eslint/compat')
const globals = require('globals')
const stylistic = require('@stylistic/eslint-plugin')

/*
 * ESLint 10 removed legacy context methods such as context.getFilename()
 * that eslint-plugin-react still calls. Replace its rules in place with
 * @eslint/compat versions so the plugin object keeps its identity, and
 * consumers can still add the upstream react presets.
 */
Object.assign(react.rules, eslintCompat.fixupPluginRules(react).rules)

module.exports = [
  // ESLint matches .js, .mjs and .cjs by default and typescript-eslint adds
  // TypeScript files. Match .jsx too so React files get linted.
  { files: ['**/*.jsx'] },
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  eslintPluginImportX.flatConfigs.recommended,
  jsxA11y.flatConfigs.recommended,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        ...globals.jest,
      },
    },
    plugins: {
      'unused-imports': unusedImports,
      '@stylistic': stylistic,
      react,
      'react-hooks': reactHook,
    },
    rules: {
      ...reactHook.configs.recommended.rules,
      'no-console': 'error',
      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'react/jsx-curly-brace-presence': ['error', 'never'],
      'react/prop-types': 'off',
      'react/display-name': 'off',
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          tabWidth: 2,
          semi: false,
        },
      ],
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],
      'import-x/consistent-type-specifier-style': ['error', 'prefer-inline'],
      'import-x/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: true,
        },
      ],
      'import-x/order': ['error'],
      // Separate a function's steps: setup, guards, the work and the result.
      // Prettier keeps blank lines but never adds them, so enforce them here.
      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: '*', next: 'if' },
        { blankLine: 'always', prev: 'if', next: '*' },
        { blankLine: 'any', prev: 'if', next: 'if' },
        {
          blankLine: 'always',
          prev: '*',
          next: ['multiline-block-like', 'multiline-expression'],
        },
        {
          blankLine: 'always',
          prev: ['multiline-block-like', 'multiline-expression'],
          next: '*',
        },
      ],
    },
    settings: {
      react: {
        pragma: 'React',
        version: 'detect',
      },
      'import-x/resolver': {
        typescript: {},
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
  },
]
