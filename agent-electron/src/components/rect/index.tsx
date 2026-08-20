import { useDispatch, useSelector } from "react-redux";
import { Tabs } from "antd";
import classNames from "classnames";
import { PlusOutlined } from "@ant-design/icons";
import { actions } from "module/material";
import type { RootState } from "type/rootState";
import { joinLessPrefix } from "utils/framework";
import "./index.less";

interface RectProps {}

function Rect(props: RectProps) {
    const dispatch = useDispatch();
    const material = useSelector((state: RootState) => state.app.material);
    const { activeScenarioKey, scenarios, scenariosOrder } = material;
    return (
        <div className={joinLessPrefix("rect-container")}>
            <div className={joinLessPrefix("rect-box")}></div>
            <div className={joinLessPrefix("rect-box")}></div>
        </div>
    );
}

export default Rect;
