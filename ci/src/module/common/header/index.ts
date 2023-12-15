import { Module, register, roPushHistory } from "@core";
import dayjs from "dayjs";
import { WEB_USERNAME } from "config/static-envs";
import { RootState } from "type/state";
import { deafaultTabs, modulesCache, nameToPath } from "utils/function/loadComponent";
import { StorageService } from "utils/StorageService";
import Main from "./component";
import { HeaderTab, HeaderTabType } from "./type";

const initialHeaderState = {
    userName: null,
    prevPathname: null,
    activeTabName: "home",
    headerTabs: [
        {
            key: "home",
            label: "首页",
            type: HeaderTabType.A,
            noClosed: true,
        },
        ...(deafaultTabs || []),
    ],
};

class HeaderModule extends Module<RootState, "header"> {
    onEnter(): void | Promise<void> {
        const { location } = this.rootState.router;
        const pathname = (location as any).pathname || "";
        const name = pathname.replace(/^\/|\/$/g, "");
        // this.pushTab(name);
        console.log("Header-onEnter", dayjs().format("YYYY-MM-DD HH:mm:ss"));
        this.pushHistoryByActiveKey(name);
    }

    // onLocationMatched(routeParam: object, location: Record<string, any>): void {
    //     //
    // }

    pushTab(keyPath: string) {
        const { headerTabs, activeTabName } = this.state;
        if (!keyPath || keyPath === activeTabName) return;

        const cacheModule = modulesCache[keyPath];
        const currentTabIndex = headerTabs.findIndex((item) => item.key === activeTabName);
        const hasTab = headerTabs.find((item) => item.key === keyPath);

        let activeKey = activeTabName;
        const newTabs = [...headerTabs];
        // 有本地模块
        if (cacheModule) {
            const { module } = cacheModule;
            const { name, title } = module;
            activeKey = name;
            const { pagePermission } = this.rootState.app.main || {};
            const hasPermission = pagePermission[nameToPath[name] || name];
            const type = hasPermission ? HeaderTabType.A : HeaderTabType.B;
            if (!hasTab) {
                const newTab = {
                    key: name,
                    label: title,
                    type,
                };
                newTabs.splice((currentTabIndex || 0) + 1, 0, newTab);
            }
        } else {
            activeKey = keyPath;
            if (!hasTab) {
                const tabKey = keyPath;
                const { pagePermission } = this.rootState.app.main || {};
                const pageName = pagePermission[tabKey]?.name;
                const newTab = {
                    key: tabKey,
                    label: pageName || "404-nofound",
                    type: pageName ? HeaderTabType.C : HeaderTabType.D,
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
            // this.setState({ activeTabName: activeKey });
            this.pushHistoryByActiveKey(activeKey);
        }
    }

    closeTabByKey(tabKey: string, activeKey?: string) {
        const { headerTabs, activeTabName } = this.state;
        // 如果关闭的是当前活跃的tab
        if (tabKey === activeTabName) {
            let active = "home";
            const tabs = headerTabs.filter((item) => item.key !== tabKey);
            if (activeKey) {
                active = activeKey;
            } else {
                const currentTabIndex = headerTabs.findIndex((item) => item.key === tabKey);
                const nextTab = currentTabIndex > -1 ? headerTabs[currentTabIndex + 1] : null;
                if (nextTab) {
                    active = nextTab.key;
                } else {
                    const { key } = tabs[tabs.length - 1] || {};
                    active = key;
                }
            }

            this.setState({ headerTabs: tabs });
            this.pushHistoryByActiveKey(active);
            return;
        }
        const tabs = headerTabs.filter((item) => item.key !== tabKey);
        this.setState({ headerTabs: tabs });
        if (activeKey) {
            this.pushHistoryByActiveKey(activeKey);
        }
    }

    sortHeaderTabs(headerTabs: HeaderTab[]) {
        this.setState({ headerTabs });
    }

    pushHistoryByActiveKey(activePath: string): void {
        roPushHistory(activePath);
    }
}

const module = register(new HeaderModule("header", initialHeaderState));
export const actions = module.getActions();
export const MainComponent = module.connect(Main);
