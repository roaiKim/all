const fs = require("fs");
const path = require("path");
const spawn = require("./tool/index");

const paths = [];

const srcFolderName = "src";
const fileSuffix = ["ts", "tsx", "js", "jsx"];

const getModuleToPageMap = (dirPath, componentPath) => {
    const dirfiles = fs.readdirSync(dirPath);
    const moduleFiles = dirfiles.filter((item) => new RegExp("^\\w+?\\.module\\.tsx?$").test(item));
    moduleFiles.forEach((item) => {
        const rels = fs.readFileSync(path.join(dirPath, item)).toString();
        const modulesReg = new RegExp("\r\n@verifiable\r\nclass (?<moduleName>\\w+?) extends").exec(rels);
        if (modulesReg) {
            paths.push({
                name: modulesReg.groups.moduleName,
                path: `/${componentPath}`,
            });
        }
    });
};

const matchMainComponent = (pagePaths) => {
    const ablativePath = path.join(srcFolderName, pagePaths);
    let suffix = null;
    for (let pageSuffix of fileSuffix) {
        if (fs.existsSync(ablativePath + "." + pageSuffix)) {
            suffix = pageSuffix;
            break;
        }
    }
    if (suffix) {
        const completePath = ablativePath + "." + suffix;
        const rels = fs.readFileSync(completePath).toString();
        const modulesReg = new RegExp("export default module.connect\\(\\w+?\\);").exec(rels);
        if (modulesReg) {
            getModuleToPageMap(path.dirname(ablativePath), pagePaths);
        }
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
        pages.forEach((item) => matchMainComponent(item));
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
