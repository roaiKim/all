/* eslint-disable */
const prettier = require("./prettier.json");

module.exports = {
    extends: [
        "taro/react",
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended",
        "plugin:react/recommended",
        "plugin:rosen/recommended",
        "prettier"
    ],
    plugins: ["@typescript-eslint", "prettier"],
    rules: {
        "prettier/prettier": ["error", prettier],
        "react/jsx-uses-react": "off",
        "react/react-in-jsx-scope": "off",
        "@typescript-eslint/no-empty-function": "off",
        "react/prop-types": "off",
        "react/sort-comp": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "import/order": ["error"],
        "rosen/no-use-taro-navigate": ["error", {
            path: "src/pages"
        }],
        "@typescript-eslint/no-empty-interface": "off"
    },
};
