import { Module, register } from "@core";
import Main from "./component";
import { RootState } from "type/state";
import { cache } from "utils/function/loadComponent";
import { v4 } from "uuid";
import { HeaderTab } from "./type";

const initialState = {
    userName: null,
    prevPathname: null,
    activeTabName: "home",
    headerTabs: [
        {
            key: "home",
            label: "首页",
            type: "page",
            noClosed: true,
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

    pushTab(keyPath: string) {
        const cacheModule = cache[keyPath];
        const { headerTabs } = this.state;
        if (cacheModule) {
            const { module } = cacheModule;
            const { name, title } = module;
            if (headerTabs.find((item) => item.key === name)) {
                this.setState({ activeTabName: name });
                return;
            }
            const newTab = {
                key: name,
                label: title,
                type: "page",
            };
            this.setState({ headerTabs: [...headerTabs, newTab], activeTabName: name });
            return;
        }
        const tabKey = keyPath || v4();
        const newTab = {
            key: tabKey,
            label: "开发中...",
            type: "page",
        };
        this.setState({ headerTabs: [...headerTabs, newTab], activeTabName: tabKey });
    }

    toggleActiveKey(activeKey: string) {
        const { activeTabName } = this.state;
        if (activeKey !== activeTabName) {
            this.setState({ activeTabName: activeKey });
        }
    }

    closeTabByKey(tabKey: string) {
        const { headerTabs, activeTabName } = this.state;
        // 如果关闭的是当前活跃的tab
        if (tabKey === activeTabName) {
            const currentTabIndex = headerTabs.findIndex((item) => item.key === tabKey);
            const nextTab = currentTabIndex > -1 ? headerTabs[currentTabIndex + 1] : null;
            let active = "home";
            const tabs = headerTabs.filter((item) => item.key !== tabKey);
            if (nextTab) {
                active = nextTab.key;
            } else {
                const { key } = tabs[tabs.length - 1] || {};
                active = key;
            }
            this.setState({ headerTabs: tabs, activeTabName: active });
            return;
        }
        const tabs = headerTabs.filter((item) => item.key !== tabKey);
        this.setState({ headerTabs: tabs });
    }

    sortHeaderTabs(headerTabs: HeaderTab[]) {
        this.setState({ headerTabs });
    }
}

const module = register(new HeaderModule("header", initialState));
export const actions = module.getActions();
export const MainComponent = module.connect(Main);
