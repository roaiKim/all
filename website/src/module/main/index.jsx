import {
    Lifecycle, Loading, Module, register,
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
    onRender(currentRouteParam, currentLocaltion) {

        // this.setState({ pathname: currentLocaltion.pathname || "" });
    }

    @Loading("mask")
    fetchLoginUser() {
        MainService.getUser().then((response) => {
            this.setState({
                user: response.data,
                _token: localStorage.getItem("_token"),
            });
            return response;
        }).catch((error) => {
            if (error.status === 401) {
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
