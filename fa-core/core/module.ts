import { app } from "./app";
import { Exception } from "./allException";
import { Module, ModuleLifecycleListener } from "./platform/Module";
import { ModuleProxy } from "./platform/ModuleProxy";
import { Action, setStateAction } from "./reducer";
import { captureError } from "./util/error-util";
export interface TickIntervalDecoratorFlag {
    tickInterval?: number;
}

export interface ErrorListener {
    onError: ErrorHandler;
}

export type ActionHandler = (...args: any[]) => any;

export type ErrorHandler = (error: Exception) => unknown;

type ActionCreator<H> = H extends (...args: infer P) => unknown ? (...args: P) => Action<P> : never;
type HandlerKeys<H> = { [K in keyof H]: H[K] extends (...args: any[]) => unknown ? K : never }[Exclude<
    keyof H,
    keyof ModuleLifecycleListener | keyof ErrorListener
>];
export type ActionCreators<H> = { readonly [K in HandlerKeys<H>]: ActionCreator<H[K]> };

export function register<M extends Module<any, any>>(module: M): ModuleProxy<M> {
    const moduleName: string = module.name;
    if (!app.store.getState().app[moduleName]) {
        // To get private property
        app.store.dispatch(setStateAction(moduleName, module.initialState, `@@${moduleName}/@@init`));
    }

    // Transform every method into ActionCreator
    const actions: any = {};
    getKeys(module).forEach((actionType) => {
        // Attach action name, for @Log / error handler reflection
        const method = module[actionType];
        const qualifiedActionType = `${moduleName}/${actionType}`;
        method.actionName = qualifiedActionType;
        actions[actionType] = (...payload: any[]): Action<any[]> => ({ type: qualifiedActionType, payload });

        app.actionHandlers[qualifiedActionType] = method.bind(module);
    });

    return new ModuleProxy(module, actions);
}

export async function executeAction(actionName: string, handler: ActionHandler, ...payload: any[]) {
    try {
        await handler(...payload);
    } catch (error) {
        // const actionPayload = stringifyWithMask(app.loggerConfig?.maskedKeywords || [], "***", ...payload) || "[No Parameter]";
        // captureError(error, actionName, { actionPayload });
    }
}

function getKeys<M extends Module<any, any>>(module: M) {
    // Do not use Object.keys(Object.getPrototypeOf(module)), because class methods are not enumerable
    const keys: string[] = [];
    for (const propertyName of Object.getOwnPropertyNames(Object.getPrototypeOf(module))) {
        if (module[propertyName] instanceof Function && propertyName !== "constructor") {
            keys.push(propertyName);
        }
    }
    return keys;
}
