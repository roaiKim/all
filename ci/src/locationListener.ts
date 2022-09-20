import { roDispatch } from "@core";
import { actions } from "module/common/header/module";

export default function locationListener(location) {
    const { pathname } = location || {};
    const name = pathname.replace(/^\/|\/$/g, "");
    roDispatch(() => actions.pushTab(name));
}
