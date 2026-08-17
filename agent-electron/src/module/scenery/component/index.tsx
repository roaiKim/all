import { useDispatch, useSelector } from "react-redux";
import { Collection, CollectionType } from "components/form";
import { actions } from "module/material";
import type { ScenarioState } from "module/material/type";
import type { RootState } from "type/rootState";
import { joinLessPrefix } from "utils/framework";
import "./index.less";

interface SceneryProps {}

function Scenery(props: SceneryProps) {
    const { scenarios, activeScenarioKey } = useSelector((state: RootState) => state.app.material);
    const currentScenarios = scenarios.get(activeScenarioKey);
    const dispatch = useDispatch();
    const updateScenarios = (state: Partial<ScenarioState>) => {
        const scenarios = Object.assign({}, currentScenarios, state);
        dispatch(actions.updateScenario(activeScenarioKey, scenarios));
    };

    return (
        <div className={joinLessPrefix("scenery-page")}>
            <div className={joinLessPrefix("main-scenario")}>
                <Collection
                    port={CollectionType.INPUT}
                    label="幕章名称"
                    value={currentScenarios.name}
                    onChange={(value) => {
                        // stageChange({ pageNoFormat: value });
                        updateScenarios({ name: value });
                    }}
                    // washLight={{
                    //     placeholder: "index/total",
                    // }}
                />
            </div>
            <div></div>
        </div>
    );
}

export default Scenery;
