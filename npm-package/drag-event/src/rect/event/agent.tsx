import { PositionManager } from "@/utils/position-manager";
import { DragEventManagement, DragState, DragTargetMoveType } from "./drag";
import { ListenerAgent, ListenerHolder } from "./listener";

export interface DragTargetState extends DragState {
    _uid: string;
}

export interface DragContainerState {
    _uid: string;
    x: number;
    y: number;
    width: number;
    height: number;
    element: HTMLElement;
}

export interface WrapState {
    wrap: string;
    offsetX: number;
    offsetY: number;
}

type StateChangeType = "start" | "moving" | "end";

export interface EventState {
    state: DragState;
    changeType?: StateChangeType;
    wraps: WrapState[];
    currentTarget: HTMLElement;
}

export enum ListenerType {
    onDragStart = "onDragStart",
    onDragMoving = "onDragMoving",
    onDragEnd = "onDragEnd",
    onResizeStart = "onResizeStart",
    onResizing = "onResizing",
    onResizeEnd = "onResizeEnd",
    onStateChange = "onStateChange",
}

type ListenerEvent = Partial<Record<ListenerType, (state: EventState) => void>>;

export interface DragAgentProps extends ListenerEvent {
    dragDirection?: "x" | "y" | "all";
    resizeDirection?: "x" | "y" | "all";
}

export function initialDragState(uid: string, mode: DragTargetMoveType) {
    return { _uid: uid || "", x: 0, y: 0, width: 0, height: 0, draging: false, moving: false, mode };
}

export class DragAgent {
    dragTargetState: Map<string, DragTargetState> = new Map([]);
    dragContainer: Map<string, DragContainerState> = new Map([]);
    activeStateId: string = "";
    currentTarget: HTMLElement;
    dragEventManagement: DragEventManagement;
    listenerAgent: ListenerAgent;
    constructor(props: DragAgentProps) {
        this.dragEventManagement = new DragEventManagement({});
        this.listenerAgent = new ListenerAgent({ listenersType: Object.values(ListenerType) });

        this.registerEvent(props || {});

        // @ts-ignore
        window.__Drag_Agent__ = this;
    }

    pushDragTargetState(state: DragTargetState | DragTargetState[]) {
        if (Array.isArray(state)) {
            state.forEach((state) => {
                this.dragTargetState.set(state._uid, state);
            });
        } else {
            this.dragTargetState.set(state._uid, state);
        }
    }

    deleteDragTargetState(state: string | string[] | DragTargetState | DragTargetState[]) {
        if (typeof state === "string") {
            this.dragTargetState.delete(state);
        } else if (Array.isArray(state)) {
            state.forEach((state) => {
                if (typeof state === "string") {
                    this.dragTargetState.delete(state);
                } else {
                    this.dragTargetState.delete(state._uid);
                }
            });
        } else {
            this.dragTargetState.delete(state._uid);
        }
    }

    updateDragTargetState(state: DragTargetState | DragTargetState[]) {
        if (Array.isArray(state)) {
            state.forEach((state) => {
                this.dragTargetState.set(state._uid, state);
            });
        } else {
            this.dragTargetState.set(state._uid, state);
        }
    }

    getDragTargetState(uid: string) {
        return this.dragTargetState.get(uid);
    }

    clearDragTargetState() {
        return this.dragTargetState.clear();
    }

    pushDragContainer(container: DragContainerState) {
        this.dragContainer.set(container._uid, container);
    }

    deleteDragContainer(container: string | string[] | DragContainerState | DragContainerState[]) {
        if (typeof container === "string") {
            this.dragContainer.delete(container);
        } else if (Array.isArray(container)) {
            container.forEach((state) => {
                if (typeof state === "string") {
                    this.dragContainer.delete(state);
                } else {
                    this.dragContainer.delete(state._uid);
                }
            });
        } else {
            this.dragContainer.delete(container._uid);
        }
    }

    getActiveState() {
        return this.dragTargetState.get(this.activeStateId);
    }

    setActiveState(state: string | DragTargetState) {
        const id = typeof state === "string" ? state : state._uid;
        if (this.dragTargetState.has(id)) {
            this.activeStateId = id;
        } else {
            console.error(`当前activeKey(${id || ""})不存在`);
        }
    }

    deleteActiveState() {
        this.activeStateId = "";
    }

    getCurrentState = (state: DragTargetState, wraps: WrapState[], type?: StateChangeType): EventState => {
        return { currentTarget: this.currentTarget, state, wraps, changeType: type };
    };

    registerEvent = (options: DragAgentProps) => {
        this.dragEventManagement.mousedownListener = (state) => {
            this.#triggerListener("onDragStart", this.getCurrentState(state, null));
            this.#triggerListener("onStateChange", this.getCurrentState(state, null, "start"));
        };

        this.dragEventManagement.mousemoveListener = (state) => {
            this.#triggerListener("onDragMoving", this.getCurrentState(state, null));
            this.#triggerListener("onStateChange", this.getCurrentState(state, null, "moving"));
        };

        this.dragEventManagement.mouseupListener = (state) => {
            const wraps = this.validateWhole(state);
            // console.log(JSON.stringify(state));
            this.#triggerListener("onDragEnd", this.getCurrentState(state, wraps));
            this.#triggerListener("onStateChange", this.getCurrentState(state, wraps, "end"));
        };

        // 事件结束回调
        this.dragEventManagement.eventEnd = () => {
            this.deleteActiveState();
            this.currentTarget = null;
        };
    };

    validateWhole = (state: DragTargetState, shouldWholeContain = true) => {
        if (this.currentTarget && this.dragContainer?.size) {
            const wraps: WrapState[] = [];
            Array.from(this.dragContainer.values()).forEach((item) => {
                const include = PositionManager.stateByContainer(state, item.element, shouldWholeContain);
                if (include) {
                    wraps.push({
                        wrap: item._uid,
                        offsetX: include[0],
                        offsetY: include[1],
                    });
                }
            });
            return wraps;
        }
        return [];
    };

    getEventTarget = (event: React.MouseEvent): HTMLElement => {
        // const { target } = this.#options;
        // if (target) {
        //     const eventTarget = event.target as HTMLElement;
        //     if (typeof target === "string") {
        //         return eventTarget.closest(target);
        //     } else if (eventTarget.contains(target)) {
        //         return target;
        //     } else {
        //         return null;
        //     }
        // }
        return event.currentTarget as HTMLElement;
    };

    dragStart = (event: React.MouseEvent, id: string, curtain?: HTMLElement) => {
        const state = this.getDragTargetState(id);
        if (state) {
            this.setActiveState(id);
            this.dragEventManagement.setDragState(state);
            const target = this.getEventTarget(event);
            this.currentTarget = target;
            this.dragEventManagement.mousedownEvent(event, target, curtain);
        }
    };

    subscribe(type: ListenerType | keyof typeof ListenerType, listeners: ListenerHolder<EventState>) {
        this.listenerAgent.subscribe(type, listeners);
    }

    #triggerListener(type: ListenerType | keyof typeof ListenerType, ...state: any[]) {
        this.listenerAgent.triggerListener(type, ...state);
    }

    unsubscribe(type: ListenerType | keyof typeof ListenerType, listeners?: ListenerHolder<EventState>) {
        this.listenerAgent.unsubscribe(type, listeners);
    }

    destoryItemByUid() {
        //
    }
}
