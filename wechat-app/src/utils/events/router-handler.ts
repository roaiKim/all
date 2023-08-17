import miniConfig from "config/mini-config";

const pagePaths = miniConfig.pages;
const tabbarPaths = miniConfig.tabBar.list.map((item) => item.pagePath);

export function routerHandler() {
    //
    console.log(pagePaths, tabbarPaths);
}
