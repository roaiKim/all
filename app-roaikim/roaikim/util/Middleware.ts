import { app } from "../app";
import type { Action } from "../reducer";

export const executeMethodMiddleware = () => (next: any) => (action: Action<any>) => {
    const result = next(action);
    const actionType = app.actionHandlers[action.type];
    if (actionType) {
        actionType.handler(...action.payload);
    }
    return result;
};
