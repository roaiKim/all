/**
 * 删除页面/模块，并同步清理：
 *   1. src/pages/<模块> 目录
 *   2. src/type/state.ts 中该模块的 State 导入与 RootState 字段
 *   3. src/config/mini-config.ts 中 pages 的路径（以及 tabBar 中指向该页面的项）
 *
 * 用法：
 *   yarn remove-module <一级模块>/<页面名>     # 例：yarn remove-module common/setting
 *   yarn remove-module <页面名>                # 例：yarn remove-module order-search
 *   yarn remove-module <模块> --force          # 仍有其他地方引用时强制删除
 *
 * 删除后建议再执行一次 `yarn path` 更新 src/type/paths.ts。
 */
const path = require("node:path");
const chalk = require("chalk");
const fs = require("fs-extra");
const yargs = require("yargs");
const spawn = require("./tool/index");

const projectRoot = path.resolve(__dirname, "..");
const srcDir = path.resolve(projectRoot, "src");
const pagesDir = path.resolve(srcDir, "pages");
const rootStatePath = path.resolve(srcDir, "type/state.ts");
const miniConfigPath = path.resolve(srcDir, "config/mini-config.ts");
/** 这些文件由脚本维护/自动生成，不算业务引用 */
const excludedFiles = new Set([
    rootStatePath,
    miniConfigPath,
    path.resolve(srcDir, "type/paths.ts"),
    path.resolve(srcDir, "type/auth-file.ts"),
]);

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** 核心页面，禁止通过命令删除 */
const PROTECTED_ROOTS = ["main", "home", "common"];

/** 提取 import / require / 动态 import 的模块说明符 */
function extractSpecifiers(content) {
    const specs = [];
    const specRe = /(?:from\s*|require\(\s*|^\s*import\s+|import\(\s*)["']([^"']+)["']/gm;
    let match = specRe.exec(content);
    while (match) {
        specs.push(match[1]);
        match = specRe.exec(content);
    }
    return specs;
}

function isSubPath(candidate, dir) {
    const rel = path.relative(dir, candidate);
    return rel === "" || (!rel.startsWith("..") && !path.isAbsolute(rel));
}

/** 说明符是否指向目标模块目录：支持 @pages/xxx、pages/xxx、相对路径 */
function isInModule(specifier, fromFile, moduleDir) {
    if (specifier.startsWith(".")) {
        return isSubPath(path.resolve(path.dirname(fromFile), specifier), moduleDir);
    }

    const pageMatch = specifier.match(/^@?pages\/(.+)$/);
    if (pageMatch) {
        return isSubPath(path.resolve(pagesDir, pageMatch[1]), moduleDir);
    }

    return false;
}

/** 扫描 src 下除目标目录外的引用 */
function findReferences(modulePath, targetDir) {
    const results = [];
    const routeRe = new RegExp(`["']/${escapeRegExp(modulePath)}/index(?=["'?])`);

    const walk = (dir) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                if (fullPath !== targetDir) walk(fullPath);
            } else if (/\.(ts|tsx|js|jsx)$/.test(entry.name) && !excludedFiles.has(fullPath)) {
                const content = fs.readFileSync(fullPath, "utf8");
                const hit =
                    routeRe.test(content) ||
                    extractSpecifiers(content).some((specifier) => isInModule(specifier, fullPath, targetDir));
                if (hit) results.push(path.relative(projectRoot, fullPath));
            }
        }
    };

    walk(srcDir);
    return results;
}

/** 从 RootState 中删除 import 与字段，返回被删除的 State 名称 */
function removeFromRootState(modulePath) {
    let content = fs.readFileSync(rootStatePath, "utf8");
    const importRe = new RegExp(`^import \\{ State as (\\w+) \\} from "@?${escapeRegExp(modulePath)}/type";\\r?\\n`, "m");
    const match = content.match(importRe);
    if (!match) {
        console.warn(chalk`{yellow 未在 type/state.ts 中找到 ${modulePath} 的 State 导入，跳过}`);
        return null;
    }

    const stateName = match[1];
    content = content.replace(importRe, "");

    const fieldRe = new RegExp(`^\\s*\\w+\\??: ${stateName};\\r?\\n`, "m");
    if (!fieldRe.test(content)) {
        console.warn(chalk`{yellow 未在 RootState 中找到字段 ${stateName}，只删除 import}`);
    } else {
        content = content.replace(fieldRe, "");
    }

    fs.writeFileSync(rootStatePath, content);
    return stateName;
}

/** 从 pages 数组中删除路径 */
function removeFromPages(content, modulePath) {
    const pageRe = new RegExp(`^\\s*"${escapeRegExp(modulePath)}/index",\\r?\\n`, "m");
    if (!pageRe.test(content)) {
        console.warn(chalk`{yellow 未在 mini-config.pages 中找到 ${modulePath}/index，跳过}`);
        return { content, removed: false };
    }
    return { content: content.replace(pageRe, ""), removed: true };
}

/** 从 tabBar.list 中删除指向该页面的对象 */
function removeFromTabBar(content, modulePath) {
    const listKeyIndex = content.indexOf("list: [");
    if (listKeyIndex === -1) return { content, removed: false };

    const arrayStart = content.indexOf("[", listKeyIndex);
    let depth = 0;
    let arrayEnd = -1;
    for (let i = arrayStart; i < content.length; i += 1) {
        if (content[i] === "[") depth += 1;
        if (content[i] === "]") {
            depth -= 1;
            if (depth === 0) {
                arrayEnd = i;
                break;
            }
        }
    }
    if (arrayEnd === -1) return { content, removed: false };

    const inner = content.slice(arrayStart + 1, arrayEnd);
    const blocks = [];
    let braceDepth = 0;
    let blockStart = -1;
    for (let i = 0; i < inner.length; i += 1) {
        if (inner[i] === "{") {
            if (braceDepth === 0) blockStart = i;
            braceDepth += 1;
        } else if (inner[i] === "}") {
            braceDepth -= 1;
            if (braceDepth === 0 && blockStart !== -1) {
                blocks.push([blockStart, i + 1]);
                blockStart = -1;
            }
        }
    }

    const pagePath = `pagePath: "${modulePath}/index"`;
    const targets = blocks.filter(([start, end]) => inner.slice(start, end).includes(pagePath));
    if (!targets.length) return { content, removed: false };

    let newInner = inner;
    targets.reverse().forEach(([start, end]) => {
        newInner = newInner.slice(0, start) + newInner.slice(end);
    });
    // 清掉删除后残留的空注释行、多余逗号与空行（避免出现稀疏数组）
    newInner = newInner
        .replace(/^[ \t]*\/\/[ \t]*$/gm, "")
        .replace(/,[ \t]*\n[ \t]*,/g, ",")
        .replace(/^[ \t]*,/gm, "")
        .replace(/\n\s*\n\s*\n/g, "\n\n");

    return {
        content: content.slice(0, arrayStart + 1) + newInner + content.slice(arrayEnd),
        removed: true,
        count: targets.length,
    };
}

function remove() {
    console.info(chalk`{white.bold usage:} yarn remove-module x/y [--force]`);
    const moduleArg = yargs.argv._[0];
    const force = Boolean(yargs.argv.force);
    console.info(`module name: ${moduleArg}`);

    try {
        if (!moduleArg) throw new Error("缺少必要的模块参数");
        const rootSegment = moduleArg.split("/")[0];
        if (PROTECTED_ROOTS.includes(rootSegment)) {
            throw new Error(`pages/${rootSegment} 下的页面属于核心页面，不允许通过命令删除`);
        }
        if (!/^[a-z]+(-[a-z]+)*(\/[a-z]+(-[a-z]+)*)*$/.test(moduleArg)) {
            throw new Error(`模块名称格式错误: ${moduleArg}。只允许小写字母，用中划线连接，层级用 / 分隔`);
        }

        const modulePath = `pages/${moduleArg}`;
        const targetDir = path.resolve(srcDir, modulePath);
        if (!targetDir.startsWith(pagesDir + path.sep)) throw new Error(`路径不合法: ${moduleArg}`);
        if (!fs.existsSync(targetDir) || !fs.statSync(targetDir).isDirectory()) {
            throw new Error(`模块目录不存在: src/${modulePath}`);
        }
        if (!fs.existsSync(path.join(targetDir, "index.tsx")) && !fs.existsSync(path.join(targetDir, "index.ts"))) {
            throw new Error(`src/${modulePath} 下没有 index.tsx / index.ts，不像是页面模块`);
        }

        const references = findReferences(modulePath, targetDir);
        if (references.length && !force) {
            console.error(chalk`{red.bold 该模块仍被以下文件引用，如确认删除请加 --force：}`);
            references.forEach((file) => console.error(`  - ${file}`));
            process.exit(1);
        }
        if (references.length && force) {
            console.warn(chalk`{yellow 仍有引用，已按 --force 继续删除：}`);
            references.forEach((file) => console.warn(`  - ${file}`));
        }

        fs.removeSync(targetDir);
        console.info(chalk`{green ✔ 已删除目录 src/${modulePath}}`);

        const stateField = removeFromRootState(modulePath);
        if (stateField) console.info(chalk`{green ✔ 已删除 RootState 中的 ${stateField}}`);

        let configContent = fs.readFileSync(miniConfigPath, "utf8");
        const pagesResult = removeFromPages(configContent, modulePath);
        configContent = pagesResult.content;
        if (pagesResult.removed) console.info(chalk`{green ✔ 已删除 mini-config.pages 中的 ${modulePath}/index}`);

        const tabBarResult = removeFromTabBar(configContent, modulePath);
        configContent = tabBarResult.content;
        if (tabBarResult.removed) {
            console.info(chalk`{green ✔ 已删除 mini-config.tabBar 中指向 ${modulePath}/index 的项}`);
            const remain = (configContent.match(/pagePath:/g) || []).length;
            if (remain < 2) {
                console.warn(chalk`{yellow 当前 tabBar 只剩 ${remain} 项，微信要求 2~5 项，请手动补充}`);
            }
        }
        fs.writeFileSync(miniConfigPath, configContent);

        [rootStatePath, miniConfigPath].forEach((file) => spawn("eslint", [file, "--fix"], `eslint --fix 失败: ${file}`));

        console.info(chalk`{green.bold 模块 [${moduleArg}] 删除完成!}`);
        console.info(chalk`{gray 建议执行 yarn path 更新 src/type/paths.ts}`);
    } catch (e) {
        console.error(chalk`{red.bold Error: ${e.message}}`);
        process.exit(1);
    }
}

remove();
