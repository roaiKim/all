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

    @Loading("PERMISSION")
    @RetryOnNetworkConnectionError(1, 2)
    async fetchPermission() {
        const permission = await new Promise((resolve, reject) => {
            console.log("--1--");
            setTimeout(() => {
                GolbalService.getByUserId()
                    .then((response) => {
                        console.log("--2--");
                        this.setState({ PERMISSION_DONE: true });
                        resolve(response);
                    })
                    .catch((error) => {
                        console.log("--3--");
                        this.setState({ PERMISSION_DONE: false });
                        reject(error);
                        // captureError(error);
                    });
            }, 1000);
        });
        // .catch((response) => {
        //     // console.log("---", response);
        // });
        console.log("--permission--");
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
