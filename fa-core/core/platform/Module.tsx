/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { push, replace } from "connected-react-router";
import { app } from "../app";
import { Location } from "history";
import { LifecycleDecoratorFlag } from "../module";
import { setStateAction, Action, navigationPreventionAction } from "../reducer";
import { State } from "../type";
import { produce } from "immer";

interface TickIntervalDecoratorFlag {
    tickInterval?: number;
}

export interface ModuleLifecycleListener<RouteParam extends object = object, HistoryState extends object = object> {
    onEnter: (entryComponentProps?: any) => unknown;
    onDestroy: () => unknown;
    onLocationMatched: (routeParameters: RouteParam, location: Location<Readonly<HistoryState | undefined>>) => unknown;
    onTick: (() => unknown) & TickIntervalDecoratorFlag;
}

export class Module<RootState extends State, ModuleName extends keyof RootState["app"] & string, RouteParam extends object = object, HistoryState extends object = object>
    implements ModuleLifecycleListener<RouteParam, HistoryState>
{
    constructor(readonly name: ModuleName, readonly initialState: RootState["app"][ModuleName]) {}

    /**
     * 初始化时执行 componentDidMount
     */
    onEnter(entryComponentProps: any) {}

    /**
     * 当location变化时匹配(依然能够匹配)
     * 如: 路由为 /user/:id;
     * 当前为 /user/1 变化到 /user/2时, 此时 这个路由依然能够匹配, 这个方法会执行
     */
    onLocationMatched(routeParam: RouteParam, location: Location<Readonly<HistoryState> | undefined>) {}

    /**
     * 卸载时触发
     */
    onDestroy() {}

    /**
     * 循环触发，一般搭配 @Interval 装饰器使用
     * 注意: 只有 前一个 循环结束, 下一个循环才会触发
     */
    onTick() {}

    setNavigationPrevented(isPrevented: boolean) {
        app.store.dispatch(navigationPreventionAction(isPrevented));
    }

    protected get state(): Readonly<RootState["app"][ModuleName]> {
        return this.rootState.app[this.name];
    }

    protected get rootState(): Readonly<RootState> {
        return app.store.getState() as Readonly<RootState>;
    }

    protected dispatch(action: () => Action<{}>) {
        if (typeof action !== "function") throw new Error("this.dispatch 的参数必须为 Function");
        app.store.dispatch(action());
    }

    // get logger(): Logger {
    //     return app.logger;
    // }

    protected setState<K extends keyof RootState["app"][ModuleName]>(state: (state: RootState["app"][ModuleName]) => void | Pick<RootState["app"][ModuleName], K> | RootState["app"][ModuleName]): void {
        if (typeof state === "function") {
            const originalState = this.state;
            const updater = state as (state: RootState["app"][ModuleName]) => void;
            let patchDescriptions: string[] | undefined;
            const newState = produce<Readonly<RootState["app"][ModuleName]>, RootState["app"][ModuleName]>(
                originalState,
                (draftState) => {
                    updater(draftState);
                },
                process.env.NODE_ENV === "development"
                    ? (patches) => {
                          patchDescriptions = patches.map((_) => _.path.join("."));
                      }
                    : undefined
            );
            if (newState !== originalState) {
                const description = `@@${this.name}/setState${patchDescriptions ? patchDescriptions.join("/") : ""}`;
                app.store.dispatch(setStateAction(this.name, newState, description));
            }
        } else {
            const partialState = state;
            this.setState((state) => Object.assign(state, partialState));
        }
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
