import { Loading, Module, register } from "@core";
import Taro from "@tarojs/taro";
import { roPushHistory } from "utils";
import { withConfirm } from "utils/decorator/withConfirm";
import { delayToast } from "utils/functions";
import { Toast } from "utils/ui/toast";
import { clearToken } from "http/static";
import { LoginService } from "service/public-api/LoginService";
import { RootState } from "type/state";
import { State } from "./type";

import { WEB_ISLOGIN, WEB_TOKEN, WEB_USER_INFO } from "config/static-envs";

const initialMainState: State = {
    name: "main",
    accessToken: null,
    loggedin: false,
    loginInfo: null,
};

class MainModule extends Module<RootState, "main"> {
    onEnter(params: Record<string, any>): void | Promise<void> {
        const accessToken = Taro.getStorageSync(WEB_TOKEN);
        const loggedin = Taro.getStorageSync(WEB_ISLOGIN);
        const loginInfo = Taro.getStorageSync(WEB_USER_INFO);
        this.setState({ loggedin, accessToken, loginInfo });
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
                content: JSON.stringify(error),
                showCancel: false,
            });
            return Promise.reject("ignore");
        });

        this.setState({
            loggedin: true,
            accessToken: response.access_token,
            loginInfo: response,
        });
        Taro.setStorageSync(WEB_TOKEN, response.access_token);
        Taro.setStorageSync(WEB_ISLOGIN, true);
        Taro.setStorageSync(WEB_USER_INFO, response);

        // await delayToast("登录成功");
        Taro.showToast({
            title: "登录成功",
            success: () => {
                roPushHistory("/pages/home/index");
            },
        });
    }

    @withConfirm("确定退出登录吗？")
    logOutConfirm() {
        this.exit();
    }

    async exit() {
        await LoginService.logout();
        await delayToast("退出成功");
        this.clearLoginState();
        roPushHistory("/pages/home/index");
    }

    async exitByPasswordChanged() {
        await LoginService.logout();
        await delayToast("密码修改成功, 请重新登录");
        this.clearLoginState();
        roPushHistory("/pages/login/index");
    }

    clearLoginState() {
        this.setState({
            accessToken: null,
            loggedin: false,
            loginInfo: null,
        });
        Taro.clearStorageSync();
        clearToken();
    }
}

const module = register(new MainModule("main", initialMainState));
const actions = module.getActions();

export { actions, module };
