import { createActionHandlerDecorator } from "./index";
import { loadingAction } from "../reducer";
import { app } from "../app";

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
