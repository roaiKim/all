import { defineConfig } from "@rsbuild/core";
import { pluginLess } from "@rsbuild/plugin-less";
import { pluginReact } from "@rsbuild/plugin-react";
import developmentProxy from "./src/service/config/development.proxy.json";

const proxy = (origin = {}) => {
    const envs: any = {};
    Object.entries(developmentProxy).forEach(
        ([key, value]) =>
            (envs[`/${key}`] = {
                pathRewrite: { [`^/${key}`]: "" },
                rewrite: (path: string) => path.replace(RegExp(`^/${key}`), ""),
                target: value,
                changeOrigin: true,
                headers: {
                    Connection: "keep-alive",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "*",
                    "Access-Control-Allow-Methods": "*",
                },
            })
    );
    return Object.assign({}, envs, origin);
};

export default defineConfig({
    server: {
        proxy: proxy(),
        port: 10086,
    },
    plugins: [pluginReact(), pluginLess()],
    html: {
        title: "Home",
        template: "./src/index.html",
        favicon: "./src/favicon.ico",
    },
    output: {
        copy: [{ from: "./src/pages/leaflet/imgs", to: "static/image" }],
    },
});
