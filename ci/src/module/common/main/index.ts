import { captureError, Loading, Module, register, roPushHistory } from "@core";
import { LoginService } from "@api/LoginService";
import { clearToken } from "@http";
import { DEV_PROXY_HOST, isDevelopment, WEB_ISLOGIN, WEB_TOKEN } from "config/static-envs";
import { GolbalService } from "service/api/GolbalService";
import { RootState } from "type/state";
import { getPagePermission, transformMeuns } from "utils/business/permission";
import { WithConfirm } from "utils/decorator/withConfirm";
import { clearLocalStorageWhenLogout } from "utils/framework";
import { StorageService } from "utils/StorageService";
import Main from "./component";

const initialMainState = {
    PERMISSION_DONE: null,
    navPermission: null,
    pagePermission: null,
};

class MainModule extends Module<RootState, "main"> {
    async onEnter() {
        const isLogin = StorageService.get(WEB_ISLOGIN);
        const webToken = StorageService.get(WEB_TOKEN);
        if (isDevelopment) {
            const proxyHost = StorageService.get(DEV_PROXY_HOST);
            if (!proxyHost) {
                clearLocalStorageWhenLogout();
                roPushHistory("/login");
                return;
            }
        }
        if (webToken && isLogin) {
            this.fetchPermission();
        } else {
            this.logout();
        }
    }

    // @RetryOnNetworkConnectionError()
    @Loading("PERMISSION")
    async fetchPermission() {
        const permission = await GolbalService.getByUserId().catch(
            (error) => (this.setState({ PERMISSION_DONE: false }), captureError(error), Promise.reject(""))
        );
        const navPermission = transformMeuns(permission);
        this.setState({
            PERMISSION_DONE: true,
            navPermission,
            pagePermission: getPagePermission(),
        });
        const { location } = this.rootState.router;
        const pathname = (location as any).pathname || "";
        // 如果在 登录页 需要需要跳转到首页
        if (pathname === "/login") {
            roPushHistory("/");
        }
    }

    @WithConfirm("确定退出吗")
    async logoutWithConfirm() {
        this.logout();
    }

    async logout() {
        await LoginService.logout();
        clearLocalStorageWhenLogout();
        clearToken();
        roPushHistory("/login");
    }

    calcPageHeight() {
        try {
            const container = document.querySelector(".ro-main-container");
            if (container) {
                (container as any).style.height = `${window.innerHeight}px`;
            }
        } catch (e) {
            console.error("获取文档高度失败", e);
        }
    }
}

const module = register(new MainModule("main", initialMainState));
export const actions = module.getActions();
export const MainComponent = module.connect(Main);
