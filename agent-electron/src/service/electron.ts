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

function assertElectron<T>(api: T | null): T {
    if (!api) {
        throw new Error("当前环境不支持文件操作（需在 Electron 桌面端运行）");
    }
    return api;
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

export interface ImportedMaterial {
    uid: string;
    name: string;
    path: string;
    thumb: string;
    type: "image" | "video";
}

interface ElectronMediaAPI {
    importMaterials: () => Promise<IpcResult<ImportedMaterial[]>>;
}

function getMediaAPI(): ElectronMediaAPI | null {
    return (window as any).electronAPI?.media ?? null;
}

export const mediaFile = {
    async importMaterials(): Promise<ImportedMaterial[]> {
        return unwrap(await assertElectron(getMediaAPI()).importMaterials());
    },
};

// 将素材目录下的相对路径转换为 media:// 协议地址（主进程通过自定义协议流式读取，视频可直接播放/拖动）
export function mediaUrl(filePath: string): string {
    return `media://local/${encodeURIComponent(filePath)}`;
}
