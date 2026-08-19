import { useDispatch, useSelector } from "react-redux";
import { Collection, CollectionType } from "components/form";
import { actions } from "module/material";
import type { ScenarioState } from "module/material/type";
import type { RootState } from "type/rootState";
import { joinLessPrefix } from "utils/framework";
import MainScenery from "./main-scenery";
import "./index.less";

interface SceneryProps {}

function Scenery(props: SceneryProps) {
    // const { scenarios, activeScenarioKey } = useSelector((state: RootState) => state.app.material);
    // const currentScenarios = scenarios.get(activeScenarioKey);
    // const dispatch = useDispatch();

    // const updateScenarios = (state: Partial<ScenarioState>) => {
    //     const scenarios = Object.assign({}, currentScenarios, state);
    //     console.log("--scenarios--", scenarios);
    //     dispatch(actions.updateScenario(activeScenarioKey, scenarios));
    // };

    return (
        <div className={joinLessPrefix("scenery-page")}>
            <MainScenery />
            <div></div>
        </div>
    );
}

export default Scenery;
