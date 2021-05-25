
const module = require.context("module/", true, /\.menu\.js$/);

const cacheMenu = [];

// 这个是由于 webpack 本身的 bug 导致的, webpack.config.js 文件中， 如果 resolve.modules 定义了 则 require.context 会有多(双)倍的
const _path = module.keys().filter((_) => _.startsWith("./"));

for (const key of _path) {
    cacheMenu.push(module(key).default);

    // console.log("defaule", module(key).default)
}

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

function mapReduce(pathArray, item) {
    const index = pathArray.length - 1;

    /* for (let j = 0; j < pathArray.length; j++) {

    } */
    for (let i = 0; i < pathArray.length; i++) {
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
    console.log("cacheMenu", JSON.stringify(cacheMenu.map((_) => ({ path: _.path }))));
    cacheMenu.map((item) => {
        const { path } = item;
        const _pathArray = path.split("/").filter((_) => _);
        console.log(_pathArray);

        // map[_pathArray[0]] = {}
        const s = {};
        for (let i = 0; i < _pathArray.length; i++) {
            if (!map[_pathArray[i]]) {
                if (i === _pathArray.length - 1) {
                    map[_pathArray[i]] = {
                        item,
                    };
                } else {

                    /* map[_pathArray[i]] = {}
                    s = map[_pathArray[i]] */
                }

                // s = map[_pathArray[i]]
            } else {

                /*  s[_pathArray[i]] = {
                    item
                } */
            }
        }
    });
    console.log("map", map);

    // return map;
}

export default mapMenu();
