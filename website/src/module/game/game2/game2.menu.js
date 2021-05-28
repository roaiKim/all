import { async } from "core";

export default {
    path: "/game/game2",
    title: "游戏2",
    icon: "",
    Component: async(() => import(/* webpackChunkName: "game_game2" */ "./index"), "MainComponent"),
    permissions: [],
};
