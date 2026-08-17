import { BrowserWindow, dialog, nativeImage } from "electron";
import fs from "fs/promises";
import path from "path";
import { getMediaDir } from "../config";
import { generateUid } from "utils/framework/uid";

const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp", ".svg"]);
const VIDEO_EXT = new Set([".mp4", ".webm", ".mov", ".mkv", ".avi", ".m4v"]);

const MEDIA_EXTENSIONS = [...IMAGE_EXT, ...VIDEO_EXT].map((ext) => ext.slice(1));

export interface ImportedMaterial {
    uid: string;
    name: string;
    path: string;
    thumb: string;
    type: "image" | "video";
}

export async function importMaterials(): Promise<ImportedMaterial[]> {
    const win = BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0];
    if (!win) return [];

    const result = await dialog.showOpenDialog(win, {
        title: "选择素材",
        properties: ["openFile", "multiSelections"],
        filters: [{ name: "图片 / 视频", extensions: MEDIA_EXTENSIONS }],
    });
    if (result.canceled) return [];

    const mediaDir = getMediaDir();
    await fs.mkdir(mediaDir, { recursive: true });

    const imported: ImportedMaterial[] = [];
    for (const source of result.filePaths) {
        const ext = path.extname(source).toLowerCase();
        const fileName = `${generateUid()}${ext}`;
        const dest = path.join(mediaDir, fileName);
        await fs.copyFile(source, dest);

        const isImage = IMAGE_EXT.has(ext);
        let thumb = fileName;
        if (isImage) {
            thumb = (await generateThumbnail(dest, fileName)) ?? fileName;
        }

        imported.push({
            uid: generateUid(),
            name: path.basename(source),
            path: fileName,
            thumb,
            type: isImage ? "image" : "video",
        });
    }
    return imported;
}

async function generateThumbnail(srcPath: string, fileName: string): Promise<string | null> {
    const image = nativeImage.createFromPath(srcPath);
    if (image.isEmpty()) return null;

    const { width } = image.getSize();
    if (width <= 320) return null;

    const thumb = image.resize({ width: 320 });
    const thumbName = fileName.replace(/\.[^.]+$/, "") + "_thumb.png";
    await fs.writeFile(path.join(getMediaDir(), thumbName), thumb.toPNG());
    return thumbName;
}
