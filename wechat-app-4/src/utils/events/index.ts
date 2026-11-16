import { Events } from "@tarojs/taro";

export class Event {
    eventInstance = null;
    handlers = {};

    constructor() {
        this.eventInstance = new Events();
    }

    on(eventName: string, handler: (...args) => void) {
        try {
            if (!this.handlers[eventName]) {
                this.handlers[eventName] = [handler];
            } else {
                console.log(`%c${eventName}事件已存在`, "color: #17dac5");
                this.handlers[eventName].push(handler);
            }
        } catch (e) {
            console.log("事件监听错误", eventName, e);
        }
        this.eventInstance.on(eventName, handler);
    }

    trigger(eventName: string, ...args: any) {
        this.eventInstance.trigger(eventName, ...args);
    }

    off(eventName: string, handler?: (...args) => void) {
        if (this.handlers[eventName]) {
            if (handler) {
                this.handlers[eventName] = this.handlers[eventName].filter((item) => item !== handler);
            } else {
                delete this.handlers[eventName];
            }
        }
        this.eventInstance.off(eventName, handler || undefined);
    }

    getHandlerNames() {
        return Object.keys(this.handlers);
    }

    getHandlersByName(eventName: string) {
        return this.handlers[eventName];
    }

    hasHandlerByName(eventName: string) {
        return !!this.handlers[eventName];
    }

    clear() {
        // 清空 事件
        this.handlers = {};
        this.eventInstance.off();
    }
}

export const roEvent = new Event();
