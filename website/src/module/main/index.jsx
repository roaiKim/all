import {
    Lifecycle, Loading, Module, register,
} from "core";
import { MainService } from "@api/MainService";
import Main from "./component";

const initialState = {
    user: "ro",
    pathname: null,
    record: null,
    collapsed: localStorage.getItem("COLLAPSED_MENU") === "true",
};

class MainModule extends Module {

    @Lifecycle()
    onRegister() {

        // this.login();
        this.fetchCurrentUser();
    }

    @Lifecycle()
    onRender() {

        // this.setState({ pathname: location.pathname || '' });
    }

    @Loading("mask")
    fetchCurrentUser() {
        MainService.getUser().then((response) => {
            console.log("fetchCurrentUser response", response);
            return response;
        }).catch((error) => {
            console.log("fetchCurrentUser error", error);
        });
        console.log("fetchCurrentUser response1");
    }

    @Loading("mask")
    login(user) {
        MainService.login({
            name: user.name,
            password: user.password,
        }).then((response) => {
            localStorage.setItem("_token", response.token);
            this.setState({ record: response });
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
