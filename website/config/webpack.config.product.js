
const env = require("./env")
const webpack = require("webpack")
const path = require("path")
const HTMLPlugin = require("html-webpack-plugin")
const {CleanWebpackPlugin} = require("clean-webpack-plugin")
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const TerserWebpackPlugin = require("terser-webpack-plugin");
const HtmlWebpackExternalsPlugin = require("html-webpack-externals-plugin");

function cacheGroupsName (module, chunks, cacheGroupKey) {
    const allChunksNames = chunks.slice(3).map((item) => item.name).join('~');
    return `${cacheGroupKey}-${allChunksNames}`;
}

module.exports = {
    mode: "production",
    entry: {
        main: `${env.src}/index.jsx`
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

        }
    },
    /* externalsType: 'script',
    externals: {
        "react": ["https://unpkg.com/react@17/umd/react.production.min.js", "React"],
        "react-dom": ["https://unpkg.com/react-dom@17/umd/react-dom.production.min.js", "ReactDOM"]
    }, */
    optimization: {
        runtimeChunk: "single",
        splitChunks: {
            automaticNameDelimiter: "-",
            cacheGroups: {
                react: {
                    test: /(react|react-dom)/,
                    name: cacheGroupsName,
                    chunks: "all"
                }
            }
        },
        minimizer: [
            new TerserWebpackPlugin({
                parallel: true,
                extractComments: {
                    condition: false
                }
            })
        ]
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: "babel-loader",
                exclude: /node_modules/,
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
                    limit: 1024
                }
            }
        ]
    },
    plugins: [
        new HTMLPlugin({
            template: `${env.src}/index.html`
        }),
        new CleanWebpackPlugin(),
        // new BundleAnalyzerPlugin(),
        /* new HtmlWebpackExternalsPlugin({
            externals: [
                {
                    module: "react",
                    entry: "https://unpkg.com/react@17/umd/react.production.min.js",
                    global: "React"
                },
                {
                    module: "react-dom",
                    entry: "https://unpkg.com/react-dom@17/umd/react-dom.production.min.js",
                    global: "ReactDOM"
                }
            ]
        }) */
    ]
}


