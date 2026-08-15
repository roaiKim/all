import { app, BrowserWindow } from "electron";
import { createWindow } from "./main/window";
import { registerIpc } from "./main/ipc";

app.whenReady().then(() => {
    registerIpc();
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
