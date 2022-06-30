import { CloseOutlined } from "@icon";
import { arrayMoveImmutable } from "array-move";
import { useState } from "react";
import { SortableContainer, SortableElement } from "react-sortable-hoc";

interface HeaderTabProps {
    // name: number;
    // isActive: boolean;
    // onClick: () => void;
    value: any;
}

export function HeaderTab(props: HeaderTabProps) {
    // const { name, isActive, onClick } = props;
    const { value } = props;
    const isActive = false;
    return (
        <div title={`${name}`} className={`ro-header-tab-item ro-flex ${isActive ? "active" : ""}`} onClick={() => {}}>
            <div className="ro-tab-trapezoid"></div>
            <span className="ro-tab-title">项理{value}</span>
            <CloseOutlined />
        </div>
    );
}

export const SortableItem = SortableElement(({ value }) => <HeaderTab value={value} />);

export const SortableList = SortableContainer(({ items }) => {
    return (
        <div className="ro-header-tabs ro-flex ro-col-center">
            {items.map((item, index) => (
                <SortableItem key={`item-${item}`} index={index} value={item} />
            ))}
        </div>
    );
});

export function SortableComponent() {
    const [tabs, setTabs] = useState<string[]>(["Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6"]);
    const onSortEnd = ({ oldIndex, newIndex }) => {
        setTabs((prevTabs) => {
            const a = arrayMoveImmutable(prevTabs, oldIndex, newIndex);
            console.log("--items--", prevTabs, a, oldIndex, newIndex);
            return a;
        });
    };
    return <SortableList axis="x" lockAxis="x" items={tabs} onSortEnd={onSortEnd} hideSortableGhost={true} />;
}
