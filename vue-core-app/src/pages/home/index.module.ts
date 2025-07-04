import { title } from "@/service/decorator/authService"
import { async } from "@/utils"

export const moduleName = "home"

export const MainComponent = async(() => import(/* webpackChunkName: "menus" */ "./component/index.vue"))

export class AuthService {
  @title("查看")
  static main() {}

  @title("获取")
  static addition() {}
}
