/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue"
  const component: DefineComponent<{}, {}, any>
  export default component
}

/**
 * crypto-js
 */
declare module "crypto-js" {
  const anything: any
  export default anything
}

/**
 * uuid
 */
declare module "uuid" {
  export const v4: () => string
}
