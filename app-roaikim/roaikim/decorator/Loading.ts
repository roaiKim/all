import { createActionHandlerDecorator } from "./createActionHandlerDecorator";
import { app } from "../app";
import { loadingAction } from "../reducer";

/**
 * To mark state.loading[identifier] during action execution.
 */
export function Loading(identifier = "global") {
    return createActionHandlerDecorator(async (handler) => {
        try {
            app.store.dispatch(loadingAction(true, identifier));
            await handler();
        } finally {
            app.store.dispatch(loadingAction(false, identifier));
        }
    });
}

/**
 * To mark state.loading[identifier] during action execution.
 */
export function MainLoading() {
    return createActionHandlerDecorator(async (handler) => {
        try {
            app.store.dispatch(loadingAction(true, "main"));
            await handler();
        } finally {
            app.store.dispatch(loadingAction(false, "main"));
        }
    });
}
