import { Module, register } from "@core";
import { RootState } from "type/state";
import Main from "./main";
import { State } from "./type";

const initialHomeState: State = {
    name: null,
};
class HomeModule extends Module<RootState, "home"> {
    onEnter(entryComponentProps: any): void {
        console.log("rosen onEntry", entryComponentProps);
        setTimeout(() => {
            this.setState({ name: "ROSEN" });
        }, 4000);
    }
}

const module = register(new HomeModule("home", initialHomeState));
export const actions = module.getActions();
const MainComponent = module.connect(Main);

export default MainComponent;
