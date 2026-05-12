import { Module, register } from "@core";
import { MENU_COLLAPSED } from "config/static-constant";
// import { MainService } from "service/api/MainService";
import type { RootState } from "type/rootState";
// import { transformMeuns2 } from "utils/function";
import { StorageService } from "utils/StorageService";
import Main from "./component";

const initialMenusState = {
    menus: null,
    collapsed: StorageService.get<boolean>(MENU_COLLAPSED),
};

class MenusModule extends Module<RootState, "menus"> {
    // async onEnter() {
    //     const response = await MainService.getMeuns();
    //     const menus = transformMeuns2(response);
    //     this.setState({ menus });
    // }

    toggleCollapsed(collapsed: boolean) {
        this.setState({ collapsed });
        StorageService.set(MENU_COLLAPSED, collapsed);
    }
}

const module = register(new MenusModule("menus", initialMenusState));
export const actions = module.getActions();
export const MainComponent = module.connect(Main);
