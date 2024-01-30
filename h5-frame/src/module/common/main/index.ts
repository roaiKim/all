import { captureError, Module, register, roPushHistory } from "@core";
import { RootState } from "type/state";
import Main from "./component";

const initialMainState = {
    PERMISSION_DONE: null,
    navPermission: null,
    pagePermission: null,
};

class MainModule extends Module<RootState, "main"> {
    async onEnter() {
        //
    }

    calcPageHeight() {
        try {
            const container = document.querySelector(".ro-main-container");
            if (container) {
                (container as any).style.height = `${window.innerHeight}px`;
            }
        } catch (e) {
            console.error("获取文档高度失败", e);
        }
    }
}

const module = register(new MainModule("main", initialMainState));
export const actions = module.getActions();
export const MainComponent = module.connect(Main);
