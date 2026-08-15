export interface FileInfo {
    name: string;
    isDirectory: boolean;
}

interface IpcResult<T> {
    ok: boolean;
    data?: T;
    code?: string;
    message?: string;
}

interface ElectronFileAPI {
    read: (filePath: string) => Promise<IpcResult<string>>;
    write: (filePath: string, content: string) => Promise<IpcResult<{ path: string }>>;
    list: (dirPath: string) => Promise<IpcResult<FileInfo[]>>;
}

function getFileAPI(): ElectronFileAPI | null {
    return (window as any).electronAPI?.file ?? null;
}

function unwrap<T>(result: IpcResult<T>): T {
    if (!result?.ok) {
        throw new Error(`[${result?.code ?? "UNKNOWN"}] ${result?.message ?? "未知错误"}`);
    }
    return result.data as T;
}

function assertElectron(fileAPI: ElectronFileAPI | null): ElectronFileAPI {
    if (!fileAPI) {
        throw new Error("当前环境不支持文件操作（需在 Electron 桌面端运行）");
    }
    return fileAPI;
}

export const electronFile = {
    async read(filePath: string): Promise<string> {
        return unwrap(await assertElectron(getFileAPI()).read(filePath));
    },
    async write(filePath: string, content: string): Promise<void> {
        await unwrap(await assertElectron(getFileAPI()).write(filePath, content));
    },
    async list(dirPath = ""): Promise<FileInfo[]> {
        return unwrap(await assertElectron(getFileAPI()).list(dirPath));
    },
};
