import { BaseCustomerEvent } from "./base-event";
import type { WebPrint } from "../main/print";

export class CustomerBodyEvent extends BaseCustomerEvent {
    body: HTMLElement;
    constructor(printModule: WebPrint, printMainRef: HTMLDivElement) {
        super(printModule);
        this.body = printMainRef;
    }

    getPrint() {
        return this.printModule;
    }

    registerLeaveSpotlight() {
        this.addEventListener(this.body, "click", this.leaveSpotlight);
    }

    leaveSpotlight = (event: MouseEvent) => {
        if (!this.isResizeing() && !this.isPrintElement(event)) {
            event.stopPropagation();
            this.printModule.removeSpotlight(this.printModule.spotlightActor?.id);
        }
    };

    isPrintElement(event: MouseEvent) {
        const target: any = event.target;
        if (target) {
            return !!target.dataset?.draggableId || !!target.dataset?.fluctuateDirection;
        }
        return false;
    }

    removeLeaveSpotlight() {
        this.removeEventListener(this.body, "click", this.leaveSpotlight);
    }

    isResizeing() {
        return this.printModule.movingState?.moving || this.printModule.movingState?.resizing;
    }
}
