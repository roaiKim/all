import type { MoveDirection } from "./spotlight-event";
import type { BaseShape } from "../type";
import { PositionManager } from "../utils/position-manager";
import { ResizeManager } from "../utils/resize-manager";
import { throttle } from "../utils/throttle";
import { ToolManager } from "../utils/tool-manager";

export interface WebEventState {
    x: number;
    y: number;
    width: number;
    height: number;
    moving?: boolean;
    resizing?: boolean;
    draging?: boolean;
}

export const initialEventState = (state?: Partial<WebEventState>) => ({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    moving: false,
    resizing: false,
    draging: false,
    ...state,
});

export type EventType = "move" | "resize" | "drag";

export interface BaseEventManagerProps<T extends WebEventState = WebEventState> {
    /**
     * 目标 target
     */
    target: string | HTMLElement;
    /**
     * 容器target
     */
    container?: string | HTMLElement;
    /**
     * move 触发频率
     */
    frequency?: number;
    /**
     *
     */
    state?: T;
    /**
     *
     */
    initMousedownEvent?: boolean;
    /**
     *
     */
    showWholeContain?: boolean;
}

export class BaseEventManager {
    #targetDom: HTMLElement;
    #containerDom: HTMLElement;
    #body: HTMLElement;
    state: WebEventState;
    #registerMousemove: (event: any) => void;
    offsetX: number = 0;
    offsetY: number = 0;
    stageState: BaseShape;
    eventType: EventType;
    direction: MoveDirection;
    #options: BaseEventManagerProps;

    constructor(props: BaseEventManagerProps) {
        const { target, container, frequency = 40, state, initMousedownEvent = false } = props;

        this.#targetDom = this.#getDom(target);
        this.#containerDom = this.#getDom(container);
        this.#body = document.body;

        if (!this.#targetDom) {
            console.error("元素不存在");
            return;
        }

        this.#options = props;

        this.initialEventState(state);
        if (this.#containerDom) {
            this.#initialStageState();
        }

        this.#registerMousemove = throttle(this.#registermoveHander, frequency);

        if (initMousedownEvent) {
            this.initRegisterEvent();
        }
    }

    #getDom = (element?: string | HTMLElement) => {
        if (!element) {
            return null;
        }
        if (typeof element === "string") {
            return document.getElementById(element);
        } else {
            return element;
        }
    };

    initRegisterEvent() {
        this.#targetDom.addEventListener("mousedown", this.#registerMousedown);
    }

    #initialStageState() {
        this.stageState = PositionManager.getRectState(this.#containerDom);
    }

    #registerMousedown = (event: MouseEvent) => {
        event.preventDefault();
        if (this.#containerDom) {
            this.#initialStageState();
        }

        this.eventType = this.decideEventType(event);

        if (this.eventType === "move") {
            this.#movStart(event);
        } else if (this.eventType === "resize") {
            this.#resizeStart(event);
        } else if (this.eventType === "drag") {
            this.#dragStart(event);
        }
        this.mousedownListener(event);
        this.#addEventListener();
    };

    #registermoveHander = (event: MouseEvent) => {
        event.preventDefault();
        if (!this.eventType) return;

        if (this.eventType === "move") {
            this.#moving(event);
        } else if (this.eventType === "resize") {
            this.#resizing(event);
        } else if (this.eventType === "drag") {
            this.#dragging(event);
        }

        this.mousemoveListener(event);
    };

    #registerMouseup = (event: MouseEvent) => {
        event.preventDefault();

        if (this.eventType === "move") {
            this.#movEnd();
        } else if (this.eventType === "resize") {
            this.#resizeEnd();
        } else if (this.eventType === "drag") {
            this.#dragEnd(event);
        }
        this.mouseupListener(event, false);
        this.#removeEventListener();
        this.eventType = null;
    };

    #movStart = (event: MouseEvent) => {
        const { offsetX, offsetY } = event;
        this.offsetX = ToolManager.numberPrecision(offsetX || 0);
        this.offsetY = ToolManager.numberPrecision(offsetY || 0);
        this.state.moving = true;
    };

    #moving = (event: MouseEvent) => {
        if (!this.state.moving) return;
        const x = event.x - this.offsetX;
        const y = event.y - this.offsetY;
        const _x = Math.min(Math.max(0, x - this.stageState.x), this.stageState.width - this.state.width);
        const _y = Math.min(Math.max(0, y - this.stageState.y), this.stageState.height - this.state.height);
        this.state.x = ToolManager.numberPrecision(_x);
        this.state.y = ToolManager.numberPrecision(_y);
    };

    #movEnd = () => {
        this.state.moving = false;
    };

    #resizeStart = (event: MouseEvent) => {
        this.state.resizing = true;
        this.direction = this.calcDirection(event);
    };

    #resizing = (event: MouseEvent) => {
        if (!this.state.resizing) return;

        if (!this.direction) return;

        const size = ResizeManager.controller(event, this.direction, this.state, this.stageState);

        this.state = {
            ...this.state,
            ...size,
        };
    };

    #resizeEnd = () => {
        this.state.resizing = false;
        this.direction = null;
    };

    #dragStart = (event: MouseEvent) => {
        const { offsetX, offsetY } = event;
        this.offsetX = ToolManager.numberPrecision(offsetX || 0);
        this.offsetY = ToolManager.numberPrecision(offsetY || 0);
        const x = event.pageX - this.state.width / 2;
        const y = event.pageY - this.state.height / 2;
        this.state.x = ToolManager.numberPrecision(x);
        this.state.y = ToolManager.numberPrecision(y);
        this.state.draging = true;
    };

    #dragging = (event: MouseEvent) => {
        if (!this.state.draging) return;
        const x = event.pageX - this.state.width / 2;
        const y = event.pageY - this.state.height / 2;
        this.state.x = ToolManager.numberPrecision(x);
        this.state.y = ToolManager.numberPrecision(y);
    };

    #dragEnd = (event: MouseEvent) => {
        this.state.draging = false;
        const isWrap = this.validateWhole(this.#options.showWholeContain);
        this.mouseupListener(event, isWrap);
    };

    #addEventListener = () => {
        const target = this.eventType === "drag" ? this.#body : this.#containerDom;
        if (target) {
            target.addEventListener("mousemove", this.#registerMousemove);
            target.addEventListener("mouseup", this.#registerMouseup);
            target.addEventListener("mouseleave", this.#registerMouseup);
        }
    };

    #removeEventListener = () => {
        const target = this.eventType === "drag" ? this.#body : this.#containerDom;
        if (target) {
            target.removeEventListener("mousemove", this.#registerMousemove);
            target.removeEventListener("mouseup", this.#registerMouseup);
            target.removeEventListener("mouseleave", this.#registerMouseup);
        }
    };

    setState = (state: Partial<WebEventState>) => {
        this.state = Object.assign({}, this.state, state);
    };

    initialEventState(state?: Partial<WebEventState>) {
        this.state = initialEventState(state);
    }

    decideEventType = (event: MouseEvent): EventType => {
        if (event.target === event.currentTarget) return "move";
        if (event.target === this.#targetDom) return "drag";
        return "resize";
    };

    calcDirection = (event: MouseEvent) => {
        const target: any = event.target;
        if (target) {
            if (target.dataset?.fluctuateDirection) {
                return target.dataset.fluctuateDirection as MoveDirection;
            }
        }
        return null;
    };

    validateWhole = (showWholeContain = true) => {
        if (this.#containerDom) {
            return PositionManager.isChildrenInContainer(this.#targetDom, this.#containerDom, showWholeContain);
        }
        return false;
    };

    uninstallMousedownEvent() {
        this.#targetDom.removeEventListener("mousedown", this.#registerMousedown);
    }

    mousedownListener = (event: MouseEvent) => {};
    mousemoveListener = (event: MouseEvent) => {};
    mouseupListener = (event: MouseEvent, isWrap: boolean) => {};
}
