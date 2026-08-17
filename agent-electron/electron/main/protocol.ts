import { protocol, net } from "electron";
import { pathToFileURL } from "url";
import { resolveMediaPath } from "./config";

export function registerMediaProtocol(): void {
    protocol.handle("media", async (request) => {
        try {
            const url = new URL(request.url);
            const relative = decodeURIComponent(url.pathname).replace(/^\/+/, "");
            if (!relative) {
                return new Response("Not Found", { status: 404 });
            }
            const absolute = resolveMediaPath(relative);
            return await net.fetch(pathToFileURL(absolute).toString());
        } catch {
            return new Response("Not Found", { status: 404 });
        }
    });
}
