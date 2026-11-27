/* eslint @typescript-eslint/no-require-imports: 0 */
/*
 * TypeScript 7.0 ships no JavaScript API, and typescript-eslint refuses to
 * load it. When `typescript` or one of its subpaths, such as
 * typescript/lib/tsserverlibrary, resolves to TypeScript 7.0, to a version
 * outside the range typescript-eslint supports, or to nothing, resolve it to
 * the TypeScript 6 API from @typescript/typescript6 instead. Projects on a
 * supported version keep their own copy, so the redirect stops once
 * typescript-eslint supports a newer TypeScript that ships an API.
 */
const fs = require('node:fs')
const Module = require('node:module')
const semver = require('semver')

const supportedRange = require('typescript-eslint/package.json')
  .peerDependencies.typescript

// TypeScript 7.0 has no JavaScript API, whatever range typescript-eslint
// declares later.
const versionsWithoutApi = '>=7.0.0-0 <7.1.0-0'

const supportedByPackageJson = new Map()

const isSupported = (packageJsonPath) => {
  if (!supportedByPackageJson.has(packageJsonPath)) {
    const { version } = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

    const options = { includePrerelease: true }

    supportedByPackageJson.set(
      packageJsonPath,
      semver.satisfies(version, supportedRange, options) &&
        !semver.satisfies(version, versionsWithoutApi, options),
    )
  }

  return supportedByPackageJson.get(packageJsonPath)
}

const typescript6PackageJson =
  require.resolve('@typescript/typescript6/package.json')

// @typescript/typescript6 ships only typescript.js, tsserverlibrary.js and
// tsc.js. Resolve other files, such as lib/lib.es5.d.ts, from the
// typescript@6 package it depends on.
const typescript6Requires = [
  {
    require: Module.createRequire(__filename),
    name: '@typescript/typescript6',
  },
  {
    require: Module.createRequire(typescript6PackageJson),
    name: '@typescript/old',
  },
]

const resolveTypeScript6 = (request) => {
  for (const { require: requireFrom, name } of typescript6Requires) {
    try {
      return requireFrom.resolve(request.replace('typescript', name))
    } catch {
      // Try the next package.
    }
  }

  return null
}

const resolveFilename = Module._resolveFilename

Module._resolveFilename = function (request, parent, ...rest) {
  if (request !== 'typescript' && !request.startsWith('typescript/')) {
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
    packageJsonPath = null
  }

  if (packageJsonPath === null || !isSupported(packageJsonPath)) {
    const redirected = resolveTypeScript6(request)

    if (redirected !== null) {
      return redirected
    }
  }

  return resolveFilename.call(this, request, parent, ...rest)
}
