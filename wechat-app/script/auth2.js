const fs = require("fs");
const path = require("path");
// const pages = require("../src/config/mini-config.ts").pages;
const defaultFiles = ["index.tsx?", "index.module.ts"];

const paths = [];

const getModuleNameByPath = (filePath) => { 
    const links = fs.readdirSync(filePath);
    links.forEach(itemPath => {
        const currentFile = path.join(filePath, itemPath); 
        const stats = fs.statSync(currentFile)
        if (stats.isDirectory()) {
            const dirfiles = fs.readdirSync(currentFile);
            if (defaultFiles.every(item => dirfiles.some(item1 => new RegExp(item).test(item1)))) {
                const rels = fs.readFileSync(path.join(currentFile, "index.module.ts")).toString();
                // const modulesReg = new RegExp("const module = register\\(new \\w+?Module\\(\"(?<moduleName>\\w+?)\"\, initial\\w+?State\\)\\)").exec(rels);
                const modulesReg = new RegExp("@verifiable\r\nclass (?<moduleName>\\w+?) extends").exec(rels);
                console.log("--dirfiles--", dirfiles);
                if (modulesReg) {
                    const relativeIndex = path.join(currentFile, "index");
                    paths.push({
                        name: modulesReg.groups.moduleName,
                        path: relativeIndex.replace("src", "").replace(/\\/g, "/"),
                    });
                }
            }
            getModuleNameByPath(currentFile);
        }
    });
}

const fileSuffix = ["ts", "tsx", "js", "jsx"];

const V = (dirPath, componentPath) => {
    const dirfiles = fs.readdirSync(dirPath);
    // console.log(dirfiles);
    const moduleFiles = dirfiles.filter(item => new RegExp("^\\w+?\\.module\\.tsx?$").test(item));
    moduleFiles.forEach(item => {
        const rels = fs.readFileSync(path.join(dirPath, item)).toString();
                // const modulesReg = new RegExp("const module = register\\(new \\w+?Module\\(\"(?<moduleName>\\w+?)\"\, initial\\w+?State\\)\\)").exec(rels);
                const modulesReg = new RegExp("@verifiable\r\nclass (?<moduleName>\\w+?) extends").exec(rels);
                // console.log("--dirfiles--", dirfiles);
                if (modulesReg) {
                    paths.push({
                        name: modulesReg.groups.moduleName,
                        path: componentPath,
                    });
                }
    });
};

const Te = (pagePaths) => {
    // export default module.connect(Main);
    const ablativePath = path.join("src", pagePaths.replace(/"/g, ""));
    let suffix = null;
    // console.log("pagePaths", pagePaths)
    // console.log("ablativePath", ablativePath)
    for(let pageSuffix of fileSuffix) {
        if (fs.existsSync(ablativePath+"."+pageSuffix)) {
            suffix = pageSuffix;
            break;
        }
    }
    if (suffix) {
        const completePath = ablativePath+"."+suffix;
        const rels = fs.readFileSync(completePath).toString();
        const modulesReg = new RegExp("export default module\.connect\\(\\w+?\\);").exec(rels);
        if (modulesReg) {
            // console.log(path.dirname(ablativePath));
            V(path.dirname(ablativePath), pagePaths);
        }
    }
}

const T = () => {
    // pages.forEach(item => {
    //     Te(item);
    // });
    const pages = [];
    try {
        const rels = fs.readFileSync(path.resolve(__dirname, "../src/config/mini-config.ts")).toString();
        const modulesReg = new RegExp("pages: \\[(?<paths>(\.|\n|\r|\S)*?)\\]", "gm").exec(rels)
        const pagePaths = modulesReg.groups.paths.replace(/\r\n\s /g, "");
        // fs.writeFileSync(path.join("src", "type/auth-file1.ts"), `[${pagePaths.split(",")}`);
        pagePaths.split(",").forEach(item => {
            item.trim() && pages.push(item.trim().replace(/"/g, ""));
        })
    } catch(e) {
        console.error("获取mini-config信息失败");
    }
    // fs.writeFileSync(path.join("src", "type/auth-file2.ts"), `${pages}`);
    if (pages?.length) {
        pages.forEach(item => { Te(item) });
    }
}

const generateAuthFile = (repath) => {
    T();
    // getModuleNameByPath(path.join(repath, "pages"));
    // console.error("获取mini-config信息失败");
    fs.writeFileSync(path.join("src", "type/auth-file2.ts"), `const auth = ${JSON.stringify(paths)}; \n\nexport default auth;\n`);
}

generateAuthFile("src")