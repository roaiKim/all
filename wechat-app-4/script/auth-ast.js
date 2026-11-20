#!/usr/bin/env node

/**
 * AST 鉴权扫描器。
 *
 * 与 script/auth.js 不同，本脚本使用 TypeScript AST 识别：
 *   @verifiable
 *   class Xxx extends Module
 *
 * 脚本输出结果，并生成独立的 src/type/auth-ast.ts，不修改 auth-file.ts。
 * 用法：node script/auth-ast.js
 */
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const spawn = require("./tool/index");

const projectRoot = path.resolve(__dirname, "..");
const miniConfigPath = path.join(projectRoot, "src", "config", "mini-config.ts");
const outputFile = path.join(projectRoot, "src", "type", "auth-ast.ts");
const sourceExtensions = new Set([".ts", ".tsx", ".js", ".jsx"]);

function readConfiguredPages() {
    const config = fs.readFileSync(miniConfigPath, "utf8");
    const pagesBlock = config.match(/pages\s*:\s*\[([\s\S]*?)\]/)?.[1] || "";
    return [...pagesBlock.matchAll(/["'](pages\/[^"']+)["']/g)].map((match) => match[1]);
}

function getPageSourceFiles(pagePath) {
    const pageDir = path.join(projectRoot, "src", path.dirname(pagePath));
    if (!fs.existsSync(pageDir)) {
        return [];
    }
    return fs
        .readdirSync(pageDir, { withFileTypes: true })
        .filter((entry) => entry.isFile() && sourceExtensions.has(path.extname(entry.name)))
        .map((entry) => path.join(pageDir, entry.name));
}

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

function hasVerifiableDecorator(node) {
    const decorators = ts.canHaveDecorators(node) ? ts.getDecorators(node) || [] : [];
    return decorators.some((decorator) => {
        let expression = decorator.expression;
        if (ts.isCallExpression(expression)) {
            expression = expression.expression;
        }
        return ts.isIdentifier(expression) && expression.text === "verifiable";
    });
}

function extendsModule(node) {
    return (node.heritageClauses || []).some(
        (clause) =>
            clause.token === ts.SyntaxKind.ExtendsKeyword &&
            clause.types.some((type) => ts.isIdentifier(type.expression) && type.expression.text === "Module")
    );
}

function findVerifiableModules(filePath) {
    const source = fs.readFileSync(filePath, "utf8");
    const sourceFile = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true, getScriptKind(filePath));
    const modules = [];

    function visit(node) {
        if (ts.isClassDeclaration(node) && node.name && hasVerifiableDecorator(node) && extendsModule(node)) {
            modules.push(node.name.text);
        }
        ts.forEachChild(node, visit);
    }

    visit(sourceFile);
    return modules;
}

function writeAuthFile(results) {
    const auth = results.map(({ name, path: pagePath }) => ({ name, path: pagePath }));
    const lines = auth.map((item) => `    ${JSON.stringify(item)},`).join("\n");
    const content = `// 此文件自动生成, 禁止更改; \n\nconst auth = [\n${lines}\n]; \n\nexport default auth;\n`;
    fs.writeFileSync(outputFile, content, "utf8");
    spawn("eslint", ["src/type/auth-ast.ts", "--fix"]);
}

function scan() {
    const startedAt = process.hrtime.bigint();
    const results = [];

    for (const pagePath of readConfiguredPages()) {
        for (const filePath of getPageSourceFiles(pagePath)) {
            for (const moduleName of findVerifiableModules(filePath)) {
                results.push({
                    file: path.relative(projectRoot, filePath).replace(/\\/g, "/"),
                    name: moduleName,
                    path: `/${pagePath}`,
                });
            }
        }
    }

    writeAuthFile(results);
    const elapsedMs = Number(process.hrtime.bigint() - startedAt) / 1e6;
    console.log(`AST 鉴权扫描完成：发现 ${results.length} 个受保护模块，耗时 ${elapsedMs.toFixed(2)} ms`);
    results.forEach((item) => console.log(`- ${item.name} -> ${item.path} (${item.file})`));
    console.log(`已写入 ${path.relative(projectRoot, outputFile).replace(/\\/g, "/")}，未修改 auth-file.ts。`);
}

scan();
