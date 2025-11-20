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
    width: 280,
    height: 100,
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
    resizing: boolean;
}

export const initialMovingState = (state?: MovingState) => ({
    id: "",
    x: 0,
    y: 0,
    type: null,
    width: 280,
    height: 100,
    moving: false,
    resizing: false,
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
    /**
     *
     */
    spotlightChange = "spotlightChange",
}

type PrintListener = (...state: any[]) => void;

export class WebPrint {
    moveEndTimer: number;
    curtain: HTMLElement;
    shapes: Record<string, any>;
    actors: PrintElement[];
    dragState: DragState;
    movingState: MovingState;
    spotlightActor: PrintElement;
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
        this.actors = [];
        this.listener = {};
        this.movingState = initialMovingState();
        this.initialDragState();
        this.#initialCurtainState();

        // @ts-ignore
        window.__WEB_PRINT__ = this;
    }

    getDragState() {
        return this.dragState;
    }

    getActor() {
        return this.actors;
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

    moveStart(event, moveState: Partial<MovingState>) {
        this.#initialCurtainState();
        this.movingState = {
            ...this.movingState,
            ...moveState,
            moving: true,
        };
        this.#triggerListener(ListenerType.movingStateChange, this.movingState);
        return this.movingState;
    }

    moving(event: MouseEvent) {
        if (!this.movingState.moving) return;
        const x = event.clientX - this.movingState.width / 2;
        const y = event.clientY - this.movingState.height / 2;
        // 边界问题
        const _x = Math.min(Math.max(0, x - this.curtainState.x), this.curtainState.width - this.movingState.width);
        const _y = Math.min(Math.max(0, y - this.curtainState.y), this.curtainState.height - this.movingState.height);
        this.movingState.x = _x;
        this.movingState.y = _y;
        this.#triggerListener(ListenerType.movingStateChange, this.movingState);
        return this.movingState;
    }

    moveEnd() {
        if (!this.movingState.moving) return;
        this.movingState.moving = false;
        this.#triggerListener(ListenerType.movingStateChange, this.movingState);
        const id = this.movingState.id;
        if (id) {
            const index = this.actors.findIndex((item) => item.id === id);
            if (index > -1) {
                this.actors[index] = {
                    ...this.actors[index],
                    ...this.movingState,
                    moving: false,
                };
            }
        }
        // 延迟
        this.moveEndTimer = setTimeout(this.initialMovingState.bind(this), 50);
    }

    resizeStart(moveState: Partial<MovingState>) {
        if (!moveState) return;
        this.#initialCurtainState();
        this.movingState = {
            ...this.movingState,
            ...moveState,
            resizing: true,
        };
        this.#triggerListener(ListenerType.movingStateChange, this.movingState);
        return this.movingState;
    }

    resizing(event: MouseEvent) {
        if (!this.movingState.resizing) return;
        const width = Math.max(this.movingState.x, Math.min(event.clientX - this.curtainState.x, this.curtainState.width));
        const height = Math.max(this.movingState.y, Math.min(event.clientY - this.curtainState.y, this.curtainState.height));

        this.movingState.width = width - this.movingState.x;
        this.movingState.height = height - this.movingState.y;
        this.#triggerListener(ListenerType.movingStateChange, this.movingState);

        return this.movingState;
    }

    resizeEnd() {
        if (!this.movingState.resizing) return;
        this.movingState.resizing = false;
        this.#triggerListener(ListenerType.movingStateChange, this.movingState);
        const id = this.movingState.id;
        if (id) {
            const index = this.actors.findIndex((item) => item.id === id);
            if (index > -1) {
                this.actors[index] = {
                    ...this.actors[index],
                    ...this.movingState,
                };
            }
        }
        // 延迟
        this.moveEndTimer = setTimeout(this.initialMovingState.bind(this), 50);
    }

    captureSpotlight(id: string) {
        if (id) {
            const spotlightActor = this.actors.find((item) => item.id === id);
            if (spotlightActor) {
                this.spotlightActor = spotlightActor;
                this.#triggerListener(ListenerType.spotlightChange, this.spotlightActor);
            }
        }
    }

    removeSpotlight(id: string) {
        if (this.spotlightActor?.id === id) {
            this.spotlightActor = null;
            this.#triggerListener(ListenerType.spotlightChange, this.spotlightActor);
        }
    }

    addActor(state: { x: number; y: number; width?: number; height?: number }) {
        const id = UidManager.getUid();
        const actors = {
            ...this.dragState,
            id,
            content: this.dragState.type,
            ...state,
        };
        this.actors.push(actors);
        this.#triggerListener(ListenerType.addActor, actors);
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
