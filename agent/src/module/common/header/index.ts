import { Module, pushHistory, register } from "@core";
import dayjs from "dayjs";
import { shouldIgnoreLogin } from "@project/config";
import { isDevelopment, WEB_USERNAME } from "config/static-constant";
import type { RootState } from "type/rootState";
import localModules from "utils/function/load-modules";
// import { deafaultTabs, modulesCache, nameToPath } from "utils/function/loadComponent";
import { StorageService } from "utils/StorageService";
import Main from "./component";
import { type HeaderTab, ModuleStatus } from "./type";

const initialHeaderState = {
    userName: null,
    prevPathname: null,
    activeTabName: "home",
    headerTabs: [
        {
            key: "home",
            title: "首页",
            type: ModuleStatus.EXIST,
            noClosed: true,
        },
        // ...(deafaultTabs || []),
    ],
};

class HeaderModule extends Module<RootState, "header"> {
    onEnter(): void | Promise<void> {
        const { location } = this.rootState.router;
        const pathname = (location as any).pathname || "";
        const name = pathname; //.replace(/^\/|\/$/g, "");
        console.log("---333");
        // this.pushTab(name);
        console.log("Header-onEnter", name, dayjs().format("YYYY-MM-DD HH:mm:ss"));
        this.pushHistoryByActiveKey(name);
    }

    // onLocationMatched(routeParam: object, location: Record<string, any>): void {
    //     //
    // }

    pushTab(keyPath: string) {
        // if (this.rootState.app.main.appLoadingStatus !== "done") {
        // return;
        // }
        const { headerTabs, activeTabName } = this.state;
        if (!keyPath || keyPath === activeTabName) return;
        const cacheModule = localModules.systemModules.get(keyPath);
        const currentTabIndex = headerTabs.findIndex((item) => item.key === activeTabName);
        const hasTab = headerTabs.find((item) => item.key === keyPath);
        const activeKey = activeTabName;
        const newTabs = [...headerTabs];
        // 有本地模块
        // if (cacheModule) {
        //     // const { module } = cacheModule;
        //     const { name, title } = cacheModule;
        //     activeKey = name;
        //     const { pagePermission } = this.rootState.app.main || {};
        //     const hasPermission = isDevelopment ? true : pagePermission[localModules.nameToPath.get(name) || name];
        //     const type = hasPermission ? ModuleStatus.EXIST : ModuleStatus.EXIST_NO_AUTH;
        //     if (!hasTab) {
        //         const newTab = {
        //             key: name,
        //             title,
        //             type,
        //         };
        //         newTabs.splice((currentTabIndex || 0) + 1, 0, newTab);
        //     }
        // } else {
        //     activeKey = keyPath;
        //     if (!hasTab) {
        //         const tabKey = keyPath;
        //         const { pagePermission } = this.rootState.app.main || {};
        //         console.log("---555");
        //         const pageName = pagePermission[tabKey]?.name;
        //         const newTab = {
        //             key: tabKey,
        //             title: pageName || "404-nofound",
        //             type: pageName ? ModuleStatus.DEVELOPING : ModuleStatus.NON_EXIST,
        //         };
        //         newTabs.splice((currentTabIndex || 0) + 1, 0, newTab);
        //     }
        // }
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
        this.pushHistory(activePath);
    }
}

const module = register(new HeaderModule("header", initialHeaderState));
export const actions = module.getActions();
export const MainComponent = module.connect(Main);
