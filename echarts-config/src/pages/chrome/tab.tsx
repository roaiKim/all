import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CloseSvg, TabBackageSvg } from "./tab-path";
export interface ChromeStyleTabType {
    /**
     * @description icon
     */
    icon?: React.ReactNode;

    /**
     * @description title
     */
    label?: React.ReactNode;

    /**
     *
     * @description key
     */
    key?: string | number;

    /**
     * @description 是显示关闭按钮
     * @default true
     */
    allowClose?: boolean;

    /**
     * @description disabled
     * @default false
     */
    disabled?: boolean;
}

interface TabItemProps {
    index: number;
    tab: ChromeStyleTabType;
    isActive: boolean;
    onClose?: (active: string | number) => void;
    onClick?: (tab: ChromeStyleTabType, index: number) => void;
    isFirstTab: boolean;
    isLastTab: boolean;
}

export function TabItem(props: TabItemProps) {
    const { tab, isActive, onClose, onClick, index, isFirstTab, isLastTab } = props;
    const { key, label, icon, disabled, allowClose = true } = tab;

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: key, disabled });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        display: "inline-block",
        zIndex: isDragging ? 101 : 100,
    };

    return (
        <div
            key={key}
            ref={setNodeRef}
            style={style}
            className={`cst-item ${isActive ? "active" : ""} ${isFirstTab ? "cst-first-tab" : isLastTab ? "cst-last-tab" : ""}`}
            {...attributes}
            {...listeners}
        >
            <div className="cst-bg">
                <TabBackageSvg />
            </div>
            <div className="cst-context" onMouseDown={() => onClick(tab, index)}>
                <div className="cst-icon">{icon}</div>
                <div className="cst-text">{label}</div>
                {!!allowClose && (
                    <div
                        className="cst-close"
                        onClick={(event) => {
                            event.stopPropagation();
                            onClose(key);
                        }}
                    >
                        <CloseSvg />
                    </div>
                )}
            </div>
        </div>
    );
}
