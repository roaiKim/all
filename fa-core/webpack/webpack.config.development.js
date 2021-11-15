/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const env = require("./env");
const webpack = require("webpack");
const HTMLPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TSImportPlugin = require("ts-import-plugin");

module.exports = {
    devServer: {
        port: 10086,
        historyApiFallback: true,
        compress: true,
        open: "Chrome",
        // proxy: {
        //     "/api": {
        //         target: "http://119.29.53.45",
        //         // target: "http://localhost:3200",
        //         secure: false,
        //         changeOrigin: true,
        //     },
        // },
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
            "@tools": "tools",
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
                    getCustomTransformers: () => ({
                        before: [TSImportPlugin({ libraryName: "antd", libraryDirectory: "es", style: true })],
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
        ],
    },
    plugins: [
        new HTMLPlugin({
            template: `${env.src}/index.html`,
            favicon: `${env.src}/favicon.ico`,
        }),
        new CleanWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ],
};
