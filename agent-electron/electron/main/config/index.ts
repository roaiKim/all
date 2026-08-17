import { app } from "electron";
import path from "path";

export function getUserDataDir(): string {
    return app.getPath("userData");
}

// 将传入的相对路径安全地拼接到用户数据目录下，阻止 `../` 路径穿越
export function resolveUserPath(...segments: string[]): string {
    const root = getUserDataDir();
    const target = path.resolve(root, ...segments);
    const relative = path.relative(root, target);
    if (relative.startsWith("..") || path.isAbsolute(relative)) {
        throw new Error(`非法路径：${segments.join("/")}`);
    }
    return target;
}

// 素材目录：跟随安装目录（便携）。打包后在可执行文件旁的 media/ 目录，开发时在项目根目录的 media/ 目录。
export function getMediaDir(): string {
    if (app.isPackaged) {
        return path.join(path.dirname(app.getPath("exe")), "media");
    }
    return path.join(app.getAppPath(), "media");
}

// 将传入的相对路径安全地拼接到素材目录下，阻止 `../` 路径穿越
export function resolveMediaPath(...segments: string[]): string {
    const root = getMediaDir();
    const target = path.resolve(root, ...segments);
    const relative = path.relative(root, target);
    if (relative.startsWith("..") || path.isAbsolute(relative)) {
        throw new Error(`非法路径：${segments.join("/")}`);
    }
    return target;
}
