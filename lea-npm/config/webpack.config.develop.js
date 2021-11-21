const env = require("./env");
const webpack = require("webpack");
const path = require("path");
const HTMLPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
    devServer: {
        port: 10010,
        historyApiFallback: true,
        compress: true,
        open: "Chrome",
    },
    mode: "development",
    entry: {
        main: `${env.src}/index.jsx`,
    },
    output: {
        filename: "static/js/[name].js",
        publicPath: "/",
    },
    devtool: "cheap-module-source-map",
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".less"],
        modules: [env.src, "node_modules"],
        alias: {},
    },
    optimization: {
        splitChunks: {
            automaticNameDelimiter: "-",
        },
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
                    plugins: [["@babel/plugin-transform-runtime"], ["@babel/plugin-proposal-class-properties", { loose: false }]],
                },
            },
            {
                test: /\.(less|css)$/,
                use: ["style-loader", "css-loader", "less-loader"],
            },
            {
                test: /\.(png|jpe?g|gif)$/,
                loader: "url-loader",
                options: {
                    limit: 1024,
                },
            },
        ],
    },
    plugins: [
        new HTMLPlugin({
            template: `${env.src}/index.html`,
        }),
        new CleanWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        // new BundleAnalyzerPlugin()
    ],
};
