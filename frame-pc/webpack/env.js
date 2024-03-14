/* eslint-env node */

const path = require("path");

function resolve(relativePath) {
    return path.resolve(__dirname, `../${relativePath}`);
}

function buildPath() {
    return resolve("build");
}

module.exports = {
    appPath: resolve(""),
    src: resolve("src"),
    core: resolve("node_modules/core-app-pc"),
    components: resolve("src/components"),
    build: buildPath(),
    tsConfig: resolve("tsconfig.json"),
    // ProxyConfig: resolve("webpack/development.proxy.json"),
    nodeMoules: resolve("node_modules"),
    eslintcache: resolve("node_modules/.cache/.eslintcache"),
    appTsBuildInfoFile: resolve("node_modules/.cache/tsconfig.tsbuildinfo"),
};
