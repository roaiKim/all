import { useCallback, useEffect, useRef, useState } from "react";
import { Tabs } from "antd";
import BaseScenery from "./base";
import type { WebPrint } from "../../main/print";
import type { Protagonist } from "../../type";

interface SceneryControllerProps {
    printModule: WebPrint;
    protagonist: Protagonist;
}

export default function SceneryController(props: SceneryControllerProps) {
    const { printModule, protagonist } = props;

    return (
        <div className="scenery-controller">
            <Tabs
                rootClassName="scenery-tabs"
                defaultActiveKey="1"
                items={[
                    {
                        key: "base",
                        label: "基础",
                        children: <BaseScenery printModule={printModule} protagonist={protagonist} />,
                    },
                    {
                        key: "css",
                        label: "样式",
                        children: "Content of Tab Pane 2",
                    },
                    {
                        key: "border",
                        label: "边框",
                        children: "Content of Tab Pane 3",
                    },
                    {
                        key: "advanced",
                        label: "高级",
                        children: "Content of Tab Pane 4",
                    },
                ]}
                onChange={() => {}}
            />
        </div>
    );
}
