import { History } from "history";
import { Store } from "redux";
import { ActionHandler, ErrorHandler } from "./module";
import { State } from "./reducer";
interface App {
    readonly browserHistory: History;
    readonly store: Store<State>;
    readonly actionHandlers: {
        [actionType: string]: ActionHandler;
    };
    errorHandler: ErrorHandler;
}
export declare const app: App;
export {};
