import { BaseCustomerEvent } from "./base-event";
import type { WebPrint } from "../main/print";
import { throttle } from "../utils/throttle";

export class CustomerSpotlightEvent extends BaseCustomerEvent {
    // curtain: HTMLElement;
    actor: HTMLElement;
    constructor(printModule: WebPrint, actor: HTMLElement) {
        super(printModule);
        // this.curtain = printModule.curtain;
        this.actor = actor;
        this.initial();
    }

    getPrint() {
        return this.printModule;
    }

    initial() {
        if (this.actor) {
            this.addEventListener(this.actor, "click", this.start);
        }
    }

    mousedown() {
        if (this.actor) {
            this.addEventListener(this.actor, "mousedown", this.start);
        }
    }

    mousemove() {
        if (this.actor) {
            const _moving = throttle(this.moving, 40);
            this.addEventListener(this.actor, "mousemove", _moving);
            return _moving;
        }
    }

    mouseleave() {
        if (this.actor) {
            this.addEventListener(this.actor, "mouseleave", this.end);
        }
    }

    mouseup() {
        if (this.actor) {
            this.addEventListener(this.actor, "mouseup", this.end);
        }
    }

    start = (event: MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        const target: any = event.target;
        if (target) {
            if (target.dataset?.draggableId) {
                const id = target.dataset?.draggableId;
                console.log("--id---", id);
                this.printModule.captureSpotlight(id);
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
