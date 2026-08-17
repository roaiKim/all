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
}
