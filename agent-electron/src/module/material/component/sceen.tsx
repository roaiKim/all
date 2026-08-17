import { useDispatch, useSelector } from "react-redux";
import { Tabs } from "antd";
import classNames from "classnames";
import { PlusOutlined } from "@ant-design/icons";
import { actions } from "module/material";
import type { RootState } from "type/rootState";
import { joinLessPrefix } from "utils/framework";
import Thumbnail from "./thumbnail";

interface SceenProps {}

function Sceen(props: SceenProps) {
    const dispatch = useDispatch();
    const material = useSelector((state: RootState) => state.app.material);
    const { activeScenarioKey, scenarios, scenariosOrder } = material;
    return (
        <div className={joinLessPrefix("sceen-container")}>
            <div
                className="sceen sceen-add"
                onClick={() => {
                    dispatch(actions.addScenario());
                }}
            >
                <span>新增幕章</span>
                <PlusOutlined style={{ fontSize: 24, marginTop: 5 }} />
            </div>
            {scenariosOrder.map((uid) => (
                <Thumbnail key={uid} activeScenarioKey={activeScenarioKey} scenario={scenarios.get(uid)}></Thumbnail>
            ))}
        </div>
    );
}

export default Sceen;
