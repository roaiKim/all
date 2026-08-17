import { Module, register } from "@core";
import { initialScenario } from "service/initial-data";
import type { RootState } from "type/rootState";
import { MainLoading } from "utils/decorator";
import Main from "./component";
import { moduleName, type ScenarioState, type State } from "./type";

const initialState: State = {
    activeScenarioKey: "",
    scenarios: new Map(),
    scenariosOrder: [],
};

class MaterialModule extends Module<RootState, typeof moduleName> {
    @MainLoading()
    async onEnter(params, location) {
        //
    }

    addScenario() {
        const scenario = initialScenario();
        const scenarios = new Map(this.state.scenarios);
        scenarios.set(scenario.uid, scenario);
        const orders = [scenario.uid, ...this.state.scenariosOrder];
        this.setState({
            scenarios,
            activeScenarioKey: scenario.uid,
            scenariosOrder: orders,
        });
    }

    setActiveScenarioKey(uid: string) {
        this.setState({
            activeScenarioKey: uid,
        });
    }

    updateScenario(uid: string, scenario: ScenarioState) {
        this.setState((state) => {
            state.scenarios.set(uid, scenario);
        });
    }
}

const module = register(new MaterialModule(moduleName, initialState));
export const actions = module.getActions();
export const MainComponent = module.connect(Main);
