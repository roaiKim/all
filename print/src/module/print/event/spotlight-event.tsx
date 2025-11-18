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
    // curtain: HTMLElement;
    stage: HTMLElement;
    actor: PrintElement;
    initialListener: ListenerConfig;
    direction: MoveDirection;
    constructor(printModule: WebPrint, stage: HTMLElement, actor: PrintElement) {
        super(printModule);
        this.stage = stage;
        this.actor = actor;
        this.initialListener = this.initial();
    }

    getPrint() {
        return this.printModule;
    }

    initial() {
        if (this.stage) {
            return this.addEventListener(this.stage, "click", this.toSpotlight);
        }
    }

    // 初始化点击事件 用于选中当前元素
    toSpotlight = (event: MouseEvent) => {
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

    // spotlighting() {
    //     // 注册点击空白事件
    //     this.registerLeaveSpotlight();
    //     // 注册 resize
    //     this.registerResize();
    // }

    // spotlightingOut() {
    //     this.destroyExclude(this.initialListener);
    //     console.log("---------", this.listeners);
    // }

    // // 取消选中 事件
    // registerLeaveSpotlight() {
    //     this.addEventListener(document.body, "click", this.leaveSpotlight);
    // }

    // // 移除事件
    // leaveSpotlight = (event: MouseEvent) => {
    //     console.log("---leaveSpotlight--");
    //     if (!this.isCurrentControllElement(event)) {
    //         event.stopPropagation();
    //         this.printModule.removeSpotlight(this.actor.id);
    //         this.spotlightingOut();
    //     }
    // };

    // isCurrentControllElement(event: MouseEvent) {
    //     const target: any = event.target;
    //     if (target) {
    //         if (target.dataset?.draggableId) {
    //             return this.printModule.spotlightActor?.id === target.dataset?.draggableId;
    //         }
    //     }
    //     return false;
    // }

    registerResize() {
        if (this.stage) {
            this.addEventListener(this.stage, "mousedown", this.resize);
        }
    }

    removeResize() {
        this.removeEventListener(this.stage, "mousedown", this.resize);
        this.end();
    }

    resize = (event: MouseEvent) => {
        const target: any = event.target;
        if (target) {
            if (target.dataset?.fluctuateDirection) {
                event.stopPropagation();
                this.direction = target.dataset.fluctuateDirection as MoveDirection;
                this.mousemove();
            }
        }
    };

    mousemove = () => {
        if (this.stage) {
            this.addEventListener(this.printModule.curtain, "mousemove", this.throttleMoving);
            this.mouseleave();
            this.mouseup();
        }
    };

    throttleMoving() {
        return throttle(this.moving, 40);
    }

    moving = (event: MouseEvent) => {
        event.stopPropagation();
        const { x, y } = this.printModule.curtainState;
        const currentX = event.clientX - x;
        const currentY = event.clientY - y;
        console.log("=currentX, currentY=", currentX, currentY);
    };

    mouseleave() {
        if (this.stage) {
            this.addEventListener(this.stage, "mouseleave", this.end);
        }
    }

    mouseup() {
        if (this.stage) {
            this.addEventListener(this.stage, "mouseup", this.end);
        }
    }

    end = (event?: MouseEvent) => {
        if (event) {
            event.stopPropagation();
        }
        this.direction = null;
        this.removeEventListener(this.printModule.curtain, "mousemove", this.throttleMoving);
        this.removeEventListener(this.stage, "mouseup", this.end);
        this.removeEventListener(this.stage, "mouseleave", this.end);
    };

    isSpotlighting() {
        return this.printModule.spotlightActor?.id === this.actor.id;
    }
}
