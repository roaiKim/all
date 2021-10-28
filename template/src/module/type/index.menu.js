import { async } from "core";

export default {
    path: "/type",
    title: "Swagger",
    Component: async(() => import(/* webpackChunkName: "type" */ "./index"), "MainComponent"),
    permissions: [],
};
