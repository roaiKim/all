import type { RootState } from "type/rootState";
import { joinLessPrefix } from "utils/framework";
import "./index.less";

interface ScenarioProps {}

function Scenario(props: ScenarioProps) {
    return <div className={joinLessPrefix("scenario-page")}>Hello Scenario</div>;
}

export default Scenario;
