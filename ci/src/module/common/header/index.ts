import { Module, register } from "@core";
import Main from "./component";
import { RootState } from "type/state";

const initialState = {
    userName: null,
    prevPathname: null,
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

    pushTab(keyPath) {}
}

const module = register(new HeaderModule("header", initialState));
export const actions = module.getActions();
export const MainComponent = module.connect(Main);
