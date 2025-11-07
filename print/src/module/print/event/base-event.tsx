import type { WebPrint } from "../main/print";

export class BaseCustomerEvent {
    listeners: any[];
    printModule: WebPrint;
    constructor(printModule: WebPrint) {
        this.printModule = printModule;
        this.listeners = [];
    }

    getPrint() {
        return this.printModule;
    }

    addEventListener(target: HTMLElement, name, listener: EventListenerOrEventListenerObject) {
        if (target && name && listener) {
            target.addEventListener(name, listener);
            this.listeners.push({ target, name, listener });
        }
    }

    removeEventListener(target: HTMLElement, name, listener: EventListenerOrEventListenerObject) {
        if (target && name && listener) {
            target.removeEventListener(name, listener);
        }
    }

    destroy() {
        if (this.listeners?.length) {
            this.listeners.forEach((item) => {
                const { target, name, listener } = item;
                this.removeEventListener(target, name, listener);
            });
        }
    }
}
