import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { CloseOutlined } from "@icon";
import { HeaderTab } from "module/common/header/type";
import ChromeTabSvg from "./tab-path";
import "./index.less";

interface HeaderTabProps {
    data: HeaderTab;
    isActive: boolean;
    onClick: () => void;
    onClose: () => void;
}

const UnfinishedModule = () => {
    return <span style={{ color: "red" }}>开发中...</span>;
};

export const SortableItem = SortableElement<HeaderTabProps>((props: HeaderTabProps) => {
    const { data, isActive, onClick, onClose } = props;
    const { label, noClosed } = data;
    return (
        <div title={`${label}`} className={`ro-header-tab-item-g ro-flex ${isActive ? "active" : ""}`}>
            <div className="ro-tab-trapezoid" onClick={onClick}></div>
            <span className="ro-tab-title" onClick={onClick}>
                {label}
            </span>
            {!noClosed && <CloseOutlined onClick={onClose} />}
        </div>
    );
});

interface SortableTabsProps {}

export const SortableTabs = SortableContainer<SortableTabsProps>((props: SortableTabsProps) => {
    return (
        <div className="chrome-tabs">
            <div className="chrome-tabs-content">
                <div className="chrome-tab">
                    <div className="chrome-tab-dividers"></div>
                    <div className="chrome-tab-background">
                        <ChromeTabSvg />
                    </div>
                    <div className="chrome-tab-content">
                        <div className="chrome-tab-title">Google</div>
                        <div className="chrome-tab-close"></div>
                    </div>
                </div>
                <div className="chrome-tab">
                    <div className="chrome-tab-dividers"></div>
                    <div className="chrome-tab-background">
                        <ChromeTabSvg />
                    </div>
                    <div className="chrome-tab-content">
                        <div className="chrome-tab-title">Google</div>
                        <div className="chrome-tab-close"></div>
                    </div>
                </div>
                <div className="chrome-tab active">
                    <div className="chrome-tab-dividers"></div>
                    <div className="chrome-tab-background">
                        <ChromeTabSvg />
                    </div>
                    <div className="chrome-tab-content">
                        <div className="chrome-tab-title">Facebook</div>
                        <div className="chrome-tab-close"></div>
                    </div>
                </div>
            </div>
            <div className="chrome-tabs-bottom-bar"></div>
        </div>
    );
});
