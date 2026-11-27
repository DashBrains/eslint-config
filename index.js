/* eslint @typescript-eslint/no-require-imports: 0 */
require('./typescript-api')

const unusedImports = require('eslint-plugin-unused-imports')
const tseslint = require('typescript-eslint')
const react = require('eslint-plugin-react')
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended')
const eslintPluginImportX = require('eslint-plugin-import-x')
const jsxA11y = require('eslint-plugin-jsx-a11y')
const reactHook = require('eslint-plugin-react-hooks')
const eslintCompat = require('@eslint/compat')
const globals = require('globals')
const {
  createTypeScriptImportResolver,
} = require('eslint-import-resolver-typescript')

const moduleExtensions = [
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.ts',
  '.tsx',
  '.mts',
  '.cts',
]

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
    },
    settings: {
      react: {
        pragma: 'React',
        version: 'detect',
      },
      // Read exports from every JavaScript and TypeScript module, not only
      // .js files, so rules such as import-x/named check them too.
      'import-x/extensions': moduleExtensions,
      // Keep skipping declaration files, as before, so packages typed with
      // `export =`, such as @types/react, do not report a missing default.
      'import-x/ignore': ['\\.d\\.[cm]?ts$'],
      // Yarn Plug'n'Play resolves packages into .yarn/cache instead of
      // node_modules. Treat both as external for import-x/order.
      'import-x/external-module-folders': ['node_modules', '.yarn'],
      // Pass resolver objects instead of names so resolution works under
      // Yarn Plug'n'Play, which blocks loading resolvers by name.
      'import-x/resolver-next': [
        createTypeScriptImportResolver(),
        eslintPluginImportX.createNodeResolver({
          extensions: moduleExtensions,
        }),
      ],
    },
  },
]
