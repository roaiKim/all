#!/usr/bin/env node

/**
 * 使用 TypeScript AST 扫描页面入口并生成独立路径表。
 *
 * 页面发现规则：
 *   1. 扫描 src/pages 下的 index.ts / index.tsx / index.js / index.jsx；
 *   2. 排除 component 目录中的组件入口；
 *   3. 使用 AST 检查文件是否存在 export default。
 *
 * 本脚本不读取或修改 mini-config.ts，也不会覆盖 src/type/paths.ts。
 * 用法：yarn path:ast
 */
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const spawn = require("./tool/index");

const projectRoot = path.resolve(__dirname, "..");
const pagesDir = path.join(projectRoot, "src", "pages");
const outputFile = path.join(projectRoot, "src", "type", "paths-ast.ts");
const sourceExtensions = new Set([".ts", ".tsx", ".js", ".jsx"]);

function getScriptKind(filePath) {
    switch (path.extname(filePath)) {
        case ".tsx":
            return ts.ScriptKind.TSX;
        case ".jsx":
            return ts.ScriptKind.JSX;
        case ".js":
            return ts.ScriptKind.JS;
        default:
            return ts.ScriptKind.TS;
    }
}

function isPageIndex(filePath) {
    const relativePath = path.relative(pagesDir, filePath).replace(/\\/g, "/");
    const pathParts = relativePath.split("/");
    return path.basename(filePath).match(/^index\.(?:ts|tsx|js|jsx)$/) && !pathParts.slice(0, -1).includes("component");
}

function collectIndexFiles(dir, result = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            collectIndexFiles(fullPath, result);
        } else if (sourceExtensions.has(path.extname(entry.name)) && isPageIndex(fullPath)) {
            result.push(fullPath);
        }
    }
    return result;
}

function hasDefaultExport(filePath) {
    const source = fs.readFileSync(filePath, "utf8");
    const sourceFile = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true, getScriptKind(filePath));
    let found = false;

    function visit(node) {
        if (ts.isExportAssignment(node) && !node.isExportEquals) {
            found = true;
            return;
        }
        ts.forEachChild(node, visit);
    }

    visit(sourceFile);
    return found;
}

function buildPaths() {
    const paths = [];
    const invalidFiles = [];

    for (const filePath of collectIndexFiles(pagesDir)) {
        if (!hasDefaultExport(filePath)) {
            invalidFiles.push(path.relative(projectRoot, filePath).replace(/\\/g, "/"));
            continue;
        }

        const relativePath = path
            .relative(pagesDir, filePath)
            .replace(/\\/g, "/")
            .replace(/\.(?:ts|tsx|js|jsx)$/, "");
        paths.push(`pages/${relativePath}`);
    }

    if (invalidFiles.length) {
        console.warn(`[paths:ast] 以下入口缺少 export default，已跳过：`);
        invalidFiles.forEach((filePath) => console.warn(`  - ${filePath}`));
    }

    return paths.sort();
}

function render(paths) {
    const lines = paths.map((item) => `    "${item}",`).join("\n");
    return `/**
 * 此文件由 script/path-ast.js 自动生成，请勿手动修改。
 * 重新生成：yarn path:ast
 *
 * src/pages 下通过 TypeScript AST 检测到默认导出的页面入口路径。
 */
const paths = [
${lines}
];

export default paths;
`;
}

function main() {
    if (!fs.existsSync(pagesDir)) {
        console.error(`[paths:ast] 找不到页面目录：${pagesDir}`);
        process.exit(1);
    }

    const startedAt = process.hrtime.bigint();
    const paths = buildPaths();
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, render(paths), "utf8");
    spawn("eslint", ["src/type/paths-ast.ts", "--fix"]);

    const elapsedMs = Number(process.hrtime.bigint() - startedAt) / 1e6;
    console.log(`[paths:ast] 共找到 ${paths.length} 个页面入口，耗时 ${elapsedMs.toFixed(2)} ms`);
    console.log(`[paths:ast] 已写入 ${path.relative(projectRoot, outputFile).replace(/\\/g, "/")}，未修改 mini-config.ts。`);
    paths.forEach((item) => console.log(`  - ${item}`));
}

main();
