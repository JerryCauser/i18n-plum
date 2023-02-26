import fs from 'node:fs'
import esbuild from 'esbuild'

const packageJson = JSON.parse(
  fs.readFileSync(new URL('package.json', import.meta.url)).toString()
)

const external = [
  ...Object.keys(packageJson.dependencies || {}),
  ...Object.keys(packageJson.peerDependencies || {})
]

const filesToBuild = fs
  .readdirSync(new URL('src', import.meta.url), { withFileTypes: true })
  .map((dirent) => (dirent.isFile() ? 'src/' + dirent.name : null))
  .filter(Boolean)

/**
 * @param {'esm' | 'cjs' } format
 */
function buildForFormat (format) {
  esbuild.buildSync({
    entryPoints: filesToBuild,
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
