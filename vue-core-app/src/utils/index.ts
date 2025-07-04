import { defineAsyncComponent } from "vue"
import { getAuthority } from "./permission"

// 异步导入组件
export const async = (asyncComponent) => {
  return defineAsyncComponent(() => asyncComponent)
}

// 是否有权限
export const getPower = (auth) => {
  const allAuth = getAuthority()
  console.log("权限-auth-key", auth.__auth_description, auth.__auth_key)
}
