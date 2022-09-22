import { roDispatch } from "@core";
import { actions } from "module/common/header/module";
import { ignoreName } from "utils/function/staticEnvs";

export default function locationListener(location) {
    const { pathname } = location || {};
    const name = pathname.replace(/^\/|\/$/g, "");
    if (ignoreName.includes(name)) return;
    roDispatch(() => actions.pushTab(name));
}
