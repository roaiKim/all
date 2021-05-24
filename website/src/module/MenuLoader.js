const module = require.context("./", true, /\.menu\.js$/);

const cacheMenu = [];
console.log("keys", module.keys())
/* for(const key of module.keys()) {
    cacheMenu.push(module(key).default)
    // console.log("defaule", module(key).default)
}
 */
export default cacheMenu;