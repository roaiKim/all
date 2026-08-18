import { useDispatch, useSelector } from "react-redux";
import { Collection, CollectionType } from "components/form";
import Modal from "components/modal";
import { actions } from "module/material";
import type { ScenarioState } from "module/material/type";
import type { RootState } from "type/rootState";
import { joinLessPrefix } from "utils/framework";
import "./index.less";

interface MainSceneryProps {
    updateScenarios: (state: Partial<ScenarioState>) => void;
    currentScenarios: ScenarioState;
}

function MainScenery(props: MainSceneryProps) {
    const { updateScenarios, currentScenarios } = props;
    return (
        <div className={joinLessPrefix("main-scenario")}>
            <Collection
                port={CollectionType.INPUT}
                label="幕章名称"
                value={currentScenarios.name}
                onChange={(value) => {
                    updateScenarios({ name: value });
                }}
            />
            <Collection
                port={CollectionType.CUSTOM}
                label="背景"
                value={currentScenarios.background.name}
                onChange={(value) => {
                    // updateScenarios({ name: value });
                }}
            >
                rtt
            </Collection>
            <Modal>dddd</Modal>
        </div>
    );
}

export default MainScenery;
