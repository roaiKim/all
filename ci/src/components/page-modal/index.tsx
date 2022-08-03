import { SetView, ViewState } from "utils/hooks/usePageModal";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { Dispatch, MutableRefObject, PropsWithChildren, ReactNode, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CloseOutlined } from "@icon";
import "./index.less";
import { useSlideWidth } from "utils/hooks/useSlideWidth";

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

    const { panelWidth, maxPanelHeight, sliderWight } = useSlideWidth({ width });

    return (
        <div className="ro-page-drag-panel-masx" style={{ left: sliderWight || "auto" }}>
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
