/* eslint-disable no-lonely-if */

const module = require.context("module/", true, /\.menu\.js$/);

const cacheMenu = [];

// 这个是由于 webpack 本身的 bug 导致的, webpack.config.js 文件中， 如果 resolve.modules 定义了 则 require.context 会有多(双)倍的
const _path = module.keys().filter((item) => item.startsWith("./"));

for (const key of _path) {
    cacheMenu.push(module(key).default);

    // console.log("defaule", module(key).default)
}
console.log("cacheMenu", cacheMenu);
const maps = [
    {
        children: [
            {
                path: "/game/game1",
            },
            {
                path: "/game/game2",
            },
            {
                path: "/game/game3",
            },
            {
                children: [
                    {
                        path: "/game/game4/game1",
                    },
                    {
                        path: "/game/game4/game2",
                    },
                ],
            },
        ],
    },
    {
        path: "/upload",
    },
    {
        path: "/user",
    },
];

const map = {};
if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-underscore-dangle
    window._map = map;
}

export function mapReduce(pathArray, item) {
    const index = pathArray.length - 1;

    /* for (let j = 0; j < pathArray.length; j++) {

    } */
    for (let i = 0; i < pathArray.length; i += 1) {
        if (map.some(({ page }) => page === pathArray[i])) {
            console.log(`path${i}`, pathArray[i]);
        } else {

            // 没有
            map.push({
                page: pathArray[i],
                childred: index === i ? [item] : [],
            });
        }
    }
}

function mapMenu() {

    // console.log("cacheMenu", JSON.stringify(cacheMenu.map((_) => ({ path: _.path }))));
    cacheMenu.forEach((item) => {
        const { path } = item;
        const paths = path.split("/").filter((_) => _);
        console.log(paths);

        // map[paths[0]] = {}
        const s = {};

        // for (let i = 0; i < map.length; i += 1) {
        let prev = null;
        for (let j = 0; j < paths.length; j += 1) {

            // debugger;

            // 如果有当前值
            if (map[paths[j]]) {

                // 如果 当前值是最后一个
                if (j === paths.length - 1) {
                    map[prev][paths[j]] = item;
                    prev = null;
                } else {

                    /* if (prev) {
                        map[prev][paths[j]] = {};

                    } else {
                        map[paths[j]] = {};
                    } */
                    prev = paths[j];

                    // map[paths[j]].
                }
            } else {

                //
                if (j === paths.length - 1) {
                    if (prev) {
                        map[prev][paths[j]] = item;
                        prev = null;
                    } else {
                        map[paths[j]] = item;
                    }

                } else {
                    map[paths[j]] = {};
                    prev = paths[j];

                    // map[paths[j]].
                }
            }
        }

        // }
    });
    console.log("map", map);

    // return map;
}

export default mapMenu();
