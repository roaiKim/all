/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import {push, replace} from "connected-react-router";
import {app} from "../app";
import {Location} from "history";
import {LifecycleDecoratorFlag} from "../module";
import {setStateAction, Action} from "../reducer";
import {State} from "../type";

export interface ModuleLifecycleListener<RouteParam extends {} = {}, HistoryState extends {} = {}> {
    onRegister: (() => void) & LifecycleDecoratorFlag;
    onRender: ((routeParameters: RouteParam, location: Location<HistoryState | undefined>) => void) & LifecycleDecoratorFlag;
    onDestroy: (() => void) & LifecycleDecoratorFlag;
}

export class Module<ModuleState extends {}, RouteParam extends {} = {}, HistoryState extends {} = {}, RootState extends State = State> {
    constructor(readonly name: string, readonly initialState: ModuleState) {}

    onRegister() {}

    // eslint-disable-next-line no-unused-vars
    onRender(routeParameters: RouteParam, location: HistoryState) {}

    onDestroy() {}

    protected get state(): Readonly<ModuleState> {
        return this.rootState.app[this.name];
    }

    protected get rootState(): Readonly<RootState> {
        return app.store.getState() as Readonly<RootState>;
    }

    protected dispatch(action: () => Action<{}>) {
        if (typeof action !== "function") throw new Error("this.dispatch 的参数必须为 Function");
        app.store.dispatch(action());
    }

    protected setState(newState: Partial<ModuleState>) {
        app.store.dispatch(setStateAction(this.name, newState, `@@${this.name}/setState[${Object.keys(newState).join(",")}]`));
    }

    protected setHistory(urlOrState: HistoryState | string, usePush = true) {
        if (typeof urlOrState === "string") {
            app.store.dispatch(usePush ? push(urlOrState) : replace(urlOrState));
        } else {
            // eslint-disable-next-line no-restricted-globals
            const currentURL = location.pathname + location.search;
            app.store.dispatch(usePush ? push(currentURL, urlOrState) : replace(currentURL, urlOrState));
        }
    }
}
