import { app } from "./app";
import { ModuleProxy } from "./platform/ModuleProxy";
import { Module, ModuleLifecycleListener } from "./platform/Module";
import { setStateAction, Action } from "./reducer";
import { Exception } from "./exception";

export interface LifecycleDecoratorFlag {
    isLifecycle?: boolean;
}

export interface ErrorListener {
    onError: ErrorHandler;
}

export type ErrorHandler = (error: Exception) => unknown;
export type ActionHandler = (...args: unknown[]) => unknown;
type ActionCreator<H> = H extends (...args: infer P) => unknown ? (...args: P) => Action<P> : never;
type HandlerKeys<H> = { [K in keyof H]: H[K] extends (...args: unknown[]) => unknown ? K : never }[Exclude<keyof H, keyof ModuleLifecycleListener>];
export type ActionCreators<H> = { readonly [K in HandlerKeys<H>]: ActionCreator<H[K]> };

export function register<M extends Module<any, any>>(module: M): ModuleProxy<M> {
    const moduleName = module.name;
    if (!app.store.getState().app[moduleName]) {
        const { initialState } = module;
        app.store.dispatch(setStateAction(moduleName, initialState, `@@${moduleName}/@@init`));
    }

    const actions: any = {};
    getKeys(module).forEach((actionType) => {
        const method = module[actionType];
        const qualifiedActionType = `${moduleName}/${actionType}`;
        method.actionName = qualifiedActionType;
        actions[actionType] = (...payload: unknown[]): Action<unknown[]> => ({ type: qualifiedActionType, payload });

        app.actionHandlers[qualifiedActionType] = method.bind(module);
    });

    // const lifecycleListener = module as ModuleLifecycleListener;
    // if (lifecycleListener.onRegister.isLifecycle) {
    //     app.store.dispatch(actions.onRegister());
    // }
    return new ModuleProxy(module, actions);
}

export async function executeAction(actionName: string, handler: ActionHandler, ...payload: any[]) {
    try {
        await handler(...payload);
    } catch (error) {
        // TODO 这里需要错误处理
        // const actionPayload = stringifyWithMask(app.loggerConfig?.maskedKeywords || [], "***", ...payload) || "[No Parameter]";
        // captureError(error, actionName, {actionPayload});
    }
}

function getKeys<M extends Module<any, any>>(module: M) {
    const keys = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const propertyName of Object.getOwnPropertyNames(Object.getPrototypeOf(module))) {
        if (module[propertyName] instanceof Function && propertyName !== "constructor") {
            keys.push(propertyName);
        }
    }
    return keys;
}
