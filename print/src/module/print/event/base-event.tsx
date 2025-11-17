import type { WebPrint } from "../main/print";

// interface BaseCustomerEventListeners {
//     target: HTMLElement;
//     name: string;
//     listener: EventListenerOrEventListenerObject;
// }

export interface ListenerConfig {
    target: HTMLElement;
    name: string;
    listener: EventListenerOrEventListenerObject;
}

export class BaseCustomerEvent {
    listeners: ListenerConfig[];
    printModule: WebPrint;
    constructor(printModule: WebPrint) {
        this.printModule = printModule;
        this.listeners = [];
    }

    getPrint() {
        return this.printModule;
    }

    addEventListener(target: ListenerConfig["target"], name: ListenerConfig["name"], listener: ListenerConfig["listener"], repetition = false) {
        if (target && name && listener) {
            if (repetition) {
                target.addEventListener(name, listener);
                this.listeners.push({ target, name, listener });
                console.log(`${target.className}-${name} 事件已注册`);
                return { target, name, listener };
            } else {
                if (!this.isRegistered(target, name, listener)) {
                    target.addEventListener(name, listener);
                    this.listeners.push({ target, name, listener });
                    console.log(`${target.className}-${name} 事件已注册`);
                    return { target, name, listener };
                } else {
                    console.log(`${target.className}-${name} 事件已存在`);
                    return { target, name, listener };
                }
            }
        }
    }

    removeEventListener(target: ListenerConfig["target"], name: ListenerConfig["name"], listener: ListenerConfig["listener"]) {
        if (target && name && listener) {
            const currentListener = this.isRegistered(target, name, listener);
            if (currentListener) {
                target.removeEventListener(name, listener);
                this.listeners = this.listeners.filter((item) => item !== currentListener);
                console.log(`${target.className}-${name} 事件已移除`);
                return this.listeners;
            }
        }
    }

    isRegistered(target: ListenerConfig["target"], name: ListenerConfig["name"], listener: ListenerConfig["listener"], strict = true) {
        return this.listeners.find((item) => {
            if (strict) {
                return item.target === target && item.name === name && item.listener === listener;
            }
            return item.listener === listener;
        });
    }

    destroyByState(state: ListenerConfig) {
        const { target, name, listener } = state || {};
        if (this.listeners?.length) {
            const isRegistered = this.isRegistered(target, name, listener);
            if (isRegistered) {
                return this.removeEventListener(target, name, listener);
            }
        }
    }

    destroyExclude(state: ListenerConfig) {
        const { target, name, listener } = state || {};
        if (this.listeners?.length) {
            this.listeners.forEach((item) => {
                if (!(item.target === target && item.name === name && item.listener === listener)) {
                    this.removeEventListener(item.target, item.name, item.listener);
                }
            });
        }
    }

    destroyAll() {
        if (this.listeners?.length) {
            this.listeners.forEach((item) => {
                const { target, name, listener } = item;
                this.removeEventListener(target, name, listener);
            });
        }
    }
}
