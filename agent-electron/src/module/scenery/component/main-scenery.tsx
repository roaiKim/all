import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "antd";
import { Collection, CollectionType } from "components/form";
import Modal from "components/modal";
import { actions } from "module/material";
import Asset from "module/material/component/asset";
import { BackgroundShowModal, type Scenario, type ScenarioState } from "module/material/type";
import type { RootState } from "type/rootState";
import { joinLessPrefix } from "utils/framework";
import "./index.less";

interface MainSceneryProps {}

function MainScenery(props: MainSceneryProps) {
    const [showBackgroundSelector, setShowBackgroundSelector] = useState(false);
    const dispatch = useDispatch();
    const { scenarios, activeScenarioKey } = useSelector((state: RootState) => state.app.material);
    const currentScenarios = scenarios.get(activeScenarioKey);

    const { main } = currentScenarios;

    const updateScenarios = (state: Partial<ScenarioState>) => {
        const scenarios = Object.assign({}, currentScenarios, state);
        dispatch(actions.updateScenario(activeScenarioKey, scenarios));
    };

    const updateMainScenario = (state: Partial<Scenario>) => {
        const scenarios = Object.assign({}, currentScenarios.main, state);
        updateScenarios({ main: scenarios });
    };
    console.log("currentScenarios==", currentScenarios);
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
            <Collection port={CollectionType.CUSTOM} label="幕章背景" value={main.background.name}>
                <Button onClick={() => setShowBackgroundSelector(!showBackgroundSelector)} size="small">
                    选择背景
                </Button>
            </Collection>
            <Collection
                port={CollectionType.SELECT}
                label="背景显示方式"
                value={main.backgroundShowModal}
                onChange={(value) => {
                    updateMainScenario({ backgroundShowModal: value });
                }}
                washLight={{ options: Object.keys(BackgroundShowModal).map((item) => ({ label: item, value: item })) }}
            />
            <Collection
                port={CollectionType.SELECT}
                label="背景显示方式"
                value={main.autoPlay}
                onChange={(value) => {
                    updateMainScenario({ autoPlay: value });
                }}
                washLight={{ options: Object.keys(BackgroundShowModal).map((item) => ({ label: item, value: item })) }}
            />
            <Modal
                open={showBackgroundSelector}
                title="素材选择"
                onClose={() => {
                    setShowBackgroundSelector(!showBackgroundSelector);
                }}
                footer={false}
            >
                <Asset
                    showAddButton={false}
                    showDeleteButton={false}
                    onClick={(material) => {
                        updateMainScenario({ background: material });
                    }}
                />
            </Modal>
        </div>
    );
}

export default MainScenery;
