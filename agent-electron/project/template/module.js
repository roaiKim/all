
/* eslint-env node */

import chalk from "chalk";
import fs from "fs-extra";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..", "..");
const srcRoot = path.join(projectRoot, "src");
const moduleRoot = path.join(srcRoot, "module");
const rootStatePath = path.join(srcRoot, "type", "rootState.ts");
const boilerplatePath = path.join(__dirname, "module-boilerplate");

function getModuleSegments(moduleNameInArg) {
    return (moduleNameInArg || "").split("/").filter(Boolean);
}

function getModuleName(moduleNameInArg, returnOriginName = false) {
    const replaceHyphen = (name, alwaysPascal = false) => {
        return name
            .split("-")
            .map((item, index) => (alwaysPascal || index > 0 ? item.slice(0, 1).toUpperCase() + item.slice(1) : item))
            .join("");
    };

    const segments = getModuleSegments(moduleNameInArg);
    const moduleName = segments[1] || segments[0];
    return returnOriginName ? moduleName : replaceHyphen(moduleName);
}

function getModulePascalName(moduleNameInArg, suffix = "") {
    const moduleFullName = getModuleName(moduleNameInArg);
    return moduleFullName.charAt(0).toUpperCase() + moduleFullName.slice(1) + suffix;
}

function getTargetModulePath(moduleNameInArg) {
    return path.join(moduleRoot, ...getModuleSegments(moduleNameInArg));
}

function getNamespacePath(moduleNameInArg) {
    return path.join(moduleRoot, getModuleSegments(moduleNameInArg)[0]);
}

function getAvailable1stLevelModuleNames() {
    if (!fs.existsSync(moduleRoot)) {
        return [];
    }

    return fs
        .readdirSync(moduleRoot)
        .filter((name) => fs.statSync(path.join(moduleRoot, name)).isDirectory())
        .sort();
}

function createModuleFolder(moduleNameInArg) {
    const targetPath = getTargetModulePath(moduleNameInArg);
    fs.ensureDirSync(path.dirname(targetPath));
    fs.copySync(boilerplatePath, targetPath);

    const moduleOriginName = getModuleName(moduleNameInArg, true);
    const moduleFullName = getModuleName(moduleNameInArg);
    const moduleMainComponentName = getModulePascalName(moduleNameInArg);
    const moduleClassName = getModulePascalName(moduleNameInArg, "Module");
    const moduleClassPropsName = getModulePascalName(moduleNameInArg, "Props");
    console.log("GH", moduleOriginName, moduleFullName, moduleMainComponentName, moduleClassName, moduleClassPropsName);
    const executeReplace = (relativePath, replacedTexts) => {
        const filePath = path.join(targetPath, relativePath);
        let finalContent = fs.readFileSync(filePath, "utf8");
        replacedTexts.forEach((item, index) => {
            finalContent = finalContent.replace(new RegExp(`\\{${index + 1}\\}`, "g"), item);
        });
        fs.writeFileSync(filePath, finalContent);
    };

    executeReplace("index.ts", [moduleClassName, moduleFullName, moduleOriginName]);
    executeReplace("type.ts", [moduleOriginName, moduleMainComponentName, moduleFullName]);
    executeReplace("component/index.tsx", [moduleClassPropsName, moduleMainComponentName, moduleFullName, moduleOriginName]);
    executeReplace("component/index.less", [moduleOriginName]);

    return targetPath;
}

function getGeneratedFilePaths(targetPath) {
    return fs
        .readdirSync(targetPath, { withFileTypes: true })
        .flatMap((entry) => {
            const entryPath = path.join(targetPath, entry.name);
            return entry.isDirectory() ? getGeneratedFilePaths(entryPath) : [entryPath];
        })
        .filter((filePath) => fs.statSync(filePath).isFile());
}

function resolveEslintCommand() {
    const binName = process.platform === "win32" ? "eslint.cmd" : "eslint";
    const localCommand = path.join(projectRoot, "node_modules", ".bin", binName);
    return fs.existsSync(localCommand) ? localCommand : null;
}

function formatFiles(filePaths) {
    const eslintCommand = resolveEslintCommand();
    if (!eslintCommand) {
        console.warn(chalk.yellow("Warning:"), "未找到 ESLint，跳过文件格式化");
        return;
    }

    const existingFiles = [...new Set(filePaths)].filter((filePath) => fs.existsSync(filePath));
    const eslintTargetFiles = existingFiles.filter((filePath) => [".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"].includes(path.extname(filePath)));

    if (eslintTargetFiles.length === 0) {
        return;
    }

    const result = spawnSync(
        eslintCommand,
        ["--fix", "--config", path.join(projectRoot, "eslint.config.js"), "--no-warn-ignored", ...eslintTargetFiles],
        {
            cwd: projectRoot,
            shell: process.platform === "win32",
            stdio: "pipe",
        },
    );

    if (result.error) {
        throw result.error;
    }

    if (result.status === 1) {
        return;
    }

    if (result.status !== 0) {
        throw new Error("文件自动格式化失败");
    }
}

function updateRootState(moduleNameInArg) {
    const eol = fs.readFileSync(rootStatePath, "utf8").includes("\r\n") ? "\r\n" : "\n";
    const lines = fs.readFileSync(rootStatePath, "utf8").split(/\r?\n/);
    const moduleFullName = getModuleName(moduleNameInArg);
    const moduleStateName = getModulePascalName(moduleNameInArg, "State");
    const importLine = `import type { State as ${moduleStateName} } from "module/${moduleNameInArg}/type";`;
    const stateLine = `        ${moduleFullName}: ${moduleStateName};`;

    if (!lines.includes(importLine)) {
        let lastImportIndex = -1;
        lines.forEach((line, index) => {
            if (line.startsWith("import ")) {
                lastImportIndex = index;
            }
        });

        if (lastImportIndex === -1) {
            throw new Error('未找到 "src/type/rootState.ts" 中的 import 区域');
        }

        lines.splice(lastImportIndex + 1, 0, importLine);
    }

    const appStartIndex = lines.findIndex((line) => line.includes("app: {"));
    if (appStartIndex === -1) {
        throw new Error("未找到 RootState 中的 app 字段");
    }

    const appEndIndex = lines.findIndex((line, index) => index > appStartIndex && /^\s*};\s*$/.test(line));
    if (appEndIndex === -1) {
        throw new Error("未找到 RootState.app 的结束位置");
    }

    const hasStateLine = lines.some((line) => new RegExp(`^\\s*${moduleFullName}\\??:\\s*${moduleStateName};\\s*$`).test(line));
    if (!hasStateLine) {
        lines.splice(appEndIndex, 0, stateLine);
    }

    fs.writeFileSync(rootStatePath, lines.join(eol));
}

function validateModuleName(moduleNameInArg) {
    const nameRegex = /^[a-z]+(?:-[a-z]+)*$/;

    if (!moduleNameInArg) {
        throw new Error("缺少模块名称");
    }

    const segments = getModuleSegments(moduleNameInArg);

    if (segments.length === 0 || segments.length > 2) {
        throw new Error("模块路径最多支持两层，例如 home 或 client/management");
    }

    if (!segments.every((name) => nameRegex.test(name))) {
        throw new Error(`模块名称格式错误：${moduleNameInArg}。仅支持小写字母和中划线，例如 rosen 或 rosen-one`);
    }

    if (!fs.existsSync(rootStatePath)) {
        throw new Error('文件 "src/type/rootState.ts" 不存在');
    }

    const targetPath = getTargetModulePath(moduleNameInArg);
    if (fs.existsSync(targetPath)) {
        throw new Error(`模块 "${moduleNameInArg}" 已存在`);
    }

    if (segments.length === 2) {
        const namespacePath = getNamespacePath(moduleNameInArg);
        const namespaceEntryFilePath = path.join(namespacePath, "index.ts");

        if (fs.existsSync(namespaceEntryFilePath)) {
            throw new Error(`"${segments[0]}" 已经是具体模块，不能继续在其下创建子模块`);
        }
    }
}

function cleanupEmptyNamespace(moduleNameInArg) {
    const segments = getModuleSegments(moduleNameInArg);
    if (segments.length !== 2) {
        return;
    }

    const namespacePath = getNamespacePath(moduleNameInArg);
    if (!fs.existsSync(namespacePath)) {
        return;
    }

    if (fs.readdirSync(namespacePath).length === 0) {
        fs.removeSync(namespacePath);
    }
}

function generate() {
    const moduleNameInArg = process.argv[2];
    const available1stLevelModuleNames = getAvailable1stLevelModuleNames();

    console.info(chalk.white.bold("usage:"), "yarn module x/y");
    console.info(`当前一级目录：[${available1stLevelModuleNames.join("|") || "(空)"}]`);
    console.info(`module name: ${moduleNameInArg}`);

    let createdModulePath = "";

    try {
        validateModuleName(moduleNameInArg);
        createdModulePath = createModuleFolder(moduleNameInArg);
        updateRootState(moduleNameInArg);
        formatFiles([...getGeneratedFilePaths(createdModulePath), rootStatePath]);
        console.info(chalk.green.bold(`模块 [${moduleNameInArg}] 新建成功!`));
    } catch (error) {
        if (createdModulePath && fs.existsSync(createdModulePath)) {
            fs.removeSync(createdModulePath);
            cleanupEmptyNamespace(moduleNameInArg);
        }

        console.error(chalk.red.bold("Error:"), error.message);
        process.exit(1);
    }
}

generate();
