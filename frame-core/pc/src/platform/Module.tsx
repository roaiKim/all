import { type RouteComponentProps } from "react-router";
import { enablePatches, produce } from "immer";
import { roDispatchFunction } from "../actions";
import { app } from "../app";
import { type Logger } from "../logger";
import { type TickIntervalDecoratorFlag } from "../module";
import { type Action, navigationPreventionAction, setStateAction, type State } from "../reducer";

// enableES5();
// @ts-ignore
if (process.env.NODE_ENV === "development") {
    enablePatches();
}

export interface ModuleLifecycleListener<RouteParam extends object = object> {
    onEnter: (parms: RouteComponentProps["match"]["params"], location: RouteComponentProps["location"]) => void | Promise<void>;
    onDestroy: () => void | Promise<void>;
    onLocationMatched: (routeParameters: RouteParam, location: RouteComponentProps["location"]) => void | Promise<void>;
    onTick: (() => void | Promise<void>) & TickIntervalDecoratorFlag;
    dispatch: (actionFunction: (...args: any[]) => Action<any>) => void | Promise<void>;
    setNavigationPrevented: (isPrevented: boolean) => void;
}

export class Module<RootState extends State, ModuleName extends keyof RootState["app"] & string, RouteParam extends object = object>
    implements ModuleLifecycleListener<RouteParam>
{
    constructor(
        readonly name: ModuleName,
        readonly initialState: RootState["app"][ModuleName]
    ) {}

    onEnter(parms: RouteComponentProps["match"]["params"], location: RouteComponentProps["location"]) {
        /**
         * mounted.
         */
    }

    onDestroy() {
        /**
         * unmount
         */
    }

    onLocationMatched(routeParam: RouteParam, location: RouteComponentProps["location"]) {
        /**
         * location changes
         */
    }

    onTick(): void | Promise<void> {
        /**
         * 周期性请求 可用 @interval 指定间隔
         */
    }

    dispatch(action: (...args: any[]) => Action<any>) {
        roDispatchFunction(action as any);
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
                    // void function
                    updater(draftState);
                },
                // @ts-ignore
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
}
