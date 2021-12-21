import { Loading, Module, register, loadingAction, showLoading } from "@core";
import { message } from "antd";
import Main from "./component";
import { RootState } from "type/state";
import { WEB_TOKEN, COLLAPSED_MENU } from "type/global";
import { State } from "./type";

const initialState = {
    name: null,
};

class GameTwoModule extends Module<RootState, "gameTwo"> {
    override onEnter(props: any) {
        console.log("");
        this.setState({ name: "gameTwo" });
    }
}

const module = register(new GameTwoModule("gameTwo", initialState));
export const actions = module.getActions();
export const MainComponent = module.connect(Main);
