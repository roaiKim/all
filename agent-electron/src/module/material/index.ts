import { Module, register } from "@core";
import { MATERIAL_FILE } from "config/file.path";
import { mediaFile } from "service/electron";
import { initialScenario } from "service/initial-data";
import type { RootState } from "type/rootState";
import { Confirm, MainLoading } from "utils/decorator";
import Main from "./component";
import { type AssetMaterial, moduleName, type ScenarioState, type State } from "./type";

const initialState: State = {
    activeScenarioKey: "",
    scenarios: new Map(),
    scenariosOrder: [],
    materials: [],
};

class MaterialModule extends Module<RootState, typeof moduleName> {
    @MainLoading()
    async onEnter(params, location) {
        await this.readMaterials();
    }

    async readMaterials() {
        return mediaFile
            .readJson(MATERIAL_FILE)
            .then((content) => {
                this.setState({ materials: JSON.parse(content) });
            })
            .catch(() => {
                // 首次运行尚无清单文件，保持空列表
            });
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

    addMaterials(materials: AssetMaterial[]) {
        this.setState((state) => {
            state.materials.push(...materials);
        });
        this.persistMaterials();
    }

    deleteMaterial(uid: string) {
        this.setState((state) => {
            state.materials = state.materials.filter((item) => item.uid !== uid);
        });
        this.persistMaterials();
    }

    persistMaterials() {
        mediaFile.writeJson(MATERIAL_FILE, JSON.stringify(this.state.materials, null, 4)).catch(() => {});
    }
}

const module = register(new MaterialModule(moduleName, initialState));
export const actions = module.getActions();
export const MainComponent = module.connect(Main);
