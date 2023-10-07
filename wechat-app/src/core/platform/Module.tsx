import { produce, enablePatches, enableES5 } from "immer";
import { AnyAction } from "redux";
import { app, roDispatch } from "../app";
import { TickIntervalDecoratorFlag, onDestroyIntervalDecoratorFlag } from "../module";
import { Action, navigationPreventionAction, setStateAction, State } from "../reducer";

// enableES5();
if (process.env.NODE_ENV === "development") {
    enablePatches();
}

export interface ModuleLifecycleListener {
    onEnter: (params: Record<string, any> | undefined, pageName: string | undefined) => Promise<void> | void;
    onDestroy: (() => Promise<void> | void) & onDestroyIntervalDecoratorFlag;
    onTick: (() => Promise<void> | void) & TickIntervalDecoratorFlag;
    onShow: (params: Record<string, any> | undefined, pageName: string | undefined) => Promise<void> | void;
    dispatch: (action: AnyAction) => Promise<void> | void;
    onHide: (params: Record<string, any> | undefined, pageName: string | undefined) => Promise<void> | void;
    needAuth?: true;
    authAction?: () => void;
}

export class Module<RootState extends State, ModuleName extends keyof RootState["app"] & string> implements ModuleLifecycleListener {
    constructor(readonly name: ModuleName, readonly initialState: RootState["app"][ModuleName]) {}

    /**
     * @description 组件安装 一个生命周期内只会运行一次  和 componentDidMount 一样
     * @param params 跳转参数
     * @param pageName 页面名称
     */
    onEnter(params: Record<string, any> | undefined, pageName: string | undefined): Promise<void> | void {}

    /**
     * @description 组件销毁 一个生命周期内只会运行一次  和 componentWillUnMount 一样
     */
    onDestroy(): Promise<void> | void {}

    /**
     * @description 循环某一个 函数, 在生命周期内会一直运行 无法提前退出 直到组件销毁
     */
    onTick(): Promise<void> | void {}

    /**
     * @description Taro 小程序 的 componentDidShow/useDidShow
     * @param params 跳转参数
     */
    onShow(params: Record<string, any> | undefined, pageName: string | undefined): Promise<void> | void {}

    /**
     * @description Taro 小程序 的 componentDidHide/useDidHide
     * @param params 跳转参数
     */
    onHide(params: Record<string, any> | undefined, pageName: string | undefined): Promise<void> | void {}

    /**
     *
     * @param action actions 调用
     */
    dispatch(action: AnyAction): Promise<void> | void {
        roDispatch(action);
    }

    /**
     * @description 获取当前module的state
     */
    get state(): Readonly<RootState["app"][ModuleName]> {
        return this.rootState.app[this.name];
    }

    /**
     * @description 获取整个项目的state
     */
    get rootState(): Readonly<RootState> {
        return app.store.getState() as Readonly<RootState>;
    }

    setNavigationPrevented(isPrevented: boolean) {
        app.store.dispatch(navigationPreventionAction(isPrevented));
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
