import { captureError, createModuleMethodErrorAction, Module, register, type RouterLocation, type RouterParams } from "@core";
import { MAIN_LAYOUT_FILE } from "config/file.path";
import defaultLayout from "service/JSON/layout.json";
import { clearToken } from "@http";
import { shouldIgnoreLogin } from "@project/config";
// import { LoginService } from "@api/LoginService";
// import { clearToken } from "@http";
import { DEV_PROXY_HOST, isDevelopment, WEB_IS_LOGIN, WEB_TOKEN } from "config/static-constant";
import { electronFile } from "service/electron";
// import { clearLocalStorageWhenLogout } from "utils/framework";
import { GolbalService } from "service/global-api/GolbalService";
import { LoginService } from "service/global-api/LoginService";
// import { GolbalService } from "service/api/GolbalService";
import type { RootState } from "type/rootState";
// import { getPagePermission, transformMeuns } from "utils/business/permission";
import { Confirm, Loading } from "utils/decorator";
import { joinLessPrefix } from "utils/framework";
import { delay } from "utils/framework/delay";
import { clearLocalStorageWhenLogout } from "utils/framework/login-storage";
import { getPagePermission, transformMeuns } from "utils/framework/permission";
import { removeMainLoading } from "utils/framework/remove-main-loading";
import { StorageService } from "utils/StorageService";
import Main from "./component";
import type { MainLoyoutRatio, State } from "./type";

const initialMainState: State = {
    appLoadingStatus: "loading",
    initialed: false,
    mainLoyoutRatio: defaultLayout,
};

class MainModule extends Module<RootState, "main"> {
    @Loading("main")
    async onEnter(routeParam: RouterParams, location: RouterLocation) {
        await this.readMainLoyoutRatio();
        await delay(1600);
        this.setState({ appLoadingStatus: "done" });
    }

    async readMainLoyoutRatio() {
        return electronFile
            .read(MAIN_LAYOUT_FILE)
            .then((content) => {
                this.setState({ mainLoyoutRatio: JSON.parse(content) });
            })
            .catch((e) => {
                console.log(e);
            });
    }

    setMainLoyoutRatio(patch: Partial<MainLoyoutRatio>) {
        const ratios = this.state.mainLoyoutRatio;
        const newRatios = { ...ratios, ...patch };
        this.setState({ mainLoyoutRatio: newRatios });
        electronFile.write(MAIN_LAYOUT_FILE, JSON.stringify(newRatios, null, 4)).catch(() => {});
    }
}

const module = register(new MainModule("main", initialMainState));
export const actions = module.getActions();
export const MainComponent = module.connect(Main);
