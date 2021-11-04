import { createActionHandlerDecorator } from "./index";
import { loadingAction } from "../reducer";
import { app } from "../app";
/**
 * To mark state.loading[identifier] during action execution.
 */
// export function Loading(identifier: string = "global") {
//     return createActionHandlerDecorator(function* (handler) {
//         try {
//             yield put(loadingAction(true, identifier));
//             yield* handler();
//         } finally {
//             yield put(loadingAction(false, identifier));
//         }
//     });
// }

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
