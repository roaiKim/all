import { roDispatchAction } from "@core";

export const ignoreName = ["login"];

export default function locationListener(location) {
    const { pathname } = location || {};
    const name = pathname.replace(/^\/|\/$/g, "");
    console.log("--names-change--", name);
}
