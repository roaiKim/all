import { SetView, ViewState } from "utils/hooks/usePageModal";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { Dispatch, MutableRefObject, PropsWithChildren, ReactNode, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CloseOutlined } from "@icon";
import "./index.less";

interface ViewModalProps {
    view: ViewState;
    setView: SetView;
    title: string | ReactNode;
    width?: number;
}

export function PageModal(props: PropsWithChildren<ViewModalProps>) {
    const { view, setView, width, title, children } = props;
    const { show } = view;
    if (!show) return null;

    const { panelWidth, maxPanelHeight, left } = useMemo(() => {
        const body = document.body;
        const slider = document.querySelector(".ro-meuns-module");

        const { width: bodyWidth, height: bodyHeight } = body.getBoundingClientRect();
        const { width: sliderWight } = slider?.getBoundingClientRect() || {};

        const parentWidth = bodyWidth - sliderWight || 200;
        const panelWidth = width ? (width > parentWidth ? parentWidth * 0.95 : width) : parentWidth * 0.8;
        const maxPanelHeight = (bodyHeight - 96) * 0.96;

        return { panelWidth, maxPanelHeight, left: sliderWight || 200 };
    }, []);

    return (
        <div className="ro-page-drag-panel-masx" style={{ left: left || "auto" }}>
            <Draggable handle=".ro-drag-header" scale={1} bounds="parent">
                <div className="ro-drag-container" style={{ width: panelWidth }}>
                    <div className="ro-drag-header">
                        <div className="ro-drag-header-title">新建运单管理</div>
                        <CloseOutlined onClick={() => setView({ show: false })} />
                    </div>
                    <div className="ro-drag-body" style={{ maxHeight: maxPanelHeight }}>
                        <div>{children}</div>
                    </div>
                </div>
            </Draggable>
        </div>
    );
}
