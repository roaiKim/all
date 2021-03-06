import { arrayMoveImmutable } from "array-move";
import React, { useState } from "react";
import { SortableTabs } from "./HeaderTab";
import "./index.less";

export default function () {
    const [activeKey, setActiveKey] = useState<string>();
    const [tabs, setTabs] = useState<string[]>(["客户管理", "项目管理", "路由管理", "承运路线", "车辆调度", "运单管理"]);

    const onSortEnd = ({ oldIndex, newIndex }) => {
        if (oldIndex === newIndex) return;
        setTabs((prevTabs) => arrayMoveImmutable(prevTabs, oldIndex, newIndex));
    };

    return (
        <header className="ro-header-module ro-flex">
            <div className="ro-header-logo ro-flex ro-col-center">
                <img alt="logo" src={localStorage.getItem("headerLogo")} />
                <div className="text-overflow-ellipsis">中集冷云综合服务平台</div>
            </div>
            <SortableTabs
                axis="x"
                lockAxis="x"
                lockOffset="0%"
                lockToContainerEdges
                hideSortableGhost
                distance={10}
                onSortEnd={onSortEnd}
                helperClass="ro-header-tab-help-sort"
                tabs={tabs}
                activeKey={activeKey}
                onClick={setActiveKey}
            />
            <div className="ro-header-operate"></div>
        </header>
    );
}
