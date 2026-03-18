import type { Action } from "../reducer";

interface ActionHandlerEntry {
    handler: (...args: any[]) => unknown;
    moduleName: string;
}

type ActionHandlerRegistry = Record<string, ActionHandlerEntry>;

export const executeMethodMiddleware = (actionHandlers: ActionHandlerRegistry) => () => (next: any) => (action: Action<any>) => {
    const result = next(action);
    const actionType = actionHandlers[action.type];
    if (actionType) {
        actionType.handler(...action.payload);
    }
    return result;
};
