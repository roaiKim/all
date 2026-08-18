import { app, BrowserWindow, protocol } from "electron";
import { registerIpc } from "./main/ipc";
import { registerMediaProtocol } from "./main/protocol";
import { createWindow } from "./main/window";

protocol.registerSchemesAsPrivileged([
    {
        scheme: "media",
        privileges: {
            standard: true,
            secure: true,
            supportFetchAPI: true,
            stream: true,
            bypassCSP: true,
            corsEnabled: true,
        },
    },
]);

app.whenReady().then(() => {
    registerIpc();
    registerMediaProtocol();
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
