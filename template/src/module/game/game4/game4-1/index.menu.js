import { async } from "core";

export default {
    path: "/game/game4/game1",
    title: "游戏41",
    icon: "",
    Component: async(() => import(/* webpackChunkName: "game_game4_game1" */ "./index"), "MainComponent"),
    permissions: [],
};
