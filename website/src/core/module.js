import { app } from "./app";
import { ModuleProxy } from "./platform/ModuleProxy";
import { setStateAction } from "./reducer";

export function register(module) {
    const moduleName = module.name;
    if (!app.store.getState().app[moduleName]) {
        const { initialState } = module;
        app.store.dispatch(setStateAction(moduleName, initialState, `@@${moduleName}/@@init`));
    }
    const actions = {};
    getKeys(module).forEach((actionType) => {
        const method = module[actionType];
        const qualifiedActionType = `${moduleName}/${actionType}`;
        method.actionName = qualifiedActionType;
        actions[actionType] = (...payload) => ({ type: qualifiedActionType, payload });
        app.actionHandlers[qualifiedActionType] = method.bind(module);
    });
    const lifecycleListener = module;
    if (lifecycleListener.onRegister.isLifecycle) {
        app.store.dispatch(actions.onRegister());
    }
    return new ModuleProxy(module, actions);
}
export async function executeAction(handler, ...payload) {
    try {
        await handler(...payload);
    } catch (error) {

    // TODO 这里需要错误处理
    }
}
function getKeys(module) {
    const keys = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const propertyName of Object.getOwnPropertyNames(Object.getPrototypeOf(module))) {
        if (module[propertyName] instanceof Function && propertyName !== "constructor") {
            keys.push(propertyName);
        }
    }
    return keys;
}
