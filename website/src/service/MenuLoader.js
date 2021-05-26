/* eslint-disable no-lonely-if */

const module = require.context("module/", true, /\.menu\.js$/);

// 这个是由于 webpack 本身的 bug 导致的, webpack.config.js 文件中， 如果 resolve.modules 定义了 则 require.context 会有多(双)倍的
const modulesId = module.keys().filter((item) => item.startsWith("module"));

const cacheMenu = modulesId.map((id) => module(id).default);

const map = {};

if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-underscore-dangle
    window._map = map;
}

(function mapMenu() {

    // console.log("cacheMenu", JSON.stringify(cacheMenu.map((_) => ({ path: _.path }))));
    cacheMenu.forEach((item) => {
        const { path } = item;
        const paths = path.split("/").filter((_) => _);

        // for (let i = 0; i < map.length; i += 1) {
        let prev = null;
        for (let j = 0; j < paths.length; j += 1) {
            if (prev ? prev[paths[j]] : map[paths[j]]) {
                if (j === paths.length - 1) {
                    prev[paths[j]] = item;
                    prev = null;
                } else {
                    if (prev) {
                        prev = prev[paths[j]];
                    } else {
                        prev = map[paths[j]];
                    }
                }
            } else {
                if (j === paths.length - 1) {
                    if (prev) {
                        prev[paths[j]] = item;
                        prev = null;
                    } else {
                        map[paths[j]] = item;
                    }
                } else {
                    if (prev) {
                        prev[paths[j]] = {};
                        prev = prev[paths[j]];
                    } else {
                        map[paths[j]] = {};
                        prev = map[paths[j]];
                    }
                }
            }
        }

        // }
    });
}());

/* const cacheRoute = cacheMenu.map((item) => ({
    path: item.path,
    title: item.title,
    icon: item.icon,
})); */

export default { map, cacheMenu };
