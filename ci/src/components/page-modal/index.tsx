import { PropsWithChildren, ReactNode } from "react";
import Draggable from "react-draggable";
import { CloseOutlined } from "@icon";
import { useContainerRect } from "utils/hooks/useContainerRect";
import { PageModalState } from "utils/hooks/usePageModal";
import CloseImg from "asset/images/global/close.png";
import { PageModalHeader } from "./header";
import "./index.less";

export type PageModalPlace = "global" | "default" | Element;

interface ViewModalProps extends PageModalState {
    title: string | ReactNode;
    width?: number;
    place?: PageModalPlace;
    wrapClassName?: string;
}

export function PageModal(props: PropsWithChildren<ViewModalProps>) {
    const { pageModalState, width, title, children, place = "default", wrapClassName = "" } = props;
    const { open, setViewState } = pageModalState;
    if (!open) return null;

    const { top, right, bottom, left, panelWidth, maxPanelBodyHeight } = useContainerRect({ width, place });
    const className = typeof place === "string" ? place : "";

    return (
        <div className={`ro-page-drag-panel-masx ${wrapClassName} ${className}`} style={{ left, top, right, bottom }}>
            <Draggable handle=".ro-drag-header" scale={1} bounds="parent">
                <div className="ro-drag-container" style={{ width: panelWidth }}>
                    <div className="ro-drag-header">
                        <div className="ro-drag-header-title">{title}</div>
                        <CloseOutlined onClick={() => setViewState({ open: false })} />
                    </div>
                    <div className="ro-drag-body" style={{ maxHeight: maxPanelBodyHeight }}>
                        <div>{children}</div>
                    </div>
                </div>
            </Draggable>
        </div>
    );
}

PageModal.header = PageModalHeader;
