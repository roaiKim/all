import { enablePatches, produce } from "immer";
import { routerNavigateAction } from "redux-router-bridge";
// import { push } from "redux-first-history";
import type { Location } from "history";
import type { Params } from "react-router";
// import { put } from "redux-saga/effects";
import { app } from "../app";
import type { Logger } from "../Logger";
import type { TickIntervalDecoratorFlag } from "../module";
import { navigationPreventionAction, setStateAction, type State } from "../reducer";
// import type { SagaGenerator } from "../typed-saga";

if (process.env.NODE_ENV === "development") enablePatches();

// export type ModuleLocation<State> = Location;

export type PromiseGenerator<T = unknown> = T | Promise<T>;

export type RouterLocation = Location;
export type RouterParams<T extends string = string> = Params<T>;

export interface ModuleLifecycleListener {
    onEnter: (params: RouterParams, location: RouterLocation) => PromiseGenerator;
    onDestroy: () => PromiseGenerator;
    onLocationMatched: (params: RouterParams, location: RouterLocation) => PromiseGenerator;
    onTick: (() => PromiseGenerator) & TickIntervalDecoratorFlag;
}

export class Module<
    RootState extends State,
    ModuleName extends keyof RootState["app"] & string,
    HistoryState extends object = object,
> implements ModuleLifecycleListener {
    constructor(
        readonly name: ModuleName,
        readonly initialState: RootState["app"][ModuleName]
    ) {}

    onEnter(routeParam: RouterParams, location: RouterLocation) {
        /**
         * Called when the attached component is initially mounted.
         */
    }

    onDestroy() {
        /**
         * Called when the attached component is going to unmount
         */
    }

    onLocationMatched(routeParam: RouterParams, location: RouterLocation) {
        /**
         * Called when the attached component is a React-Route component and its Route location matches
         * It is called each time the location changes, as long as it still matches
         */
    }

    onTick() {
        /**
         * Called periodically during the lifecycle of attached component
         * Usually used together with @Interval decorator, to specify the period (in second)
         * Attention: The next tick will not be triggered, until the current tick has finished
         */
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
            this.setState((state: object) => Object.assign(state, partialState));
        }
    }

    /**
     * CAVEAT:
     * (1)
     * Calling this.pushHistory to other module should cancel the following logic.
     * Using store.dispatch here will lead to error while cancelling in lifecycle.
     *
     * Because the whole process is in sync mode:
     * dispatch push action -> location change -> router component will un-mount -> lifecycle saga cancel
     *
     * Cancelling the current sync-running saga will throw "TypeError: Generator is already executing".
     *
     * (2)
     * Adding yield cancel() in pushHistory is also incorrect.
     * If this.pushHistory is only to change state rather than URL, it will lead to the whole lifecycle saga cancelled.
     *
     * https://github.com/react-boilerplate/react-boilerplate/issues/1281
     */
    pushHistory(url: string): PromiseGenerator;
    pushHistory(url: string, stateMode: "keep-state"): PromiseGenerator;
    pushHistory<T extends object>(url: string, state: T): PromiseGenerator; // Recommended explicitly pass the generic type
    pushHistory(state: HistoryState): PromiseGenerator;

    pushHistory(urlOrState: HistoryState | string, state?: object | "keep-state") {
        if (typeof urlOrState === "string") {
            const url: string = urlOrState;
            if (state) {
                app.store.dispatch(routerNavigateAction(url, { state: state === "keep-state" ? app.history.location.state : state }));
            } else {
                app.store.dispatch(routerNavigateAction(url));
            }
        } else {
            const currentURL = location.pathname + location.search;
            const state: HistoryState = urlOrState;
            app.store.dispatch(routerNavigateAction(currentURL, { state }));
        }
    }
}
