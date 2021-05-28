import { async } from "core";

export default {
    path: "/game/game4/game2",
    title: "游戏42",
    icon: "",
    Component: async(() => import(/* webpackChunkName: "game_game4_game2" */ "./index"), "MainComponent"),
    permissions: [],
};
