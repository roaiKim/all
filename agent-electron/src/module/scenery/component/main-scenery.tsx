import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "antd";
import { Collection, CollectionType } from "components/form";
import Modal from "components/modal";
import { actions } from "module/material";
import Asset from "module/material/component/asset";
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
    const [open, setOpen] = useState(false);
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
            <Collection port={CollectionType.CUSTOM} label="幕章背景" value={currentScenarios.background.name}>
                <Button
                    onClick={() => {
                        setOpen(!open);
                    }}
                    size="small"
                >
                    选择背景
                </Button>
            </Collection>
            <Modal
                open={open}
                title="超级萝莉"
                onClose={() => {
                    setOpen(!open);
                }}
                footer={false}
            >
                <Asset
                    showAddButton={false}
                    showDeleteButton={false}
                    onClick={(material) => {
                        updateScenarios({ background: material });
                    }}
                />
            </Modal>
        </div>
    );
}

export default MainScenery;
