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

Requires Node.js 20.19, 22.13 or 24 and later, ESLint 9.7 or later or ESLint 10, Prettier 3, and TypeScript. The config loads typescript-eslint, which needs TypeScript 4.8.4 or later and below 6.1, even in JavaScript-only projects.

```bash
pnpm add -D eslint prettier typescript@^6 @dashbrains/eslint-config
```

#### TypeScript 7

typescript-eslint does not support TypeScript 7 yet, so the config fails to load when `typescript` resolves to TypeScript 7. To use TypeScript 7 for type checking, install it next to the TypeScript 6 API with npm aliases, as the [TypeScript 7.0 announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6.0) recommends:

```json
{
  "devDependencies": {
    "@typescript/native": "npm:typescript@^7.0.2",
    "typescript": "npm:@typescript/typescript6@^6.0.2"
  }
}
```

`tsc` then runs TypeScript 7, and typescript-eslint loads the TypeScript 6 API. `@typescript-eslint/typescript-estree` has an optional peer with the same `@typescript/native` name that accepts only TypeScript 7.1 dev or beta builds. npm therefore warns that it overrides the peer and installs nightly TypeScript 7.1 copies under typescript-eslint, and pnpm reports an unmet optional peer. Linting output stays the same. On Yarn 4, use 4.19 or later. Yarn 4.13 fails to install this setup ([microsoft/typescript-go#4368](https://github.com/microsoft/typescript-go/issues/4368)).

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

### Blank lines

Prettier keeps blank lines but never adds them. The config uses `@stylistic/padding-line-between-statements` to require a blank line before a `return`, around a run of `if` statements, and before and after a multi-line block or expression. Run `eslint --fix` to add them.

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
