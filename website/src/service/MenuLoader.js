const module = require.context("module/", true, /\.menu\.js$/);

const cacheMenu = [];

// 这个是由于 webpack 本身的 bug 导致的, webpack.config.js 文件中， 如果 resolve.modules 定义了 则 require.context 会有多(双)倍的
const _path = module.keys().filter((_) => _.startsWith("./"));

for(const key of _path) {
    cacheMenu.push(module(key).default)
    // console.log("defaule", module(key).default)
}

export default cacheMenu;
