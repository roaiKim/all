import fs from "fs/promises";
import path from "path";
import { resolveUserPath } from "../config";

export interface FileInfo {
    name: string;
    isDirectory: boolean;
}

export async function read(filePath: string): Promise<string> {
    const absolutePath = resolveUserPath(filePath);
    return fs.readFile(absolutePath, "utf8");
}

export async function write(filePath: string, content: string): Promise<{ path: string }> {
    const absolutePath = resolveUserPath(filePath);
    await fs.mkdir(path.dirname(absolutePath), { recursive: true });
    await fs.writeFile(absolutePath, content, "utf8");
    return { path: absolutePath };
}

export async function list(dirPath = ""): Promise<FileInfo[]> {
    const absolutePath = resolveUserPath(dirPath);
    const entries = await fs.readdir(absolutePath, { withFileTypes: true });
    return entries.map((entry) => ({
        name: entry.name,
        isDirectory: entry.isDirectory(),
    }));
}
