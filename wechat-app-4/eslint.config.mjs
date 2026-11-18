// eslint.config.mjs —— ESLint 9 Flat Config
// 复用 agent-electron 的共享规则集 eslint-config-way，只做项目级适配
import wayConfigs from "eslint-config-way";
import { defineConfig } from "eslint/config";

export default defineConfig([
    wayConfigs,
    {
        ignores: [
            "dist/**",
            "dist-h5/**",
            "node_modules/**",
            "src/index.html",
            "**/*.d.ts",
            "babel.config.js",
            "commitlint.config.mjs",
            "stylelint.config.js",
            // "config/**",
            "types/**",
        ],
    },
    {
        // Taro 4 使用 Vite，构建期由 defineConstants 注入的全局变量
        files: ["src/**/*.{ts,tsx}"],
        languageOptions: {
            globals: {
                defineAppConfig: "readonly",
                definePageConfig: "readonly",
                wx: "readonly",
            },
        },
        rules: {
            // TypeScript 已经负责未定义变量检查，no-undef 在 TS 文件里只会误报
            "no-undef": "off",
        },
    },
]);
