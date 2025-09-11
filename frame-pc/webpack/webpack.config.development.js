/* eslint-env node */

const env = require("./env");
const path = require("path");
const webpack = require("webpack");
const fs = require("fs");
const HTMLPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const ReactRefreshTypeScript = require("react-refresh-typescript");
const ESLintPlugin = require("eslint-webpack-plugin");
// const antdLessVars = require("../src/asset/theme/antd-less-vars.json");
const developmentProxy = require("../src/config/development.proxy.json");
const ForkTsCheckerWebpackPlugin = require("react-dev-utils/ForkTsCheckerWebpackPlugin");

const wr = (proxyRes, req, res) => {
    // console.log("req.url", req.url);
    // if (req.url.includes("getByUserId")) console.log("res", res);
    // fs.writeFileSync(path.join(__dirname, "../", "z-files", `${req.url.replace(/\//g, "")}.ts`), req);
    // console.log("--==--", req.url);
    if (req.url.includes("getByUserId")) {
        // proxyRes.setHeader("Auth-Sub", "foobar");
        // const body = [];
        // proxyRes.on("data", function (chunk) {
        //     // body.push(chunk);
        //     // console.log("res from proxied server:", chunk);
        // });
        // proxyRes.on("end", function () {
        //     // body = Buffer.concat(body).toString();
        //     console.log("res from proxied server:", res.data);
        //     res.end("my response to cli");
        // });
        res.end("my response to cli");
        // console.log("res from proxied server:proxyRes", Object.keys(proxyRes));
        // console.log("res from proxied server:res", Object.keys(res));
        // console.log("res from proxied server:req", Object.keys(req));
        // fs.writeFileSync(path.join(__dirname, "../", "z-files", `keys.ts`), `export const proxyResKeys = ${JSON.stringify(Object.keys(proxyRes))};\nexport const resKeys = ${JSON.stringify(Object.keys(res))};\nexport const reqKeys = ${JSON.stringify(Object.keys(req))};\n`);
    }
};

const proxy = (origin = {}) => {
    const envs = [];
    Object.entries(developmentProxy).forEach(([key, value]) => {
        // (envs[`/${key}`] = {
        //     pathRewrite: { [`^/${key}`]: "" },
        //     target: value,
        //     changeOrigin: true,
        //     headers: {
        //         Connection: "keep-alive",
        //         "Access-Control-Allow-Origin": "*",
        //         "Access-Control-Allow-Headers": "*",
        //         "Access-Control-Allow-Methods": "*",
        //     },
        //     // selfHandleResponse: true,
        //     // onProxyReq: (proxyReq, req, res) => {
        //     //     console.log(1111111);
        //     //     // wr(proxyReq, req, res);
        //     // },
        //     // onError: (err, req, res) => {
        //     //     console.log(3333333);
        //     // },
        //     // onProxyRes: (proxyRes, req, res) => {
        //     //     console.log(2222222);
        //     //     wr(proxyRes, req, res);
        //     // },
        // });
        envs.push({
            context: [`/${key}`],
            target: value,
            changeOrigin: true,
            pathRewrite: { [`^/${key}`]: "" },
        });
    });
    return envs;
    // return Object.assign({}, envs, origin);
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
        // client: {
        //     overlay: {
        //         errors: true,
        //         warnings: false,
        //     },
        // },
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*",
        },
        proxy: proxy(),
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
            // "@proxy-config": env.ProxyConfig,
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
        new ReactRefreshWebpackPlugin({ overlay: false }),
        new HTMLPlugin({
            template: `${env.src}/index.html`,
            favicon: `${env.src}/favicon.ico`,
        }),
        new webpack.ProgressPlugin(),
        // new webpack.HotModuleReplacementPlugin(),
        new ForkTsCheckerWebpackPlugin({
            async: true,
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
            formatter: "codeframe",
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
            failOnError: true,
            quiet: true,
            cache: true,
            cacheLocation: env.eslintcache,
        }),
    ],
};
