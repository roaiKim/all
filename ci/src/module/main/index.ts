import { Module, register } from "@core";
import Main from "./component";
import { RootState } from "type/state";

const initialState = {
    userName: null,
    prevPathname: null,
};

class MainModule extends Module<RootState, "main"> {
    calcPageHeight() {
        try {
            const container = document.querySelector(".ro-main-body");
            if (container) {
                (container as any).style.height = `${window.innerHeight}px`;
            }
        } catch (e) {
            console.error("获取文档高度失败", e);
        }
    }
}

const module = register(new MainModule("main", initialState));
export const actions = module.getActions();
export const MainComponent = module.connect(Main);
