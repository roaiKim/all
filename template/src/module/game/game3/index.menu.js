import { async } from "core";

export default {
    path: "/game/game3",
    title: "游戏3",
    icon: "",
    Component: async(() => import(/* webpackChunkName: "game_game3" */ "./index"), "MainComponent"),
    permissions: [],
};
