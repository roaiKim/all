const env = require("./env");
const webpack = require("webpack");
const path = require("path");
const HTMLPlugin = require("html-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const TerserWebpackPlugin = require("terser-webpack-plugin");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackExternalsPlugin = require("html-webpack-externals-plugin");

function cacheGroupsName(module, chunks, cacheGroupKey) {
    const allChunksNames = chunks
        .slice(3)
        .map((item) => item.name)
        .join("~");
    return `${cacheGroupKey}-${allChunksNames}`;
}

module.exports = {
    mode: "production",
    entry: {
        main: `${env.src}/index.jsx`,
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
            cacheGroups: {
                react: {
                    test: /(react|react-dom)/,
                    name: "react-react-dom",
                    chunks: "all",
                },
            },
        },
        minimizer: [
            new TerserWebpackPlugin({
                parallel: true,
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
                test: /\.(j|t)sx?$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                options: {
                    presets: [
                        "@babel/preset-react",
                        [
                            "@babel/preset-env",
                            {
                                useBuiltIns: "usage",
                                corejs: 3,
                            },
                        ],
                        "@babel/preset-typescript",
                    ],
                    plugins: [
                        ["@babel/plugin-transform-runtime"],
                        ["@babel/plugin-proposal-decorators", {legacy: true}],
                        ["@babel/plugin-proposal-class-properties"],
                        [
                            "import",
                            {
                                libraryName: "antd",
                                libraryDirectory: "es",
                                style: true,
                            },
                        ],
                    ],
                },
            },
            {
                test: /\.(less|css)$/,
                use: [
                    MiniCSSExtractPlugin.loader,
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
                loader: "url-loader",
                options: {
                    esModule: false,
                    limit: 1024,
                    name: "static/img/[name].[hash:8].[ext]",
                },
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                loader: "file-loader",
                options: {
                    name: "static/font/[name].[hash:8].[ext]",
                },
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
