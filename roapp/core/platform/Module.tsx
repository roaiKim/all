import { produce, enablePatches, enableES5 } from "immer";
import { app } from "../app";
import { TickIntervalDecoratorFlag } from "../module";
import { navigationPreventionAction, setStateAction, State } from "../reducer";

// enableES5();
if (process.env.NODE_ENV === "development") {
    enablePatches();
}

export interface ModuleLifecycleListener {
    onEnter: (entryComponentProps?: any) => unknown;
    onDestroy: () => unknown;
    onTick: (() => unknown) & TickIntervalDecoratorFlag;
}

export class Module<RootState extends State, ModuleName extends keyof RootState["app"] & string> implements ModuleLifecycleListener {
    constructor(readonly name: ModuleName, readonly initialState: RootState["app"][ModuleName]) {}

    onEnter(entryComponentProps: any) {
        /**
         * Called when the attached component is initially mounted.
         */
    }

    onDestroy() {
        /**
         * Called when the attached component is going to unmount
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
}
