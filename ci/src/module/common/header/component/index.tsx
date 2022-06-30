import React, { useState } from "react";
import { arrayMove } from "react-sortable-hoc";
import { SortableList, HeaderTab, SortableComponent } from "./HeaderTab";
import "./index.less";

export default function () {
    const [activeKey, setActiveKey] = useState<number>();
    const [tabs, setTabs] = useState<string[]>(["Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6"]);
    return (
        <header className="ro-header-container ro-flex">
            <div className="ro-header-logo ro-flex ro-col-center">
                <img alt="logo" src={localStorage.getItem("headerLogo")} />
                <div className="text-overflow-ellipsis">中集冷云综合服务平台</div>
            </div>
            {/* <div className="ro-header-tabs ro-flex ro-col-center">
                {[1, 3, 4, 5, 6].map((item) => (
                    <HeaderTab key={item} isActive={activeKey === item} name={item} onClick={() => setActiveKey(item)} />
                ))}
            </div> */}
            <SortableComponent />
            <div className="ro-header-operate"></div>
        </header>
    );
}
