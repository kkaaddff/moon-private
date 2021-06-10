import { ModuleKind, ModuleResolutionKind, Project, ScriptTarget } from 'ts-morph'
import * as fse from 'fs-extra'
import * as prettier from 'prettier'
import { join, parse } from 'path'

const TSCONFIG = {
  compilerOptions: {
    target: ScriptTarget.ESNext, // ts-morph 内部定义 ScriptTarget
    allowJs: true,
    strict: false,
    lib: ['dom', 'esnext'],
    module: ModuleKind.ESNext, // ts-morph 内部定义
    outDir: './src/api',
    declaration: true,
    moduleResolution: ModuleResolutionKind.NodeJs, // ts-morph 内部定义
    noUnusedLocals: false,
    noUnusedParameters: false,
    esModuleInterop: true,
  },
}

const defaultPrettiesConfig = {
  tabWidth: 2,
  jsxSingleQuote: true,
  jsxBracketSameLine: true,
  endOfLine: 'lf',
  printWidth: 100,
  singleQuote: true,
  semi: false,
  trailingComma: 'es5',
  parser: 'typescript',
  ...fse.readJsonSync('.prettierrc', { throws: false }),
}

enum EXTENSION {
  dts = '.d.ts',
  js = '.js',
}

/**
 *
 */
export default async function buildTs(options: {
  content: string
  toSaveFilePath: string
  [k: string]: any
}) {
  try {
    const project = new Project(TSCONFIG)
    project.createSourceFile('_MyTempFile.ts', options.content)
    const result = project.emitToMemory()

    for (const file of result.getFiles()) {
      if (file.filePath.includes('.d.ts')) {
        const dtsPath = buildOutPutPath(options.toSaveFilePath, EXTENSION.dts)
        writeDTS2Dir(prettierFormat(file.text), dtsPath)
      } else {
        options.toSaveFilePath = buildOutPutPath(options.toSaveFilePath, EXTENSION.js)
        options.content = prettierFormat(file.text)
      }
    }
  } catch (e) {
    console.error(e)
  }
}

function prettierFormat(text) {
  return prettier.format(text, defaultPrettiesConfig)
}

function buildOutPutPath(path: string, extension: '.js' | '.d.ts') {
  return path.replace(/(\.ts$|\.js)$/, extension)
}

function writeDTS2Dir(content, dtsPath) {
  fse.ensureDirSync(parse(dtsPath).dir)
  fse.writeFileSync(dtsPath, content)
}
