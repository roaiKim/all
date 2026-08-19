import { useDispatch, useSelector } from "react-redux";
import { When } from "components/when";
import { mediaUrl } from "service/electron";
import type { RootState } from "type/rootState";
import { joinLessPrefix } from "utils/framework";
import "./index.less";

interface ScenarioProps {}

function Scenario(props: ScenarioProps) {
    const { scenarios, activeScenarioKey } = useSelector((state: RootState) => state.app.material);
    const dispatch = useDispatch();
    const currentScenarios = scenarios.get(activeScenarioKey);
    const { main } = currentScenarios;
    return (
        <div className={joinLessPrefix("scenario-page")}>
            <When when={!!main.background.path}>
                {main.background.type === "image" ? (
                    <img src={mediaUrl(main.background.path)} alt={main.background.name} style={{ objectFit: main.backgroundShowModal }} />
                ) : (
                    <video
                        src={mediaUrl(main.background.path)}
                        style={{ objectFit: main.backgroundShowModal }}
                        muted
                        preload="metadata"
                        playsInline
                    />
                )}
            </When>
        </div>
    );
}

export default Scenario;
