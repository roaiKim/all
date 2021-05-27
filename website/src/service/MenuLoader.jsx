/* eslint-disable no-lonely-if */

const module = require.context("module/", true, /\.menu\.js$/);

// 这个是由于 webpack 本身的 bug 导致的, webpack.config.js 文件中， 如果 resolve.modules 定义了 则 require.context 会有多(双)倍的
const modulesId = module.keys().filter((item) => item.startsWith("module"));

const cacheMenu = modulesId.map((id) => module(id).default);

const map = [];

const menuMap = {
    game: {
        title: "游戏game资源",
    },
    upload: {
        title: "游戏upload资源",
    },
    user: {
        title: "游戏user资源",
    },
    game4: {
        title: "GAME4",
    },
};

if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-underscore-dangle
    window._map = map;
}

(function mapMenu() {

    // console.log("cacheMenu", JSON.stringify(cacheMenu.map((_) => ({ path: _.path }))));
    cacheMenu.forEach((item) => {
        const { path } = item;
        const paths = path.split("/").filter((_) => _);
        if (paths.length === 1) {
            console.log("menuMap[path[0]]", menuMap[paths[0]], paths[0]);
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

export { map, cacheMenu };
