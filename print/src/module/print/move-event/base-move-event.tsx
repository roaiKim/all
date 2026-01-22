import type { MoveDirection } from "../event/spotlight-event";
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
}

export const initialMoveState = (state?: Partial<WebEventState>) => ({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    moving: false,
    resizing: false,
    ...state,
});

export interface MoveBaseEventManagerProps<T extends WebEventState = WebEventState> {
    /**
     * 目标 target
     */
    mover: string | HTMLElement;
    /**
     * 容器target
     */
    container: string | HTMLElement;
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
}

type MoveBaseEventType = "move" | "resize";

export class MoveBaseEventManager {
    containerDom: HTMLElement;
    moverDom: HTMLElement;
    state: WebEventState;
    #registerMousemove: (event: any) => void;
    offsetX: number = 0;
    offsetY: number = 0;
    stageState: BaseShape;
    eventType: MoveBaseEventType;
    direction: MoveDirection;
    constructor(props: MoveBaseEventManagerProps) {
        const { mover, container, frequency = 40, state, initMousedownEvent = false } = props;

        this.moverDom = this.#getDom(mover);
        this.containerDom = this.#getDom(container);

        if (!this.moverDom || !this.containerDom) {
            console.error("元素不存在");
            return;
        }

        // this.#options = props;

        this.initialMoveState(state);
        this.#initialStageState();

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
        this.moverDom.addEventListener("mousedown", this.#registerMousedown);
    }

    #initialStageState() {
        this.stageState = PositionManager.getRectState(this.containerDom);
    }

    #registerMousedown = (event: MouseEvent) => {
        event.preventDefault();
        this.#initialStageState();

        this.eventType = this.decideEventType(event);

        if (this.eventType === "move") {
            this.#movStart(event);
        } else if (this.eventType === "resize") {
            this.#resizeStart(event);
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
        }

        this.mousemoveListener(event);
    };

    #registerMouseup = (event: MouseEvent) => {
        event.preventDefault();

        if (this.eventType === "move") {
            this.#movEnd();
        } else if (this.eventType === "resize") {
            this.#resizeEnd();
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
        // 边界问题
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

    #addEventListener = () => {
        this.containerDom.addEventListener("mousemove", this.#registerMousemove);
        this.containerDom.addEventListener("mouseup", this.#registerMouseup);
        this.containerDom.addEventListener("mouseleave", this.#registerMouseup);
    };

    #removeEventListener = () => {
        this.containerDom.removeEventListener("mousemove", this.#registerMousemove);
        this.containerDom.removeEventListener("mouseup", this.#registerMouseup);
        this.containerDom.removeEventListener("mouseleave", this.#registerMouseup);
    };

    setState = (state: Partial<WebEventState>) => {
        this.state = Object.assign({}, this.state, state);
    };

    initialMoveState(state?: Partial<WebEventState>) {
        this.state = initialMoveState(state);
    }

    decideEventType = (event: MouseEvent): MoveBaseEventType => {
        if (event.target === event.currentTarget) return "move";
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

    uninstallMousedownEvent() {
        this.moverDom.removeEventListener("mousedown", this.#registerMousedown);
    }

    mousedownListener = (event: MouseEvent) => {};
    mousemoveListener = (event: MouseEvent) => {};
    mouseupListener = (event: MouseEvent, isWrap: boolean) => {};
}
