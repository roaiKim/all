import { BaseCustomerEvent } from "./base-event";
import type { WebPrint } from "../main/print";

export class CustomerDragEvent extends BaseCustomerEvent {
    constructor(
        printModule: WebPrint,
        private dragTarget
    ) {
        super(printModule);
    }

    getPrint() {
        return this.printModule;
    }

    mousedown() {
        if (this.dragTarget) {
            this.addEventListener(this.dragTarget, "mousedown", this.start);
        }
    }

    mouseup() {
        if (this.dragTarget) {
            this.addEventListener(this.dragTarget, "mouseup", this.end);
        }
    }

    start = (event: MouseEvent) => {
        event.stopPropagation();
        const target: any = event.target;
        if (target) {
            if (target.dataset?.draggableType) {
                // this.printModule.dragStart(event, target.dataset.draggableType);
            }
        }
    };

    end = () => {
        // this.printModule.dragEnd();
    };
}
