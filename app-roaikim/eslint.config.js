import exampleConfigs from "eslint-config-way";
import { defineConfig } from "eslint/config";

export default defineConfig([
    exampleConfigs,
    {
        ignores: ["webpack/**", "src/index.html", "./rsbuild.config.ts", "build", "**/**.d.ts"],
    },
]);
