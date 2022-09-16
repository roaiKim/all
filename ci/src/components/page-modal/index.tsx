import { SetView, ViewState } from "utils/hooks/usePageModal";
import Draggable from "react-draggable";
import { PropsWithChildren, ReactNode } from "react";
import { CloseOutlined } from "@icon";
import { useContainerRect } from "utils/hooks/useContainerRect";
import { PageModalHeader } from "./header";
import "./index.less";

export type PageModalPlace = "global" | "default" | Element;

interface ViewModalProps {
    view: ViewState;
    setView: SetView;
    title: string | ReactNode;
    width?: number;
    place?: PageModalPlace;
    wrapClassName?: string;
}

export function PageModal(props: PropsWithChildren<ViewModalProps>) {
    const { view, setView, width, title, children, place = "default", wrapClassName = "" } = props;
    const { show } = view;
    if (!show) return null;

    const { top, right, bottom, left, panelWidth, maxPanelBodyHeight } = useContainerRect({ width, place });
    const className = typeof place === "string" ? place : "";
    console.log("--------", panelWidth);
    return (
        <div className={`ro-page-drag-panel-masx ${wrapClassName} ${className}`} style={{ left, top, right, bottom }}>
            <Draggable handle=".ro-drag-header" scale={1} bounds="parent">
                <div className="ro-drag-container" style={{ width: panelWidth }}>
                    <div className="ro-drag-header">
                        <div className="ro-drag-header-title">{title}</div>
                        <CloseOutlined onClick={() => setView({ show: false })} />
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
