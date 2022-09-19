import { push, replace } from "connected-react-router";
import { Location } from "history";
import { produce, enablePatches, enableES5 } from "immer";
import { RouteComponentProps } from "react-router";
import { app } from "../app";
import { Logger } from "../logger";
import { TickIntervalDecoratorFlag } from "../module";
import { Action, navigationPreventionAction, setStateAction, State } from "../reducer";

// enableES5();
if (process.env.NODE_ENV === "development") {
    enablePatches();
}

export interface ModuleLifecycleListener<RouteParam extends object = object, HistoryState extends object = object> {
    onEnter: (parms: RouteComponentProps["match"]["params"], location: RouteComponentProps["location"]) => void | Promise<void>;
    onDestroy: () => void | Promise<void>;
    onLocationMatched: (routeParameters: RouteParam, location: Location<Readonly<HistoryState> | undefined>) => void | Promise<void>;
    onTick: (() => void | Promise<void>) & TickIntervalDecoratorFlag;
    dispatch: (actionFunction: (...args: any[]) => Action<any>) => void | Promise<void>;
}

export class Module<
    RootState extends State,
    ModuleName extends keyof RootState["app"] & string,
    RouteParam extends object = object,
    HistoryState extends object = object
> implements ModuleLifecycleListener<RouteParam, HistoryState>
{
    constructor(readonly name: ModuleName, readonly initialState: RootState["app"][ModuleName]) {}

    onEnter(parms: RouteComponentProps["match"]["params"], location: Location) {
        /**
         * Called when the attached component is initially mounted.
         */
    }

    onDestroy() {
        /**
         * Called when the attached component is going to unmount
         */
    }

    onLocationMatched(routeParam: RouteParam, location: Location<Readonly<HistoryState> | undefined>) {
        /**
         * Called when the attached component is a React-Route component and its Route location matches
         * It is called each time the location changes, as long as it still matches
         */
    }

    onTick(): void | Promise<void> {
        /**
         * Called periodically during the lifecycle of attached component
         * Usually used together with @Interval decorator, to specify the period (in second)
         * Attention: The next tick will not be triggered, until the current tick has finished
         */
    }

    dispatch(action: (...args: any[]) => Action<any>) {
        if (typeof action !== "function") throw new Error("this.dispatch 的参数必须为 Function");
        app.store.dispatch(action());
    }

    get state(): Readonly<RootState["app"][ModuleName]> {
        return this.rootState.app[this.name];
    }

    get rootState(): Readonly<RootState> {
        return app.store.getState() as Readonly<RootState>;
    }

    get logger(): Logger {
        return app.logger;
    }

    setNavigationPrevented(isPrevented: boolean) {
        app.store.dispatch(navigationPreventionAction(isPrevented));
    }

    setState<K extends keyof RootState["app"][ModuleName]>(
        stateOrUpdater: ((state: RootState["app"][ModuleName]) => void) | Pick<RootState["app"][ModuleName], K> | RootState["app"][ModuleName]
    ): void {
        if (typeof stateOrUpdater === "function") {
            const originalState = this.state;
            const updater = stateOrUpdater as (state: RootState["app"][ModuleName]) => void;
            let patchDescriptions: string[] | undefined;
            const newState = produce<Readonly<RootState["app"][ModuleName]>, RootState["app"][ModuleName]>(
                originalState,
                (draftState) => {
                    // Wrap into a void function, in case updater() might return anything
                    updater(draftState);
                },
                process.env.NODE_ENV === "development"
                    ? (patches) => {
                          // No need to read "op", in will only be "replace"
                          patchDescriptions = patches.map((_) => _.path.join("."));
                      }
                    : undefined
            );
            if (newState !== originalState) {
                const description = `@@${this.name}/setState${patchDescriptions ? `[${patchDescriptions.join("/")}]` : ``}`;
                app.store.dispatch(setStateAction(this.name, newState, description));
            }
        } else {
            const partialState = stateOrUpdater as object;
            this.setState((state) => Object.assign(state, partialState));
        }
    }

    pushHistory(url: string): void;
    pushHistory(url: string, stateMode: "keep-state"): void;
    pushHistory<T extends object>(url: string, state: T): void; // Recommended explicitly pass the generic type
    pushHistory(state: HistoryState): void;

    pushHistory(urlOrState: HistoryState | string, state?: object | "keep-state") {
        if (typeof urlOrState === "string") {
            const url: string = urlOrState;
            if (state) {
                app.store.dispatch(push(url, state === "keep-state" ? app.browserHistory.location.state : state));
            } else {
                app.store.dispatch(push(url));
            }
        } else {
            const currentURL = location.pathname + location.search;
            const state: HistoryState = urlOrState;
            app.store.dispatch(push(currentURL, state));
        }
    }

    // protected setHistory(urlOrState: HistoryState | string, usePush = true) {
    //     if (typeof urlOrState === "string") {
    //         app.store.dispatch(usePush ? push(urlOrState) : replace(urlOrState));
    //     } else {
    //         // eslint-disable-next-line no-restricted-globals
    //         const currentURL = location.pathname + location.search;
    //         app.store.dispatch(usePush ? push(currentURL, urlOrState) : replace(currentURL, urlOrState));
    //     }
    // }
}
