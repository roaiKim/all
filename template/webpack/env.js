const path = require("path");
const os = require("os");

function resolve(relativePath) {
    return path.resolve(__dirname, `../${relativePath}`);
}

function buildPath() {
    // 开发环境或者windows环境
    if (process.env.NODE_ENV === "development" || os.type() === "Windows_NT") {
        return resolve("build");
    }
    return "/swtg/web/swtg-front";
}

module.exports = {
    src: resolve("src"),
    build: buildPath(),
    tsConfig: resolve("tsconfig.json"),
};
