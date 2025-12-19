import { BaseCustomerEvent } from "./base-event";
import type { WebPrint } from "../main/print";
import { throttle } from "../utils/throttle";

export class CustomerDragingEvent extends BaseCustomerEvent {
    printContainerDom: HTMLElement;
    constructor(printModule: WebPrint) {
        super(printModule);
        this.printContainerDom = printModule.domManger.printContainerDom;
    }

    getPrint() {
        return this.printModule;
    }

    mousemove() {
        if (this.printContainerDom) {
            const _draging = throttle(this.draging, 40);
            this.addEventListener(this.printContainerDom, "mousemove", _draging);
            return _draging;
        }
    }

    mouseup() {
        if (this.printContainerDom) {
            const _end = () => {
                this.end();
            };
            this.addEventListener(this.printContainerDom, "mouseup", _end);
            return _end;
        }
    }

    draging = (event: MouseEvent) => {
        event.stopPropagation();
        // this.printModule.draging(event);
    };

    end = () => {
        // this.printModule.dragEnd();
    };
}
