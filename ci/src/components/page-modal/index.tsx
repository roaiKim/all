import { Modal } from "antd";
import { SetView, ViewState } from "utils/hooks/usePageModal";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { Dispatch, MutableRefObject, PropsWithChildren, ReactNode, useRef, useState } from "react";
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

const onDragStart = (
    _event: DraggableEvent,
    uiData: DraggableData,
    draggleRef: MutableRefObject<HTMLDivElement>,
    setBounds: Dispatch<React.SetStateAction<BoundsState>>
) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
        return;
    }
    setBounds({
        left: -targetRect.left + uiData.x,
        right: clientWidth - (targetRect.right - uiData.x),
        top: -targetRect.top + uiData.y,
        bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
};

export function PageModal(props: PropsWithChildren<ViewModalProps>) {
    const { view, setView, width, title, children } = props;
    const { show } = view;
    const [disabled, setDisabled] = useState(false);
    const [bounds, setBounds] = useState<BoundsState>({ left: 0, top: 0, bottom: 0, right: 0 });
    const draggleRef = useRef<HTMLDivElement>(null);

    return (
        <div className="ro-page-modal">
            <Modal
                title={
                    <div onMouseOver={() => disabled && setDisabled(false)} onMouseOut={() => setDisabled(true)}>
                        {title}
                    </div>
                }
                wrapClassName="ro-page-modal-container"
                centered
                destroyOnClose
                visible={show}
                onOk={() => setView({ show: false })}
                onCancel={() => setView({ show: false })}
                width={width || 800}
                maskClosable={false}
                footer={null}
                getContainer={() => document.querySelector(".ro-module-body")}
                modalRender={(modal) => (
                    <Draggable disabled={disabled} bounds={bounds} onStart={(event, uiData) => onDragStart(event, uiData, draggleRef, setBounds)}>
                        <div ref={draggleRef}>{modal}</div>
                    </Draggable>
                )}
            >
                {children}
            </Modal>
        </div>
    );
}
