#!/usr/bin/env node
/**
 * 扫描 src/pages 下所有 index.tsx / index.ts，
 * 收集「导出页面入口组件」的文件（export default Main / export default module.connect(Main)），
 * 把相对 src/pages 的路径写进 src/type/paths.ts（默认导出该字符串数组）。
 *
 * 用法：node script/path.js
 */
const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const pagesDir = path.join(projectRoot, "src", "pages");
const outputFile = path.join(projectRoot, "src", "type", "paths.ts");

/**
 * 页面入口的两种导出写法：
 *   export default Main;
 *   export default module.connect(Main);
 * Main 后面加 \b，避免把 MainLayout 之类也匹配进来。
 */
const ENTRY_RE = /export\s+default\s+(?:Main\b|module\.connect\s*\(\s*Main\s*\))/;

/**
 * 只认真正的页面入口：
 * 1. 文件所在目录必须有 component 子目录（页面目录的特征）；
 * 2. 文件本身不能就在 component 目录里（排除 xxx/component/index）。
 */
function isPageEntry(filePath) {
    const dir = path.dirname(filePath);
    return path.basename(dir) !== "component" && fs.existsSync(path.join(dir, "component"));
}

/** 递归收集 index.tsx / index.ts */
function collectIndexFiles(dir, result = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            collectIndexFiles(fullPath, result);
        } else if (/^index\.tsx?$/.test(entry.name)) {
            result.push(fullPath);
        }
    }
    return result;
}

function buildPaths() {
    return collectIndexFiles(pagesDir)
        .filter((filePath) => isPageEntry(filePath) && ENTRY_RE.test(fs.readFileSync(filePath, "utf8")))
        .map((filePath) =>
            path
                .relative(pagesDir, filePath)
                .replace(/\\/g, "/")
                .replace(/\.tsx?$/, "")
        )
        .map((item) => `pages/${item}`)
        .sort();
}

function render(paths) {
    const lines = paths.map((item) => `    "${item}",`).join("\n");
    return `/**
 * 此文件由 script/path.js 自动生成，请勿手动修改。
 * 重新生成：node script/path.js
 *
 * src/pages 下导出了页面入口组件（export default Main / export default module.connect(Main)）
 * 的 index 文件，路径相对 src 并以 pages/ 开头。
 */
const paths = [
${lines}
];

export default paths;
`;
}

function main() {
    if (!fs.existsSync(pagesDir)) {
        console.error(`[paths] 找不到页面目录：${pagesDir}`);
        process.exit(1);
    }

    const paths = buildPaths();
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, render(paths), "utf8");

    console.log(`[paths] 共找到 ${paths.length} 个页面入口，已写入 ${path.relative(projectRoot, outputFile).replace(/\\/g, "/")}`);
    paths.forEach((item) => console.log(`  - ${item}`));
}

main();
