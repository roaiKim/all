/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");
const os = require("os");

function resolve(relativePath) {
    return path.resolve(__dirname, `../${relativePath}`);
}

function buildPath() {
    // // 开发环境或者windows环境
    // if (process.env.NODE_ENV === "development" || os.type() === "Windows_NT") {
    //     return resolve("build");
    // }
    return resolve("build");
}

module.exports = {
    src: resolve("src"),
    core: resolve("core"),
    components: resolve("src/components"),
    build: buildPath(),
    tsConfig: resolve("tsconfig.json"),
};
