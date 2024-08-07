const prettier = require("./prettier.json");
const pictureFormat = "png|jpge?|svg|gif|webp";

module.exports = {
    parser: "@typescript-eslint/parser",
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended",
        "plugin:react/recommended",
        "prettier",
    ],
    plugins: ["@typescript-eslint", "prettier", "simple-import-sort"],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module",
        ecmaFeatures: { jsx: true },
    },
    rules: {
        "prettier/prettier": ["error", prettier],
        "@typescript-eslint/ban-types": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-member-accessibility": ["error", { accessibility: "no-public" }],
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-empty-interface": "off",
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
                        "public-abstract-field",
                        "protected-abstract-field",
                        "private-abstract-field",
                        "public-constructor",
                        "protected-constructor",
                        "private-constructor",
                        "public-instance-method",
                        "protected-instance-method",
                        "private-instance-method",
                        "public-abstract-method",
                        "protected-abstract-method",
                        "private-abstract-method",
                    ],
                    order: "as-written",
                },
            },
        ],
        "simple-import-sort/exports": "error",
        "simple-import-sort/imports": ["error", {
            "groups": [
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
                    ".less"
                ]
            ]
        }],
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-inferrable-types": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-use-before-define": ["error", "nofunc"],
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/no-empty-function": "off",
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
    "settings": {
        "react": {
            "version": "detect",
        }
    }
};
