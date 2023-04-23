import { ComponentType } from "react";
import { LogoutService } from "service/public-api/LoginService";
import { isDevelopment } from "./staticEnvs";

// 这个是全局加载的功能
const modules = require.context("service/public-api", true, /Service\.ts$/);
const modulesId: string[] = modules.keys(); // .filter((item: string) => item.startsWith("module"));

export declare interface ModuleStatement {
    name: string;
    path: string;
    title: string;
    icon?: string;
    disabled?: boolean;
    order?: number;
    component: ComponentType<any>;
}

export const cacheServices = {};

modulesId.forEach((id) => {
    const packages = modules(id);
    const servicesModule = getKeys(packages).filter((item) => item.endsWith("Service")) || [];
    console.log(servicesModule);

    servicesModule.forEach((item) => {
        cacheServices[item] = packages[item];
    });
});

// console.log(cacheServices.LogoutService.logout());

const allHttps = (ser) => {
    console.log(
        "--ser.toString()--",
        ser.then((res) => {
            console.log("s");
        }),
        ser.toString(),
        ser.serviceName
    );
    const ad = cacheServices[ser.toString()];
    console.log("ad", ad);
};

allHttps(LogoutService.logout());

function getKeys<M>(module: M) {
    // Do not use Object.keys(Object.getPrototypeOf(module)), because class methods are not enumerable
    const keys: string[] = [];
    for (const propertyName of Object.getOwnPropertyNames(module)) {
        if (module[propertyName] instanceof Function && propertyName !== "constructor") {
            keys.push(propertyName);
        }
    }
    return keys;
}

const md = {
    actionHandlers: {},
};

function register<M>(module: M) {
    const moduleName: string = (module as any).name;

    // Transform every method into ActionCreator
    const actions: any = {};
    getKeys(module).forEach((actionType) => {
        // Attach action name, for @Log / error handler reflection
        const method = module[actionType];
        const qualifiedActionType = `${moduleName}/${actionType}`;
        method.actionName = qualifiedActionType;
        actions[actionType] = (...payload: any[]) => ({ type: qualifiedActionType, payload });

        md.actionHandlers[qualifiedActionType] = method.bind(module);
    });

    return actions;
}
// const names = getKeys(LoginService);
// const c = register(LoginService);
// console.log("---names---", md, c);
