const fs = require("fs");
const path = require("path");

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
                const modulesReg = new RegExp("const module = register\\(new \\w+?Module\\(\"(?<moduleName>\\w+?)\"\, initial\\w+?State\\)\\)").exec(rels);
                const relativeIndex = path.join(currentFile, "index");
                paths.push({
                    name: modulesReg.groups.moduleName,
                    path: relativeIndex.replace("src", "").replace(/\\/g, "/")
                });
            }
            getModuleNameByPath(currentFile);
        }
    });
}

const generateAuthFile = (repath) => {
    getModuleNameByPath(path.join(repath, "pages"));
    fs.writeFileSync(path.join(repath, "type/auth-file.ts"), `const auth = ${JSON.stringify(paths)}; \nexport default auth;\n`);
}

generateAuthFile("src")