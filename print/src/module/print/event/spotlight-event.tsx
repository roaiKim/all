import { BaseCustomerEvent, type ListenerConfig } from "./base-event";
import type { PrintElement } from "../main";
import type { WebPrint } from "../main/print";
import { throttle } from "../utils/throttle";

export enum MoveDirection {
    TL = "tl",
    TR = "tr",
    BL = "bl",
    BR = "br",
    MT = "mt",
    MB = "mb",
    ML = "ml",
    MR = "mr",
}

export class CustomerSpotlightEvent extends BaseCustomerEvent {
    stage: HTMLElement;
    actor: PrintElement;
    initialListener: ListenerConfig;
    direction: MoveDirection;
    throttleMoving: any;
    constructor(printModule: WebPrint, stage: HTMLElement, actor: PrintElement) {
        super(printModule);
        this.stage = stage;
        this.actor = actor;
        this.initialListener = this.registerClick();
    }

    getPrint() {
        return this.printModule;
    }

    registerClick() {
        if (this.stage) {
            return this.addEventListener(this.stage, "click", this.setSpotlight);
        }
    }

    // 初始化点击事件 用于选中当前元素
    setSpotlight = (event: MouseEvent) => {
        if (!this.isSpotlighting()) {
            event.stopPropagation();
            event.preventDefault();
            const target: any = event.target;
            if (target) {
                if (target.dataset?.draggableId) {
                    const id = target.dataset?.draggableId;
                    this.printModule.captureSpotlight(id);
                }
            }
        }
    };

    registerResize() {
        if (this.stage) {
            this.addEventListener(this.stage, "mousedown", this.resize);
        }
    }

    removeResize() {
        this.removeEventListener(this.stage, "mousedown", this.resize);
        this.end();
    }

    registerMousemove = () => {
        if (this.stage) {
            this.throttleMoving = throttle(this.moving, 40);
            this.addEventListener(this.printModule.curtain, "mousemove", this.throttleMoving);
            this.registerMouseleave();
            this.registerMouseup();
        }
    };

    registerMouseleave() {
        this.addEventListener(this.printModule.curtain, "mouseleave", this.end);
    }

    registerMouseup() {
        this.addEventListener(this.printModule.curtain, "mouseup", this.end);
    }

    resize = (event: MouseEvent) => {
        const target: any = event.target;
        if (target) {
            if (target.dataset?.fluctuateDirection) {
                event.stopPropagation();
                this.direction = target.dataset.fluctuateDirection as MoveDirection;
                this.printModule.resizeStart(this.actor);
                this.registerMousemove();
            }
        }
    };

    moving = (event: MouseEvent) => {
        event.stopPropagation();
        // const { x, y } = this.printModule.curtainState;
        // const currentX = event.clientX - x;
        // const currentY = event.clientY - y;
        // console.log("=currentX, currentY=", currentX, currentY);
        this.printModule.resizing(event);
    };

    end = (event?: MouseEvent) => {
        if (event) {
            event.stopPropagation();
        }
        this.direction = null;
        this.removeEventListener(this.printModule.curtain, "mousemove", this.throttleMoving);
        this.removeEventListener(this.printModule.curtain, "mouseup", this.end);
        this.removeEventListener(this.printModule.curtain, "mouseleave", this.end);
    };

    isSpotlighting() {
        return this.printModule.spotlightActor?.id === this.actor.id;
    }
}
