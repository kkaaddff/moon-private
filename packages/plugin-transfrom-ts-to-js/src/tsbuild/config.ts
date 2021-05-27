import { join } from 'path'
const typescript2 = require('rollup-plugin-typescript2')

export default () => {
  const tsconfigPath = join('./', 'tsconfig.json')
  const plugins = [
    typescript2({
      tsconfig: tsconfigPath,
      useTsconfigDeclarationDir: true,
      tsconfigOverride: {
        compilerOptions: {},
      },
    }),
  ]
  return {
    plugins,
  }
}
