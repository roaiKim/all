import { defineConfig } from "@rsbuild/core";
import { pluginLess } from "@rsbuild/plugin-less";
import { pluginReact } from "@rsbuild/plugin-react";
import developmentProxy from "./src/config/development.proxy";
import { isProduction, lessPrefixName } from "./src/config/static-constant";

function startProxy() {
    return Object.entries(developmentProxy).reduce(
        (prev, [key, value]) => (
            (prev[`/${key}`] = {
                pathRewrite: { [`^/${key}`]: "" },
                target: value,
                changeOrigin: true,
                secure: false,
                headers: {
                    Connection: "keep-alive",
                },
            }),
            prev
        ),
        {} as Record<string, any>,
    );
}

// Docs: https://rsbuild.rs/config/
export default defineConfig({
    dev: {
        lazyCompilation: false,
    },
    server: {
        proxy: startProxy(),
        port: 10010,
    },
    html: {
        title: "Home",
        template: "./public/index.html",
        favicon: "./public/avatar.png",
    },
    plugins: [
        pluginReact(),
        pluginLess({
            lessLoaderOptions: {
                additionalData: `@less-name: ${lessPrefixName};`,
            },
        }),
    ],
    performance: {
        bundleAnalyze: isProduction
            ? {
                analyzerMode: "static",
                openAnalyzer: false,
                generateStatsFile: true,
            }
            : {},
    },
});
