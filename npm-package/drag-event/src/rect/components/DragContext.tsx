import React, { createContext, PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import { DragAgent, DragAgentProps, EventState } from "../event/agent";
import { Register, Unregister } from "../event/register";
import "./index.less";

export interface DragContextProps extends DragAgentProps {
    //
}

export const DragAgentContext = createContext<DragAgent | null>(null);

export function DragContext(props: PropsWithChildren<DragContextProps>) {
    const dragAgent = useMemo(() => new DragAgent(props || {}), []);
    const activeState = dragAgent.getActiveState();

    const [dragTemplateState, setDragTemplateState] = useState<EventState["state"]>(null);

    const draging = useCallback((state: EventState) => {
        if (state.state.mode === "drag") {
            if (state.changeType === "end") {
                setDragTemplateState(null);
            } else {
                setDragTemplateState(state.state);
            }
        }
    }, []);

    useEffect(() => {
        if (dragAgent) {
            Register(dragAgent, props);
            dragAgent.subscribe("onStateChange", draging);
        }
        return () => {
            if (dragAgent) {
                Unregister(dragAgent, props);
                dragAgent.unsubscribe("onStateChange", draging);
            }
        };
    }, [dragAgent]);

    // console.log("---templateModal-state-", dragTemplateState);

    return (
        <DragAgentContext.Provider value={dragAgent}>
            {props.children}
            {dragTemplateState?.mode == "drag" && (
                <div
                    className={classNames("rosen-template-html", { active: dragTemplateState?._uid })}
                    style={{
                        width: dragTemplateState.width,
                        height: dragTemplateState.height,
                        top: dragTemplateState.y,
                        left: dragTemplateState.x,
                    }}
                ></div>
            )}
        </DragAgentContext.Provider>
    );
}
