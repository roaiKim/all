import Taro from "@tarojs/taro";
import { Loading, Module, register } from "@core";
import { RootState } from "type/state";
import { LoginService } from "service/public-api/LoginService";
import { State } from "./type";

const initialMainState: State = {
    name: null,
    accessToken: null,
    loggedin: false,
    loginInfo: null,
};

class MainModule extends Module<RootState, "main"> {
    onEnter(params: Record<string, any>): void | Promise<void> {
        //
        console.log("Main-in");
    }

    @Loading()
    async login(username: string, password: string) {
        const request = {
            grant_type: "password",
            username: "gongchao",
            password: `FXhi3+aMlwbivn8EPBWrgQ==`,
            // password: `dHK1PiBQM/moZ0YnSUsViQ==`,
        };
        const response = await LoginService.login(request).catch((error) => {
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

        Taro.showToast({ title: "登录成功" });
        this.setState({
            loggedin: true,
            accessToken: response.access_token,
            loginInfo: response,
        });
        Taro.setStorageSync("WEB_TOKEN", response.access_token);
    }
}

const module = register(new MainModule("main", initialMainState));
const actions = module.getActions();

export { module, actions };
