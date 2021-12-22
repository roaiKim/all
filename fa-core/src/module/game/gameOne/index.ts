import { Loading, Module, register, loadingAction, showLoading } from "@core";
import { message } from "antd";
import Main from "./component";
import { RootState } from "type/state";
import { WEB_TOKEN, COLLAPSED_MENU } from "type/global";
import { State } from "./type";

const initialState = {
    name: null,
};

class GameOneModule extends Module<RootState, "gameOne"> {
    override onEnter(props: any) {
        // console.log("");
        this.setState({ name: "gameOne" });
    }
}

const module = register(new GameOneModule("gameOne", initialState));
export const actions = module.getActions();
export const MainComponent = module.connect(Main);
