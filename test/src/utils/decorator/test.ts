import { ContentType, RequestMethod, ViewType } from "http/config";

export function TestDecorator() {
    console.log("cccccccccccc", 222222222222);
    return (target, propertyKey, descriptor) => {
        const fn = descriptor.value!;
        console.log(2222222222222222);
        descriptor.value = function (...args: any[]) {
            const boundFn = fn.bind(this, ...args) as any;
            boundFn.actionName = (descriptor.value as any).actionName;
            boundFn.ccc = "Yui";
            // boundFn.action = "POST";
            // console.log(2222222222222222);
            console.log("------descriptor-----", this);
            console.log("------propertyKey-----", propertyKey);
            console.log("------descriptor.method-----", target[propertyKey].method);
            console.log("------descriptor.descript-----", target[propertyKey].descript);
            console.log("------descriptor.globalHold-----", target[propertyKey].globalHold);
            console.log("------descriptor.contentType-----", target[propertyKey].contentType);
            return boundFn(11);
        };
        return descriptor;
    };
}

export function Api(method: RequestMethod, descript: string, type: keyof typeof ViewType) {
    return (target, propertyKey, descriptor) => {
        const fn = descriptor.value!;
        descriptor.value = function (...args: any[]) {
            const boundFn = fn.bind(this, ...args) as any;
            boundFn.actionName = (descriptor.value as any).actionName;
            // descriptor.value.method = method;
            // descriptor.value.descript = descript;
            // descriptor.value.type = type;
            // boundFn.action = "POST";
            // console.log(2222222222222222);
            console.log("------descriptor-----", this);
            console.log("------propertyKey-----", propertyKey);
            console.log("------descriptor.method-----", target[propertyKey].method);
            console.log("------descriptor.descript-----", target[propertyKey].descript);
            console.log("------descriptor.globalHold-----", target[propertyKey].globalHold);
            console.log("------descriptor.contentType-----", target[propertyKey].contentType);
            console.log("------descriptor.config-----", target[propertyKey].config);
            return boundFn(1);
        };
        descriptor.value.method = method;
        descriptor.value.descript = descript;
        descriptor.value.type = type;
        return descriptor;
    };
}

export function StaticAssemble() {
    return (target, propertyKey, descriptor) => {
        const fn = descriptor.value!;
        descriptor.value = function (...args: any[]) {
            const boundFn = fn.bind(this, ...args) as any;
            const actionName = (descriptor.value as any).actionName;
            console.log("--111111----actionName-----", descriptor.value.length);
            console.log("--111111----descriptor-----", this);
            console.log("--111111----propertyKey-----", this.propertyKey);
            console.log("--111111----descriptor.method-----", target[propertyKey].method);
            console.log("--111111----descriptor.descript-----", target[propertyKey].descript);
            console.log("--111111----descriptor.globalHold-----", target[propertyKey].globalHold);
            console.log("--111111----descriptor.contentType-----", target[propertyKey].contentType);
            console.log("--111111----descriptor.config-----", target[propertyKey].config);
            // const method = target[propertyKey].method;
            // const descript = target[propertyKey].descript;
            // const globalHold = target[propertyKey].globalHold;
            // const contentType = target[propertyKey].contentType;
            // const config = target[propertyKey].config;
            // const headers = target[propertyKey].headers;
            // if (config) {
            //     axiosConfig["config"] = config;
            // }
            // if (headers) {
            //     axiosConfig["headers"] = headers;
            // }
            // if (globalHold) {
            //     axiosConfig["globalHold"] = globalHold;
            // }
            boundFn(22222);
            // return boundFn(method, contentType, { globalHold, config, headers });
        };
        return descriptor;
    };
}

export function TestPOSTDecorator() {
    return (target, propertyKey, descriptor) => {
        // const fn = descriptor.value!;
        descriptor.value.action = "POST";
        return descriptor;
    };
}

/**
 *
 * @param method 请求方法
 * @param descript 接口描述
 * @returns
 */
export function Method(method: RequestMethod, descript: string) {
    return (target, propertyKey, descriptor) => {
        descriptor.value.method = method;
        descriptor.value.descript = descript;
        return descriptor;
    };
}

/**
 *
 * @param descript 是否自己处理后台返回的数据
 * @returns
 */
export function GlobalHold(target, propertyKey, descriptor) {
    descriptor.value.globalHold = true;
    return descriptor;
}

/**
 *
 * @param type http 的 request content-type
 * @returns
 */
export function HttpContentType(type: keyof typeof ContentType) {
    return (target, propertyKey, descriptor) => {
        descriptor.value.contentType = type;
        return descriptor;
    };
}

/**
 *
 * @param headers http request 的 headers
 * @returns
 */
export function HttpHeaders(headers: Record<string, any>) {
    return (target, propertyKey, descriptor) => {
        descriptor.value.headers = headers;
        return descriptor;
    };
}

/**
 *
 * @param config axios 的 其他 config
 * @returns
 */
export function AxiosConfig(config: keyof typeof HttpContentType) {
    return (target, propertyKey, descriptor) => {
        descriptor.value.config = config;
        return descriptor;
    };
}
