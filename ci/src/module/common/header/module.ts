import { Module, register, roPushHistory } from "@core";
import { WEB_USERNAME } from "config/static-envs";
import { RootState } from "type/state";
import { cache } from "utils/function/loadComponent";
import { StorageService } from "utils/StorageService";
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
        const { location } = this.rootState.router;
        const pathname = (location as any).pathname || "";
        const name = pathname.replace(/^\/|\/$/g, "");
        console.log("oooo", name);
        console.log("StorageService.get<string>(WEB_USERNAME)", StorageService.get<string>(WEB_USERNAME));
        this.pushTab(name);
    }

    // onLocationMatched(routeParam: object, location: Record<string, any>): void {
    //     //
    // }

    pushTab(keyPath: string) {
        const { headerTabs, activeTabName } = this.state;
        if (!keyPath || keyPath === activeTabName) return;

        const cacheModule = cache[keyPath];
        const currentTabIndex = headerTabs.findIndex((item) => item.key === activeTabName);
        const hasTab = headerTabs.find((item) => item.key === keyPath);

        let activeKey = activeTabName;
        const newTabs = [...headerTabs];
        if (cacheModule) {
            const { module } = cacheModule;
            const { name, title } = module;
            activeKey = name;
            if (!hasTab) {
                const newTab = {
                    key: name,
                    label: title,
                    type: "page",
                };
                newTabs.splice((currentTabIndex || 0) + 1, 0, newTab);
            }
        } else {
            activeKey = keyPath;
            if (!hasTab) {
                const tabKey = keyPath;
                const newTab = {
                    key: tabKey,
                    label: "开发中...",
                    type: "page",
                };
                newTabs.splice((currentTabIndex || 0) + 1, 0, newTab);
            }
        }
        this.setState({ headerTabs: newTabs, activeTabName: activeKey });
        // this.pushHistoryByActiveKey(activeKey);
    }

    toggleActiveKey(activeKey: string) {
        const { activeTabName } = this.state;
        if (activeKey !== activeTabName) {
            this.setState({ activeTabName: activeKey });
            this.pushHistoryByActiveKey(activeKey);
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

    pushHistoryByActiveKey(activePath: string): void {
        roPushHistory(activePath);
    }
}

const module = register(new HeaderModule("header", initialState));
const actions = module.getActions();

export { actions, module };
