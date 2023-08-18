const path = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const resolve = require("resolve");
const ESLintPlugin = require("eslint-webpack-plugin");
const env = require("./env");

const config = {
    projectName: "wechat-app",
    date: "2023-3-20",
    designWidth: 750,
    deviceRatio: {
        640: 2.34 / 2,
        750: 1,
        828: 1.81 / 2,
    },
    sourceRoot: "src",
    outputRoot: "dist",
    alias: {
        "@core": path.resolve(__dirname, "../src", "core"),
        "@http": path.resolve(__dirname, "../src", "http"),
        "@api": path.resolve(__dirname, "..", "src/service/api"),
    },
    // plugins: [["eslint-webpack-plugin"]]
    defineConstants: {},
    copy: {
        patterns: [],
        options: {},
    },
    framework: "react",
    mini: {
        postcss: {
            pxtransform: {
                enable: true,
                config: {},
            },
            url: {
                enable: true,
                config: {
                    limit: 1024, // 设定转换尺寸上限
                },
            },
            cssModules: {
                enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
                config: {
                    namingPattern: "module", // 转换模式，取值为 global/module
                    generateScopedName: "[name]__[local]___[hash:base64:5]",
                },
            },
        },
        /**
         * WebpackChain 插件配置
         * @docs https://github.com/neutrinojs/webpack-chain
         */
        webpackChain(chain) {
            chain.resolve.modules.add(env.src);
            chain.plugin("fork-ts-checker-webpack-plugin").use(ForkTsCheckerWebpackPlugin);
            chain
                .plugin("eslint-webpack-plugin")
                .use(ESLintPlugin, [{ extensions: ["js", "mjs", "jsx", "ts", "tsx"], quiet: true, cache: true, cacheLocation: env.eslintcache }]);
        },
    },
    h5: {
        publicPath: "/",
        staticDirectory: "static",
        postcss: {
            autoprefixer: {
                enable: true,
                config: {},
            },
            cssModules: {
                enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
                config: {
                    namingPattern: "module", // 转换模式，取值为 global/module
                    generateScopedName: "[name]__[local]___[hash:base64:5]",
                },
            },
        },
    },
};

module.exports = function (merge) {
    if (process.env.NODE_ENV === "development") {
        return merge({}, config, require("./dev"));
    }
    return merge({}, config, require("./prod"));
};
