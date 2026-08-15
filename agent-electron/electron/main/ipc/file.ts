import { ipcMain } from "electron";
import * as fileService from "../services/file-service";
import { ok, fail } from "../utils/error";

export function registerFileIpc(): void {
    ipcMain.handle("file:read", async (_event, filePath: string) => {
        try {
            return ok(await fileService.read(filePath));
        } catch (error) {
            return fail(error);
        }
    });

    ipcMain.handle("file:write", async (_event, filePath: string, content: string) => {
        try {
            return ok(await fileService.write(filePath, content));
        } catch (error) {
            return fail(error);
        }
    });

    ipcMain.handle("file:list", async (_event, dirPath: string) => {
        try {
            return ok(await fileService.list(dirPath));
        } catch (error) {
            return fail(error);
        }
    });
}
