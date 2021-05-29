/* eslint-disable no-lonely-if */
import {
    AppleOutlined, AndroidOutlined, WindowsOutlined, ChromeOutlined, HomeOutlined,
} from "@icon";
import React from "react";

const module = require.context("module/", true, /\.menu\.js$/);

// 这个是由于 webpack 本身的 bug 导致的, webpack.config.js 文件中， 如果 resolve.modules 定义了 则 require.context 会有多(双)倍的
const modulesId = module.keys().filter((item) => item.startsWith("module"));

const cacheRoute = modulesId.map((id) => module(id).default);

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
    game4: {
        order: 5,
        title: "GAME4",
        icon: <ChromeOutlined className="ro-menu-icon" />,
    },
};

(function mapMenu() {

    cacheRoute.forEach((item) => {
        const { path } = item;
        const paths = path.split("/").filter((_) => _);
        if (paths.length === 0) {
            map.push({
                id: item.path,
                ...menuMap.home,
                page: {
                    ...item,
                },
            });
        } else if (paths.length === 1) {
            map.push({
                id: paths[0],
                ...menuMap[paths[0]],
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
                } else {
                    current.children = {
                        id: paths[1],
                        page: {
                            ...item,
                        },
                    };
                }
            } else {
                const newCurrent = {
                    id: paths[0],
                    ...menuMap[paths[0]],
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
                    } else {
                        currentChildren.children = {
                            id: paths[2],
                            page: {
                                ...item,
                            },
                        };
                    }
                } else {
                    current.children.push({
                        id: paths[1],
                        ...menuMap[paths[1]],
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
                map.push({
                    id: paths[0],
                    ...menuMap[paths[0]],
                    children: [
                        {
                            id: paths[1],
                            ...menuMap[paths[1]],
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
        } else {
            throw new Error("菜单最多只支持3层!");
        }
    });

}());

const cacheMenu = map.sort((prev, next) => prev.order - next.order);

if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-underscore-dangle
    window._cacheMenu = cacheMenu;
    // eslint-disable-next-line no-underscore-dangle
    window._cacheRoute = cacheRoute;
}

export { cacheMenu, cacheRoute };
