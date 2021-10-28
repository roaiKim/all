import { Lifecycle, Module, register } from "core";
import { WEB_TOKEN, COLLAPSED_MENU } from "@tools/enumType";
import Main from "./component";

const initialState = {
    collapsed: localStorage.getItem(COLLAPSED_MENU) === "true",
};

class NavigationModule extends Module {
    @Lifecycle()
    onRender() {
        console.log("navigation module action");
    }

    logOut() {
        localStorage.removeItem(WEB_TOKEN);
        this.setHistory("/login");
    }

    toggleCollapseMenu() {
        const { collapsed } = this.state;
        console.log("ds", collapsed);
        this.setState({ collapsed: !collapsed });
        // 设置 localStorage
        localStorage.setItem(COLLAPSED_MENU, !collapsed);
    }

    open(url, historyState) {
        this.setHistory(url);
    }
}

const module = register(new NavigationModule("navigation", initialState));
export const actions = module.getActions();
export default module.attachLifecycle(Main);
