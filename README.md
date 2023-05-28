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

```bash
pnpm add -D eslint @dashbrains/eslint-config
```

### Config `.eslintrc`

```json
{
  "extends": "@dashbrains/eslint-config"
}
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

Sure, you can override the rules in your `.eslintrc` file.

<!-- eslint-skip -->

```jsonc
{
  "extends": "@dashbrains/eslint-config",
  "rules": {
    // your rules...
  }
}
```

Or you can always fork this repo and make your own.

## License

[MIT](./LICENSE) License &copy; 2019-PRESENT [DashBrains](https://github.com/dashbrains)