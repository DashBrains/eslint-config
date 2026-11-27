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

Requires ESLint 9.7 or later, or ESLint 10, plus Prettier 3 and TypeScript. The config loads typescript-eslint, which needs TypeScript 4.8.4 or later and below 6.1, even in JavaScript-only projects.

```bash
pnpm add -D eslint prettier typescript@^6 @dashbrains/eslint-config
```

#### TypeScript 7

typescript-eslint does not support TypeScript 7 yet and fails with "typescript-eslint does not support TS 7.0". To use TypeScript 7 for type checking, install it next to the TypeScript 6 API with npm aliases, as the [TypeScript 7.0 announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6.0) recommends:

```json
{
  "devDependencies": {
    "@typescript/native": "npm:typescript@^7.0.2",
    "typescript": "npm:@typescript/typescript6@^6.0.2"
  }
}
```

`tsc` then runs TypeScript 7, and typescript-eslint loads the TypeScript 6 API.

### Config `eslint.config.mjs`

The package exports a flat config array. Spread it into your `eslint.config.mjs`:

```js
import dashbrains from '@dashbrains/eslint-config'

export default [...dashbrains]
```

With CommonJS, use `eslint.config.cjs`:

```js
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

The config patches `eslint-plugin-react` so its rules run on ESLint 10. Add its presets directly, for example `react.configs.flat.recommended`. Do not wrap them with `fixupConfigRules` or `fixupPluginRules` from `@eslint/compat`, because the wrapped copy conflicts with the plugin this config registers and ESLint fails with "Cannot redefine plugin".

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