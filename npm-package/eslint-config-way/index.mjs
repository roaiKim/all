// eslint.config.js - ESLint 9 Flat Config 格式
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";
import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import { defineConfig } from "eslint/config";
import prettier from "eslint-plugin-prettier/recommended";

const pictureFormat = "png|jpge?|svg|gif|webp";

export default defineConfig([
    js.configs.recommended,
    tseslint.configs.recommended,
    {
        files: ["src/**"],
    },
    {
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 2021,
                sourceType: "module",
                allowImportExportEverywhere: true,
                ecmaFeatures: {
                    legacyDecorators: true,
                    jsx: true,
                    arrowFunctions: true,
                },
                globals: {
                    ...globals.browser,
                    ...globals.node,
                    React: "readonly",
                },
            },
        },
    },
    {
        plugins: {
            react,
            "simple-import-sort": simpleImportSort,
            "react-hooks": reactHooks,
        },
    },
    {
        rules: {
            "prettier/prettier": [
                "error",
                {
                    singleQuote: false,
                    tabWidth: 4,
                    printWidth: 150,
                    trailingComma: "es5",
                    bracketSpacing: true,
                    endOfLine: "auto",
                },
            ],
            "@typescript-eslint/ban-types": "off",
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/explicit-member-accessibility": [
                "error",
                { accessibility: "no-public" },
            ],
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-empty-interface": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-inferrable-types": "off",
            "@typescript-eslint/no-non-null-assertion": "off",
            "@typescript-eslint/no-use-before-define": ["error", "nofunc"],
            "@typescript-eslint/ban-ts-comment": "off",
            "@typescript-eslint/no-empty-function": "off",
            "@typescript-eslint/member-ordering": [
                "error",
                {
                    default: {
                        memberTypes: [
                            "public-static-field",
                            "protected-static-field",
                            "private-static-field",
                            "public-static-method",
                            "protected-static-method",
                            "private-static-method",
                            "public-instance-field",
                            "protected-instance-field",
                            "private-instance-field",
                            "public-constructor",
                            "protected-constructor",
                            "private-constructor",
                            "public-instance-method",
                            "protected-instance-method",
                            "private-instance-method",
                        ],
                        order: "as-written",
                    },
                },
            ],
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    vars: "all",
                    args: "after-used",
                    caughtErrors: "none"
                },
            ],
            "simple-import-sort/exports": "error",
            "simple-import-sort/imports": [
                "error",
                {
                    groups: [
                        [
                            "^react",
                            "^react-\\w+?$",
                            "^@core",
                            "^\\w+?$",
                            "^[a-zA-Z-]+?$",
                            "^@",
                            "^config",
                            "^http",
                            "^component",
                            "^module",
                            "^utils",
                            "^service",
                            "^type",
                            "^[^.]+?$",
                            `.(${pictureFormat})$`,
                            "^asset",
                            "\\.\\/",
                            "\\.\\.\\/",
                            ".less",
                        ],
                    ],
                },
            ],
            "no-duplicate-imports": ["error"],
            "no-useless-computed-key": ["error"],
            "no-useless-rename": ["error"],
            "no-var": ["error"],
            "object-shorthand": "error",
            "prefer-const": ["error"],
            "require-yield": "off",
            "object-curly-spacing": ["error", "always"],
            "no-constant-condition": ["error", { checkLoops: false }],
            "no-console": ["warn", { allow: ["error", "info", "table"] }],
            "react/display-name": "off",
            "react/prop-types": "off",
            "react/react-in-jsx-scope": "off",
            "no-debugger": "off",
        },
    },
    prettier,
]);
