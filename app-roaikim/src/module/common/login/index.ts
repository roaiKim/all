import { type Location, Log, Module, register } from "@core";
import { message } from "antd";
import { v4 } from "uuid";
import { DEV_PROXY_HOST, isDevelopment } from "config/static-constant";
// import { v4 } from "uuid";
// import { DEV_PROXY_HOST, isDevelopment } from "config/static-envs";
import { actions as MainActions } from "module/common/main";
import type { Params } from "react-router";
import { LoginService } from "service/global-api/LoginService";
import type { RootState } from "type/rootState";
import { Loading } from "utils/decorator";
import { StorageService } from "utils/StorageService";
// import { setLocalStorageWhenLogined } from "utils/framework";
// import { encrypted } from "utils/function/crypto";
// import { StorageService } from "utils/StorageService";
import Login from "./component/index";

const initialLoginState = {
    companyInfo: null,
    userInfo: null,
};

class LoginModule extends Module<RootState, "login"> {
    onEnter(params: Params<string>, location: Location) {
        //
    }

    onLocationMatched(params: Params<string>, location: Location): void {
        //
    }

    // @Log()
    // onTick(): void {
    //     console.log("--LoginModule-onTick--", times);
    //     times++;
    // }

    @Loading("login-loading")
    async login(username: string, password: string) {
        const request = {
            grant_type: "password",
            username: username.trim(),
            password: password + 1, //`${encrypted(password)}`,
            randomStr: v4(),
            code: "0000",
            imgCode: "0000",
        };
        const response = await LoginService.login(request).catch((error) => {
            let content = error?.originalErrorMessage || error?.message || "";
            // if (error.statusCode === 426 || error.statusCode === 401) {
            //     content = "账号或密码错误";
            // }
            if (isDevelopment) {
                const proxyHost = StorageService.get(DEV_PROXY_HOST);
                if (!proxyHost) {
                    content = "请选择代理环境";
                }
            }
            message.error(content);
            return Promise.reject("ignore");
        });
        this.setState({ userInfo: response });
        // roPushHistory("/");
        // message.success("登录成功");
        // setLocalStorageWhenLogined(response, username, password);
        // this.dispatch(() => MainActions.fetchPermission());
    }
}

const module = register(new LoginModule("login", initialLoginState));
export const actions = module.getActions();
export const MainComponent = module.connect(Login);
