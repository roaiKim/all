import { SetView, ViewState } from "utils/hooks/usePageModal";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { Dispatch, MutableRefObject, PropsWithChildren, ReactNode, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CloseOutlined } from "@icon";
import "./index.less";
import { useSlideWidth } from "utils/hooks/useSlideWidth";
import { useContainerRect } from "utils/hooks/useContainerRect";

export type PageModalPlace = true | "global" | "default";

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

    // const { maskLeft, maskTop, panelWidth, maxPanelHeight, sliderWight } = useSlideWidth({ width, place });

    const { top, right, bottom, left, panelWidth, maxPanelBodyHeight } = useContainerRect({ width, place });
    const className = typeof place === "string" ? place : "";
    console.log("-PageModal-", { top, right, bottom, left });

    return (
        <div className={`ro-page-drag-panel-masx ${wrapClassName} ${className}`} style={{ left }}>
            <Draggable handle=".ro-drag-header" scale={1} bounds="parent">
                <div className="ro-drag-container" style={{ width: panelWidth }}>
                    <div className="ro-drag-header">
                        <div className="ro-drag-header-title">新建运单管理</div>
                        <CloseOutlined onClick={() => setView({ show: false })} />
                    </div>
                    <div className="ro-drag-body" style={{ maxHeight: maxPanelBodyHeight }}>
                        <div>{children}</div>
                        <div>{children}</div>
                        <div>{children}</div>
                        <div>{children}</div>
                        <div>{children}</div>
                        <div>{children}</div>
                        <div>{children}</div>
                    </div>
                </div>
            </Draggable>
        </div>
    );
}
