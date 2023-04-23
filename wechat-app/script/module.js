const chalk = require("chalk");
const fs = require("fs-extra");
const path = require("path");
const yargs = require("yargs");

const srcFolderName = "src";
const rootStatePath = path.resolve(__dirname, `../${srcFolderName}/type/index.ts`);
const available1stLevelModuleNames = fs.readdirSync(path.resolve(__dirname, `../${srcFolderName}/pages`)).filter(_ => _ !== "main");

function getModuleName(moduleNameInArg, returnOriginName = false) {
    // E.g:
    //  account/order-detail -> accountOrderDetail
    //  common/something -> something
    const replaceHyphen = (name, alwaysPascal = false) => {
        return name
            .split("-")
            .map((_, index) => (alwaysPascal || index > 0 ? _.substr(0, 1).toUpperCase() + _.slice(1) : _))
            .join("");
    };

    const moduleName = moduleNameInArg.split("/")[1] || moduleNameInArg.split("/")[0];
    return returnOriginName ? moduleName : replaceHyphen(moduleName);
}

function getModulePascalName(moduleNameInArg, suffix) {
    // E.g (suffix=State):
    //  account/order-detail -> AccountOrderDetailState
    //  common/something -> SomethingState
    const moduleFullName = getModuleName(moduleNameInArg);
    return moduleFullName.charAt(0).toUpperCase() + moduleFullName.slice(1) + suffix;
}

function createModuleFolder(moduleNameInArg) {
    const sourcePath = path.resolve(__dirname, "./module-boilerplate");
    const targetPath = path.resolve(__dirname, `../${srcFolderName}/pages/${moduleNameInArg}`);
    fs.copySync(sourcePath, targetPath);

    // Replace placeholders
    const moduleOriginName = getModuleName(moduleNameInArg, true);
    const moduleFullName = getModuleName(moduleNameInArg);
    const moduleMainComponentName = getModulePascalName(moduleNameInArg, "");
    const moduleClassName = getModulePascalName(moduleNameInArg, "Module");
    const moduleClassPropsName = getModulePascalName(moduleNameInArg, "Props");
    
    const executeReplace = (relPath, replacedTexts) => {
        let finalContent = fs.readFileSync(targetPath + relPath).toString();
        for (let i = 0; i < replacedTexts.length; i++) {
            finalContent = finalContent.replace(new RegExp("\\{" + (i + 1) + "\\}", "g"), replacedTexts[i]);
        }
        fs.writeFileSync(targetPath + relPath, finalContent);
    };

    executeReplace("/index.ts", [moduleClassName, moduleFullName]);
    executeReplace("/type.ts", [moduleOriginName, moduleMainComponentName, moduleFullName]);
    executeReplace("/component/index.tsx", [moduleClassPropsName, moduleMainComponentName, moduleFullName, moduleOriginName]);
    executeReplace("/component/index.less", [moduleOriginName]);
}

function updateRootState(moduleNameInArg) {
    const rootStateFileContent = fs.readFileSync(rootStatePath).toString();
    const lastStateImportIndex = rootStateFileContent.lastIndexOf(`type";`);
    const lastStateDeclarationIndex = rootStateFileContent.lastIndexOf("};");
    if (lastStateDeclarationIndex === -1) throw new Error("在 state.ts 中未找到 State 声明");

    const moduleFullName = getModuleName(moduleNameInArg);
    const moduleStateName = getModulePascalName(moduleNameInArg, "State");

    // Use 4 spaces, instead of \t, to keep consistent with Prettier
    const replacedRootStateFileContent = rootStateFileContent.substring(0, lastStateImportIndex+6) + `\nimport { State as ${moduleStateName} } from "module/${moduleNameInArg}/type";` + rootStateFileContent.substring(lastStateImportIndex+6, lastStateDeclarationIndex)  + `    ${moduleFullName}?: ${moduleStateName};\n    ` + rootStateFileContent.substring(lastStateDeclarationIndex);
    fs.writeFileSync(rootStatePath, replacedRootStateFileContent);
}

function generate() {
    console.info(chalk`{white.bold usage:} yarn module x/y`);
    console.info(`如果有y, x必须为 ${available1stLevelModuleNames.join("/")} 之一`);
    const moduleNameInArg = yargs.argv._[0];
    console.info(`module name: ${moduleNameInArg}`);

    try {
        const nameRegex = /^[a-z]+?(\-[a-z]+?)*$/;
        if (!moduleNameInArg) throw new Error("缺少必要的模块参数");
        if (!fs.existsSync(rootStatePath)) throw new Error("文件 type/state.ts 不存在");
        const splitModuleNames = moduleNameInArg.split("/");

        if (splitModuleNames.length > 2) throw new Error("目录层级不允许大于2级");
        if (splitModuleNames.length > 1 && !available1stLevelModuleNames.includes(splitModuleNames[0])) throw new Error(`模块 [${moduleNameInArg.split("/")[0]}] 不在可用空间(${available1stLevelModuleNames.join("/")})下`);
        
        if (splitModuleNames.length === 1) {
            const existedSubModules = fs.readdirSync(path.resolve(__dirname, `../${srcFolderName}/pages`));
            if (existedSubModules.includes(splitModuleNames[0])) throw new Error(`模块 ${moduleNameInArg} 已存在`);
        } else {
            const existedSubModules = fs.readdirSync(path.resolve(__dirname, `../${srcFolderName}/pages/${splitModuleNames[0]}`));
            if (existedSubModules.includes(splitModuleNames[1])) throw new Error(`模块 ${moduleNameInArg} 已存在`);
            if (existedSubModules.includes("index.ts")) throw new Error(`模块 ${splitModuleNames[0]} 下不允许再建模块`);
        }

        if (!nameRegex.test(splitModuleNames[0]) || !nameRegex.test(splitModuleNames[1])) throw new Error(`模块名称格式错误: ${moduleNameInArg}。 只允许小写, 或用中划线连接; E.g: rosen、rosen-one`);

        createModuleFolder(moduleNameInArg);
        updateRootState(moduleNameInArg);
        console.info(chalk`{green.bold 模块 [${moduleNameInArg}] 新建成功!}`);
    } catch (e) {
        // Delete generated, if any error triggers after creating module folder
        console.error(chalk`{red.bold Error: ${e.message}}`);
        process.exit(1);
    }
}

generate();
