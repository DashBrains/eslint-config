/* eslint @typescript-eslint/no-require-imports: 0 */
/*
 * TypeScript 7.0 ships no JavaScript API, and typescript-eslint refuses to
 * load it. When `typescript` or one of its subpaths, such as
 * typescript/lib/tsserverlibrary, resolves to a version outside the range
 * typescript-eslint supports, or is not installed, resolve it to the
 * TypeScript 6 API from @typescript/typescript6 instead. Projects on a
 * supported version keep their own copy, so the redirect stops once
 * typescript-eslint supports a newer TypeScript.
 */
const fs = require('node:fs')
const Module = require('node:module')
const semver = require('semver')

const typescript6Prefix = '@typescript/typescript6'
const supportedRange = require('typescript-eslint/package.json')
  .peerDependencies.typescript
const supportedByPackageJson = new Map()

const isSupported = (packageJsonPath) => {
  if (!supportedByPackageJson.has(packageJsonPath)) {
    const { version } = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
    supportedByPackageJson.set(
      packageJsonPath,
      semver.satisfies(version, supportedRange, { includePrerelease: true }),
    )
  }
  return supportedByPackageJson.get(packageJsonPath)
}

const resolveFilename = Module._resolveFilename
const resolveTypeScript6 = (request) => {
  try {
    return require.resolve(request.replace('typescript', typescript6Prefix))
  } catch {
    return null
  }
}

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
