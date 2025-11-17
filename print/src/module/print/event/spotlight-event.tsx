import { BaseCustomerEvent, type ListenerConfig } from "./base-event";
import type { PrintElement } from "../main";
import type { WebPrint } from "../main/print";
import { throttle } from "../utils/throttle";

export class CustomerSpotlightEvent extends BaseCustomerEvent {
    // curtain: HTMLElement;
    stage: HTMLElement;
    actor: PrintElement;
    initialListener: ListenerConfig;
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
                    // 新增点击其他区域 取消选中
                    this.registerLeaveSpotlight();
                    // this.registerResize();
                }
            }
        }
    };

    // 取消选中 事件
    registerLeaveSpotlight() {
        this.addEventListener(document.body, "click", this.leaveSpotlight);
    }

    // 移除事件
    leaveSpotlight = (event: MouseEvent) => {
        console.log("---leaveSpotlight--");
        if (!this.isCurrentControllElement(event)) {
            event.stopPropagation();
            this.printModule.removeSpotlight();
            this.destroyExclude(this.initialListener);
        }
    };

    isCurrentControllElement(event: MouseEvent) {
        const target: any = event.target;
        if (target) {
            if (target.dataset?.draggableId) {
                return this.printModule.spotlightActor?.id === target.dataset?.draggableId;
            }
        }
        return false;
    }

    registerResize() {
        if (this.stage) {
            this.addEventListener(this.stage, "mousedown", this.resize);
        }
    }

    resize(event: MouseEvent) {
        event.stopPropagation();
        const target: any = event.target;
        if (target) {
            if (target.dataset?.fluctuateDirection) {
                const direction = target.dataset.fluctuateDirection;
                console.log("==fluctuateDirection==", direction);
            }
        }
    }

    isSpotlighting() {
        return this.printModule.spotlightActor?.id === this.actor.id;
    }

    mousemove() {
        if (this.stage) {
            const _moving = throttle(this.moving, 40);
            this.addEventListener(this.stage, "mousemove", _moving);
            return _moving;
        }
    }

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

    moving = (event: MouseEvent) => {
        event.stopPropagation();
        this.printModule.moving(event);
    };

    end = () => {
        this.printModule.moveEnd();
    };
}
