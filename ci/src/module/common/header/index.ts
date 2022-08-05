import { Module, register } from "@core";
import Main from "./component";
import { RootState } from "type/state";
import { cache } from "utils/function/loadComponent";

const initialState = {
    userName: null,
    prevPathname: null,
    activeTabName: "home",
    headerTabs: [
        {
            key: "home",
            label: "首页",
            type: "page",
            noClosed: false,
        },
    ],
};

class HeaderModule extends Module<RootState, "header"> {
    onEnter(): void | Promise<void> {
        // const homeTab = {
        //     key: "home",
        //     label: "首页s",
        //     type: "page",
        //     noClosed: false,
        // };
        // const { headerTabs } = this.state;
        // const tabs = [homeTab, ...headerTabs];
        // this.setState({ headerTabs: tabs });
    }

    pushTab(keyPath) {
        const module = cache[keyPath];
        if (module) {
            //
        }
    }
}

const module = register(new HeaderModule("header", initialState));
export const actions = module.getActions();
export const MainComponent = module.connect(Main);
