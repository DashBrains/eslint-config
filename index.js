/* eslint @typescript-eslint/no-require-imports: 0 */
const unusedImports = require('eslint-plugin-unused-imports')
const tseslint = require('typescript-eslint')
const react = require('eslint-plugin-react')
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended')
const eslintPluginImportX = require('eslint-plugin-import-x')
const jsxA11y = require('eslint-plugin-jsx-a11y')
const reactHook = require('eslint-plugin-react-hooks')
const eslintCompat = require('@eslint/compat')

module.exports = [
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
        browser: true,
        node: true,
        es2021: true,
        jest: true,
      },
    },
    plugins: {
      'unused-imports': unusedImports,
      react,
      'react-hooks': eslintCompat.fixupPluginRules(reactHook),
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
    },
    settings: {
      react: {
        pragma: 'React',
        version: 'detect',
      },
      'import/resolver': {
        typescript: {},
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
  },
]
