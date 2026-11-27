// export type ListenerHolder = (...state: any[]) => void;
export type ListenerHolder<T = any[]> = T extends any[] ? (...state: T) => void : (state: T) => void;

interface ListenerAgentProps<T extends string[]> {
    listenersType?: T;
    allowAllType?: boolean;
}

export class ListenerAgent<T extends string[] = string[]> {
    #listeners: Map<T[number], ListenerHolder[]>;
    listenersType: T;
    allowAllType: boolean;

    constructor(props: ListenerAgentProps<T>) {
        this.#listeners = new Map<T[number], ListenerHolder[]>();
        this.listenersType = props.listenersType || ([] as unknown as T);
        this.allowAllType = props.allowAllType === undefined ? !props.listenersType?.length : props.allowAllType;
    }

    getListener(): Map<T[number], ListenerHolder[]> {
        return this.#listeners;
    }

    getListenerByType(type: T[number]): ListenerHolder[] {
        return this.#listeners.get(type);
    }

    subscribe(type: T[number], listeners: ListenerHolder) {
        if (!this.allowAllType && !this.listenersType.includes(type)) {
            throw new Error("The subscription event type does not exist.");
        }
        if (this.#listeners.has(type)) {
            this.#listeners.get(type)!.push(listeners);
        } else {
            this.#listeners.set(type, [listeners]);
        }
    }

    trigger(type: T[number], ...state: any[]) {
        const listenersList = this.#listeners.get(type);
        if (listenersList?.length) {
            listenersList.forEach((item) => item(...state));
        }
    }

    unsubscribe(type: T[number], listeners?: ListenerHolder) {
        if (!this.allowAllType && !this.listenersType.includes(type)) {
            throw new Error("The subscription event type does not exist.");
        }
        const listenersList = this.#listeners.get(type);
        if (listenersList) {
            this.#listeners.set(
                type,
                listenersList.filter((item) => item !== listeners)
            );
        }
    }

    clear() {
        this.#listeners.clear();
    }

    clearByType(type: T[number]) {
        this.#listeners.set(type, []);
    }
}
