import React, { useCallback, useEffect } from "react";
import { useLocation, useMatch, useParams } from "react-router";
import type { Location } from "history";
// import type { RouteComponentProps } from "react-router";
// import type { Task } from "redux-saga";
// import { call, call as rawCall, cancel, delay, fork, put, select, take } from "redux-saga/effects";
import { StartupModulePerformanceLogger } from "./StartupModulePerformanceLogger";
import { app } from "../../app";
import { type ActionCreators, executeAction } from "../../module";
import { IDLE_STATE_ACTION, navigationPreventionAction, type State } from "../../reducer";
import { Module, type ModuleLifecycleListener } from "../Module";

function hasOwnLifecycle<P, M>(
    modulePrototype: React.ComponentType<P & { actions: ActionCreators<M> }>,
    methodName: keyof ModuleLifecycleListener
): boolean {
    return Object.prototype.hasOwnProperty.call(modulePrototype, methodName);
}

export class ModuleProxy<M extends Module<any, any>> {
    constructor(
        private module: M,
        private actions: ActionCreators<M>,
        private moduleName: string
    ) {}

    getActions(): ActionCreators<M> {
        return this.actions;
    }

    connect<P extends object>(ComponentType: React.ComponentType<P & { actions: ActionCreators<M> }>): React.ComponentType<P> {
        const moduleName = this.module.name as string;
        const lifecycleListener = this.module as ModuleLifecycleListener;
        const modulePrototype = Object.getPrototypeOf(lifecycleListener);

        const actions = this.actions as any;

        return function (props) {
            const location = useLocation();
            const params = useParams();
            console.log("-params--f-f-", params);
            useEffect(() => {
                StartupModulePerformanceLogger.registerIfNotExist(moduleName);
            }, []);

            const onTickWatcher = useCallback(async () => {
                // let runningIntervalTask: Task = yield fork(this.onTickSaga.bind(this));
                // while (true) {
                //     yield take(IDLE_STATE_ACTION);
                //     yield cancel(runningIntervalTask); // no-op if already cancelled
                //     const isActive: boolean = yield select((state: State) => state.idle.state === "active");
                //     if (isActive) {
                //         runningIntervalTask = yield fork(this.onTickSaga.bind(this));
                //     }
                // }
                const tickIntervalInMillisecond = (lifecycleListener.onTick.tickInterval || 5) * 1000;
                const boundTicker = lifecycleListener.onTick.bind(lifecycleListener);
                const tickActionName = `${moduleName}/@@TICK`;

                // while (true) {
                //     await executeAction(tickActionName, boundTicker);
                //     this.tickCount++;
                //     await new Promise((resolve, reject) => {
                //         this.timer = setTimeout(resolve, tickIntervalInMillisecond);
                //     });
                // }
            }, []);

            const lifecycle = useCallback(async function () {
                /**
                 * CAVEAT:
                 * Do not use <yield* executeAction> for lifecycle actions.
                 * It will lead to cancellation issue, which cannot stop the lifecycleSaga as expected.
                 *
                 * https://github.com/redux-saga/redux-saga/issues/1986
                 */
                // const props = this.props as RouteComponentProps & P;

                const enterActionName = `${moduleName}/@@ENTER`;
                const startTime = Date.now();

                await executeAction(enterActionName, lifecycleListener.onEnter.bind(lifecycleListener), params, location);

                app.logger.info({
                    action: enterActionName,
                    elapsedTime: Date.now() - startTime,
                    info: {
                        component_props: JSON.stringify(props),
                    },
                });

                if (hasOwnLifecycle(modulePrototype, "onLocationMatched")) {
                    if ("match" in props && "location" in props) {
                        const initialRenderActionName = `${moduleName}/@@LOCATION_MATCHED`;
                        const startTime = Date.now();

                        executeAction(initialRenderActionName, lifecycleListener.onLocationMatched.bind(lifecycleListener), params, location);

                        app.logger.info({
                            action: initialRenderActionName,
                            elapsedTime: Date.now() - startTime,
                            info: {
                                route_params: JSON.stringify(params),
                                history_state: JSON.stringify(location.state),
                            },
                        });
                    } else {
                        console.error(`[framework] Module component [${moduleName}] is non-route, use onEnter() instead of onLocationMatched()`);
                    }
                }

                StartupModulePerformanceLogger.log(moduleName);

                if (hasOwnLifecycle(modulePrototype, "onTick")) {
                    // yield rawCall(this.onTickWatcherSaga.bind(this));
                }
            }, []);

            useEffect(() => {
                lifecycle();
            }, []);

            return <ComponentType actions={actions} {...props} />;
        };
    }
}
