import { roDispatchAction } from "@core";
import { actions } from "module/common/header/index";

export const ignoreName = ["login"];

export default function locationListener(location) {
    const { pathname } = location || {};
    const name = pathname.replace(/^\/|\/$/g, "");
    if (ignoreName.includes(name)) return;
    roDispatchAction(actions.pushTab(name));
}
