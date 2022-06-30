/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const env = require("./env");
const webpack = require("webpack");
const HTMLPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const ReactRefreshTypeScript = require("react-refresh-typescript");
const ESLintPlugin = require("eslint-webpack-plugin");

module.exports = {
    devServer: {
        port: 10010,
        historyApiFallback: true,
        compress: true,
        // https: true,
        open: true,
        // client: {
        //     overlay: {
        //         errors: true,
        //         warnings: false,
        //     },
        // },
        proxy: {
            "/api": {
                // target: "http://192.168.2.121",
                target: "http://cccc.smartcomma.com",
                secure: false,
                changeOrigin: true,
            },
        },
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
                    getCustomTransformers: () => ({
                        before: [ReactRefreshTypeScript()],
                    }),
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
        new ReactRefreshWebpackPlugin(),
        new HTMLPlugin({
            template: `${env.src}/index.html`,
            favicon: `${env.src}/favicon.ico`,
        }),
        new CleanWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new ESLintPlugin({
            extensions: ["js", "mjs", "jsx", "ts", "tsx"],
            quiet: true,
            cache: true,
        }),
    ],
};
