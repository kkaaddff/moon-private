import fs from 'fs'
import path from 'path'
import { build } from 'esbuild'
import { normalizePath } from 'vite'
import type { UserConfig } from 'vite'
import { createDebugger, isObject } from './utils'

const debug = createDebugger('fta-router:loader')

export function lookupFile(dir: string, formats: string[], pathOnly = false): string | undefined {
  for (const format of formats) {
    const fullPath = path.join(dir, format)
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
      return pathOnly ? fullPath : fs.readFileSync(fullPath, 'utf-8')
    }
  }
  const parentDir = path.dirname(dir)
  if (parentDir !== dir) {
    return lookupFile(parentDir, formats, pathOnly)
  }
}

export async function loadConfigFromFile(configRoot: string = process.cwd()): Promise<{
  path: string
  config: UserConfig
  dependencies: string[]
} | null> {
  const start = performance.now()
  const getTime = () => `${(performance.now() - start).toFixed(2)}ms`

  let resolvedPath: string | undefined
  let isTS = false
  let isESM = false
  let dependencies: string[] = []

  // check package.json for type: "module" and set `isMjs` to true
  try {
    const pkg = lookupFile(configRoot, ['package.json'])
    if (pkg && JSON.parse(pkg).type === 'module') {
      isESM = true
    }
  } catch (e) {}

  // implicit config file loaded from inline root (if present)
  // otherwise from cwd
  const jsconfigFile = path.resolve(configRoot, 'vite.config.js')
  if (fs.existsSync(jsconfigFile)) {
    resolvedPath = jsconfigFile
  }

  if (!resolvedPath) {
    const mjsconfigFile = path.resolve(configRoot, 'vite.config.mjs')
    if (fs.existsSync(mjsconfigFile)) {
      resolvedPath = mjsconfigFile
      isESM = true
    }
  }

  if (!resolvedPath) {
    const tsconfigFile = path.resolve(configRoot, 'vite.config.ts')
    if (fs.existsSync(tsconfigFile)) {
      resolvedPath = tsconfigFile
      isTS = true
    }
  }

  if (!resolvedPath) {
    console.warn('no config file found.')
    return null
  }

  try {
    let userConfig: UserConfig | undefined

    if (isESM) {
      const fileUrl = require('url').pathToFileURL(resolvedPath)
      const bundled = await bundleConfigFile(resolvedPath, true)
      dependencies = bundled.dependencies
      if (isTS) {
        // before we can register loaders without requiring users to run node
        // with --experimental-loader themselves, we have to do a hack here:
        // bundle the config file w/ ts transforms first, write it to disk,
        // load it with native Node ESM, then delete the file.
        fs.writeFileSync(resolvedPath + '.js', bundled.code)
        userConfig = await require(`${fileUrl}.js?t=${Date.now()}`)
        fs.unlinkSync(resolvedPath + '.js')
        debug(`TS + native esm config loaded in ${getTime()}`, fileUrl)
      } else {
        // using Function to avoid this from being compiled away by TS/Rollup
        // append a query so that we force reload fresh config in case of
        // server restart
        userConfig = (await require(`${fileUrl}?t=${Date.now()}`)).default
        debug(`native esm config loaded in ${getTime()}`, fileUrl)
      }
    }

    if (!isObject(userConfig)) {
      throw new Error(`config must export or return an object.`)
    }
    return {
      path: normalizePath(resolvedPath),
      config: userConfig,
      dependencies,
    }
  } catch (e) {
    throw e
  }
}

async function bundleConfigFile(fileName: string, isESM = false): Promise<{ code: string; dependencies: string[] }> {
  const result = await build({
    absWorkingDir: process.cwd(),
    entryPoints: [fileName],
    outfile: 'out.js',
    write: false,
    platform: 'node',
    bundle: true,
    format: isESM ? 'esm' : 'cjs',
    sourcemap: 'inline',
    metafile: true,
    plugins: [
      {
        name: 'externalize-deps',
        setup(build) {
          build.onResolve({ filter: /.*/ }, (args) => {
            const id = args.path
            if (id[0] !== '.' && !path.isAbsolute(id)) {
              return {
                external: true,
              }
            }
          })
        },
      },
      {
        name: 'replace-import-meta',
        setup(build) {
          build.onLoad({ filter: /\.[jt]s$/ }, async (args) => {
            const contents = await fs.promises.readFile(args.path, 'utf8')
            return {
              loader: args.path.endsWith('.ts') ? 'ts' : 'js',
              contents: contents
                .replace(/\bimport\.meta\.url\b/g, JSON.stringify(`file://${args.path}`))
                .replace(/\b__dirname\b/g, JSON.stringify(path.dirname(args.path)))
                .replace(/\b__filename\b/g, JSON.stringify(args.path)),
            }
          })
        },
      },
    ],
  })
  const { text } = result.outputFiles[0]
  return {
    code: text,
    dependencies: result.metafile ? Object.keys(result.metafile.inputs) : [],
  }
}
