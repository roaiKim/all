/* eslint-disable max-classes-per-file */
import React from "react";
import { app } from "../app";
import { executeAction, ActionCreators, ActionHandler } from "../module";
import { setStateAction, navigationPreventionAction } from "../reducer";
import { Module, ModuleLifecycleListener } from "./Module";
import { RouteComponentProps } from "react-router";
import { Location } from "history";

let startupModuleName: string | null = null;

function locationsAreEqual(a: Location, b: Location) {
    return a.pathname === b.pathname && a.search === b.search && a.hash === b.hash && a.key === b.key && a.state === b.state;
}

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
                const prevLocation = (prevProps as any).location;
                const props = this.props as RouteComponentProps & P & { hidden: boolean };
                const currentLocation = props.location;
                const currentRouteParams = props.match || null;
                const hidden = props.hidden || null;
                // console.log("-componentDidUpdate-" + moduleName, prevProps, props);
                if (
                    !hidden &&
                    currentLocation &&
                    currentRouteParams &&
                    !locationsAreEqual(currentLocation, prevLocation) &&
                    this.hasOwnLifecycle("onLocationMatched")
                ) {
                    const actionName = `${moduleName}/@@LOCATION_MATCHED`;
                    const startTime = Date.now();
                    await executeAction(
                        actionName,
                        lifecycleListener.onLocationMatched.bind(lifecycleListener) as ActionHandler,
                        currentRouteParams,
                        currentLocation
                    );
                    app.store.dispatch(navigationPreventionAction(false));
                }
            }

            override componentWillUnmount() {
                if (this.hasOwnLifecycle("onDestroy")) {
                    app.store.dispatch(actions.onDestroy());
                }

                const currentLocation = (this.props as any).location;
                if (currentLocation) {
                    app.store.dispatch(navigationPreventionAction(false));
                }

                try {
                    this.timer && clearTimeout(this.timer);
                } catch {
                    //
                }
            }

            async initialLifecycle() {
                const props = this.props as RouteComponentProps & P & { hidden: boolean };

                const enterActionName = `${moduleName}/@@ENTER`;
                const startTime = Date.now();
                await executeAction(enterActionName, lifecycleListener.onEnter.bind(lifecycleListener), props?.match, props.location);

                if (this.hasOwnLifecycle("onLocationMatched")) {
                    if ("match" in props && "location" in props && "hidden" in props) {
                        const initialRenderActionName = `${moduleName}/@@LOCATION_MATCHED`;
                        const startTime = Date.now();
                        await executeAction(
                            initialRenderActionName,
                            lifecycleListener.onLocationMatched.bind(lifecycleListener) as ActionHandler,
                            props.match,
                            props.location
                        );
                    } else {
                        console.error(`模块 [${moduleName}] 不支持 onLocationMatched() 方法, 使用 onEnter() 代替 onLocationMatched()`);
                    }
                }

                if (moduleName === startupModuleName) {
                    createStartupPerformanceLog(`${moduleName}/@@STARTUP_PERF`);
                }

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

function createStartupPerformanceLog(actionName: string): void {
    if (window.performance && performance.timing) {
        // https://www.w3.org/blog/2012/09/performance-timing-information/
        const now = Date.now();
        const perfTiming = performance.timing;
        const baseTime = perfTiming.navigationStart;
        const duration = now - baseTime;
        const stats: { [key: string]: number } = {};

        const createStat = (key: string, timeStamp: number) => {
            if (timeStamp >= baseTime) {
                stats[key] = timeStamp - baseTime;
            }
        };

        createStat("http_start", perfTiming.requestStart);
        createStat("http_end", perfTiming.responseEnd);
        createStat("dom_start", perfTiming.domLoading);
        createStat("dom_content", perfTiming.domContentLoadedEventEnd);
        createStat("dom_end", perfTiming.loadEventEnd);

        const slowStartupThreshold = app.loggerConfig?.slowStartupThresholdInSecond || 5;
        if (duration / 1000 >= slowStartupThreshold) {
            // app.logger.warn({
            //     action: actionName,
            //     elapsedTime: duration,
            //     stats,
            //     errorCode: "SLOW_STARTUP",
            //     errorMessage: `Startup took ${(duration / 1000).toFixed(2)} sec, longer than ${slowStartupThreshold}`,
            // });
        } else {
            // app.logger.info({
            //     action: actionName,
            //     elapsedTime: duration,
            //     stats,
            // });
        }
    }
}
