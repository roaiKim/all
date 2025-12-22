import type { BaseShape } from "../main/print";
import { PositionManager } from "../utils/position-manager";
import { throttle } from "../utils/throttle";
import { ToolManager } from "../utils/tool-manager";

export interface WebEventState {
    x: number;
    y: number;
    width: number;
    height: number;
    moving?: boolean;
}

export const initialMoveState = (state?: Partial<WebEventState>) => ({ x: 0, y: 0, width: 100, height: 100, moving: false, ...state });

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

export class MoveBaseEventManager {
    containerDom: HTMLElement;
    moverDom: HTMLElement;
    state: WebEventState;
    #registerMousemove: (event: any) => void;
    offsetX: number = 0;
    offsetY: number = 0;
    stageState: BaseShape;

    // #options: MoveBaseEventManagerProps;
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

        this.#registerMousemove = throttle(this.#mousemoveHander, frequency);

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
        console.log("--initRegisterEvent-");
        this.moverDom.addEventListener("mousedown", this.#registerMousedown);
    }

    #initialStageState() {
        this.stageState = PositionManager.getRectState(this.containerDom);
    }

    #registerMousedown = (event: MouseEvent) => {
        event.preventDefault();
        this.#initialStageState();
        // console.log("--registerMousedown-");
        const { offsetX, offsetY } = event;
        this.offsetX = ToolManager.numberPrecision(offsetX || 0);
        this.offsetY = ToolManager.numberPrecision(offsetY || 0);
        // const x = event.pageX - this.offsetX;
        // const y = event.pageY - this.offsetY;
        // this.state.x = ToolManager.numberPrecision(x /*  + (window.pageXOffset || 0) */);
        // this.state.y = ToolManager.numberPrecision(y /* + (window.pageYOffset || 0) */);
        // this.state.moving = true;
        this.mousedownListener(event);
        this.containerDom.addEventListener("mousemove", this.#registerMousemove);
        this.containerDom.addEventListener("mouseup", this.#registerMouseup);
        this.containerDom.addEventListener("mouseleave", this.#registerMouseup);
    };

    uninstallMousedownEvent() {
        this.moverDom.removeEventListener("mousedown", this.#registerMousedown);
    }

    #mousemoveHander = (event: MouseEvent) => {
        event.preventDefault();
        // const x = event.x - this.offsetX;
        // const y = event.y - this.offsetY;
        // const x = event.pageX - this.offsetX;
        // const y = event.pageY - this.offsetY;
        // this.state.x = ToolManager.numberPrecision(x /*  + (window.pageXOffset || 0) */);
        // this.state.y = ToolManager.numberPrecision(y /*  + (window.pageYOffset || 0) */);
        console.log("--mousemoveHander-");

        if (!this.state.moving) return;
        const x = event.x - this.offsetX;
        const y = event.y - this.offsetY;
        // 边界问题
        const _x = Math.min(Math.max(0, x - this.stageState.x), this.stageState.width - this.state.width);
        const _y = Math.min(Math.max(0, y - this.stageState.y), this.stageState.height - this.state.height);
        this.state.x = ToolManager.numberPrecision(_x);
        this.state.y = ToolManager.numberPrecision(_y);
        this.mousemoveListener(event);
    };

    #registerMouseup = (event: MouseEvent) => {
        event.preventDefault();
        this.state.moving = false;
        this.mouseupListener(event, false);
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

    mousedownListener = (event: MouseEvent) => {};
    mousemoveListener = (event: MouseEvent) => {};
    mouseupListener = (event: MouseEvent, isWrap: boolean) => {};
}
