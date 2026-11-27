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

Requires ESLint 9.7 or later, or ESLint 10.

```bash
pnpm add -D eslint @dashbrains/eslint-config
```

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

If you want to apply formatting with prettier, you can add the following to your `.prettierrc`:

```json
{
  "singleQuote": true,
  "tabWidth": 2,
  "semi": false
}
```

and then

```bash
npm i -D prettier
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