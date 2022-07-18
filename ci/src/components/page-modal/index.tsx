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

interface BoundsState {
    left: number;
    top: number;
    bottom: number;
    right: number;
}

export function PageModal(props: PropsWithChildren<ViewModalProps>) {
    const { view, setView, width, title, children } = props;
    const { show } = view;
    if (!show) return null;

    const { panelWidth, maxPanelHeight, defaultX } = useMemo(() => {
        const portal = document.querySelector(".ro-module-body");

        const { width: parentWidth, height: parentHeight } = portal?.getBoundingClientRect() || {};
        const panelWidth = width ? (width > parentWidth ? parentWidth * 0.95 : width) : parentWidth * 0.8;
        const maxPanelHeight = parentHeight - 80;

        return { panelWidth, maxPanelHeight, defaultX: (parentWidth + 10 - panelWidth) / 2 };
    }, []);

    const nodeModule = (
        <div className="ro-page-drag-panel-masx">
            <Draggable handle=".ro-drag-header" scale={1} bounds="parent">
                <div className="ro-drag-container" style={{ width: panelWidth, maxHeight: "95%" }}>
                    <div className="ro-drag-header">
                        <div className="ro-drag-header-title">新建运单管理</div>
                        <CloseOutlined onClick={() => setView({ show: false })} />
                    </div>
                    <div className="ro-drag-body" style={{ maxHeight: maxPanelHeight, overflowY: "auto" }}>
                        <div>{children}</div>
                        <div>{children}</div>
                        <div>{children}</div>
                        <div>{children}</div>
                    </div>
                </div>
            </Draggable>
        </div>
    );

    return createPortal(nodeModule, document.querySelector(".ro-module-body"));
}
