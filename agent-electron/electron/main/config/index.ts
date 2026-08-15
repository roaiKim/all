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
