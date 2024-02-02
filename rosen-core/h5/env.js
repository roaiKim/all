/* eslint-env node */

const path = require("path");

function resolve(relativePath) {
    return path.resolve(__dirname, `../${relativePath}`);
}

function buildPath() {
    return resolve("lib");
}

module.exports = {
    appPath: resolve(""),
    src: resolve("src"),  
    build: buildPath(),
    tsConfig: resolve("tsconfig.json"), 
    nodeMoules: resolve("node_modules"),
    eslintcache: resolve("node_modules/.cache/.eslintcache"),
    appTsBuildInfoFile: resolve("node_modules/.cache/tsconfig.tsbuildinfo"),
};
