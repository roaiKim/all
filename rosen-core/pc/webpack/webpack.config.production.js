/* eslint-env node */

const env = require("./env");
const path = require("path");
const webpack = require("webpack");
const HTMLPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const TerserWebpackPlugin = require("terser-webpack-plugin");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const autoprefixer = require("autoprefixer");
const ESLintPlugin = require("eslint-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("react-dev-utils/ForkTsCheckerWebpackPlugin");

module.exports = {
    mode: "production",
    entry: {
        main: `${env.core}/index.ts`,
    },
    output: {
        path: env.build,
        filename: "[name].[chunkhash:8].js",
        // publicPath: "/",
    },
    devtool: "nosources-source-map",
    resolve: {
        extensions: [".ts", ".tsx"],
        // modules: [env.src, env.core, "node_modules"],
        alias: {
            "@core": env.core,
            "@http": "http",
            "@icon": "@ant-design/icons",
            "@api": "service/api",
            // "@proxy-config": env.ProxyConfig,
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
                include: [env.core],
                loader: "ts-loader",
                options: {
                    configFile: env.tsConfig,
                    transpileOnly: true,
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
                            postcssOptions: {
                                plugins: [autoprefixer],
                            },
                        },
                    },
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
                    filename: "static/img/[name].[hash:8].[ext]",
                },
            },
        ],
    },
    plugins: [
        new MiniCSSExtractPlugin({
            filename: "static/css/[name].[contenthash:8].css",
        }),
        // new HTMLPlugin({
        //     template: `${env.src}/index.html`,
        //     favicon: `${env.src}/favicon.ico`,
        // }),
        new CleanWebpackPlugin(),
        new webpack.ProgressPlugin(),
        new BundleAnalyzerPlugin({
            analyzerMode: "static", // 生成 HTML 的方式
            openAnalyzer: false,
        }),
        new ForkTsCheckerWebpackPlugin({
            async: false,
            typescript: {
                typescriptPath: path.resolve(env.nodeMoules, "typescript"),
                configOverwrite: {
                    compilerOptions: {
                        noEmit: true,
                        incremental: true,
                        tsBuildInfoFile: env.appTsBuildInfoFile,
                    },
                },
                context: env.appPath,
                diagnosticOptions: {
                    syntactic: true,
                },
                mode: "write-references",
            },
            issue: {
                include: [{ file: "../**/src/**/*.{ts,tsx}" }, { file: "**/src/**/*.{ts,tsx}" }],
                exclude: [
                    { file: "**/src/**/__tests__/**" },
                    { file: "**/src/**/?(*.){spec|test}.*" },
                    { file: "**/src/setupProxy.*" },
                    { file: "**/src/setupTests.*" },
                ],
            },
            logger: {
                infrastructure: "silent",
            },
        }),
        new ESLintPlugin({
            extensions: ["js", "mjs", "jsx", "ts", "tsx"],
            quiet: true,
            cache: true,
        }),
    ],
};
