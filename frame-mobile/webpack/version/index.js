const version = require("./version.js");
const packageJson = require("../../package.json");
const fs = require("fs");
if (packageJson.version !== version.version) {
    fs.writeFileSync(
        "../../package.json",
        JSON.stringify(
            {
                ...packageJson,
                version: version.version
            },
            null,
            2
        )
    );
}
const versionString = "`${MAJOR}.${MINOR}.${PATCH}`";
fs.writeFileSync(
    "./src/version.ts",
    `// 主版本 一般没有颠覆性升级不修改
export const MAJOR = ${version.MAJOR};

// 次版本 有新模块添加可修改
export const MINOR = ${version.MINOR};

// 修订版本 bug修复修改
export const PATCH = ${version.PATCH};

// 打包时间
export const BUILD_DATE = ${version.BUILD_DATE};

export default ${versionString};
`,
    null,
    2
);
