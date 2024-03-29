/* eslint-disable max-classes-per-file */
import { getCurrentInstance } from "@tarojs/taro";
import React from "react";
import { app } from "../app";
import { executeAction, ActionCreators } from "../module";
import { setStateAction } from "../reducer";
import { Module, ModuleLifecycleListener } from "./Module";

let startupModuleName: string | null = null;
const calcpageName = (path) => {
    return new RegExp("(?<pageName>[a-zA-Z]+?$)").exec(path)?.groups.pageName;
};

export class ModuleProxy<M extends Module<any, any>> {
    constructor(private module: M, private actions: ActionCreators<M>) {}

    getActions(): ActionCreators<M> {
        return this.actions;
    }

    connect<P extends object>(ComponentType: React.ComponentType<P>): React.ComponentType<P> {
        const moduleName = this.module.name;
        const { initialState } = this.module;
        const lifecycleListener = this.module as ModuleLifecycleListener;
        const modulePrototype = Object.getPrototypeOf(lifecycleListener);
        const actions = this.actions as any;

        return class extends React.PureComponent<P> {
            static displayName = `Module[${moduleName}]`;
            private tickCount = 0;
            private timer: number | undefined;
            private pageInstance: any = getCurrentInstance();

            constructor(props: P) {
                super(props);
                if (!startupModuleName) {
                    startupModuleName = moduleName;
                }
            }

            override componentDidMount() {
                const { params, path } = this.pageInstance.router || {};
                const pageName = calcpageName(path);
                // this.validateAuth();
                this.initialLifecycle(params, pageName);
            }

            override async componentDidUpdate(prevProps: Readonly<P>) {
                // 小程序 跳转到当前页貌似 不走 DidUpdate
                console.log(`${moduleName} DidUpdate`);
            }

            override componentWillUnmount() {
                if (this.hasOwnLifecycle("onDestroy")) {
                    const { path } = this.pageInstance.router || {};
                    const pageName = calcpageName(path);
                    app.store.dispatch(actions.onDestroy(pageName));
                    // 不想清空走这个逻辑
                    if (!lifecycleListener.onDestroy.keep) {
                        app.store.dispatch(setStateAction(moduleName, initialState, `@@${moduleName}/@@reset`));
                    }
                } else {
                    // 模块卸载默认清空 Module State
                    app.store.dispatch(setStateAction(moduleName, initialState, `@@${moduleName}/@@reset`));
                }

                try {
                    this.timer && clearTimeout(this.timer);
                } catch {
                    //
                }
            }

            componentDidShow() {
                if (this.hasOwnLifecycle("onShow")) {
                    const enterActionName = `${moduleName}/@@SHOW`;
                    const { params, path } = this.pageInstance.router || {};
                    const pageName = calcpageName(path);
                    executeAction(enterActionName, lifecycleListener.onShow.bind(lifecycleListener, params, pageName));
                }
            }

            componentDidHide() {
                if (this.hasOwnLifecycle("onHide")) {
                    const enterActionName = `${moduleName}/@@HIDE`;
                    const { params, path } = this.pageInstance.router || {};
                    const pageName = calcpageName(path);
                    executeAction(enterActionName, lifecycleListener.onHide.bind(lifecycleListener, params, pageName));
                }
            }

            async initialLifecycle(params: Record<string, any> | undefined, pageName: string | undefined) {
                const enterActionName = `${moduleName}/@@ENTER`;

                await executeAction(enterActionName, lifecycleListener.onEnter.bind(lifecycleListener, params, pageName));

                if (this.hasOwnLifecycle("onTick")) {
                    const tickIntervalInMillisecond = (lifecycleListener.onTick.tickInterval || 5) * 1000;
                    const boundTicker = lifecycleListener.onTick.bind(lifecycleListener);
                    const tickActionName = `${moduleName}/@@TICK`;

                    // eslint-disable-next-line no-constant-condition
                    while (true) {
                        await executeAction(tickActionName, boundTicker);
                        this.tickCount++;
                        await new Promise((resolve, reject) => {
                            this.timer = setTimeout(resolve, tickIntervalInMillisecond);
                        });
                        if (this.tickCount > 50) {
                            break;
                        }
                    }
                }
            }

            override render() {
                return <ComponentType {...this.props} />;
            }

            private hasOwnLifecycle = (methodName: keyof ModuleLifecycleListener): boolean => {
                return Object.prototype.hasOwnProperty.call(modulePrototype, methodName);
            };
        };
    }
}
