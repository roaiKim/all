import { dispatchAction } from "@core";
import { actions } from "module/common/header/index";

export const ignoreName = ["/", "login"];

export default function locationListener(location) {
    console.log("----location----", location);
    const { pathname } = location || {};
    const name = pathname; //.replace(/^\/|\/$/g, "");
    if (ignoreName.includes(name)) return;
    dispatchAction(actions.pushTab(name));
}
