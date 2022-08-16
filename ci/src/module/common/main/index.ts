import { Loading, Module, register } from "@core";
import Main from "./component";
import { RootState } from "type/state";
import { GolbalService } from "service/api/GolbalService";

const initialState = {
    userName: null,
    prevPathname: null,
};

class MainModule extends Module<RootState, "main"> {
    @Loading("PERMISSION")
    async onEnter(parms: {}, location: Location) {
        const permission = await GolbalService.getByUserId();
        // .catch((response) => {
        //     // console.log("---", response);
        // });
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

const module = register(new MainModule("main", initialState));
export const actions = module.getActions();
export const MainComponent = module.connect(Main);
