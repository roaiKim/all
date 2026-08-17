import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
    isElectron: true,
    platform: process.platform,
    versions: {
        node: process.versions.node,
        chrome: process.versions.chrome,
        electron: process.versions.electron,
    },
    file: {
        read: (filePath: string) => ipcRenderer.invoke("file:read", filePath),
        write: (filePath: string, content: string) => ipcRenderer.invoke("file:write", filePath, content),
        list: (dirPath: string) => ipcRenderer.invoke("file:list", dirPath),
    },
    media: {
        importMaterials: () => ipcRenderer.invoke("media:import"),
    },
});
