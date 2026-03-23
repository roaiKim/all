import { isDevelopment } from "../src/config/static-constant";

// 项目是否免登录，接口不报错 // 一般开发环境中用
const ignoreLogin = false;

export const shouldIgnoreLogin = isDevelopment ? ignoreLogin : false;
