import { async } from "core";

export default {
  path: "/upload",
  title: "上传下载",
  icon: "",
  component: async(() => import("./index"), "MainComponent"),
  permissions: [],
};
