import { ipcMain } from "electron";
import * as mediaService from "../services/media-service";
import { ok, fail } from "../utils/error";

export function registerMediaIpc(): void {
    ipcMain.handle("media:import", async () => {
        try {
            return ok(await mediaService.importMaterials());
        } catch (error) {
            return fail(error);
        }
    });

    ipcMain.handle("media:readJson", async (_event, fileName: string) => {
        try {
            return ok(await mediaService.readJson(fileName));
        } catch (error) {
            return fail(error);
        }
    });

    ipcMain.handle("media:writeJson", async (_event, fileName: string, content: string) => {
        try {
            return ok(await mediaService.writeJson(fileName, content));
        } catch (error) {
            return fail(error);
        }
    });

    ipcMain.handle("media:saveThumbnail", async (_event, fileName: string, dataUrl: string) => {
        try {
            return ok(await mediaService.saveThumbnail(fileName, dataUrl));
        } catch (error) {
            return fail(error);
        }
    });

    ipcMain.handle("media:listFiles", async () => {
        try {
            return ok(await mediaService.listFiles());
        } catch (error) {
            return fail(error);
        }
    });
}
