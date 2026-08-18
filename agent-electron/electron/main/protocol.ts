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

            // 仅在有 Range 头时转发，视频才能按字节范围请求（快进/拖动、大文件元数据加载）
            const range = request.headers.get("Range");
            const response = range
                ? await net.fetch(pathToFileURL(absolute).toString(), { headers: { Range: range } })
                : await net.fetch(pathToFileURL(absolute).toString());

            const headers = new Headers(response.headers);
            headers.set("Access-Control-Allow-Origin", "*");
            return new Response(response.body, {
                status: response.status,
                statusText: response.statusText,
                headers,
            });
        } catch (error) {
            console.error("[media] 请求失败:", error);
            return new Response("Not Found", { status: 404 });
        }
    });
}
