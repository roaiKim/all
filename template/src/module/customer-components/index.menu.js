import { async } from "core";

export default {
    path: "/show-customer-components",
    title: "组件使用",
    icon: "",
    Component: async(() => import(/* webpackChunkName: "customer-components" */ "./index"), "MainComponent"),
    permissions: [],
};
