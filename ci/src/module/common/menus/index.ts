import { Module, register } from "@core";
import { MainService } from "service/api/MainService";
import { RootState } from "type/state";
import { transformMeuns } from "utils/function";
import { StorageService } from "utils/StorageService";
import Main from "./component";
import { COLLAPSED } from "./type";

const initialState = {
    menus: null,
    collapsed: StorageService.get<boolean>(COLLAPSED),
};

class MenusModule extends Module<RootState, "menus"> {
    async onEnter() {
        const response = await MainService.getMeuns();
        const menus = transformMeuns(response);
        this.setState({ menus });
    }

    toggleCollapsed(collapsed: boolean) {
        this.setState({ collapsed });
        StorageService.set(COLLAPSED, collapsed);
    }
}

const module = register(new MenusModule("menus", initialState));
export const actions = module.getActions();
export const MainComponent = module.connect(Main);
