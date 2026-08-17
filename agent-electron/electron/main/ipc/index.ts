import { registerFileIpc } from "./file";
import { registerMediaIpc } from "./media";

export function registerIpc(): void {
    registerFileIpc();
    registerMediaIpc();
}
