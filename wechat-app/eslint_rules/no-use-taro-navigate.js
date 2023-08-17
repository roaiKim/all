/**
 * @fileoverview rosen
 * @author
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    run: true,
    meta: {
        type: "problem", // `problem`, `suggestion`, or `layout`
        messages: {
            noUseNavigateTo: "禁止使用Taro.{{ name }}方法, 使用roPushHistory替代",
        },
        docs: {
            description: "f",
            recommended: false,
            url: null, // URL to the documentation page for this rule
        },
        fixable: "code", // Or `code` or `whitespace`
        schema: [
            {
                excludes: {
                    type: "array",
                },
                path: {
                    type: ["string", "array"],
                },
            },
        ], // Add a schema if the rule has options
    },
    create(context) {
        // console.log("context", context);
        // console.log("context.getCwd()", context.getCwd());
        // console.log("context.getFilename()", context.getFilename());
        // console.log("context.sourceCode.filter()", context.sourceCode.getText());
        // const text = context.getSourceCode().getText();
        // fs.writeFileSync("./source.ts", text);
        // const ins = text.includes("Taro");
        // console.log("ins", ins);
        const relvatePath = context.getCwd();
        const fileNamePath = context.getFilename();
        const startPath = fileNamePath.replace(relvatePath, "");
        const absolvePath = startPath.slice(1).replace(/\\/g, "/");
        // console.log("absolvePath-", absolvePath);
        const path = context.options[0]?.path;

        const calc = (includeMethods) => {
            return {
                Identifier(node) {
                    if (includeMethods.includes(node.name)) {
                        const name = includeMethods.find((item) => item === node.name);
                        context.report({
                            node: node,
                            messageId: "noUseNavigateTo",
                            data: {
                                name,
                            },
                        });
                    }
                },
            };
        };

        const calcIncludes = () => {
            const methodExcludes = context.options[0]?.excludes;
            const defalutIncludes = ["switchTab", "reLaunch", "redirectTo", "navigateTo", "navigateBack"];
            if (!methodExcludes?.length) {
                return defalutIncludes;
            }
            return defalutIncludes.filter((item) => !methodExcludes.includes(item));
        };

        if (path) {
            if (typeof path === "string") {
                if (absolvePath.startsWith(path)) {
                    const includeMethods = calcIncludes();
                    return calc(includeMethods);
                }
            } else if (Array.isArray(path)) {
                const inPath = path.some((item) => absolvePath.startsWith(item));
                if (inPath) {
                    const includeMethods = calcIncludes();
                    return calc(includeMethods);
                }
            }
        }
        return {};
    },
};

// node_modules/.bin/eslint src/pages/home/index.tsx --rulesdir ./eslint_rules --rule 'no-use-taro-navigate: [error, {path: src/pages}]'
