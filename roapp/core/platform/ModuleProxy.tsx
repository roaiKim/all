/* eslint-disable max-classes-per-file */
import React from "react";
import { app } from "../app";
import { executeAction, ActionCreators } from "../module";
import { Module, ModuleLifecycleListener } from "./Module";

let startupModuleName: string | null = null;

export class ModuleProxy<M extends Module<any, any>> {
    constructor(private module: M, private actions: ActionCreators<M>) {}

    getActions(): ActionCreators<M> {
        return this.actions;
    }

    connect<P extends object>(ComponentType: React.ComponentType<P>): React.ComponentType<P> {
        const moduleName = this.module.name;
        const lifecycleListener = this.module as ModuleLifecycleListener;
        const modulePrototype = Object.getPrototypeOf(lifecycleListener);
        const actions = this.actions as any;

        return class extends React.PureComponent<P> {
            static displayName = `Module[${moduleName}]`;
            private tickCount: number = 0;
            private timer: NodeJS.Timeout | undefined;
            constructor(props: P) {
                super(props);
                if (!startupModuleName) {
                    startupModuleName = moduleName;
                }
            }

            override componentDidMount() {
                this.initialLifecycle();
            }

            override async componentDidUpdate(prevProps: Readonly<P>) {
                //
            }

            override componentWillUnmount() {
                if (this.hasOwnLifecycle("onDestroy")) {
                    app.store.dispatch(actions.onDestroy());
                }

                try {
                    this.timer && clearTimeout(this.timer);
                } catch {
                    //
                }
            }

            async initialLifecycle() {
                const enterActionName = `${moduleName}/@@ENTER`;

                await executeAction(enterActionName, lifecycleListener.onEnter.bind(lifecycleListener));

                if (this.hasOwnLifecycle("onTick")) {
                    const tickIntervalInMillisecond = (lifecycleListener.onTick.tickInterval || 5) * 1000;
                    const boundTicker = lifecycleListener.onTick.bind(lifecycleListener);
                    const tickActionName = `${moduleName}/@@TICK`;

                    while (true) {
                        await executeAction(tickActionName, boundTicker);
                        this.tickCount++;
                        await new Promise((resolve, reject) => {
                            this.timer = setTimeout(resolve, tickIntervalInMillisecond);
                        });
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
