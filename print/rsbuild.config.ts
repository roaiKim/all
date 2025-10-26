import { defineConfig } from "@rsbuild/core";
import { pluginLess } from "@rsbuild/plugin-less";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
    server: {
        port: 10010,
        base: "/print",
    },
    html: {
        title: "Home",
        template: "./src/index.html",
        favicon: "./src/favicon.ico",
    },
    plugins: [pluginReact(), pluginLess()],
    performance: {
        bundleAnalyze: import.meta.env.PROD
            ? {
                  analyzerMode: "static",
                  openAnalyzer: true,
                  generateStatsFile: true,
              }
            : {},
    },
});
