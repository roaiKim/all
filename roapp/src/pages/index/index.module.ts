import { Loading, Module, register } from "@core";
import { RootState } from "type/state";
import { State } from "./type";

const initialHomeState: State = {
    name: null,
};

class HomeModule extends Module<RootState, "home"> {
    @Loading()
    async onEnter() {
        await new Promise((resolve, reject) => {
            setTimeout(resolve, 2000);
        });
        this.setState({ name: "ROSEN" });
    }

    reset() {
        this.setState({ name: null });
    }
}

const module = register(new HomeModule("home", initialHomeState));
const actions = module.getActions();

export { module, actions };
