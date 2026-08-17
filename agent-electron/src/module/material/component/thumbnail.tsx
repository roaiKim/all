import { useDispatch } from "react-redux";
import classNames from "classnames";
import { DeleteOutlined } from "@ant-design/icons";
import { When } from "components/when";
import { actions } from "module/material";
import { mediaUrl } from "service/electron";
import type { ScenarioState } from "../type";

interface ThumbnailProps {
    scenario: ScenarioState;
    activeScenarioKey: string;
}

function Thumbnail(props: ThumbnailProps) {
    const { activeScenarioKey, scenario } = props;
    const dispatch = useDispatch();
    const { background, name, uid } = scenario;

    return (
        <div
            className={classNames("sceen", "sceen-thumbnail", { active: uid === activeScenarioKey })}
            onClick={() => {
                if (uid === activeScenarioKey) return;
                dispatch(actions.setActiveScenarioKey(uid));
            }}
        >
            <div className="sceen-thumbnail-title">{name}</div>
            <When when={uid === activeScenarioKey}>
                <DeleteOutlined
                    onClick={() => {
                        if (uid !== activeScenarioKey) return;
                        dispatch(actions.deleteScenario(uid));
                    }}
                    style={{ fontSize: 16 }}
                    className="sceen-delete"
                />
            </When>
            <When when={!!background}>
                <img src={mediaUrl(background)}></img>
            </When>
        </div>
    );
}

export default Thumbnail;
