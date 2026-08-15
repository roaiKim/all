import { app, BrowserWindow } from "electron";
import path from "path";

const devServerUrl = process.env.ELECTRON_START_URL;

export function createWindow(): BrowserWindow {
    const appRoot = app.getAppPath();
    const mainWindow = new BrowserWindow({
        width: 1366,
        height: 900,
        minWidth: 1024,
        minHeight: 640,
        show: false,
        webPreferences: {
            preload: path.join(appRoot, "dist-electron", "preload.cjs"),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true,
        },
    });

    mainWindow.once("ready-to-show", () => {
        mainWindow.show();
    });

    if (devServerUrl) {
        mainWindow.loadURL(devServerUrl);
        mainWindow.webContents.openDevTools({ mode: "detach" });
    } else {
        mainWindow.loadFile(path.join(appRoot, "dist", "index.html"));
    }

    return mainWindow;
}
