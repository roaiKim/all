import { RouteComponentProps } from "react-router";
import { roDispatchFunction } from "../actions";
import { app } from "../app";
import { TickIntervalDecoratorFlag } from "../module";
import { Action, State } from "../reducer";

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

    setState<K extends keyof RootState["app"][ModuleName]>(state: Pick<RootState["app"][ModuleName], K> | RootState["app"][ModuleName]): void {
        const partialState = state;
        this.setState((state) => Object.assign(state, partialState));
    }
}
