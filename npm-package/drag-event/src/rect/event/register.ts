import { DragAgent, ListenerType } from "./agent";

const events: (keyof typeof ListenerType)[] = Object.values(ListenerType);

export function Register(dragAgent: DragAgent, props: Record<string, any>, event = events) {
    if (!dragAgent || !props || !event?.length) return;
    event.forEach((event) => {
        if (props[event]) {
            dragAgent.subscribe(event, props[event]);
        }
    });
}

export function Unregister(dragAgent: DragAgent, props: Record<string, any>, event = events) {
    if (!dragAgent || !props || !event?.length) return;
    event.forEach((event) => {
        if (props[event]) {
            dragAgent.unsubscribe(event, props[event]);
        }
    });
}
