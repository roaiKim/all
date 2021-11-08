/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const env = require("./env");
const webpack = require("webpack");
const path = require("path");
const HTMLPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const TerserWebpackPlugin = require("terser-webpack-plugin");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TSImportPlugin = require("ts-import-plugin");
const autoprefixer = require("autoprefixer");

module.exports = {
    mode: "production",
    entry: {
        main: `${env.src}/index.tsx`,
    },
    output: {
        path: env.build,
        filename: "static/js/[name].[chunkhash:8].js",
        publicPath: "/",
    },
    devtool: "nosources-source-map",
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".less"],
        modules: [env.src, "node_modules"],
        alias: {
            "@component": "component",
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
            // cacheGroups: {
            //     react: {
            //         test: /(react|react-dom)/,
            //         name: "react-react-dom",
            //         chunks: "all",
            //     },
            // },
        },
        minimizer: [
            new TerserWebpackPlugin({
                extractComments: {
                    condition: false,
                },
                terserOptions: {
                    compress: {
                        // drop_console: true,
                        pure_funcs: ["console.log"], // 生产环境过滤掉 console.log... 如果实在要调试 可以用 console.info 暂时代替下
                    },
                },
            }),
            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: {
                    map: {
                        inline: false,
                    },
                },
            }),
        ],
    },
    performance: {
        // 入口体积应小于 700KB, 单个文件应小于 400 KB
        maxEntrypointSize: 716800,
        maxAssetSize: 409600,
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                include: env.src,
                loader: "ts-loader",
                options: {
                    configFile: env.tsConfig,
                    transpileOnly: true,
                    getCustomTransformers: () => ({
                        before: [TSImportPlugin({ libraryName: "antd", libraryDirectory: "es", style: true })],
                    }),
                },
            },
            {
                test: /\.(css|less)$/,
                use: [
                    MiniCSSExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                            importLoaders: 2,
                        },
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            sourceMap: true,
                            plugins: () => [autoprefixer],
                        },
                    },
                    {
                        loader: "less-loader",
                        options: {
                            javascriptEnabled: true,
                            sourceMap: true,
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new MiniCSSExtractPlugin({
            filename: "static/css/[name].[contenthash:8].css",
        }),
        new HTMLPlugin({
            template: `${env.src}/index.html`,
            favicon: `${env.src}/favicon.ico`,
        }),
        new CleanWebpackPlugin(),
        new webpack.ProgressPlugin(),
        new BundleAnalyzerPlugin({
            analyzerMode: "static", // 生成 HTML 的方式
            openAnalyzer: false,
        }),
    ],
};
