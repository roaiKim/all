/* eslint-disable no-lonely-if */
import {
    AppleOutlined, AndroidOutlined, WindowsOutlined, HomeOutlined, GithubOutlined, InstagramOutlined, FileTextOutlined,
} from "@icon";
import React from "react";

const modules = require.context("module/", true, /\.menu\.js$/);

// 这个是由于 webpack 本身的 bug 导致的, webpack.config.js 文件中， 如果 resolve.modules 定义了 则 require.context 会有多(双)倍的
const modulesId = modules.keys().filter((item) => item.startsWith("module"));

// console.log("modulesId", modulesId);
const cacheModules = modulesId.map((id) => ({
    moduleId: id,
    module: modules(id).default,
}));

// console.log("cacheRoute", cacheModules);
const map = [];

const menuMap = {
    home: {
        order: 1,
        title: "主页",
        icon: <HomeOutlined className="ro-menu-icon" />,
    },
    game: {
        order: 2,
        title: "游戏game资源",
        icon: <AppleOutlined className="ro-menu-icon" />,
    },
    upload: {
        order: 3,
        title: "游戏upload资源",
        icon: <AndroidOutlined className="ro-menu-icon" />,
    },
    user: {
        order: 4,
        title: "游戏user资源",
        icon: <WindowsOutlined className="ro-menu-icon" />,
    },
    table: {
        order: 5,
        title: "Table",
        icon: <GithubOutlined className="ro-menu-icon" />,
    },
    "game/game4": {
        order: 5,
        title: "GAME4",
    },
    usesr1: {
        order: 6,
        title: "GAME4",
        icon: <InstagramOutlined className="ro-menu-icon" />,
    },
    filelist: {
        order: 7,
        title: "GAME4",
        icon: <FileTextOutlined className="ro-menu-icon" />,
    },
};

// 初步 检查菜单是否合法
(function checkMenu() {
    const routeMap = {};
    cacheModules.forEach(({ moduleId, module }) => {
        const { path, title, Component } = module;

        // 检查 是否设置了 path/title/Component 属性
        if (!path || !title || !Component) {
            throw new Error(`请检查 ${moduleId} 路径下是否包含 path/title/Component 属性`);
        }

        // 检查是否有重复路径
        if (routeMap[path]) {
            throw new Error(`path 错误: 在 ${routeMap[path].filePath} 和 ${moduleId} 中 path: ${path} 重复`);
        }

        // 检查是否有 错误设置的路径 // 如果有路径 为 /a, 则其他路径 不能再以 /a 开头
        const somePathItem = Object.keys(routeMap).find((item) => {
            if (item !== "/" && path !== "/") {
                if (path.length > item.length) {
                    return path.startsWith(item);
                }
                return item.startsWith(path);
            }
            return false;
        });
        if (somePathItem) {
            if (somePathItem.length < path.length) {
                throw new Error(`path 错误: ${routeMap[somePathItem].filePath} 中已设置 path 为 ${somePathItem}, 则在 ${moduleId} 中 path 属性不能再以 ${somePathItem} 开头`);
            }
            throw new Error(`path 错误: ${moduleId} 中已设置 path 为 ${path}, 则在 ${routeMap[somePathItem].filePath} 中 path 属性不能再以 ${path} 开头`);
        }
        routeMap[path] = {
            path,
            filePath: moduleId,
        };
    });
}());

// 提取路径并分级
(function mapMenu() {
    let homePageCount = 0;
    cacheModules.forEach((module) => {
        const { module: item } = module;
        const { path } = item;
        const paths = path.split("/").filter((_) => _);
        if (paths.length > 3) {
            throw new Error("菜单最多只支持3层!");
        }
        if (paths.length === 0) {
            const info = menuMap.home;
            if (!info) {
                throw new Error("请在 src/service/MenuLoader.jsx 文件的 menuMap 中配置 home 的相关信息(order/title/icon)");
            }
            if (homePageCount >= 1) {
                throw new Error("/(主路径)只能有一个, 请检查各 .*menu.js 中 path 的属性是否有多个 '/', 或者未设置 path ");
            }
            homePageCount += 1;
            map.push({
                id: item.path,
                ...info,
                page: {
                    ...item,
                },
            });
        } else if (paths.length === 1) {
            const info = menuMap[paths[0]];
            if (!info) {
                throw new Error(`请在 src/service/MenuLoader.jsx 文件的 menuMap 中配置 ${paths[0]} 相关信息`);
            }
            map.push({
                id: paths[0],
                ...info,
                page: {
                    ...item,
                },
            });
        } else if (paths.length === 2) {
            const current = map.find((mapItem) => mapItem.id === paths[0]);
            if (current) {
                if (current.children) {
                    current.children.push({
                        id: paths[1],
                        page: {
                            ...item,
                        },
                    });
                }
            } else {
                const info = menuMap[paths[0]];
                if (!info) {
                    throw new Error(`请在 menuMap 中设置 ${paths[0]} 相关信息`);
                }
                const newCurrent = {
                    id: paths[0],
                    ...info,
                    children: [
                        {
                            id: paths[1],
                            page: {
                                ...item,
                            },
                        },
                    ],
                };
                map.push(newCurrent);
            }
        } else if (paths.length === 3) {
            const current = map.find((mapItem) => mapItem.id === paths[0]);
            if (current) {
                const currentChildren = current.children.find((childrenItem) => childrenItem.id === paths[1]);
                if (currentChildren) {
                    if (currentChildren.children) {
                        currentChildren.children.push({
                            id: paths[2],
                            page: {
                                ...item,
                            },
                        });
                    }
                } else {
                    const info = menuMap[`${paths[0]}/${paths[1]}`];
                    if (!info) {
                        throw new Error(`请在 menuMap 中设置 ${paths[0]}/${paths[1]} 相关信息`);
                    }
                    current.children.push({
                        id: paths[1],
                        ...info,
                        children: [
                            {
                                id: paths[2],
                                page: {
                                    ...item,
                                },
                            },
                        ],
                    });
                }
            } else {
                const info1 = menuMap[paths[0]];
                if (!info1) {
                    throw new Error(`请在 menuMap 中设置 ${paths[0]} 相关信息`);
                }
                const info2 = menuMap[`${paths[0]}/${paths[1]}`];
                if (!info2) {
                    throw new Error(`请在 menuMap 中设置 ${paths[0]}/${paths[1]} 相关信息`);
                }
                map.push({
                    id: paths[0],
                    ...info1,
                    children: [
                        {
                            id: paths[1],
                            ...info2,
                            children: [
                                {
                                    id: paths[2],
                                    page: {
                                        ...item,
                                    },
                                },
                            ],
                        },
                    ],
                });
            }
        }
    });

}());

const cacheMenu = map.sort((prev, next) => prev.order - next.order);

const cacheRoute = cacheModules.map(({ module }) => ({ ...module }));

if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-underscore-dangle
    window._cacheMenu = cacheMenu;
    // eslint-disable-next-line no-underscore-dangle
    window._cacheRoute = cacheRoute;
}

export { cacheMenu, cacheRoute };
