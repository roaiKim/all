import { Loading, Module, register, roPushHistory } from "@core";
import { LoginService } from "@api/LoginService";
import { DEV_PROXY_HOST, isDevelopment, WEB_ISLOGIN, WEB_TOKEN } from "config/static-envs";
import { clearToken } from "http/static-type";
import { GolbalService } from "service/api/GolbalService";
import { RootState } from "type/state";
import { WithConfirm } from "utils/decorator/withConfirm";
import { clearLocalStorageWhenLogout } from "utils/function";
import { StorageService } from "utils/StorageService";
import Main from "./component";

const initialState = {
    PERMISSION_DONE: null,
};

class MainModule extends Module<RootState, "main"> {
    async onEnter(parms: {}, location: Location) {
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
        console.log("-=Main-onEnter=-", parms, location);
    }

    onLocationMatched(routeParam: object, location: Record<string, any>): void {
        console.log("-=Main-onLocationMatched=-", routeParam, location);
    }

    // @RetryOnNetworkConnectionError()
    @Loading("PERMISSION")
    async fetchPermission() {
        await GolbalService.getByUserId();
        this.setState({ PERMISSION_DONE: true });
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

const module = register(new MainModule("main", initialState));
export const actions = module.getActions();
export const MainComponent = module.connect(Main);
