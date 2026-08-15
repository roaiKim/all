import { captureError, createModuleMethodErrorAction, Module, register, type RouterLocation, type RouterParams } from "@core";
import { clearToken } from "@http";
import { shouldIgnoreLogin } from "@project/config";
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
import { joinLessPrefix } from "utils/framework";
import { clearLocalStorageWhenLogout } from "utils/framework/login-storage";
import { getPagePermission, transformMeuns } from "utils/framework/permission";
import { removeMainLoading } from "utils/framework/remove-main-loading";
import { StorageService } from "utils/StorageService";
import Main from "./component";
import type { State } from "./type";

const initialMainState: State = {
    appLoadingStatus: "loading",
    navPermission: null,
    pagePermission: {},
    initialed: false,
};

class MainModule extends Module<RootState, "main"> {
    @Loading("main")
    async onEnter(routeParam: RouterParams, location: RouterLocation) {
        // 忽略登录，仅在开发环境生效
        // console.log("0", routeParam.location.pathname);
        if (shouldIgnoreLogin) {
            this.devPage(routeParam);
            return;
        }
        const isLogin = StorageService.get(WEB_IS_LOGIN);
        const webToken = StorageService.get(WEB_TOKEN);
        if (isDevelopment) {
            const proxyHost = StorageService.get(DEV_PROXY_HOST);
            if (!proxyHost) {
                clearLocalStorageWhenLogout();
                this.pushHistory("/login");
                this.setState({ appLoadingStatus: "done" });
                return;
            }
        }
        if (webToken && isLogin) {
            this.fetchUser();
        } else {
            this.setState({ appLoadingStatus: "done" });
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
        // 如果在登录页，需要跳转到首页
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
            const container = document.querySelector(`.${joinLessPrefix("main-container")}`);
            if (container) {
                (container as any).style.height = `${window.innerHeight}px`;
            }
        } catch (e) {
            console.error("获取文档高度失败", e);
        }
    }

    async devPage(routeParam: RouterParams) {
        if (process.env.NODE_ENV === "development") {
            const { default: permission } = await import("@project/JSON/meuns.json");
            const navPermission = transformMeuns(permission);
            this.setState({
                initialed: true,
                appLoadingStatus: "done",
                navPermission,
                pagePermission: getPagePermission(),
            });
            if (routeParam.location.pathname === "/login") {
                this.pushHistory("/");
            }
        }
    }
}

const module = register(new MainModule("main", initialMainState));
export const actions = module.getActions();
export const MainComponent = module.connect(Main);
