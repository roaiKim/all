import { RouteComponentProps } from "react-router";
import { enablePatches, produce } from "immer";
import { roDispatchFunction } from "../actions";
import { app } from "../app";
import { TickIntervalDecoratorFlag } from "../module";
import { Action, setStateAction, State } from "../reducer";

// enableES5();
if (process.env.NODE_ENV === "development") {
    enablePatches();
}

export interface ModuleLifecycleListener<RouteParam extends object = object> {
    onEnter: (parms: RouteComponentProps["match"]["params"], location: RouteComponentProps["location"]) => void | Promise<void>;
    onDestroy: () => void | Promise<void>;
    onLocationMatched: (routeParameters: RouteParam, location: RouteComponentProps["location"]) => void | Promise<void>;
    onTick: (() => void | Promise<void>) & TickIntervalDecoratorFlag;
    dispatch: (actionFunction: (...args: any[]) => Action<any>) => void | Promise<void>;
}

export class Module<RootState extends State, ModuleName extends keyof RootState["app"] & string, RouteParam extends object = object>
    implements ModuleLifecycleListener<RouteParam>
{
    constructor(readonly name: ModuleName, readonly initialState: RootState["app"][ModuleName]) {}

    /**
     * @description mount 之后调用
     * @param parms
     * @param location
     */
    onEnter(parms: RouteComponentProps["match"]["params"], location: RouteComponentProps["location"]) {
        //
    }

    /**
     * @description 销毁
     */
    onDestroy() {
        //
    }

    /**
     * @description 更新 路由 参数变更
     * @param routeParam
     * @param location
     */
    onLocationMatched(routeParam: RouteParam, location: RouteComponentProps["location"]) {
        //
    }

    /**
     * @description 循环请求 可用 @interval 装饰器决定 周期
     */
    onTick(): void | Promise<void> {
        //
    }

    /**
     *
     * @param action
     */
    dispatch(action: (...args: any[]) => Action<any>) {
        roDispatchFunction(action as any);
    }

    get state(): Readonly<RootState["app"][ModuleName]> {
        return this.rootState.app[this.name];
    }

    get rootState(): Readonly<RootState> {
        return app.store.getState() as Readonly<RootState>;
    }

    /**
     *
     * @param stateOrUpdater 更新的内容 可以是对象 & function
     */
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
