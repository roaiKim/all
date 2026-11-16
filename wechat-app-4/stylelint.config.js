// stylelint.config.js —— 复用 agent-electron 的共享规则集 stylelint-config-way
module.exports = {
    extends: ["stylelint-config-way"],
    ignoreFiles: ["dist/**", "dist-h5/**", "node_modules/**"],
};
