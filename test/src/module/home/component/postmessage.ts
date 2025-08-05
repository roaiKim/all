import { useCallback, useEffect, useMemo } from "react";

type MessageHandler<T = any> = (data: T) => void;
type EventType = string | symbol;

interface CommunicatorMethods {
    sendMessage: <T>(eventType: string, payload: T, targetWindow?: Window) => void;
    subscribe: <T>(eventType: EventType, callback: (data: T) => void) => () => void;
}

class IframeCommunicator {
    private targetOrigin: string;
    private eventListeners: Map<EventType, Set<MessageHandler>>;
    private messageHandler: (event: MessageEvent) => void;

    constructor(targetOrigin = "*") {
        this.targetOrigin = targetOrigin;
        this.eventListeners = new Map();
        this.messageHandler = this.handleMessage.bind(this);
        window.addEventListener("message", this.messageHandler);
    }

    // 发送消息到目标iframe
    send<T>(targetWindow: Window, eventType: EventType, payload: T): void {
        targetWindow.postMessage({ type: eventType, data: payload }, this.targetOrigin);
    }

    // 添加事件监听
    on<T>(eventType: EventType, callback: MessageHandler<T>): void {
        if (!this.eventListeners.has(eventType)) {
            this.eventListeners.set(eventType, new Set());
        }
        this.eventListeners.get(eventType).add(callback);
    }

    // 移除事件监听
    off<T>(eventType: EventType, callback: MessageHandler<T>): void {
        if (this.eventListeners.has(eventType)) {
            this.eventListeners.get(eventType).delete(callback);
        }
    }

    // 销毁监听
    destroy(): void {
        window.removeEventListener("message", this.messageHandler);
    }

    // 内部消息处理
    private handleMessage(event: MessageEvent): void {
        const { type, data } = event.data;
        if (this.eventListeners.has(type)) {
            this.eventListeners.get(type).forEach((cb) => cb(data));
        }
    }
}

export function useIframeCommunicator(targetOrigin: string = "*"): CommunicatorMethods {
    const communicator = useMemo(() => new IframeCommunicator(targetOrigin), [targetOrigin]);

    useEffect(() => {
        return () => communicator.destroy();
    }, [communicator]);

    const sendMessage = useCallback(
        <T>(eventType: EventType, payload: T, targetWindow: Window) => {
            if (!targetWindow && window.parent) {
                communicator.send(window.parent, eventType, payload);
            } else if ((targetWindow as any).contentWindow) {
                communicator.send((targetWindow as any).contentWindow, eventType, payload);
            } else if (targetWindow) {
                communicator.send(targetWindow, eventType, payload);
            }
        },
        [communicator]
    );

    const subscribe = useCallback(
        <T>(eventType: EventType, callback: (data: T) => void) => {
            communicator.on(eventType, callback);
            return () => communicator.off(eventType, callback);
        },
        [communicator]
    );

    return { sendMessage, subscribe };
}
