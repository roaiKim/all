/* eslint-env node */

const env = require("./env");
const path = require("path");
const webpack = require("webpack");
const HTMLPlugin = require("html-webpack-plugin");
// const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
// const ReactRefreshTypeScript = require("react-refresh-typescript");
const ESLintPlugin = require("eslint-webpack-plugin");
// const antdLessVars = require("../src/asset/theme/antd-less-vars.json");
const developmentProxy = require("../src/config/development.proxy.json");
// const ForkTsCheckerWebpackPlugin = require("react-dev-utils/ForkTsCheckerWebpackPlugin");


const proxy = (origin = {}) => {
    const envs = {};
    Object.entries(developmentProxy).forEach(
        ([key, value]) =>
            (envs[`/${key}`] = {
                pathRewrite: { [`^/${key}`]: "" },
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

module.exports = {
    devServer: {
        port: 10010,
        allowedHosts: "all",
        historyApiFallback: true,
        compress: true,
        // https: true,
        open: {
            app: process.platform === "win32" ? "chrome" : "Google Chrome",
        },
        client: {
            overlay: {
                errors: true,
                warnings: false,
            },
        },
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*",
        },
        proxy: proxy()
    },
    mode: "development",
    entry: {
        main: `${env.src}/index.tsx`,
    },
    output: {
        filename: "asset/js/[name].js",
        publicPath: "/",
    },
    devtool: "cheap-module-source-map",
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".less"],
        modules: [env.src, "node_modules"],
        alias: {
            "@core": env.core,
            "@http": "http",
            "@icon": "@ant-design/icons",
            "@api": "service/api",
        },
    },
    optimization: {
        runtimeChunk: "single",
        splitChunks: {
            automaticNameDelimiter: "-",
            maxAsyncRequests: 12,
        },
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                include: [env.src, env.core],
                loader: "ts-loader",
                options: {
                    configFile: env.tsConfig,
                    silent: true,
                    transpileOnly: true,
                    // getCustomTransformers: () => ({
                    //     before: [TSImportPlugin({ libraryName: "antd", libraryDirectory: "es", style: true })],
                    // }),
                    // getCustomTransformers: () => ({
                    //     before: [ReactRefreshTypeScript()],
                    // }),
                },
            },
            {
                test: /\.(less|css)$/,
                use: [
                    "style-loader",
                    "css-loader",
                    {
                        loader: "less-loader",
                        options: {
                            lessOptions: {
                                javascriptEnabled: true,
                                // modifyVars: antdLessVars,
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                type: "asset",
                generator: {
                    filename: "asset/img/[name].[hash:8].[ext]",
                },
            },
        ],
    },
    plugins: [
        // new ReactRefreshWebpackPlugin({ overlay: false }),
        new HTMLPlugin({
            template: `${env.src}/index.html`,
            favicon: `${env.src}/favicon.ico`,
        }),
        new webpack.ProgressPlugin(),
        // new webpack.HotModuleReplacementPlugin(),
        // new ForkTsCheckerWebpackPlugin({
        //     async: true,
        //     typescript: {
        //         typescriptPath: path.resolve(env.nodeMoules, "typescript"),
        //         configOverwrite: {
        //             compilerOptions: {
        //                 noEmit: true,
        //                 incremental: true,
        //                 tsBuildInfoFile: env.appTsBuildInfoFile,
        //             },
        //         },
        //         context: env.appPath,
        //         diagnosticOptions: {
        //             syntactic: true,
        //         },
        //         mode: "write-references",
        //     },
        //     formatter: "codeframe",
        //     issue: {
        //         include: [{ file: "../**/src/**/*.{ts,tsx}" }, { file: "**/src/**/*.{ts,tsx}" }],
        //         exclude: [
        //             { file: "**/src/**/__tests__/**" },
        //             { file: "**/src/**/?(*.){spec|test}.*" },
        //             { file: "**/src/setupProxy.*" },
        //             { file: "**/src/setupTests.*" },
        //         ],
        //     },
        //     logger: {
        //         infrastructure: "silent",
        //     },
        // }),
        new ESLintPlugin({
            extensions: ["js", "mjs", "jsx", "ts", "tsx"],
            failOnError: true,
            quiet: true,
            cache: true,
            cacheLocation: env.eslintcache,
        }),
    ],
};
