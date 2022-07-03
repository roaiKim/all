import { Module, register } from "@core";
import Main from "./component";
import { RootState } from "type/state";
import { MainService } from "service/api/MainService";

const initialState = {
    menus: null,
};

class MenusModule extends Module<RootState, "menus"> {
    async onEnter() {
        const menus = await MainService.getMeuns();
        this.setState({ menus });
    }
}

const module = register(new MenusModule("menus", initialState));
export const actions = module.getActions();
export const MainComponent = module.connect(Main);
