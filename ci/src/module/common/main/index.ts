import { captureError, Loading, Module, register, RetryOnNetworkConnectionError } from "@core";
import Main from "./component";
import { RootState } from "type/state";
import { GolbalService } from "service/api/GolbalService";

const initialState = {
    PERMISSION_DONE: null,
};

class MainModule extends Module<RootState, "main"> {
    async onEnter(parms: {}, location: Location) {
        this.fetchPermission();
    }

    @RetryOnNetworkConnectionError()
    @Loading("PERMISSION")
    async fetchPermission() {
        const permission = await new Promise((resolve, reject) => {
            setTimeout(() => {
                GolbalService.getByUserId()
                    .then((response) => {
                        this.setState({ PERMISSION_DONE: true });
                        resolve(response);
                    })
                    .catch((error) => {
                        this.setState({ PERMISSION_DONE: false });
                        reject(error);
                        // captureError(error);
                    });
            }, 1000);
        });
        // console.log("--permission--");

        // const permission = await GolbalService.getByUserId();
        // this.setState({ PERMISSION_DONE: true });
        // console.log("--permission--");
    }

    onLocationMatched(routeParam: object, location): void {
        console.log("-------");
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
