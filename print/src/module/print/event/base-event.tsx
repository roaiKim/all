import type { WebPrint } from "../main/print";

interface BaseCustomerEventListeners {
    target: HTMLElement;
    name: string;
    listener: EventListenerOrEventListenerObject;
}

export class BaseCustomerEvent {
    listeners: BaseCustomerEventListeners[];
    printModule: WebPrint;
    constructor(printModule: WebPrint) {
        this.printModule = printModule;
        this.listeners = [];
    }

    getPrint() {
        return this.printModule;
    }

    addEventListener(target: HTMLElement, name, listener: EventListenerOrEventListenerObject, repetition = false) {
        if (target && name && listener) {
            if (repetition) {
                target.addEventListener(name, listener);
                this.listeners.push({ target, name, listener });
            } else {
                const hasRepetition = this.listeners.find((item) => item.target === target && item.name === name && item.listener === listener);
                if (!hasRepetition) {
                    target.addEventListener(name, listener);
                    this.listeners.push({ target, name, listener });
                }
            }
        }
    }

    removeEventListener(target: HTMLElement, name, listener: EventListenerOrEventListenerObject) {
        if (target && name && listener) {
            target.removeEventListener(name, listener);
        }
    }

    destroy(listener?: EventListenerOrEventListenerObject) {
        if (this.listeners?.length) {
            if (listener) {
                const currentListener = this.listeners.find((item) => item.listener === listener);
                if (currentListener) {
                    this.removeEventListener(currentListener.target, currentListener.name, listener);
                }
            } else {
                this.listeners.forEach((item) => {
                    const { target, name, listener } = item;
                    this.removeEventListener(target, name, listener);
                });
            }
        }
    }
}
