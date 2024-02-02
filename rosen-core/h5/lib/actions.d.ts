import { Action } from "redux";
export declare const roPushHistory: (urlOrState: Record<string, any> | string, state?: object | "keep-state") => void;
export declare function roDispatchFunction(action: (...args: any[]) => Action<any>): void;
export declare function roDispatchAction(action: Action<any>): void;
