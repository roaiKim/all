import { Module, register } from "@core";
import { initialScenario } from "service/initial-data";
import type { RootState } from "type/rootState";
import { MainLoading } from "utils/decorator";
import Main from "./component";
import { moduleName, type State } from "./type";

const initialState: State = {
    activeScenarioKey: "",
    scenarios: [],
};

class MaterialModule extends Module<RootState, typeof moduleName> {
    @MainLoading()
    async onEnter(params, location) {
        //
    }

    addScenario() {
        const scenario = initialScenario();
        this.setState({
            scenarios: [scenario, ...this.state.scenarios],
            activeScenarioKey: scenario.uid,
        });
    }
    setActiveScenarioKey(uid: string) {
        this.setState({
            activeScenarioKey: uid,
        });
    }
}

const module = register(new MaterialModule(moduleName, initialState));
export const actions = module.getActions();
export const MainComponent = module.connect(Main);
