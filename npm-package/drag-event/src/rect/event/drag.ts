import { throttle } from "@/utils/throttle";
import { ToolManager } from "@/utils/tool-manager";

export type DragTargetMoveType = "drag" | "move" | "resize" | null;

export interface DragState {
    _uid: string;
    x: number;
    y: number;
    width: number;
    height: number;
    draging: boolean;
    moving: boolean;
    mode: DragTargetMoveType;
}

export interface DragBaseEventManagerProps {
    frequency?: number;
    shouldWholeContain?: boolean;
}

const defaultState = {
    frequency: 40,
    shouldWholeContain: true,
};

export class DragEventManagement {
    container: HTMLElement;
    dragTarget: HTMLElement;
    #dragState: DragState;
    #registerMousemove: (event: any) => void;
    offsetX: number = 0;
    offsetY: number = 0;
    #options: DragBaseEventManagerProps;
    constructor(props: DragBaseEventManagerProps) {
        this.container = document.body;

        this.#options = Object.assign({}, defaultState, props);

        this.#dragState = this.initialDragState();

        this.#registerMousemove = throttle(this.#mousemoveHander, this.#options.frequency);
    }

    destroy() {
        this.container?.removeEventListener("mousemove", this.#registerMousemove);
        this.container?.removeEventListener("mouseup", this.#registerMouseup);
        this.container?.removeEventListener("mouseleave", this.#registerMouseup);
    }

    mousedownEvent = (event: React.MouseEvent, dragTarget: HTMLElement, curtain?: HTMLElement) => {
        event.preventDefault();
        if (!dragTarget) return;
        this.dragTarget = dragTarget;

        const dragTargetRect = this.dragTarget.getBoundingClientRect();
        this.#dragState.width = dragTargetRect.width;
        this.#dragState.height = dragTargetRect.height;
        if (curtain) {
            const { top, left } = curtain.getBoundingClientRect();
            this.offsetX = ToolManager.numberPrecision(left || 0);
            this.offsetY = ToolManager.numberPrecision(top || 0);
        }
        // console.log("---offset--", this.offsetX, this.offsetY);
        const x = event.pageX - this.offsetX - this.#dragState.width / 2;
        const y = event.pageY - this.offsetY - this.#dragState.height / 2;
        this.#dragState.x = ToolManager.numberPrecision(x /*  + (window.pageXOffset || 0) */);
        this.#dragState.y = ToolManager.numberPrecision(y /* + (window.pageYOffset || 0) */);
        this.#dragState.draging = true;
        this.mousedownListener(this.getDragState());
        this.container.addEventListener("mousemove", this.#registerMousemove);
        this.container.addEventListener("mouseup", this.#registerMouseup);
        this.container.addEventListener("mouseleave", this.#registerMouseup);
    };

    #mousemoveHander = (event: MouseEvent) => {
        event.preventDefault();
        if (!this.dragTarget) return;
        const x = event.pageX - this.offsetX - this.#dragState.width / 2;
        const y = event.pageY - this.offsetY - this.#dragState.height / 2;

        // console.log("---x-y--", x, y);
        this.#dragState.moving = true;
        this.#dragState.x = ToolManager.numberPrecision(x /*  + (window.pageXOffset || 0) */);
        this.#dragState.y = ToolManager.numberPrecision(y /*  + (window.pageYOffset || 0) */);

        this.mousemoveListener(this.getDragState());
    };

    #registerMouseup = (event: MouseEvent) => {
        event.preventDefault();
        this.#dragState.draging = false;
        this.#dragState.moving = false;
        this.mouseupListener(this.getDragState());

        this.#dragState = this.initialDragState();
        this.dragTarget = null;
        this.offsetX = 0;
        this.offsetY = 0;
        this.destroy();
        this.eventEnd();
    };

    setDragState = (dragState: Partial<DragState>) => {
        this.#dragState = Object.assign({}, this.#dragState, dragState);
    };

    initialDragState(dragState?: Partial<DragState>): DragState {
        return { _uid: "", x: 0, y: 0, width: 0, height: 0, draging: false, moving: false, mode: null, ...dragState };
    }

    getDragState = () => {
        return { ...this.#dragState };
    };

    mousedownListener = (dragState: DragState) => {};
    mousemoveListener = (dragState: DragState) => {};
    mouseupListener = (dragState: DragState) => {};

    eventEnd = () => {};
}
