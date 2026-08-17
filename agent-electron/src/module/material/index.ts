import { Module, register } from "@core";
import { initialScenario } from "service/initial-data";
import type { RootState } from "type/rootState";
import { Confirm, MainLoading } from "utils/decorator";
import Main from "./component";
import { moduleName, type MaterialItem, type ScenarioState, type State } from "./type";

const initialState: State = {
    activeScenarioKey: "",
    scenarios: new Map(),
    scenariosOrder: [],
    materials: [],
};

class MaterialModule extends Module<RootState, typeof moduleName> {
    @MainLoading()
    async onEnter(params, location) {
        //
    }

    addScenario() {
        const scenario = initialScenario();
        this.setState((state) => {
            state.scenarios.set(scenario.uid, scenario);
            state.scenariosOrder = [scenario.uid, ...this.state.scenariosOrder];
            state.activeScenarioKey = scenario.uid;
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

    @Confirm("确定删除当前幕章")
    deleteScenario(uid: string) {
        this.setState((state) => {
            state.scenarios.delete(uid);
            state.scenariosOrder = state.scenariosOrder.filter((item) => item !== uid);
            state.activeScenarioKey = state.scenariosOrder[0] || "";
        });
    }

    addMaterials(materials: MaterialItem[]) {
        this.setState((state) => {
            state.materials.push(...materials);
        });
    }

    deleteMaterial(uid: string) {
        this.setState((state) => {
            state.materials = state.materials.filter((item) => item.uid !== uid);
        });
    }
}

const module = register(new MaterialModule(moduleName, initialState));
export const actions = module.getActions();
export const MainComponent = module.connect(Main);
