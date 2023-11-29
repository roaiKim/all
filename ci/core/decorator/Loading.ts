import { createActionHandlerDecorator } from "./index";
import { app } from "../app";
import { loadingAction } from "../reducer";

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
