import path from 'node:path'

import { visualizer } from 'rollup-plugin-visualizer'

/**
 * 打包分析配置。
 *
 * Vite 本身没有内置的「打包分析」功能（只有 build 结束时的产物体积 + gzip 列表），
 * 社区标准做法是 rollup-plugin-visualizer：它是 rollup 官方生态插件，
 * Vite 的构建底层就是 rollup，所以直接挂到 Taro 的 compiler.vitePlugins 里即可，
 * **每次 build 都会自动生成报告**，不需要额外命令、也不需要环境变量开关。
 *
 * 产物：
 *   dist/analyzer-<平台>.html  // 树图，浏览器直接打开
 *
 * 报告放在 dist 之外，避免被打进小程序包。
 */
export default function createAnalyzer() {
  const platform = process.env.TARO_ENV || 'app'

  return visualizer({
    filename: path.resolve(__dirname, '..', 'dist', `analyzer-${platform}.html`),
    title: `${platform} bundle`,
    template: 'treemap',
    gzipSize: true,
    brotliSize: false,
    open: false,
    emitFile: false
  })
}
