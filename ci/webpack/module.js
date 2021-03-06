const chalk = require("chalk");
const fs = require("fs-extra");
const path = require("path");
const yargs = require("yargs");

const srcFolderName = "src";
const rootStatePath = path.resolve(__dirname, `../${srcFolderName}/type/state.ts`);
const available1stLevelModuleNames = fs.readdirSync(path.resolve(__dirname, `../${srcFolderName}/module`)).filter(_ => _ !== "main");

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
    const targetPath = path.resolve(__dirname, `../${srcFolderName}/module/${moduleNameInArg}`);
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
    if (lastStateDeclarationIndex === -1) throw new Error("??? state.ts ???????????? State ??????");

    const moduleFullName = getModuleName(moduleNameInArg);
    const moduleStateName = getModulePascalName(moduleNameInArg, "State");

    // Use 4 spaces, instead of \t, to keep consistent with Prettier
    const replacedRootStateFileContent = rootStateFileContent.substring(0, lastStateImportIndex+6) + `\nimport { State as ${moduleStateName} } from "module/${moduleNameInArg}/type";` + rootStateFileContent.substring(lastStateImportIndex+6, lastStateDeclarationIndex)  + `    ${moduleFullName}?: ${moduleStateName};\n    ` + rootStateFileContent.substring(lastStateDeclarationIndex);
    fs.writeFileSync(rootStatePath, replacedRootStateFileContent);
}

function generate() {
    console.info(chalk`{white.bold usage:} yarn module x/y`);
    console.info(`?????????y, x????????? ${available1stLevelModuleNames.join("/")} ??????`);
    const moduleNameInArg = yargs.argv._[0];
    console.info(`module name: ${moduleNameInArg}`);

    try {
        const nameRegex = /^[a-z]+?(\-[a-z]+?)*$/;
        if (!moduleNameInArg) throw new Error("???????????????????????????");
        if (!fs.existsSync(rootStatePath)) throw new Error("?????? type/state.ts ?????????");
        const splitModuleNames = moduleNameInArg.split("/");

        if (splitModuleNames.length > 2) throw new Error("???????????????????????????2???");
        if (splitModuleNames.length > 1 && !available1stLevelModuleNames.includes(splitModuleNames[0])) throw new Error(`?????? [${moduleNameInArg.split("/")[0]}] ??????????????????(${available1stLevelModuleNames.join("/")})???`);
        
        if (splitModuleNames.length === 1) {
            const existedSubModules = fs.readdirSync(path.resolve(__dirname, `../${srcFolderName}/module`));
            if (existedSubModules.includes(splitModuleNames[0])) throw new Error(`?????? ${moduleNameInArg} ?????????`);
        } else {
            const existedSubModules = fs.readdirSync(path.resolve(__dirname, `../${srcFolderName}/module/${splitModuleNames[0]}`));
            if (existedSubModules.includes(splitModuleNames[1])) throw new Error(`?????? ${moduleNameInArg} ?????????`);
            if (existedSubModules.includes("index.ts")) throw new Error(`?????? ${splitModuleNames[0]} ????????????????????????`);
        }

        if (!nameRegex.test(splitModuleNames[0]) || !nameRegex.test(splitModuleNames[1])) throw new Error(`????????????????????????: ${moduleNameInArg}??? ???????????????, ?????????????????????; E.g: rosen???rosen-one`);

        createModuleFolder(moduleNameInArg);
        updateRootState(moduleNameInArg);
        console.info(chalk`{green.bold ?????? [${moduleNameInArg}] ????????????!}`);
    } catch (e) {
        // Delete generated, if any error triggers after creating module folder
        console.error(chalk`{red.bold Error: ${e.message}}`);
        process.exit(1);
    }
}

generate();
