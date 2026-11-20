const fs = require("fs");
const path = require("path");
const spawn = require("./tool/index");

const paths = [];

const srcFolderName = "src";
const sourceFileReg = /\.(?:ts|tsx|js|jsx)$/;

/**
 * 页面 Module 的鉴权标记：同一个页面目录内，类需要同时满足
 * `@verifiable` 和 `extends Module`。
 *
 * 这里允许任意空白（包括 LF / CRLF），不再依赖固定的文件名或换行符。
 */
const verifiableModuleReg = /@verifiable\s*class\s+(?<moduleName>[A-Za-z_$][\w$]*)\s+extends\s+Module\b/g;

const getModuleToPageMap = (dirPath, componentPath) => {
    const sourceFiles = fs.readdirSync(dirPath).filter((item) => sourceFileReg.test(item));
    sourceFiles.forEach((item) => {
        const source = fs.readFileSync(path.join(dirPath, item), "utf8");
        for (const modulesReg of source.matchAll(verifiableModuleReg)) {
            paths.push({
                name: modulesReg.groups.moduleName,
                path: `/${componentPath}`,
            });
        }
    });
};

const matchPageModules = (pagePaths) => {
    const pagePath = path.join(srcFolderName, pagePaths);
    const pageDir = path.dirname(pagePath);
    if (fs.existsSync(pageDir)) {
        getModuleToPageMap(pageDir, pagePaths);
    }
};

const getPagePathsByConfig = () => {
    const pages = [];
    try {
        const rels = fs.readFileSync(path.resolve(__dirname, "../src/config/mini-config.ts")).toString();
        const modulesReg = new RegExp("pages: \\[(?<paths>(.|\n|\r|S)*?)\\]", "gm").exec(rels);
        const pagePaths = modulesReg.groups.paths.replace(/\r\n\s /g, "");
        pagePaths.split(",").forEach((item) => {
            item.trim() && pages.push(item.trim().replace(/"/g, ""));
        });
    } catch (e) {
        console.error("获取mini-config信息失败");
    }
    if (pages?.length) {
        pages.forEach((item) => matchPageModules(item));
    }
};

const generateAuthFile = () => {
    getPagePathsByConfig();
    fs.writeFileSync(
        path.join(srcFolderName, "type/auth-file.ts"),
        `// 此文件自动生成, 禁止更改; \n\nconst auth = ${JSON.stringify(paths)}; \n\nexport default auth;\n`
    );
    spawn("eslint", ["src/type/auth-file.ts", "--fix"]);
};

generateAuthFile();
