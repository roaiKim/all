import { Module, register } from "@core";
import Login from "./component";
import { RootState } from "type/state";
import { LoginService } from "service/api/LoginService";
import { MainService } from "service/api/MainService";
import { encrypted } from "utils/function/crypto";
import { StorageService } from "utils/StorageService";
import { WEB_TOKEN } from "type/global";
import { v4 } from "uuid";

const initialState = {
    companyInfo: null,
    userInfo: null,
};

class LoginModule extends Module<RootState, "login"> {
    async onEnter() {
        const isLogin = StorageService.get("h5_isLogin");
        const token = StorageService.get(WEB_TOKEN);
        const refreshToken = StorageService.get("h5_refreshToken");
        const userName = StorageService.get("h5_userName");
        if (isLogin && token && refreshToken && userName) {
            this.pushHistory("/");
        } else {
            const response = await MainService.getCompanyInfo();
            this.setState({ companyInfo: response });
        }
    }

    async login(username: string, password: string) {
        const request = {
            grant_type: "password",
            username,
            // password: `${encodeURI(encrypted(password))}`,
            password: `${encrypted(password)}`,
            randomStr: v4(),
            code: "0000",
        };
        LoginService.login(request)
            .then((response) => {
                this.setState({ userInfo: response });
                this.pushHistory("/");
                // Toast.show("登录成功");
                const { access_token, refresh_token = "", username, user_id } = response;
                StorageService.set("h5_isLogin", true);
                StorageService.set(WEB_TOKEN, access_token);
                StorageService.set("h5_token", access_token);
                StorageService.set("h5_userId", `${user_id}`);
                StorageService.set("h5_refreshToken", refresh_token);
                StorageService.set("h5_userName", username);
                StorageService.set("h5_getTokenTime", new Date().getTime());
                StorageService.set("h5_user_info", response);
            })
            .catch(() => {
                StorageService.clear();
            });
    }
}

const module = register(new LoginModule("login", initialState));
export const actions = module.getActions();
export const MainComponent = module.connect(Login);
