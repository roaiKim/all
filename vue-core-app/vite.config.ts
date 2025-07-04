import { fileURLToPath, URL } from "node:url"

import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import vueDevTools from "vite-plugin-vue-devtools"
import Components from "unplugin-vue-components/vite"
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers"
const developmentProxy = require("./src/service/config/development.proxy.json")

const proxy = (origin = {}) => {
  const envs: any = {}
  Object.entries(developmentProxy).forEach(
    ([key, value]) =>
      (envs[`/${key}`] = {
        pathRewrite: { [`^/${key}`]: "" },
        rewrite: (path: string) => path.replace(RegExp(`^/${key}`), ""),
        target: value,
        changeOrigin: true,
        headers: {
          Connection: "keep-alive",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Methods": "*",
        },
      }),
  )
  return Object.assign({}, envs, origin)
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false, // css in js
        }),
      ],
    }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: proxy(),
  },
})
