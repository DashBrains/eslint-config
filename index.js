const tseslint = require('typescript-eslint')
const unused = require('eslint-plugin-unused-imports')
const reactRecommended = require('eslint-plugin-react/configs/recommended')
const reactJsx = require('eslint-plugin-react/configs/jsx-runtime')
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended')
const eslintImport = require('eslint-plugin-import')
const eslintjsxa11y = require('eslint-plugin-jsx-a11y')
const reactHook = require('eslint-plugin-react-hooks')

module.exports = [
  ...tseslint.configs.recommended,
  reactRecommended,
  reactJsx,
  eslintPluginPrettierRecommended,
  {
    plugins: {
      'unused-imports': unused,
      import: eslintImport,
      'jsx-a11y': eslintjsxa11y,
      'react-hooks': reactHook,
    },
    rules: {
      ...eslintjsxa11y.configs.recommended.rules,
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
      'import/consistent-type-specifier-style': ['error', 'prefer-inline'],
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: true,
        },
      ],
      'import/order': ['error'],
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
  },
]
