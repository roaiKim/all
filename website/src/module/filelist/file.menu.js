import { async } from "core";

export default {
    path: "/filelist",
    title: "文件管理",
    icon: "",
    Component: async(() => import(/* webpackChunkName: "file" */ "./index"), "MainComponent"),
    permissions: [],
};
