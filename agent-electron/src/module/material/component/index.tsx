import type { RootState } from "type/rootState";
import { joinLessPrefix } from "utils/framework";
import "./index.less";

interface MaterialProps {}

function Material(props: MaterialProps) {
    return <div className={joinLessPrefix("material-page")}>Hello Material</div>;
}

export default Material;
