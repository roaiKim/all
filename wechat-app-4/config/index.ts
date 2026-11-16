import path from 'path'

import { defineConfig, type UserConfigExport } from '@tarojs/cli'

import devConfig from './dev'
import prodConfig from './prod'

const resolve = (...paths: string[]) => path.resolve(__dirname, '..', ...paths)

// https://taro-docs.jd.com/docs/next/config#defineconfig-辅助函数
export default defineConfig<'vite'>(async (merge, { command, mode }) => {
  const baseConfig: UserConfigExport<'vite'> = {
    projectName: 'wechat-app-4',
    date: '2026-11-16',
    designWidth: 750,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2,
      828: 1.81 / 2
    },
    sourceRoot: 'src',
    outputRoot: process.env.TARO_OUTPUT_ROOT || 'dist',
    plugins: [
      '@tarojs/plugin-generator'
    ],
    /**
     * wechat-app 的 tsconfig 使用了 baseUrl: "./src"，业务代码里存在 `utils/xxx`、
     * `pages/xxx`、`asset/xxx` 这类「裸模块」写法。Vite 不认 tsconfig 的 baseUrl，
     * 因此这里按顶层目录逐个建立 alias，保持源码零改动。
     */
    alias: {
      '@core': resolve('node_modules/wechat-core-app'),
      '@http': resolve('src/http'),
      '@api': resolve('src/service/api'),
      utils: resolve('src/utils'),
      pages: resolve('src/pages'),
      asset: resolve('src/asset'),
      type: resolve('src/type'),
      config: resolve('src/config'),
      component: resolve('src/component'),
      service: resolve('src/service'),
      http: resolve('src/http')
    },
    defineConstants: {
    },
    copy: {
      patterns: [
      ],
      options: {
      }
    },
    framework: 'react',
    compiler: 'vite',
    mini: {
      /**
       * taro-ui 的样式是 scss 且内部大量使用 @import，sass 1.x 会打印
       * deprecation（@import / legacy-js-api）警告。这些能力要到 sass 3.0 才移除，
       * 当前 sass 锁在 1.x，不影响产物，静默掉保持日志可读。
       * 若升级到 sass 3 或 taro-ui 迁移到 @use，需要删掉这段。
       */
      sassLoaderOption: {
        silenceDeprecations: ['legacy-js-api', 'import']
      },
      postcss: {
        pxtransform: {
          enable: true,
          config: {

          }
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      },
    },
    h5: {
      sassLoaderOption: {
        silenceDeprecations: ['legacy-js-api', 'import']
      },
      publicPath: '/',
      staticDirectory: 'static',

      miniCssExtractPluginOption: {
        ignoreOrder: true,
        filename: 'css/[name].[hash].css',
        chunkFilename: 'css/[name].[chunkhash].css'
      },
      postcss: {
        autoprefixer: {
          enable: true,
          config: {}
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      },
    },
  }


  if (process.env.NODE_ENV === 'development') {
    // 本地开发构建配置（不混淆压缩）
    return merge({}, baseConfig, devConfig)
  }
  // 生产构建配置（默认开启压缩混淆等）
  return merge({}, baseConfig, prodConfig)
})
