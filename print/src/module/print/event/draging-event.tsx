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
            const _draging = throttle(this.draging, 40);
            this.addEventListener(this.dragTarget, "mousemove", _draging);
            return _draging;
        }
    }

    mouseup(slidingBlock) {
        if (this.dragTarget) {
            const _end = () => {
                this.end(slidingBlock);
            };
            this.addEventListener(this.dragTarget, "mouseup", _end);
            return _end;
        }
    }

    draging = (event: MouseEvent) => {
        event.stopPropagation();
        this.printModule.draging(event);
    };

    end = (slidingBlock) => {
        this.printModule.dragEnd(slidingBlock);
    };
}
