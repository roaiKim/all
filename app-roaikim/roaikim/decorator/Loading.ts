// import { put } from "redux-saga/effects";
import { createActionHandlerDecorator } from "./createActionHandlerDecorator";
import { app } from "../app";
import { loadingAction } from "../reducer";

/**
 * To mark state.loading[identifier] during action execution.
 */
export function Loading(identifier = "global") {
    return createActionHandlerDecorator(async (handler) => {
        try {
            console.log("---" + identifier, new Date());
            app.store.dispatch(loadingAction(true, identifier));
            await handler();
        } finally {
            app.store.dispatch(loadingAction(false, identifier));
            console.log("---" + identifier, new Date());
        }
    });
}
