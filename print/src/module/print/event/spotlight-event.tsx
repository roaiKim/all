import { BaseCustomerEvent, type ListenerConfig } from "./base-event";
import type { PrintElement } from "../main";
import type { WebPrint } from "../main/print";
import { throttle } from "../utils/throttle";

export enum MoveDirection {
    TOP_LEFT = "tl",
    TOP_RIGHT = "tr",
    BOTTOM_LEFT = "bl",
    BOTTOM_RIGHT = "br",
    MIDDLE_TOP = "mt",
    MIDDLE_BOTTOM = "mb",
    MIDDLE_LEFT = "ml",
    MIDDLE_RIGHT = "mr",
}

export class CustomerSpotlightEvent extends BaseCustomerEvent {
    stage: HTMLElement;
    actorId: string;
    initialListener: ListenerConfig;
    direction: MoveDirection;
    throttleMoving: any;
    curtain: HTMLElement;
    constructor(printModule: WebPrint, stage: HTMLElement, actorId: string) {
        super(printModule);
        this.stage = stage;
        this.actorId = actorId;
        this.initialListener = this.registerClick();
        this.curtain = printModule.domManger.printTemplateDom;
    }

    getPrint() {
        return this.printModule;
    }

    getActor() {
        if (this.actorId) {
            return this.printModule.actors.find((item) => item.id === this.actorId);
        }
        return null;
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
            this.addEventListener(this.curtain, "mousemove", this.throttleMoving);
            this.registerMouseleave();
            this.registerMouseup();
        }
    };

    registerMouseleave() {
        this.addEventListener(this.curtain, "mouseleave", this.end);
    }

    registerMouseup() {
        this.addEventListener(this.curtain, "mouseup", this.end);
    }

    resize = (event: MouseEvent) => {
        const target: any = event.target;
        if (target) {
            if (target.dataset?.fluctuateDirection) {
                event.stopPropagation();
                this.direction = target.dataset.fluctuateDirection as MoveDirection;
                this.printModule.resizeStart(this.getActor());
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
        this.printModule.resizing(event, this.direction);
    };

    end = (event?: MouseEvent) => {
        if (event) {
            event.stopPropagation();
        }
        this.printModule.resizeEnd();
        this.direction = null;
        this.removeEventListener(this.curtain, "mousemove", this.throttleMoving);
        this.removeEventListener(this.curtain, "mouseup", this.end);
        this.removeEventListener(this.curtain, "mouseleave", this.end);
    };

    isSpotlighting() {
        return this.printModule.spotlightActor?.id === this.getActor()?.id;
    }
}
