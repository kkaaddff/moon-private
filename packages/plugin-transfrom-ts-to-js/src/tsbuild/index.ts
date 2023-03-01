import { Project } from 'ts-morph'
import * as fse from 'fs-extra'
import * as prettier from 'prettier'
import { parse } from 'path'
import MoonCore from '@zhangqc/moon-core'

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
    const project = new Project(MoonCore.CompileUtil.DefaultTsconfig)
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
  return prettier.format(text, MoonCore.CompileUtil.DefaultPrettiesConfig)
}

function buildOutPutPath(path: string, extension: '.js' | '.d.ts') {
  return path.replace(/(\.ts$|\.js)$/, extension)
}

function writeDTS2Dir(content, dtsPath) {
  fse.ensureDirSync(parse(dtsPath).dir)
  fse.writeFileSync(dtsPath, content)
}
