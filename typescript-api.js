/* eslint @typescript-eslint/no-require-imports: 0 */
/*
 * TypeScript 7.0 ships no JavaScript API, and typescript-eslint refuses to
 * load it. When `typescript` resolves to TypeScript 7 or is not installed,
 * resolve it to the TypeScript 6 API from @typescript/typescript6 instead.
 * Projects on TypeScript 4.8 to 6 keep their own copy.
 */
const fs = require('node:fs')
const Module = require('node:module')

const typescript6 = require.resolve('@typescript/typescript6')
const majorByPackageJson = new Map()

const typescriptMajor = (packageJsonPath) => {
  if (!majorByPackageJson.has(packageJsonPath)) {
    const { version } = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
    majorByPackageJson.set(packageJsonPath, Number(version.split('.')[0]))
  }
  return majorByPackageJson.get(packageJsonPath)
}

const resolveFilename = Module._resolveFilename
Module._resolveFilename = function (request, parent, ...rest) {
  if (request !== 'typescript') {
    return resolveFilename.call(this, request, parent, ...rest)
  }
  let packageJsonPath
  try {
    packageJsonPath = resolveFilename.call(
      this,
      'typescript/package.json',
      parent,
      ...rest,
    )
  } catch {
    return typescript6
  }
  if (typescriptMajor(packageJsonPath) >= 7) {
    return typescript6
  }
  return resolveFilename.call(this, request, parent, ...rest)
}
