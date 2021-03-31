
const env = require("./env")
const webpack = require("webpack")
const HTMLPlugin = require("html-webpack-plugin")
const {CleanWebpackPlugin} = require("clean-webpack-plugin")
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
    devServer: {
        port: 3000,
        hot: true,
        historyApiFallback: true,
        compress: true
    },
    mode: "development",
    entry: {
        main: `${env.src}/index.jsx`
    },
    output: {
        filename: "static/js/[name].js",
        publicPath: "/",
    },
    devtool: "cheap-module-source-map",
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".less"],
        modules: [env.src, "node_modules"],
        alias: {
            
        }
    },
    optimization: {
        splitChunks: {
            automaticNameDelimiter: "-",
        }
    },
    module: {
        rules: [
            {
                test: /\.(j|t)sx?$/,
                loader: "babel-loader",
                exclude:/node_modules/,
                options: {
                    presets: [
                        "@babel/preset-react",
                        ["@babel/preset-env", {
                            useBuiltIns: "usage",
                            corejs: 3
                        }]
                    ],
                    plugins: [
                        ["@babel/plugin-proposal-decorators", { "legacy": true }],
                        ["@babel/plugin-transform-runtime"],
                        ["@babel/plugin-proposal-class-properties", { "loose": true }]
                    ]
                }
            }
        ]
    },
    plugins: [
        new HTMLPlugin({
            template: `${env.src}/index.html`
        }),
        new CleanWebpackPlugin(),
        // new BundleAnalyzerPlugin()
    ]
}
