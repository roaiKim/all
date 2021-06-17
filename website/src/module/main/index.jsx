import {
    Lifecycle, Loading, Module, register, loadingAction, showLoading,
} from "core";
import { MainService } from "@api/MainService";
import { message } from "antd";
import Main from "./component";

const initialState = {
    user: null,
    prevPathname: null,
    record: null,
    collapsed: localStorage.getItem("COLLAPSED_MENU") === "true",
};

class MainModule extends Module {

    @Lifecycle()
    onRegister() {
        this.fetchLoginUser();
    }

    @Lifecycle()
    // eslint-disable-next-line no-unused-vars
    onRender(currentRouteParam, currentLocaltion) {

        // this.setState({ pathname: currentLocaltion.pathname || "" });
    }

    @Loading("check")
    async fetchLoginUser() {
        await MainService.getUser().then((response) => {
            this.setState({
                user: response.data,
                _token: localStorage.getItem("_token"),
            });
            console.log("showLoading(this.rootState ", showLoading(this.rootState, "check"));
            if (showLoading(this.rootState, "check")) {
                this.dispatch(() => loadingAction(false, "check"));
            }
        }).catch((error) => {
            if (error.status === 401) {
                console.log("showLoading(this.rootState ", showLoading(this.rootState, "check"));
                if (showLoading(this.rootState, "check")) {
                    this.dispatch(() => loadingAction(false, "check"));
                }
                try {

                    // prevPathname 是跳转登录页之前的路径 用于登录成功后跳到之前的页面
                    const { pathname } = this.rootState.router.location;
                    this.setState({ prevPathname: pathname === "/login" ? "/" : pathname });
                    if (pathname !== "/login") {
                        this.setHistory("/login");
                    }
                } catch {
                    this.setHistory("/login");
                }
            } else {
                this.dispatch(() => loadingAction(true, "check"));
                message.error(error.message || error.error || "网络错误");
            }
        });
    }

    @Loading("mask")
    login(user) {
        MainService.login({
            name: user.name,
            password: user.password,
        }).then((response) => {
            localStorage.setItem("_token", response.token);
            this.setState({
                user: response.user,
                _token: response.token,
            });

            //
            const { pathname } = this.rootState.router.location;
            this.setHistory(pathname === "/login" ? "/" : pathname);
        });
    }

    toggleCollapseMenu() {
        const { collapsed } = this.state;
        this.setState({ collapsed: !collapsed });

        // 设置 localStorage
        localStorage.setItem("COLLAPSED_MENU", !collapsed);
    }

}

const module = register(new MainModule("main", initialState));
export const actions = module.getActions();
export const MainComponent = module.attachLifecycle(Main);
