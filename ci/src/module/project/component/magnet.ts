import * as sw from "webtorrent/dist/sw.min.js";
import WebTorrent from "webtorrent/dist/webtorrent.min.js";
const client = new WebTorrent();

export async function Rox1(torrentId) {
    navigator.serviceWorker.register(sw);
    const controller = await navigator.serviceWorker.ready;
    client.createServer({ controller });

    client.add(torrentId, (torrent) => {
        // Torrents can contain many files. Let's use the .mp4 file
        const file = torrent.files.find((file) => {
            return file.name.endsWith(".mp4");
        });

        // Display the file by adding it to the DOM.
        // Supports video, audio, image files, and more!
        file.streamTo(document.querySelector("video"));
    });
}
export async function Rox(torrentId) {
    const client = new WebTorrent();
    const magnetURI = torrentId;
    console.log("Client is downloading:", torrentId);

    client.add(torrentId, function (torrent) {
        // Torrents can contain many files. Let's use the .mp4 file
        const file = torrent.files.find(function (file) {
            return file.name.endsWith(".mp4");
        });

        // Display the file by adding it to the DOM.
        // Supports video, audio, image files, and more!
        file.appendTo("body");
    });
}
