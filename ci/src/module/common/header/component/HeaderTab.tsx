import { CloseOutlined } from "@icon";
import { Dispatch, SetStateAction } from "react";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { HeaderTab } from "../type";

interface HeaderTabProps {
    data: HeaderTab;
    isActive: boolean;
    onClick: () => void;
}

export const SortableItem = SortableElement((props: HeaderTabProps) => {
    const { data, isActive, onClick } = props;
    const { label, key, noClosed } = data;
    return (
        <div title={`${label}`} className={`ro-header-tab-item-g ro-flex ${isActive ? "active" : ""}`}>
            <div className="ro-tab-trapezoid" onClick={onClick}></div>
            <span className="ro-tab-title" onClick={onClick}>
                {label}
            </span>
            {noClosed && <CloseOutlined />}
        </div>
    );
});

interface SortableTabsProps {
    tabs: HeaderTab[];
    activeKey: string;
    onClick: Dispatch<SetStateAction<HeaderTab>>;
}

export const SortableTabs = SortableContainer((props: SortableTabsProps) => {
    const { tabs, onClick, activeKey } = props;
    return (
        <div className="ro-header-tabs ro-flex ro-col-center">
            {tabs.map((item, index) => (
                <SortableItem key={`item-${item.key}`} isActive={activeKey === item.key} data={item} index={index} onClick={() => onClick(item)} />
            ))}
        </div>
    );
});
