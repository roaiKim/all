import { Module, register } from "@core";
import Login from "./component";
import { RootState } from "type/state";
import { LoginService } from "service/api/LoginService";
import { actions as MainActions } from "module/common/main";
import { encrypted } from "utils/function/crypto";
import { StorageService } from "utils/StorageService";
import { v4 } from "uuid";
import {
    LOGIN_REMEMBER_USERNAME,
    LOGIN_REMEMBER_PASSWORD,
    WEB_DEPARTMENT_ID,
    WEB_GETTOKENTIME,
    WEB_ISLOGIN,
    WEB_NEW_USER,
    WEB_REFRESHTOKEN,
    WEB_TOKEN,
    WEB_USERID,
    WEB_USERNAME,
    WEB_USER_INFO,
} from "utils/function/staticEnvs";
import { message } from "antd";

const initialState = {
    companyInfo: null,
    userInfo: null,
};

class LoginModule extends Module<RootState, "login"> {
    async onEnter() {
        // const isLogin = StorageService.get("h5_isLogin");
        // const token = StorageService.get(WEB_TOKEN);
        // const refreshToken = StorageService.get("h5_refreshToken");
        // const userName = StorageService.get("h5_userName");
        // if (isLogin && token && refreshToken && userName) {
        //     this.pushHistory("/");
        // } else {
        //     const response = await MainService.getCompanyInfo();
        //     this.setState({ companyInfo: response });
        // }
    }

    async login(username: string, password: string) {
        const request = {
            grant_type: "password",
            username: username.trim(),
            password: `${encrypted(password)}`,
            randomStr: v4(),
            code: "0000",
            imgCode: "0000",
        };
        const loginPromise = LoginService.login(request);
        const response = await loginPromise;

        this.setState({ userInfo: response });
        this.pushHistory("/");
        message.success("登录成功");

        const { access_token, refresh_token = "", user_id, dept_id, new_user } = response;
        StorageService.set(WEB_ISLOGIN, true);
        StorageService.set(WEB_TOKEN, access_token);
        StorageService.set(WEB_USERID, `${user_id}`);
        StorageService.set(WEB_DEPARTMENT_ID, `${dept_id}`);
        StorageService.set(WEB_REFRESHTOKEN, refresh_token);
        StorageService.set(WEB_USERNAME, username);
        StorageService.set(WEB_NEW_USER, new_user);
        StorageService.set(WEB_GETTOKENTIME, new Date().getTime());
        StorageService.set(WEB_USER_INFO, response);
        StorageService.set(encrypted(LOGIN_REMEMBER_USERNAME), encrypted(username));
        StorageService.set(encrypted(LOGIN_REMEMBER_PASSWORD), encrypted(password));

        loginPromise.then(() => {
            this.dispatch(MainActions.fetchPermission);
        });
    }
}

const module = register(new LoginModule("login", initialState));
export const actions = module.getActions();
export const MainComponent = module.connect(Login);
