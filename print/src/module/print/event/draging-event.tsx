import { BaseCustomerEvent } from "./base-event";
import type { WebPrint } from "../main/print";
import { throttle } from "../utils/throttle";

export class CustomerDragingEvent extends BaseCustomerEvent {
    constructor(
        printModule: WebPrint,
        private dragTarget
    ) {
        super(printModule);
    }

    getPrint() {
        return this.printModule;
    }

    mousemove() {
        if (this.dragTarget) {
            const moving = throttle(this.moving, 40);
            this.addEventListener(this.dragTarget, "mousemove", moving);
        }
    }

    mouseup() {
        if (this.dragTarget) {
            this.addEventListener(this.dragTarget, "mouseup", this.end);
        }
    }

    moving = (event: MouseEvent) => {
        event.stopPropagation();
        this.printModule.draging(event);
    };

    end = () => {
        this.printModule.dragEnd();
    };
}
