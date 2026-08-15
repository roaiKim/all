import type { RootState } from "type/rootState";
import { joinLessPrefix } from "utils/framework";
import "./index.less";

interface SceneryProps {}

function Scenery(props: SceneryProps) {
    return <div className={joinLessPrefix("scenery-page")}>Hello Scenery</div>;
}

export default Scenery;
