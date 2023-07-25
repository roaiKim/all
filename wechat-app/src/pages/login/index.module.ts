import { Interval, Loading, Module, register } from "@core";
import Taro from "@tarojs/taro";
import { RootState } from "type";
import { Method } from "@http";
import { LoginService } from "service/public-api/LoginService";
import { State } from "./type";

const initialLoginModule: State = {
    name: null,
};

class LoginModule extends Module<RootState, "login"> {
    onEnter(params) {}

    @Loading()
    async login(username: string, password: string) {
        const request = {
            grant_type: "password",
            username: "gongchao",
            // password: `FXhi3+aMlwbivn8EPBWrgQ==`,
            password: `dHK1PiBQM/moZ0YnSUsViQ==`,
        };
        const response = await LoginService.login(request).catch((error) => {
            console.log("--LoginService.login--", error);
            let content = "";
            if (error.statusCode === 426) {
                content = "登录密码错误";
            } else if (error.statusCode === 401) {
                content = "账号不存在";
            }
            Taro.showModal({
                title: "错误",
                content,
                showCancel: false,
            });
            return Promise.reject("ignore");
        });
        console.log("LoginService.login#response", response);
    }
}

const module = register(new LoginModule("login", initialLoginModule));
const actions = module.getActions();

export { module, actions };
