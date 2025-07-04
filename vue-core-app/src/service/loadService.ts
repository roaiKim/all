import { HeaderTabType } from "@/pages/common/header/type"
import { isDevelopment } from "./config/static-envs"

// 这个是全局加载的功能
// @ts-ignore webpack 提供的功能 ts 暂时无法识别
const importModules = import.meta.glob(`/src/pages/**/index.module.ts`)

const modules = {}
const authority = {}

export const generator = () => {
  console.log("--importModules--", importModules)
  for (const path in importModules) {
    importModules[path]().then((module: any) => {
      //   console.log(path, module)
      const service = module.AuthService
      for (const propertyName of Object.getOwnPropertyNames(service)) {
        if (service[propertyName] instanceof Function && propertyName !== "constructor") {
          console.log("auth-name", `${service.name}_${propertyName}`)
        }
      }
    })
  }
}

export const generatorModules = {
  install(app) {
    generator()
  },
}

export { modules }
