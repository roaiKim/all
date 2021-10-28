import { async } from "core";

export default {
    path: "/upload",
    title: "上传下载",
    icon: "",
    Component: async(() => import(/* webpackChunkName: "upload" */ "./index"), "MainComponent"),
    permissions: [],
};
