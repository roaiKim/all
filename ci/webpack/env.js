/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");

function resolve(relativePath) {
    return path.resolve(__dirname, `../${relativePath}`);
}

function buildPath() {
    return resolve("build");
}

module.exports = {
    src: resolve("src"),
    core: resolve("core"),
    components: resolve("src/components"),
    build: buildPath(),
    tsConfig: resolve("tsconfig.json"),
    ProxyConfig: resolve("webpack/development.proxy.json"),
    nodeMoules: resolve("node_modules"),
    eslintcache: resolve("node_modules/.cache/.eslintcache"),
};
