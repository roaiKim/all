
const env = require("./env")
const webpack = require("webpack")
const path = require("path")
const HTMLPlugin = require("html-webpack-plugin")
const {CleanWebpackPlugin} = require("clean-webpack-plugin")
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
    devServer: {
        port: 8000,
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
                        ["@babel/plugin-transform-runtime"],
                        ["@babel/plugin-proposal-class-properties",{
                            loose: true
                        }],
                        ["import",{
                            libraryName: "antd", libraryDirectory: "es", style: true
                        }]
                    ]
                }
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
                                javascriptEnabled: true
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpe?g|gif)$/,
                loader: "url-loader",
                options: {
                    esModule: false,
                    limit: 1024,
                    name: "asset/imgages/[name].[hash:8].[ext]"
                }
            }
        ]
    },
    plugins: [
        new HTMLPlugin({
            template: `${env.src}/index.html`
        }),
        new CleanWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin()
        // new BundleAnalyzerPlugin()
    ]
}
