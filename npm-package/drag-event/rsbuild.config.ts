import { defineConfig } from "@rsbuild/core";
import { pluginLess } from "@rsbuild/plugin-less";
import { pluginReact } from "@rsbuild/plugin-react"; 

const  developmentProxy = {
    1:2
}

const isProduction = true;
const lessPrefixName = "ros";

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
    source: {
        entry: {
            index: './main/index.tsx',
        }
    },
    plugins: [
        pluginReact(),
        pluginLess({
            lessLoaderOptions: {
                additionalData: `@less-name: ${lessPrefixName};`,
            },
        }),
    ],
});
