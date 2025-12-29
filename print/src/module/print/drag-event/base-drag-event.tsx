import { PositionManager } from "../utils/position-manager";
import { throttle } from "../utils/throttle";
import { ToolManager } from "../utils/tool-manager";

export interface WebEventState {
    x: number;
    y: number;
    width: number;
    height: number;
    // draging: boolean;
}

export const initialDragState = (state?: Partial<WebEventState>) => ({ x: 0, y: 0, width: 100, height: 100, ...state });

export interface DragBaseEventManagerProps<T = WebEventState> {
    /**
     * 目标 target
     */
    dragger: string | HTMLElement;
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
    showWholeContain?: boolean;
}

export class DragBaseEventManager {
    #containerDom: HTMLElement;
    #dragDom: HTMLElement;
    #body: HTMLElement;
    state: WebEventState;
    #registerMousemove: (event: any) => void;
    offsetX: number = 0;
    offsetY: number = 0;
    #options: DragBaseEventManagerProps;
    draging: boolean;
    constructor(props: DragBaseEventManagerProps) {
        const { dragger, container, frequency = 40, state } = props;

        this.#dragDom = this.#getDom(dragger);
        this.#containerDom = this.#getDom(container);
        this.#body = document.body;

        if (!this.#dragDom) {
            console.error("元素不存在");
            return;
        }

        this.#options = props;

        this.initialDragState(state);

        this.#registerMousemove = throttle(this.#mousemoveHander, frequency);

        this.#init();
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

    #init() {
        this.#dragDom.addEventListener("mousedown", this.#registerMousedown);
    }

    #registerMousedown = (event: MouseEvent) => {
        event.preventDefault();
        const { offsetX, offsetY } = event;
        this.offsetX = ToolManager.numberPrecision(offsetX || 0);
        this.offsetY = ToolManager.numberPrecision(offsetY || 0);
        const x = event.pageX - this.state.width / 2;
        const y = event.pageY - this.state.height / 2;
        this.state.x = ToolManager.numberPrecision(x /*  + (window.pageXOffset || 0) */);
        this.state.y = ToolManager.numberPrecision(y /* + (window.pageYOffset || 0) */);
        this.draging = true;
        this.mousedownListener(event);
        this.#body.addEventListener("mousemove", this.#registerMousemove);
        this.#body.addEventListener("mouseup", this.#registerMouseup);
        this.#body.addEventListener("mouseleave", this.#registerMouseup);
    };

    #mousemoveHander = (event: MouseEvent) => {
        event.preventDefault();
        // const x = event.x - this.offsetX;
        // const y = event.y - this.offsetY;
        const x = event.pageX - this.state.width / 2;
        const y = event.pageY - this.state.height / 2;
        this.state.x = ToolManager.numberPrecision(x /*  + (window.pageXOffset || 0) */);
        this.state.y = ToolManager.numberPrecision(y /*  + (window.pageYOffset || 0) */);
        this.mousemoveListener(event);
    };

    #registerMouseup = (event: MouseEvent) => {
        event.preventDefault();
        this.draging = false;
        const isWrap = this.validateWhole(this.#options.showWholeContain);
        this.mouseupListener(event, isWrap);
        this.#body.removeEventListener("mousemove", this.#registerMousemove);
        this.#body.removeEventListener("mouseup", this.#registerMouseup);
        this.#body.removeEventListener("mouseleave", this.#registerMouseup);
    };

    validateWhole = (showWholeContain = true) => {
        if (this.#containerDom) {
            return PositionManager.isChildrenInContainer(this.#dragDom, this.#containerDom, showWholeContain);
        }
        return false;
    };

    setState = (state: Partial<WebEventState>) => {
        this.state = Object.assign({}, this.state, state);
    };

    initialDragState(state?: Partial<WebEventState>) {
        this.state = initialDragState(state);
    }

    mousedownListener = (event: MouseEvent) => {};
    mousemoveListener = (event: MouseEvent) => {};
    mouseupListener = (event: MouseEvent, isWrap: boolean) => {};
}
