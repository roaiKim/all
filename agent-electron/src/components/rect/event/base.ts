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
    target?: string | HTMLElement;
    frequency?: number;
    defaultState?: Partial<DragTargetState>;
    shouldWholeContain?: boolean;
}

export class DragBaseEventManager {
    container: HTMLElement;
    #dragger: HTMLElement;
    dragTarget: HTMLElement;
    dragState: DragTargetState;
    #registerMousemove: (event: any) => void;
    offsetX: number = 0;
    offsetY: number = 0;
    #options: DragBaseEventManagerProps;
    // draging: boolean;
    constructor(props: DragBaseEventManagerProps) {
        const { dragger, container, frequency = 40, defaultState } = props;

        this.#dragger = this.#getTarget(dragger);
        this.container = this.#getTarget(container || document.body);

        // this.#body = document.body;

        if (!this.#dragger) {
            console.error(dragger + "元素不存在");
            return;
        }

        this.#options = props;

        this.dragState = this.initialDragTargetState(defaultState);

        this.#registerMousemove = throttle(this.#mousemoveHander, frequency);

        this.#init();
    }

    #getTarget = (element?: string | HTMLElement) => {
        console.log("--getTarget-", element);
        if (!element) {
            return null;
        }
        if (typeof element === "string") {
            return document.querySelector(element) as HTMLElement;
        } else {
            return element;
        }
    };

    #init() {
        this.#dragger.addEventListener("mousedown", this.#registerMousedown);
    }

    destroy() {
        this.#dragger?.removeEventListener("mousedown", this.#registerMousedown);
        this.container?.removeEventListener("mousemove", this.#registerMousemove);
        this.container?.removeEventListener("mouseup", this.#registerMouseup);
        this.container?.removeEventListener("mouseleave", this.#registerMouseup);
    }

    #registerMousedown = (event: MouseEvent) => {
        event.preventDefault();
        const dragTarget = this.targetElement(event);
        if (!dragTarget) return;
        console.log("--dragTarget-", dragTarget);
        const dragTargetRect = dragTarget.getBoundingClientRect();
        this.dragState.width = dragTargetRect.width;
        this.dragState.height = dragTargetRect.height;
        this.dragTarget = dragTarget;
        const { offsetX, offsetY } = event;
        this.offsetX = ToolManager.numberPrecision(offsetX || 0);
        this.offsetY = ToolManager.numberPrecision(offsetY || 0);
        const x = event.pageX - this.dragState.width / 2;
        const y = event.pageY - this.dragState.height / 2;
        this.dragState.x = ToolManager.numberPrecision(x /*  + (window.pageXOffset || 0) */);
        this.dragState.y = ToolManager.numberPrecision(y /* + (window.pageYOffset || 0) */);
        this.dragState.draging = true;
        this.mousedownListener(event);
        this.container.addEventListener("mousemove", this.#registerMousemove);
        this.container.addEventListener("mouseup", this.#registerMouseup);
        this.container.addEventListener("mouseleave", this.#registerMouseup);
    };

    #mousemoveHander = (event: MouseEvent) => {
        event.preventDefault();
        // const x = event.x - this.offsetX;
        // const y = event.y - this.offsetY;
        const x = event.pageX - this.dragState.width / 2;
        const y = event.pageY - this.dragState.height / 2;
        this.dragState.x = ToolManager.numberPrecision(x /*  + (window.pageXOffset || 0) */);
        this.dragState.y = ToolManager.numberPrecision(y /*  + (window.pageYOffset || 0) */);
        this.mousemoveListener(event);
    };

    #registerMouseup = (event: MouseEvent) => {
        event.preventDefault();
        this.dragState.draging = false;
        const isWrap = this.validateWhole(this.#options.shouldWholeContain);
        this.mouseupListener(event, isWrap);
        this.container.removeEventListener("mousemove", this.#registerMousemove);
        this.container.removeEventListener("mouseup", this.#registerMouseup);
        this.container.removeEventListener("mouseleave", this.#registerMouseup);
    };

    validateWhole = (shouldWholeContain = true) => {
        if (this.container) {
            return PositionManager.isChildrenInContainer(this.dragTarget, this.container, shouldWholeContain);
        }
        return false;
    };

    setDragTargetState = (dragState: Partial<DragTargetState>) => {
        this.dragState = Object.assign({}, this.dragState, dragState);
    };

    initialDragTargetState(dragState?: Partial<DragTargetState>): DragTargetState {
        return { x: 0, y: 0, width: 0, height: 0, draging: false, moving: false, ...dragState };
    }

    targetElement = (event: MouseEvent): HTMLElement => {
        const { target } = this.#options;
        if (target) {
            const eventTarget = event.target as HTMLElement;
            if (typeof target === "string") {
                return eventTarget.closest(target);
            } else if (eventTarget.contains(target)) {
                return target;
            } else {
                return null;
            }
        }
        return this.#dragger;
    };

    mousedownListener = (event: MouseEvent) => {};
    mousemoveListener = (event: MouseEvent) => {};
    mouseupListener = (event: MouseEvent, isWrap: boolean) => {};
}
