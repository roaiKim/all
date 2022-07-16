import { SetView, ViewState } from "utils/hooks/usePageModal";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { Dispatch, MutableRefObject, PropsWithChildren, ReactNode, useMemo, useRef, useState } from "react";
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
    const [disabled, setDisabled] = useState(false);
    const [bounds, setBounds] = useState<BoundsState>({ left: 0, top: 0, bottom: 0, right: 0 });
    const draggleRef = useRef<HTMLDivElement>(null);
    const { parentWidth, parentHeight } = useMemo(() => {
        const portal = document.querySelector(".ro-module-body");
        const { width, height } = portal?.getBoundingClientRect() || {};
        return {
            parentWidth: width || 0,
            parentHeight: height || 0,
        };
    }, []);
    if (!show) {
        return null;
    }

    const panelWidth = width ? (width > parentWidth ? parentWidth * 0.95 : width) : "80%";

    const nodeModule = (
        <div className="ro-page-drag-panel">
            <Draggable handle=".ro-drag-header" scale={1} bounds="parent">
                <div style={{ width: panelWidth, maxHeight: "95%" }}>
                    <div className="ro-drag-header">
                        <div className="ro-drag-header-title">新建运单管理</div>
                        <CloseOutlined onClick={() => setView({ show: false })} />
                    </div>
                    <div className="ro-drag-body" style={{ maxHeight: parentHeight * 0.85, overflowY: "auto" }}>
                        <div>{children}</div>
                    </div>
                </div>
            </Draggable>
        </div>
    );

    return createPortal(nodeModule, document.querySelector(".ro-module-body"));
}
