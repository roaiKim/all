import { Module, register } from "@core";
import { MainService } from "service/api/MainService";
import { RootState } from "type/state";
// import { transformMeuns2 } from "utils/function";
import { StorageService } from "utils/StorageService";
import Main from "./component";
import { COLLAPSED } from "./type";

const initialMenusState = {
    menus: null,
    collapsed: StorageService.get<boolean>(COLLAPSED),
};

class MenusModule extends Module<RootState, "menus"> {
    // async onEnter() {
    //     const response = await MainService.getMeuns();
    //     const menus = transformMeuns2(response);
    //     this.setState({ menus });
    // }

    toggleCollapsed(collapsed: boolean) {
        this.setState({ collapsed });
        StorageService.set(COLLAPSED, collapsed);
    }
}

const module = register(new MenusModule("menus", initialMenusState));
export const actions = module.getActions();
export const MainComponent = module.connect(Main);
