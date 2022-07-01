import { CloseOutlined } from "@icon";
import { Dispatch, SetStateAction } from "react";
import { SortableContainer, SortableElement } from "react-sortable-hoc";

interface HeaderTabProps {
    name: number;
    isActive: boolean;
    onClick: () => void;
}

export const SortableItem = SortableElement((props: HeaderTabProps) => {
    const { name, isActive, onClick } = props;
    return (
        <div title={`${name}`} className={`ro-header-tab-item-g ro-flex ${isActive ? "active" : ""}`}>
            <div className="ro-tab-trapezoid" onClick={onClick}></div>
            <span className="ro-tab-title" onClick={onClick}>
                项理{name}
            </span>
            <CloseOutlined />
        </div>
    );
});

interface SortableTabsProps {
    tabs: any[];
    activeKey: string;
    onClick: Dispatch<SetStateAction<string>>;
}

export const SortableTabs = SortableContainer((props: SortableTabsProps) => {
    const { tabs, onClick, activeKey } = props;
    return (
        <div className="ro-header-tabs ro-flex ro-col-center">
            {tabs.map((item, index) => (
                <SortableItem key={`item-${item}`} isActive={activeKey === item} name={item} index={index} onClick={() => onClick(item)} />
            ))}
        </div>
    );
});
