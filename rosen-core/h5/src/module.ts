import { app } from "./app";
import { Exception } from "./Exception";
import { Module, ModuleLifecycleListener } from "./platform/Module";
import { ModuleProxy } from "./platform/ModuleProxy";
import { Action, setStateAction } from "./reducer";

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
        app.store.dispatch(setStateAction(moduleName, module.initialState, `@@${moduleName}/@@init`));
    }

    const actions: any = {};
    getKeys(module).forEach((actionType) => {
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
        //
    }
}

function getKeys<M extends Module<any, any>>(module: M) {
    const keys: string[] = [];
    for (const propertyName of Object.getOwnPropertyNames(Object.getPrototypeOf(module))) {
        if (module[propertyName] instanceof Function && propertyName !== "constructor") {
            keys.push(propertyName);
        }
    }
    return keys;
}
