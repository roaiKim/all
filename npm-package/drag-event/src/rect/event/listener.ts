// export type ListenerHolder = (...state: any[]) => void;
export type ListenerHolder<T = any[]> = T extends any[] ? (...state: T) => void : (state: T) => void;

interface ListenerAgentProps<T extends string[]> {
    listenersType: T;
}

export class ListenerAgent<T extends string[] = string[]> {
    listeners: Map<T[number], ListenerHolder[]>;
    listenersType: T;

    constructor(props: ListenerAgentProps<T>) {
        this.listeners = new Map<T[number], ListenerHolder[]>();
        this.listenersType = props.listenersType || ([] as unknown as T);
    }

    getListener() {
        return this.listeners;
    }

    subscribe(type: T[number], listeners: ListenerHolder) {
        if (!this.listenersType.includes(type)) {
            console.error("订阅事件类型不存在");
            return;
        }
        if (this.listeners.has(type)) {
            this.listeners.get(type)!.push(listeners);
        } else {
            this.listeners.set(type, [listeners]);
        }
    }

    triggerListener(type: T[number], ...state: any[]) {
        const listenersList = this.listeners.get(type);
        if (listenersList?.length) {
            listenersList.forEach((item) => item(...state));
        }
    }

    unsubscribe(type: T[number], listeners?: ListenerHolder) {
        if (!this.listenersType.includes(type)) {
            console.error("取消订阅事件类型不存在");
            return;
        }
        const listenersList = this.listeners.get(type);
        if (listenersList) {
            this.listeners.set(
                type,
                listenersList.filter((item) => item !== listeners)
            );
        }
    }
}
