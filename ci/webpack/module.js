const chalk = require("chalk");
const fs = require("fs-extra");
const path = require("path");
const yargs = require("yargs");

const srcFolderName = "src";
const rootStatePath = path.resolve(__dirname, `../${srcFolderName}/type/state.ts`);
const available1stLevelModuleNames = fs.readdirSync(path.resolve(__dirname, `../${srcFolderName}/module`)).filter(_ => _ !== "main");

function getModuleName(moduleNameInArg) {
    // E.g:
    //  account/order-detail -> accountOrderDetail
    //  common/something -> something
    const replaceHyphen = (name, alwaysPascal = false) => {
        return name
            .split("-")
            .map((_, index) => (alwaysPascal || index > 0 ? _.substr(0, 1).toUpperCase() + _.slice(1) : _))
            .join("");
    };

    const moduleName = moduleNameInArg.split("/")[0];
    const subModuleName = moduleNameInArg.split("/")[1];
    if (moduleName === "common") {
        return replaceHyphen(subModuleName);
    } else {
        return moduleName + replaceHyphen(subModuleName, true);
    }
}

function getModulePascalName(moduleNameInArg, suffix) {
    // E.g (suffix=State):
    //  account/order-detail -> AccountOrderDetailState
    //  common/something -> SomethingState
    const moduleFullName = getModuleName(moduleNameInArg);
    return moduleFullName.charAt(0).toUpperCase() + moduleFullName.slice(1) + suffix;
}

function createModuleFolder(moduleNameInArg) {
    // Copy sources to target
    // const moduleName = moduleNameInArg.split("/")[0];
    // const subModuleName = moduleNameInArg.split("/")[1];
    const sourcePath = path.resolve(__dirname, "./module-boilerplate");
    const targetPath = path.resolve(__dirname, `../${srcFolderName}/module/${moduleNameInArg}`);
    fs.copySync(sourcePath, targetPath);

    // Replace placeholders
    const moduleFullName = getModuleName(moduleNameInArg);
    const moduleMainComponentName = getModulePascalName(moduleNameInArg, "Main");
    const moduleClassName = getModulePascalName(moduleNameInArg, "Module");
    const executeReplace = (relPath, replacedTexts) => {
        let finalContent = fs.readFileSync(targetPath + relPath).toString();
        for (let i = 0; i < replacedTexts.length; i++) {
            finalContent = finalContent.replace(new RegExp("\\{" + (i + 1) + "\\}", "g"), replacedTexts[i]);
        }
        fs.writeFileSync(targetPath + relPath, finalContent);
    };

    executeReplace("/index.ts", [moduleFullName, moduleMainComponentName, moduleClassName]);
    executeReplace("/component/Main.tsx", [moduleMainComponentName]);
}

function updateRootState(moduleNameInArg) {
    const rootStateFileContent = fs.readFileSync(rootStatePath).toString();
    const lastStateDeclarationIndex = rootStateFileContent.lastIndexOf("};");
    if (lastStateDeclarationIndex === -1) throw new Error("Cannot find state declaration in state.ts");

    const moduleFullName = getModuleName(moduleNameInArg);
    const moduleStateName = getModulePascalName(moduleNameInArg, "State");

    // Use 4 spaces, instead of \t, to keep consistent with Prettier
    const replacedRootStateFileContent = `import {State as ${moduleStateName}} from "module/${moduleNameInArg}/type";\n` + rootStateFileContent.substr(0, lastStateDeclarationIndex) + `    ${moduleFullName}?: ${moduleStateName};\n    ` + rootStateFileContent.substr(lastStateDeclarationIndex);
    fs.writeFileSync(rootStatePath, replacedRootStateFileContent);
}

function generate() {
    console.info(chalk`{white.bold usage:} yarn module x/y`);
    console.info(`x must be: ${available1stLevelModuleNames.join("/")}, y must conform to naming convention: some-name`);
    const moduleNameInArg = yargs.argv._[0];
    console.info(`module name: ${moduleNameInArg}`);
    try {

        const nameRegex = /^[a-z]+?(\-[a-z]+?)*$/;
        if (!moduleNameInArg) throw new Error("缺少必要的模块参数");
        
        if (!fs.existsSync(rootStatePath)) throw new Error("文件 type/state.ts 不存在");
        
        const splitModuleNames = moduleNameInArg.split("/");
        
        if (splitModuleNames.length > 2) throw new Error("目录层级不允许大于2级");

        if (splitModuleNames.length > 1 && available1stLevelModuleNames.indexOf(splitModuleNames[0]) === -1) throw new Error(`模块 [${moduleNameInArg.split("/")[0]}] 不在可用空间(${available1stLevelModuleNames.join("/")})下`);
        
        if (splitModuleNames.length === 1) {

            const existedSubModules = fs.readdirSync(path.resolve(__dirname, `../${srcFolderName}/module`));

            if (existedSubModules.indexOf(splitModuleNames[0]) !== -1) throw new Error(`模块 ${moduleNameInArg} 已存在`);
        } else {

            const existedSubModules = fs.readdirSync(path.resolve(__dirname, `../${srcFolderName}/module/${splitModuleNames[0]}`));

            if (existedSubModules.indexOf(splitModuleNames[1]) !== -1) throw new Error(`模块 ${moduleNameInArg} 已存在`);
        }

        if (!nameRegex.test(splitModuleNames[1])) throw new Error("模块名称格式错误: " + splitModuleNames[1]);

        // createModuleFolder(moduleNameInArg);
        // updateRootState(moduleNameInArg);
        console.info(chalk`{white.bold Create module [${moduleNameInArg}] done!}`);
    } catch (e) {
        // Delete generated, if any error triggers after creating module folder
        console.error(chalk`{red.bold Error: ${e.message}}`);
        process.exit(1);
    }
}

generate();
