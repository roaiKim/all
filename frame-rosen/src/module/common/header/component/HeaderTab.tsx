// import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { CloseOutlined } from "@icon";
import { HeaderTab } from "module/common/header/type";

interface HeaderTabProps {
    data: HeaderTab;
    isActive: boolean;
    onClick: () => void;
    onClose: () => void;
}

const UnfinishedModule = () => {
    return <span style={{ color: "red" }}>开发中...</span>;
};

// export const SortableItem = SortableElement<HeaderTabProps>((props: HeaderTabProps) => {
//     const { data, isActive, onClick, onClose } = props;
//     const { label, noClosed } = data;
//     return (
//         <div title={`${label}`} className={`ro-header-tab-item-g ro-flex ${isActive ? "active" : ""}`}>
//             <div className="ro-tab-trapezoid" onClick={onClick}></div>
//             <span className="ro-tab-title" onClick={onClick}>
//                 {label}
//             </span>
//             {!noClosed && <CloseOutlined onClick={onClose} />}
//         </div>
//     );
// });

// interface SortableTabsProps {
//     tabs: HeaderTab[];
//     activeKey: string;
//     onClick: (tab: HeaderTab) => void;
//     onClose: (tab: HeaderTab) => void;
// }

// export const SortableTabs = SortableContainer<SortableTabsProps>((props: SortableTabsProps) => {
//     const { tabs, onClick, activeKey, onClose } = props;
//     return (
//         <div className="ro-header-tabs ro-flex ro-col-center">
//             {tabs.map((item, index) => (
//                 <SortableItem
//                     key={`item-${item.key}`}
//                     isActive={activeKey === item.key}
//                     data={item}
//                     index={index}
//                     onClick={() => onClick(item)}
//                     onClose={() => onClose(item)}
//                     disabled={item.key === "home"}
//                 />
//             ))}
//         </div>
//     );
// });
