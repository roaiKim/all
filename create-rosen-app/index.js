#!/usr/bin/env node

/**
 * create-rosen-app — 脚手架 CLI 入口
 * ============================================================================
 * 调用方式：
 *   yarn create rosen-app <project-name> [--install]
 *   npm  create rosen-app <project-name> [--install]
 *
 * 工作机制（create 协议）：
 *   yarn create <foo> / npm create <foo> 会自动查找名为 create-<foo> 的 npm 包，
 *   然后执行该包 package.json 中 bin 字段指向的入口文件。
 *   因此 yarn/npm create rosen-app → 执行本文件 (create-rosen-app/index.js)。
 *
 * 包管理器自动检测：
 *   通过 npm_config_user_agent 环境变量判断用户用的是 npm 还是 yarn，
 *   --install 安装依赖时自动使用对应的包管理器命令。
 *
 * 执行流程速览：
 *   1. 检测包管理器（npm / yarn）
 *   2. 解析命令行参数，拿到项目名
 *   3. 校验项目名的合法性（正则 + 保留字黑名单）
 *   4. 确保目标目录不存在（防止覆盖）
 *   5. 将内置的 template/ （即 app-bot 模板）递归复制到目标目录
 *   6. 替换 package.json 中的 name 为新项目名
 *   7. 创建 .env.development 占位文件
 *   8. 确保 .gitignore 存在
 *   9. 默认不安装依赖，传 --install 可主动安装
 */

// ============================================================================
// 依赖引入（全部使用 Node.js 内置模块，零外部依赖）
// ============================================================================
const fs = require("fs"); // 文件系统操作：读/写/复制文件、检查路径是否存在
const path = require("path"); // 路径拼接与解析：__dirname、resolve
const { execSync } = require("child_process"); // 同步执行 shell 命令：npm/yarn install

// ============================================================================
// 检测包管理器
// ============================================================================
/**
 * npm_config_user_agent 是 npm/yarn 在执行时自动注入的环境变量
 * 通过解析它可以判断用户当前使用的是哪个包管理器
 *
 * 典型值示例：
 *   npm  create xxx  → "npm/10.2.0 node/v20.10.0 win32 x64"
 *   yarn create xxx  → "yarn/1.22.19 npm/? node/v20.10.0 win32 x64"
 *   pnpm create xxx  → "pnpm/8.10.0 npm/? node/v20.10.0 win32 x64"
 *
 * 检测优先级：pnpm > yarn > npm（默认兜底）
 */
function detectPackageManager() {
  const agent = process.env.npm_config_user_agent || "";
  if (agent.startsWith("pnpm")) return "pnpm";
  if (agent.startsWith("yarn")) return "yarn";
  return "npm"; // 默认当作 npm
}

const pm = detectPackageManager();

/**
 * 根据包管理器返回对应的 install 命令
 *   npm  → "npm install"
 *   yarn → "yarn install"
 *   pnpm → "pnpm install"
 */
function getInstallCmd() {
  return pm === "yarn" ? "yarn install" : pm === "pnpm" ? "pnpm install" : "npm install";
}

// ============================================================================
// 帮助信息
// ============================================================================
const help = `
Usage: ${pm} create rosen-app <project-directory>

Creates a new Rosen App in the specified directory.

Options:
  --install         Install dependencies after creating the project
  --help, -h        Show this help message
`;

// ============================================================================
// 第一步：解析命令行参数
// ============================================================================
// process.argv 示例：
//   ["node", "/path/to/create-rosen-app/index.js", "my-app", "--install"]
// slice(2) 去掉前两个（node 路径 + 脚本路径），拿到用户实际传入的参数
const args = process.argv.slice(2);

// 遇到 --help 或 -h 直接打印帮助并退出（退出码 0 = 正常退出）
if (args.includes("--help") || args.includes("-h")) {
  console.log(help);
  process.exit(0);
}

// 判断是否需要安装依赖（默认不安装，需要用户显式传 --install）
// npm create rosen-app my-app --install → shouldInstall = true
// npm create rosen-app my-app           → shouldInstall = false
const shouldInstall = args.includes("--install");

// 从参数列表中提取项目名称
// 过滤规则：排除所有以 "--" 开头的选项参数，剩下的第一个非选项即为项目名
//   args = ["--install", "my-app"] → 过滤 "--install" → "my-app"
//   args = ["my-app"] → "my-app"
const projectName = args
  .filter((a) => !a.startsWith("--")) // 排除选项参数
  .find((a) => a); // 取第一个剩下的值

// 没有提供项目名 → 报错并显示帮助
if (!projectName) {
  console.error("❌ Please provide a project directory name.");
  console.log(help);
  process.exit(1);
}

// ============================================================================
// 第二步：校验项目名称
// ============================================================================

/**
 * 项目名校验规则：
 * - 必须以字母或数字开头
 * - 后续可包含字母、数字、连字符、下划线、点号
 * - 不区分大小写
 *
 * 示例：
 *   ✅ my-app、MyApp、app_v2、com.example
 *   ❌ -myapp（禁止以连字符开头）、my app（禁止空格）、中文项目名
 */
const nameRegex = /^[a-z0-9][a-z0-9-_.]*$/i;

/**
 * 保留名称列表
 * 这些是文件系统中的特殊文件或目录，不能作为项目名
 *
 * 说明：
 * - node_modules: npm/yarn 依赖目录，如果项目名和它冲突会导致依赖安装异常
 * - package.json: 项目的元数据文件，同名会导致冲突
 * - .git: 版本控制目录，同名会导致 git 初始化异常
 * - favicon.ico: 常见静态文件，防止奇怪的文件名冲突
 * - yarn.lock / package-lock.json: 锁文件，同名冲突
 * - .npmrc / .nvmrc: 包管理器配置文件
 */
const reserved = [
  "node_modules",
  "favicon.ico",
  "package.json",
  "yarn.lock",
  ".git",
  ".gitignore",
  ".npmrc",
  ".nvmrc",
];

// 校验项目名是否符合命名规范
if (!nameRegex.test(projectName)) {
  console.error(
    `❌ Invalid project name "${projectName}".\n` +
    `   Name must start with a letter or number and can only contain\n` +
    `   letters, numbers, hyphens, underscores, and dots.`
  );
  process.exit(1); // 退出码 1 = 异常退出
}

// 检查是否命中保留名称（不区分大小写）
if (reserved.includes(projectName.toLowerCase())) {
  console.error(
    `❌ "${projectName}" is a reserved name. Please choose a different one.`
  );
  process.exit(1);
}

/**
 * 解析目标路径
 * path.resolve(projectName) 将相对路径转为绝对路径
 * 例如：projectName = "my-app"
 *   当前在 /Users/xxx/ → 解析为 /Users/xxx/my-app
 *   当前在 D:\work\ → 解析为 D:\work\my-app
 */
const targetPath = path.resolve(projectName);

// 如果目标目录已经存在，拒绝覆盖（防止误删用户文件）
if (fs.existsSync(targetPath)) {
  console.error(
    `❌ Directory "${projectName}" already exists.\n` +
    `   Please choose a different name or remove the existing directory.`
  );
  process.exit(1);
}

// ============================================================================
// 第三步：定位模板目录
// ============================================================================
/**
 * __dirname 是当前脚本文件所在的绝对目录
 * template/ 是同目录下的模板文件夹（即 app-bot 项目去掉 node_modules 等后的副本）
 *
 * 结构示意：
 *   create-rosen-app/
 *   ├── index.js          ← 本文件（__dirname = 这里）
 *   ├── package.json
 *   └── template/         ← 模板目录
 *       ├── src/
 *       ├── roaikim/
 *       └── ...
 */
const templatePath = path.resolve(__dirname, "template");

// 模板目录不存在 = 包安装不完整或被损坏，直接拒绝执行
if (!fs.existsSync(templatePath)) {
  console.error(
    "❌ Template directory not found. The package may be corrupted."
  );
  process.exit(1);
}

// ============================================================================
// 第四步：定义复制时需要跳过的文件/目录
// ============================================================================
/**
 * skipFiles 集合
 * 这些文件/目录在模板复制时会被忽略，原因如下：
 *
 *   node_modules    — 依赖不应随模板复制，应由用户在目标目录执行 yarn install
 *   dist            — 构建产物，每次 yarn build 都会重新生成
 *   .git            — 版本历史不应继承，用户在项目初始化后自行 git init
 *   yarn.lock       — 锁文件与具体环境相关，yarn install 会重新生成
 *   AGENTS.md       — 仅用于模板开发阶段的 AI 辅助文件
 *   CLAUDE.md       — 同上，仅模板开发阶段使用
 *   .env.development— 包含模板开发阶段的环境变量，用户项目应重新配置
 *   package-lock.json — npm 的锁文件（项目使用 yarn，此文件无用）
 */
const skipFiles = new Set([
  "node_modules",
  "dist",
  ".git",
  "yarn.lock",
  "AGENTS.md",
  "CLAUDE.md",
  ".env.development",
  "package-lock.json",
]);

// ============================================================================
// 第五步：递归复制函数
// ============================================================================
/**
 * 递归复制目录（深度优先）
 *
 * @param {string} src  - 源目录路径
 * @param {string} dest - 目标目录路径
 *
 * 执行逻辑：
 *   1. 确保目标目录存在（mkdirSync recursive: true = mkdir -p）
 *   2. 读取源目录下的所有条目（withFileTypes: true 可区分文件/目录）
 *   3. 遍历每个条目：
 *      - 在 skipFiles 集合中的 → 跳过
 *      - 是目录 → 递归调用 copyDir
 *      - 是文件 → 直接用 copyFileSync 复制
 */
function copyDir(src, dest) {
  // 创建目标目录（如果父目录不存在也会一并创建）
  fs.mkdirSync(dest, { recursive: true });

  // readdirSync + withFileTypes: true 返回 Dirent 对象，
  // 可以直接调用 entry.isDirectory() 判断类型，比先读目录再对每个条目
  // 调用 statSync 更高效（减少一次系统调用）
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    // 跳过黑名单中的文件/目录
    if (skipFiles.has(entry.name)) continue;

    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // 目录 → 递归进入子目录
      copyDir(srcPath, destPath);
    } else {
      // 文件 → 直接复制
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// ============================================================================
// 第六步：执行模板复制
// ============================================================================
console.log();
console.log(`⚡ Creating a new Rosen App in ${projectName}/`);
console.log();

try {
  // 将 template/ 下的全部内容复制到用户指定的目标目录
  copyDir(templatePath, targetPath);
} catch (err) {
  // 磁盘空间不足、权限不够等异常 → 报错退出
  console.error(`❌ Failed to copy template: ${err.message}`);
  process.exit(1);
}

// ============================================================================
// 第七步：自定义 package.json
// ============================================================================
/**
 * 模板中的 package.json 里 "name" 是 "app-roaikim"（原 app-bot 的项目名）
 * 这里把它替换成用户指定的项目名
 *
 * 原因：package.json 的 name 字段是 npm/yarn 识别项目的唯一标识，
 * 如果不改的话每个生成的项目都叫 app-roaikim，在 monorepo 等场景下会冲突
 */
const pkgPath = path.join(targetPath, "package.json");

if (fs.existsSync(pkgPath)) {
  // 读取 → 解析 JSON → 修改 name → 格式化写回
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  pkg.name = projectName;
  // JSON.stringify 第三个参数 2 = 缩进 2 空格，末尾加 \n 符合 POSIX 规范
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
}

// ============================================================================
// 第八步：创建 .env.development 占位文件
// ============================================================================
/**
 * 原模板的 .env.development 在 skipFiles 中被跳过了（里面是模板开发时的环境变量）
 * 所以在这里创建一个空的占位文件，用户可按需填入自己的环境变量
 *
 * 典型用法：在此文件中定义开发环境专用的环境变量
 *   例如 REACT_APP_API_BASE=http://localhost:8080
 */
fs.writeFileSync(
  path.join(targetPath, ".env.development"),
  "# Development environment variables\n"
);

// ============================================================================
// 第九步：确保 .gitignore 存在
// ============================================================================
/**
 * 如果 .gitignore 在某个边缘情况下没被复制过来，这里做一个兜底创建
 *
 * 写入的内容是最基础的必须忽略项：
 * - node_modules/：依赖目录，绝对不能提交
 * - dist/：构建产物目录
 * - .env.local / .env.development.local：本地环境变量覆盖文件（可能含敏感信息）
 */
const gitignorePath = path.join(targetPath, ".gitignore");
if (!fs.existsSync(gitignorePath)) {
  fs.writeFileSync(
    gitignorePath,
    "node_modules/\ndist/\n.env.local\n.env.development.local\n"
  );
}

// ============================================================================
// 第十步：安装依赖（默认跳过，--install 主动安装）
// ============================================================================
const installCmd = getInstallCmd();

if (shouldInstall) {
  // 用户显式传了 --install，使用检测到的包管理器安装依赖
  console.log(`📦 Installing dependencies with ${pm}...`);
  console.log();

  try {
    /**
     * execSync 同步执行 shell 命令：
     * - cwd: 指定工作目录（在用户的项目目录下执行）
     * - stdio: "inherit" — 将子进程的 stdout/stderr 直接透传到当前终端
     *   这样用户能看到安装进度条，体验和手动执行完全一致
     * - shell: true — 在 shell 中执行，确保能找到包管理器命令
     */
    execSync(installCmd, {
      cwd: targetPath,
      stdio: "inherit",
      shell: true,
    });
  } catch (err) {
    // 安装失败不会直接退出 — 可能只是网络问题，用户稍后可以手动重试
    console.log();
    console.log(`⚠️  ${installCmd} failed. You can try again manually:`);
    console.log(`   cd ${projectName} && ${installCmd}`);
  }
} else {
  // 默认行为：不安装依赖，提示用户稍后手动安装
  console.log(`📦 Skipping dependency installation. Once ready, run:`);
  console.log(`   cd ${projectName} && ${installCmd}`);
}

// ============================================================================
// 完成提示
// ============================================================================
// 对于 npm/pnpm 用户，"start" 命令同样是 npm/pnpm start
const runCmd = pm === "yarn" ? "yarn start" : pm === "pnpm" ? "pnpm start" : "npm start";

console.log();
console.log("✅ Success! Your Rosen App is ready.");
console.log();
console.log(`   cd ${projectName}`);
// 没传 --install 时提醒用户需要安装依赖；传了 --install 且成功的话依赖已装好
if (!shouldInstall) console.log(`   ${installCmd}`);
console.log(`   ${runCmd}`);
console.log();
console.log("   Happy coding! ⚡");
console.log();
