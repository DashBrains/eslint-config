# @dashbrains/eslint-config

[![npm](https://img.shields.io/npm/v/@dashbrains/eslint-config?color=a1b858&label=)](https://www.npmjs.com/package/@dashbrains/eslint-config)

- Single quotes, no semi
- Auto fix for formatting
- Designed to work with TypeScript, React out-of-box
- Sorted imports, dangling commas
- Reasonable defaults, best practices, only one-line of config
- **Style principle**: Minimal for reading, stable for diff

## Usage

### Install

Requires Node.js 20.19, 22.13 or 24 and later, ESLint 9.7 or later or ESLint 10, and Prettier 3.

```bash
pnpm add -D eslint prettier @dashbrains/eslint-config
```

npm picks ESLint 9 by default, because `eslint-plugin-react` and `eslint-plugin-jsx-a11y` do not list ESLint 10 as a peer yet. To use ESLint 10 with npm, add the `overrides` block from [React and ESLint 10](#react-and-eslint-10) to your `package.json`, then install `eslint@10`:

```bash
npm i -D eslint@10 prettier @dashbrains/eslint-config
```

#### TypeScript

TypeScript is optional, and TypeScript 7 works without extra setup. typescript-eslint needs the TypeScript JavaScript API, which TypeScript 7.0 does not ship. When your project has no TypeScript, TypeScript 7.0, or another version typescript-eslint does not support yet (currently anything outside 4.8.4 to below 6.1), the config loads the TypeScript 6 API from a bundled copy of [`@typescript/typescript6`](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6.0). Your `tsc` keeps running your own TypeScript version with npm, pnpm and Yarn 4. Yarn 1 hoists the bundled copy, so it links the `tsc6` and `tsserver` binaries to TypeScript 6, and `tsc` too when your project has no TypeScript. Projects on a supported version use their own copy for linting, and the redirect stops once typescript-eslint supports a newer TypeScript.

The config redirects `typescript` for every CommonJS `require` in the ESLint process. If you enable type-aware rules on a TypeScript 7 project, TypeScript 6 computes the types.

The redirect starts when the config loads, so import `@dashbrains/eslint-config` before anything else that loads TypeScript, such as `typescript-eslint` or `@typescript-eslint/parser`. If one of those loads first on a TypeScript 7 project, ESLint fails with "typescript-eslint does not support TS 7.0".

### Config `eslint.config.mjs`

The package exports a flat config array. Spread it into your `eslint.config.mjs`:

```js
import dashbrains from '@dashbrains/eslint-config'

export default [...dashbrains]
```

With CommonJS, use `eslint.config.cjs`:

```js
// eslint-disable-next-line @typescript-eslint/no-require-imports
const dashbrains = require('@dashbrains/eslint-config')

module.exports = [...dashbrains]
```

### Add script for package.json

For example:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

### Config VS Code auto fix

Install [VS Code ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and create `.vscode/settings.json`

```json
{
  "prettier.enable": true,
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### Prettier

The `prettier/prettier` rule formats with the Prettier version your project installs. To get the same output from the Prettier CLI or editor integration, add the following to your `.prettierrc`:

```json
{
  "singleQuote": true,
  "tabWidth": 2,
  "semi": false
}
```

### Globals

The config declares browser, Node.js (including CommonJS names such as `require` and `module`), ES2021 and Jest globals for every linted file. If you enable `no-undef`, it will not report those names in any file.

### React and ESLint 10

The config patches `eslint-plugin-react` so its rules run on ESLint 10. To add one of its presets, put it before the shared config so the shared config's settings, such as the JSX runtime rules, still apply:

```js
import react from 'eslint-plugin-react'
import dashbrains from '@dashbrains/eslint-config'

export default [react.configs.flat.recommended, ...dashbrains]
```

Do not wrap the presets with `fixupConfigRules` or `fixupPluginRules` from `@eslint/compat`. The wrapped copy conflicts with the plugin this config registers, and ESLint fails with "Cannot redefine plugin".

`eslint-plugin-react` and `eslint-plugin-jsx-a11y` do not list ESLint 10 in their peer dependencies yet. Package managers warn about this, and npm fails with `ERESOLVE` when you install `eslint-plugin-react` yourself. With npm, accept your ESLint version through `overrides` in `package.json`:

```json
{
  "overrides": {
    "eslint-plugin-react": { "eslint": "$eslint" },
    "eslint-plugin-jsx-a11y": { "eslint": "$eslint" }
  }
}
```

## FAQ

### I prefer XXX...

Sure, add a config object after the shared config in your `eslint.config.mjs`:

```js
import dashbrains from '@dashbrains/eslint-config'

export default [
  ...dashbrains,
  {
    rules: {
      // your rules...
    },
  },
]
```

Or you can always fork this repo and make your own.

## License

[MIT](./LICENSE) License &copy; 2019-PRESENT [DashBrains](https://github.com/dashbrains)