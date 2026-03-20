import { defineConfig } from "@rsbuild/core";
import { pluginLess } from "@rsbuild/plugin-less";
import { pluginReact } from "@rsbuild/plugin-react";
import developmentProxy from "./src/config/development.proxy";
import { isProduntion } from "./src/config/static-constant";

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
        {} as Record<string, any>
    );
}

// Docs: https://rsbuild.rs/config/
export default defineConfig({
    server: {
        proxy: startProxy(),
        port: 10010,
    },
    html: {
        title: "Home",
        template: "./src/index.html",
        favicon: "./src/favicon.ico",
    },
    plugins: [pluginReact(), pluginLess()],
    performance: {
        bundleAnalyze: isProduntion
            ? {
                  analyzerMode: "static",
                  openAnalyzer: true,
                  generateStatsFile: true,
              }
            : {},
    },
});
