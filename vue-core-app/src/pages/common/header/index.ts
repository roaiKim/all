import router from "@/router"
import { LoginService } from "@/service/api/LoginService"
import { DEV_PROXY_HOST, isDevelopment } from "@/service/config/static-envs"
import { StorageService } from "@/service/StorageService"
import { useUserGolbalStore } from "@/stores/global.user"
import { encrypted } from "@/utils/crypto"
import { setLocalStorageWhenLogined } from "@/utils/login-service"
import { message } from "ant-design-vue"
import { v4 } from "uuid"
import { actions as MainActions } from "../main"
import { Module, moduleRegister } from "@/utils/register"
import { HeaderTabType, type HeaderTab } from "./type"

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
    // ...(deafaultTabs || []),
  ],
}

class HeaderModule extends Module<object, "header"> {
  main(pathname: string): void | Promise<void> {
    // const { location } = this.rootState.router;
    // const pathname = (location as any).pathname || "";
    const name = pathname.replace(/^\/|\/$/g, "")
    // this.pushHistoryByActiveKey(name)
  }

  // pushTab(keyPath: string) {
  //     const { headerTabs, activeTabName } = this.store();
  //     if (!keyPath || keyPath === activeTabName) return;

  //     const cacheModule = modulesCache[keyPath];
  //     const currentTabIndex = headerTabs.findIndex((item) => item.key === activeTabName);
  //     const hasTab = headerTabs.find((item) => item.key === keyPath);

  //     let activeKey = activeTabName;
  //     const newTabs = [...headerTabs];
  //     // 有本地模块
  //     if (cacheModule) {
  //         const { module } = cacheModule;
  //         const { name, title } = module;
  //         activeKey = name;
  //         const { pagePermission } = this.rootState.app.main || {};
  //         const hasPermission = isDevelopment ? true : pagePermission[nameToPath[name] || name];
  //         const type = hasPermission ? HeaderTabType.A : HeaderTabType.B;
  //         if (!hasTab) {
  //             const newTab = {
  //                 key: name,
  //                 label: title,
  //                 type,
  //             };
  //             newTabs.splice((currentTabIndex || 0) + 1, 0, newTab);
  //         }
  //     } else {
  //         activeKey = keyPath;
  //         if (!hasTab) {
  //             const tabKey = keyPath;
  //             const { pagePermission } = this.rootState.app.main || {};
  //             const pageName = pagePermission[tabKey]?.name;
  //             const newTab = {
  //                 key: tabKey,
  //                 label: pageName || "404-nofound",
  //                 type: pageName ? HeaderTabType.C : HeaderTabType.D,
  //             };
  //             newTabs.splice((currentTabIndex || 0) + 1, 0, newTab);
  //         }
  //     }
  //     this.setState({ headerTabs: newTabs, activeTabName: activeKey });
  //     // this.pushHistoryByActiveKey(activeKey);
  // }

  // toggleActiveKey(activeKey: string) {
  //     const { activeTabName } = this.state;
  //     if (activeKey !== activeTabName) {
  //         // this.setState({ activeTabName: activeKey });
  //         this.pushHistoryByActiveKey(activeKey);
  //     }
  // }

  // closeTabByKey(tabKey: string, activeKey?: string) {
  //     const { headerTabs, activeTabName } = this.state;
  //     // 如果关闭的是当前活跃的tab
  //     if (tabKey === activeTabName) {
  //         let active = "home";
  //         const tabs = headerTabs.filter((item) => item.key !== tabKey);
  //         if (activeKey) {
  //             active = activeKey;
  //         } else {
  //             const currentTabIndex = headerTabs.findIndex((item) => item.key === tabKey);
  //             const nextTab = currentTabIndex > -1 ? headerTabs[currentTabIndex + 1] : null;
  //             if (nextTab) {
  //                 active = nextTab.key;
  //             } else {
  //                 const { key } = tabs[tabs.length - 1] || {};
  //                 active = key;
  //             }
  //         }

  //         this.setState({ headerTabs: tabs });
  //         this.pushHistoryByActiveKey(active);
  //         return;
  //     }
  //     const tabs = headerTabs.filter((item) => item.key !== tabKey);
  //     this.setState({ headerTabs: tabs });
  //     if (activeKey) {
  //         this.pushHistoryByActiveKey(activeKey);
  //     }
  // }

  // sortHeaderTabs(headerTabs: HeaderTab[]) {
  //     this.setState({ headerTabs });
  // }

  // pushHistoryByActiveKey(activePath: string): void {
  //     router.push(activePath)
  // }
}

export const actions = moduleRegister(new HeaderModule("header", initialHeaderState))
