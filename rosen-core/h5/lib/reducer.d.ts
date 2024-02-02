import { History } from "history";
import { Action as ReduxAction, Reducer } from "redux";
import { RouterState } from "connected-react-router";
interface LoadingState {
    [loading: string]: number;
}
export interface State {
    loading: LoadingState;
    router: RouterState;
    app: object;
}
declare const SET_STATE_ACTION = "@@framework/setState";
export interface Action<P> extends ReduxAction<string> {
    payload: P;
    name?: typeof SET_STATE_ACTION;
}
interface SetStateActionPayload {
    module: string;
    state: any;
}
export declare function setStateAction(module: string, state: object, type: string): Action<SetStateActionPayload>;
interface LoadingActionPayload {
    identifier: string;
    show: boolean;
}
/**
 * 普通的 loading
 */
export declare const LOADING_ACTION = "@@framework/loading";
export declare function loadingAction(show: boolean, identifier?: string): Action<LoadingActionPayload>;
export declare function rootReducer(history: History): Reducer<State>;
export declare function showLoading(state: State, identifier?: string): boolean;
export declare const executeMethodMiddleware: () => (next: any) => (action: Action<any>) => any;
export {};
