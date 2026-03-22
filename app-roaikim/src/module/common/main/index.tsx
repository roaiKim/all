import { captureError, createModuleMethodErrorAction, Module, register, type RouterLocation, type RouterParams } from "@core";
import { clearToken } from "@http";
// import { LoginService } from "@api/LoginService";
// import { clearToken } from "@http";
import { DEV_PROXY_HOST, isDevelopment, WEB_IS_LOGIN, WEB_TOKEN } from "config/static-constant";
// import { clearLocalStorageWhenLogout } from "utils/framework";
import { GolbalService } from "service/global-api/GolbalService";
import { LoginService } from "service/global-api/LoginService";
// import { GolbalService } from "service/api/GolbalService";
import type { RootState } from "type/rootState";
// import { getPagePermission, transformMeuns } from "utils/business/permission";
import { Confirm, Loading } from "utils/decorator";
import { clearLocalStorageWhenLogout } from "utils/framework/login-storage";
import { getPagePermission, transformMeuns } from "utils/framework/permission";
import { StorageService } from "utils/StorageService";
import Main from "./component";
import type { State } from "./type";

const initialMainState: State = {
    appLoadingStatus: "loading",
    navPermission: null,
    pagePermission: null,
};

class MainModule extends Module<RootState, "main"> {
    @Loading("main")
    async onEnter(routeParam: RouterParams, location: RouterLocation) {
        // debugger;
        const isLogin = StorageService.get(WEB_IS_LOGIN);
        const webToken = StorageService.get(WEB_TOKEN);
        if (isDevelopment) {
            const proxyHost = StorageService.get(DEV_PROXY_HOST);
            if (!proxyHost) {
                clearLocalStorageWhenLogout();
                this.pushHistory("/login");
                return;
            }
        }
        if (webToken && isLogin) {
            this.fetchUser();
        } else {
            this.logout();
        }
    }

    @Loading("main")
    async fetchUser() {
        const permission = await GolbalService.getByUserId().catch((error) => {
            this.setState({ appLoadingStatus: "error" });
            return Promise.reject(error);
        });
        const navPermission = transformMeuns(permission);
        this.setState({
            appLoadingStatus: "done",
            navPermission,
            pagePermission: getPagePermission(),
        });
        const { location } = this.rootState.router;
        const pathname = location.pathname || "";
        // 如果在 登录页 需要需要跳转到首页
        if (pathname === "/login") {
            this.pushHistory("/");
        }
    }

    @Confirm("确定退出吗")
    logoutWithConfirm() {
        this.logout();
    }

    async logout() {
        await LoginService.logout();
        clearLocalStorageWhenLogout();
        clearToken();
        this.pushHistory("/login");
    }

    @Confirm("确定退出吗")
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
