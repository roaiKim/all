import { useRef, useState } from "react";
import { Tabs } from "antd";
import classNames from "classnames";
import { v4 } from "uuid";
import { DragContainer } from "./components/DragContainer";
import { DragContext } from "./components/DragContext";
import { DragItem } from "./components/DragItem";
import { EventState } from "./event/agent";
import { useDrag } from "./hooks/useDrag";
import "./index.less";

interface RectProps {}

interface ContainerState {
    uid: string;
    width: number;
    height: number;
    y: number;
    x: number;
}

function Rect(props: RectProps) {
    const contaienr = useRef<HTMLDivElement>(null);
    const [state, setState] = useState<ContainerState[]>([]);
    // const { dragState } = useDrag({
    //     dragger: contaienr,
    //     target: ".rect-box",
    // });
    // console.log("---dragState--", dragState);
    const onDragMoving = (state) => {
        // console.log("onDragMoving", state);
    };
    const onDragEnd = (state: EventState) => {
        console.log("onDragEnd000", state);
        if (state.wraps?.length) {
            if (state.state.mode === "drag") {
                const rect = {
                    uid: v4(),
                    width: state.state.width,
                    height: state.state.height,
                    y: state.wraps[0].offsetY,
                    x: state.wraps[0].offsetX,
                };
                setState((state) => [...state, rect]);
            } else {
                setState((states) => {
                    return states.map((item) => {
                        if (item.uid === state.state._uid) {
                            return {
                                ...item,
                                width: state.state.width,
                                height: state.state.height,
                                y: state.wraps[0].offsetY,
                                x: state.wraps[0].offsetX,
                            };
                        }
                        return item;
                    });
                });
            }
        }
    };
    console.log("state00", state);
    return (
        <DragContext onDragMoving={onDragMoving} onDragEnd={onDragEnd}>
            <div ref={contaienr} className={"rect-container"}>
                <DragItem mode="drag">
                    <div className={"rect-box"}></div>
                </DragItem>
                <DragItem mode="drag">
                    <div className={"rect-box"}></div>
                </DragItem>
            </div>
            <DragContainer>
                <div className="rosen-container-1">
                    {state.map((item) => (
                        <DragItem key={item.uid} id={item.uid} width={item.width} height={item.height} y={item.y} x={item.x}>
                            <div
                                className="rosen-item-1" /* style={{ width: item.width, height: item.height, top: item.top, left: item.left }} */
                            ></div>
                        </DragItem>
                    ))}
                </div>
            </DragContainer>
        </DragContext>
    );
}

export default Rect;
