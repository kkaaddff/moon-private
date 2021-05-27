import { rollup } from 'rollup'
import getConfig from './config'

/**
 *
 */
export default async function buildTs(options: { context: string; [k: string]: any }) {
  try {
    const config = getConfig()
    const bundle = await rollup({
      ...config,
      context: options.context,
    })
    debugger
  } catch (e) {
    console.error(e)
  }
}
