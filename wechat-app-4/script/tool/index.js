const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

const isWindows = process.platform === "win32";

/** 本地依赖的 js 入口，例如 node_modules/eslint/bin/eslint.js */
const getLocalBin = (command) => path.resolve(__dirname, "../../node_modules", command, "bin", `${command}.js`);

module.exports = function spawn(command, args, errorMessage) {
    // Windows 上 Node 20.12+ 出于安全考虑禁止 spawnSync 直接执行 .cmd / .bat（会抛 EINVAL），
    // 所以本地依赖优先用 node 跑它的 js 入口，跨平台一致；找不到再退回 .cmd 方式。
    const localBin = getLocalBin(command);
    const result = fs.existsSync(localBin)
        ? childProcess.spawnSync(process.execPath, [localBin, ...args], { stdio: "inherit" })
        : childProcess.spawnSync(isWindows ? command + ".cmd" : command, args, { stdio: "inherit" });

    if (result.error) {
        console.error(result.error);
        process.exit(1);
    }
    if (result.status !== 0) {
        console.error(chalk`{red.bold ${errorMessage}}`);
        console.error(`non-zero exit code returned, code=${result.status}, command=${command} ${args.join(" ")}`);
        process.exit(1);
    }
};
