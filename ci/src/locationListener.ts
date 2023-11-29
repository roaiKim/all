import { roDispatch } from "@core";
import { ignoreName } from "http/static-type";
import { actions } from "module/common/header/module";

export default function locationListener(location) {
    const { pathname } = location || {};
    const name = pathname.replace(/^\/|\/$/g, "");
    if (ignoreName.includes(name)) return;
    roDispatch(() => actions.pushTab(name));
}
