import { useDispatch, useSelector } from "react-redux";
import { Tabs } from "antd";
import classNames from "classnames";
import { PlusOutlined } from "@ant-design/icons";
import { actions } from "module/material";
import type { RootState } from "type/rootState";
import { joinLessPrefix } from "utils/framework";

interface SceenProps {}

function Sceen(props: SceenProps) {
    const dispatch = useDispatch();
    const material = useSelector((state: RootState) => state.app.material);
    const { activeScenarioKey, scenarios } = material;
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
            {scenarios.map((item) => (
                <div
                    key={item.uid}
                    className={classNames("sceen", { active: item.uid === activeScenarioKey })}
                    onClick={() => {
                        if (item.uid === activeScenarioKey) return;
                        dispatch(actions.setActiveScenarioKey(item.uid));
                    }}
                >
                    Add
                </div>
            ))}
        </div>
    );
}

export default Sceen;
