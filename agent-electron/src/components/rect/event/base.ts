import { PositionManager } from "utils/framework/position-manager";
import { throttle } from "utils/framework/throttle";
import { ToolManager } from "utils/framework/tool-manager";

export interface DragTargetState {
    x: number;
    y: number;
    width: number;
    height: number;
    draging: boolean;
    moving: boolean;
}

export interface DragBaseEventManagerProps {
    dragger: string | HTMLElement;
    container?: string | HTMLElement;
    frequency?: number;
    defaultState?: Partial<DragTargetState>;
    showWholeContain?: boolean;
}

export class DragBaseEventManager {
    #container: HTMLElement;
    #dragger: HTMLElement;
    // #body: HTMLElement;
    state: DragTargetState;
    #registerMousemove: (event: any) => void;
    offsetX: number = 0;
    offsetY: number = 0;
    #options: DragBaseEventManagerProps;
    // draging: boolean;
    constructor(props: DragBaseEventManagerProps) {
        const { dragger, container, frequency = 40, defaultState } = props;

        this.#dragger = this.#getTarget(dragger);
        this.#container = this.#getTarget(container || document.body);
        // this.#body = document.body;

        if (!this.#dragger) {
            console.error("元素不存在");
            return;
        }

        this.#options = props;

        this.initialDragTargetState(defaultState);

        this.#registerMousemove = throttle(this.#mousemoveHander, frequency);

        this.#init();
    }

    #getTarget = (element?: string | HTMLElement) => {
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
        this.#dragger.addEventListener("mousedown", this.#registerMousedown);
    }

    #registerMousedown = (event: MouseEvent) => {
        event.preventDefault();
        console.log("---");
        const { offsetX, offsetY } = event;
        this.offsetX = ToolManager.numberPrecision(offsetX || 0);
        this.offsetY = ToolManager.numberPrecision(offsetY || 0);
        const x = event.pageX - this.state.width / 2;
        const y = event.pageY - this.state.height / 2;
        this.state.x = ToolManager.numberPrecision(x /*  + (window.pageXOffset || 0) */);
        this.state.y = ToolManager.numberPrecision(y /* + (window.pageYOffset || 0) */);
        this.state.draging = true;
        this.mousedownListener(event);
        this.#container.addEventListener("mousemove", this.#registerMousemove);
        this.#container.addEventListener("mouseup", this.#registerMouseup);
        this.#container.addEventListener("mouseleave", this.#registerMouseup);
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
        this.state.draging = false;
        const isWrap = this.validateWhole(this.#options.showWholeContain);
        this.mouseupListener(event, isWrap);
        this.#container.removeEventListener("mousemove", this.#registerMousemove);
        this.#container.removeEventListener("mouseup", this.#registerMouseup);
        this.#container.removeEventListener("mouseleave", this.#registerMouseup);
    };

    validateWhole = (showWholeContain = true) => {
        if (this.#container) {
            return PositionManager.isChildrenInContainer(this.#dragger, this.#container, showWholeContain);
        }
        return false;
    };

    setState = (state: Partial<DragTargetState>) => {
        this.state = Object.assign({}, this.state, state);
    };

    initialDragTargetState(state?: Partial<DragTargetState>): DragTargetState {
        return {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            draging: false,
            moving: false,
            ...state,
        };
    }

    mousedownListener = (event: MouseEvent) => {};
    mousemoveListener = (event: MouseEvent) => {};
    mouseupListener = (event: MouseEvent, isWrap: boolean) => {};
}
