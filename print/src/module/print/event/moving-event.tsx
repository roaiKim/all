import { BaseCustomerEvent } from "./base-event";
import type { WebPrint } from "../main/print";
import { throttle } from "../utils/throttle";

export class CustomerMovingEvent extends BaseCustomerEvent {
    curtain: HTMLElement;
    constructor(printModule: WebPrint) {
        super(printModule);
        this.curtain = printModule.curtain;
    }

    getPrint() {
        return this.printModule;
    }

    mousedown() {
        if (this.curtain) {
            this.addEventListener(this.curtain, "mousedown", this.start);
        }
    }

    mousemove() {
        if (this.curtain) {
            const _moving = throttle(this.moving, 40);
            return this.addEventListener(this.curtain, "mousemove", _moving);
        }
    }

    mouseleave() {
        if (this.curtain) {
            return this.addEventListener(this.curtain, "mouseleave", this.end);
        }
    }

    mouseup() {
        if (this.curtain) {
            return this.addEventListener(this.curtain, "mouseup", this.end);
        }
    }

    start = (event: MouseEvent) => {
        event.stopPropagation();
        const target: any = event.target;
        if (target) {
            if (target.dataset?.draggableId) {
                const id = target.dataset?.draggableId;
                const state = this.printModule.actors.find((item) => item.id === id);
                if (state) {
                    this.printModule.moveStart(event, state);
                }
            }
        }
    };

    moving = (event: MouseEvent) => {
        event.stopPropagation();
        this.printModule.moving(event);
    };

    end = () => {
        this.printModule.moveEnd();
    };
}
