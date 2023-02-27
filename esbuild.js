import fs from 'node:fs'
import esbuild from 'esbuild'

const packageJsonPath = new URL('package.json', import.meta.url)
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath).toString())

const external = [
  ...Object.keys(packageJson.dependencies ?? {}),
  ...Object.keys(packageJson.peerDependencies ?? {})
]

const filesToBuild = fs
  .readdirSync(new URL('src', import.meta.url), { withFileTypes: true })
  .map((dirent) => dirent.isFile() ? dirent.name : null)
  .filter(Boolean)

console.log({ filesToBuild })

/**
 * Check if folders for correct module resolving exists (need for correct autocomplete in ide)
 * @param {string} alias
 */
function ensureModuleFolder (alias) {
  if (alias === 'index') return

  const dirPath = new URL(alias, import.meta.url)
  const packageJson = new URL(`${alias}/package.json`, import.meta.url)

  try {
    fs.rmSync(dirPath, { recursive: true, force: true })
  } catch (e) {
    console.error(e)
  }

  fs.mkdirSync(dirPath)

  fs.writeFileSync(packageJson, JSON.stringify(
    {
      name: `i18n-plum/${alias}`,
      // types: `../dist/index.d.ts`, // bundling all types in one file not works for now
      types: `../dist/types/${alias}.d.ts`,
      main: `../dist/cjs/${alias}.js`,
      module: `../dist/esm/${alias}.js`,
      sideEffects: false
    },
    null,
    2
  ) + '\n')
}

function fillPackageJson (alias) {
  const fieldName = alias === 'index' ? '.' : `./${alias}`

  packageJson.exports[fieldName] = {
    // types: `./dist/index.d.ts`, // bundling all types in one file not works for now
    types: `./dist/types/${alias}.d.ts`,
    require: `./dist/cjs/${alias}.js`,
    import: `./dist/esm/${alias}.js`,
    default: `./dist/esm/${alias}.js`
  }

  if (alias !== 'index') packageJson.files.push(`/${alias}`)
}

packageJson.files = [
  '/dist',
  '/src',
  'CHANGELOG.md',
  'README.md',
  'LICENSE',
  'package.json'
]
packageJson.exports = {
  './package.json': './package.json'
}

for (const fileName of filesToBuild) {
  const [alias] = fileName.split('.')

  ensureModuleFolder(alias)
  fillPackageJson(alias)
}

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')

/**
 * @param {'esm' | 'cjs' } format
 */
function buildForFormat (format) {
  esbuild.buildSync({
    entryPoints: filesToBuild.map(file => `src/${file}`),
    nodePaths: ['./'],
    outdir: './dist/' + format,
    sourcemap: true,
    jsx: 'automatic',
    minify: true,
    bundle: true,
    platform: 'browser',
    external,
    target: ['esnext', 'node16', 'chrome100'],
    format
  })
}

buildForFormat('cjs')
buildForFormat('esm')
