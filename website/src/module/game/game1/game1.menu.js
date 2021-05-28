import { async } from "core";

export default {
    path: "/game/game1",
    title: "游戏1",
    icon: "",
    Component: async(() => import(/* webpackChunkName: "game_game1" */ "./index"), "MainComponent"),
    permissions: [],
};
