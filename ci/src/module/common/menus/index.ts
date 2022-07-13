import { Module, register } from "@core";
import Main from "./component";
import { RootState } from "type/state";
import { MainService } from "service/api/MainService";
import { transformMeuns } from "utils/function";

const initialState = {
    menus: null,
};

class MenusModule extends Module<RootState, "menus"> {
    async onEnter() {
        const response = await MainService.getMeuns();
        const menus = transformMeuns(response);
        this.setState({ menus });
    }
}

const module = register(new MenusModule("menus", initialState));
export const actions = module.getActions();
export const MainComponent = module.connect(Main);
