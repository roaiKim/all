import { Content } from "antd/es/layout/layout";
import { DraggableType } from "./static";
import { PositionManager } from "../utils/position-manager";
import { UidManager } from "../utils/uid-manager";

import type { PrintElement } from ".";

interface Shapes {
    base: any[];
    auxiliary: any[];
    other: any[];
    custom: any[];
}

export interface DragState {
    x: number;
    y: number;
    type: DraggableType | null;
    width: number;
    height: number;
    moving: boolean;
}

export const initialDragState = () => ({
    x: 0,
    y: 0,
    type: null,
    width: 180,
    height: 24,
    moving: false,
});

export interface MovingState {
    id: string;
    x: number;
    y: number;
    type: DraggableType | null;
    width: number;
    height: number;
    moving: boolean;
}

export const initialMovingState = (state?: MovingState) => ({
    id: "",
    x: 0,
    y: 0,
    type: null,
    width: 180,
    height: 24,
    moving: false,
    ...state,
});

export interface CurtainState {
    x: number;
    y: number;
    width: number;
    height: number;
}

export const initialCurtainState = () => ({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
});

export enum ListenerType {
    /**
     * 拖拽结束
     */
    dragEnd = "dragEnd",
    /**
     * 新增组件
     */
    addActor = "addActor",
    /**
     * 新增组件
     */
    actorChange = "actorChange",
    /**
     * drag 变化
     */
    dragStateChange = "dragStateChange",

    /**
     * 移动
     */
    movingStateChange = "movingStateChange",
}

type PrintListener = (...state: any[]) => void;

export class WebPrint {
    curtain: HTMLElement;
    shapes: Record<string, any>;
    actor: PrintElement[];
    dragState: DragState;
    movingState: MovingState;
    curtainState: CurtainState;
    listener: Partial<Record<keyof typeof ListenerType, PrintListener[]>>;
    listenerType: (keyof typeof ListenerType)[] = Object.keys(ListenerType) as Array<keyof typeof ListenerType>;
    constructor(curtain: HTMLElement, shapesType?: string[]) {
        this.shapes = {
            base: [],
            auxiliary: [],
            other: [],
            custom: [],
        };
        this.curtain = curtain;
        this.actor = [];
        this.listener = {};
        this.movingState = initialMovingState();
        this.initialDragState();
        this.#initialCurtainState();

        // @ts-ignore
        window.__web_pring__ = this;
    }

    getDragState() {
        return this.dragState;
    }

    getActor() {
        return this.actor;
    }

    getListener() {
        return this.listener;
    }

    initialDragState() {
        this.dragState = initialDragState();
        this.#triggerListener(ListenerType.dragStateChange, this.dragState);
        return this.dragState;
    }

    #initialCurtainState() {
        this.curtainState = PositionManager.getRectState(this.curtain);
    }

    initialMovingState() {
        this.movingState = initialMovingState();
        this.#triggerListener(ListenerType.movingStateChange, this.movingState);
        return this.movingState;
    }

    dragStart(event, type: DraggableType) {
        const x = event.pageX - this.dragState.width / 2;
        const y = event.pageY - this.dragState.height / 2;
        this.dragState = {
            ...this.dragState,
            x,
            y,
            type,
            moving: true,
        };
        this.#triggerListener(ListenerType.dragStateChange, this.dragState);
        return this.dragState;
    }

    draging(event) {
        if (!this.dragState.moving) return;
        const x = event.pageX - this.dragState.width / 2;
        const y = event.pageY - this.dragState.height / 2;
        this.dragState.x = x;
        this.dragState.y = y;
        this.#triggerListener(ListenerType.dragStateChange, this.dragState);
        return this.dragState;
    }

    dragEnd(slidingBlock?: HTMLElement, showWholeContain = true) {
        if (!this.dragState.moving) return;
        if (this.curtain) {
            const isWrap = PositionManager.isChildrenInContainer(slidingBlock, this.curtain, showWholeContain);
            if (isWrap) {
                const position = PositionManager.getPositionByContainer(slidingBlock, this.curtain);
                this.addActor({ ...position });
            }
            this.#triggerListener(ListenerType.dragEnd, {
                dragState: this.dragState,
                contain: isWrap,
            });
        }
        return this.initialDragState();
    }

    moveStart(event, moveState: MovingState) {
        // const x = event.pageX - moveState.width / 2;
        // const y = event.pageY - moveState.height / 2;
        this.#initialCurtainState();
        this.movingState = {
            ...moveState,
            // x: x - this.curtainState.x,
            // y: y - this.curtainState.y,
            moving: true,
        };
        this.#triggerListener(ListenerType.movingStateChange, this.movingState);
        return this.movingState;
    }

    moving(event: MouseEvent) {
        if (!this.movingState.moving) return;
        const x = event.clientX - this.movingState.width / 2;
        const y = event.clientY - this.movingState.height / 2;
        this.movingState.x = x - this.curtainState.x;
        this.movingState.y = y - this.curtainState.y;
        this.#triggerListener(ListenerType.movingStateChange, this.movingState);
        return this.movingState;
    }

    moveEnd() {
        if (!this.movingState.moving) return;
        const id = this.movingState.id;
        if (id) {
            const index = this.actor.findIndex((item) => item.id === id);
            if (index > -1) {
                this.actor[index] = {
                    ...this.actor[index],
                    ...this.movingState,
                };
            }
        }
        return this.initialMovingState();
    }

    addActor(state: { x: number; y: number; width?: number; height?: number }) {
        const id = UidManager.getUid();
        const actor = {
            ...this.dragState,
            id,
            content: this.dragState.type,
            ...state,
        };
        this.actor.push(actor);
        this.#triggerListener(ListenerType.addActor, actor);
        this.#triggerListener(ListenerType.actorChange, this.getActor());
    }

    // #initSize(curtain) {
    //     const updateContainerBounds = () => {
    //         // const curtain = containerRef.current;
    //         if (curtain) {
    //             const { clientWidth: cw, clientHeight: ch } = curtain;
    //             // dragState.current.maxLeft = cw - itemSize.current.width;
    //             // dragState.current.maxTop = ch - itemSize.current.height;
    //         }
    //     };

    //     updateContainerBounds();
    //     // 监听窗口大小变化，实时更新边界
    //     window.addEventListener("resize", updateContainerBounds);
    // }

    subscribe(type: keyof typeof ListenerType, listener: PrintListener) {
        if (!this.listenerType.includes(type)) {
            throw new Error("订阅事件类型不存在");
        }
        if (this.listener[type]) {
            this.listener[type].push(listener);
        } else {
            this.listener[type] = [listener];
        }
    }

    #triggerListener(type: keyof typeof ListenerType, ...state: any[]) {
        if (this.listener[type]?.length) {
            this.listener[type].forEach((item) => item(...state));
        }
    }

    unsubscribe(type: ListenerType, listener?: PrintListener) {
        if (!this.listenerType.includes(type)) {
            throw new Error("取消订阅事件类型不存在");
        }
        if (this.listener[type]) {
            this.listener[type] = this.listener[type].filter((item) => item !== listener);
        }
    }

    registerShapes(shapeName: string, shape: any) {
        if (this.shapes[shapeName]) {
            throw new Error(`${shapeName}已经注册`);
        }
        this.shapes[shapeName] = shape;
    }
}
