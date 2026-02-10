import { useCallback, useEffect, useRef, useState } from "react";
import { Tabs } from "antd";

interface SceneryControllerProps {
    type: string;
}

export default function SceneryController(props: SceneryControllerProps) {
    const { type } = props;

    return (
        <div className="scenery-controller">
            <Tabs
                rootClassName="scenery-tabs"
                defaultActiveKey="1"
                items={[
                    {
                        key: "base",
                        label: "基础",
                        children: "Content of Tab Pane 1",
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
