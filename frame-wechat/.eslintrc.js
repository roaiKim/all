/* eslint-disable */
const prettier = require("./prettier.json");

const pictureFormat = "png|jpge?|svg|gif|webp";


module.exports = {
    extends: [
        "taro/react",
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended",
        "plugin:react/recommended",
        "plugin:rosen/recommended",
        "prettier",
    ],
    plugins: ["@typescript-eslint", "prettier", "simple-import-sort"],
    rules: {
        "prettier/prettier": ["error", prettier],
        "react/jsx-uses-react": "off",
        "react/react-in-jsx-scope": "off",
        "@typescript-eslint/no-empty-function": "off",
        "react/prop-types": "off",
        "react/sort-comp": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "import/first": "off",
        "simple-import-sort/exports": "error",
        "simple-import-sort/imports": ["error", {
            "groups": [
                [
                    "^react",
                    "^react-\\w+?$",
                    "^@core",
                    "^@taro",
                    "^\\w+?$",
                    "^[a-zA-Z-]+?$",
                    "^@",
                    "^utils",
                    "^http",
                    "^service",
                    "^type",
                    "^component",
                    "^pages",
                    `^(^(http|type|service|component|pages|utils))\\w+?\/.*?(?<!(${pictureFormat}))$`,
                    `.(${pictureFormat})$`,
                    "^asset",
                    "\\.\\/",
                    "\\.\\.\\/",
                    ".less"
                ]
            ]
    
        }],
        "rosen/no-use-taro-navigate": ["error", {
            "path": "src/pages"
        }],
        "@typescript-eslint/no-empty-interface": "off"
    }
};
