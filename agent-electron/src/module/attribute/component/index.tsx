import type { RootState } from "type/rootState";
import { joinLessPrefix } from "utils/framework";
import "./index.less";

interface AttributeProps {}

function Attribute(props: AttributeProps) {
    return <div className={joinLessPrefix("attribute-page")}>Hello Attribute</div>;
}

export default Attribute;
