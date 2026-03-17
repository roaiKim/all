import React, { useCallback, useEffect, useRef, useState } from "react";
import type { Location } from "history";
import type { RouteComponentProps } from "react-router";
import { StartupModulePerformanceLogger } from "./StartupModulePerformanceLogger";
import { app } from "../../app";
import { type ActionCreators, executeAction } from "../../module";
import { IDLE_STATE_ACTION, navigationPreventionAction, type State } from "../../reducer";
import { Module, type ModuleLifecycleListener } from "../Module";

// 自定义任务类型（替代 redux-saga 的 Task）
interface CustomTask {
    cancel: () => void;
}

// 工具函数：替代 saga 的 delay
const delay = (ms: number, signal?: AbortSignal): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (signal?.aborted) {
            reject(new Error("Task aborted"));
            return;
        }

        const timer = setTimeout(resolve, ms);
        signal?.addEventListener("abort", () => {
            clearTimeout(timer);
            reject(new Error("Task aborted"));
        });
    });
};

// 工具函数：监听 redux action（替代 saga 的 take）
const takeAction = (actionType: string): Promise<unknown> => {
    return new Promise((resolve) => {
        const unsubscribe = app.store.subscribe(() => {
            const action = app.store.getState().lastAction; // 需确保 store 记录最后触发的 action
            if (action?.type === actionType) {
                unsubscribe();
                resolve(action);
            }
        });
    });
};

export class ModuleProxy<M extends Module<any, any>> {
    constructor(
        private module: M,
        private actions: ActionCreators<M>,
        private moduleName: string
    ) {}

    getActions(): ActionCreators<M> {
        return this.actions;
    }

    attachLifecycle<P extends object>(ComponentType: React.ComponentType<P & { actions: ActionCreators<M> }>): React.ComponentType<P> {
        const moduleName = this.module.name as string;
        const lifecycleListener = this.module as ModuleLifecycleListener;
        const modulePrototype = Object.getPrototypeOf(lifecycleListener);
        const actions = this.actions as any;

        // 定义 Function 组件
        const ModuleWrapper: React.FC<P> = (props) => {
            // 保存自定义任务（替代 saga Task）
            const lifecycleTaskRef = useRef<CustomTask | null>(null);
            const lastDidUpdateTaskRef = useRef<CustomTask | null>(null);
            const tickTaskRef = useRef<{
                intervalId: NodeJS.Timeout | null;
                abortController: AbortController | null;
            }>({ intervalId: null, abortController: null });

            // 响应式状态
            const [tickCount, setTickCount] = useState<number>(0);

            // 挂载时间
            const mountedTimeRef = useRef<number>(Date.now());

            // 对比两个 Location 是否相等
            const areLocationsEqual = useCallback((a: Location, b: Location): boolean => {
                return a.pathname === b.pathname && a.search === b.search && a.hash === b.hash && a.key === b.key && a.state === b.state;
            }, []);

            // 检查是否有自定义生命周期方法
            const hasOwnLifecycle = useCallback((methodName: keyof ModuleLifecycleListener): boolean => {
                return Object.prototype.hasOwnProperty.call(modulePrototype, methodName);
            }, []);

            // 初始化
            useEffect(() => {
                StartupModulePerformanceLogger.registerIfNotExist(moduleName);
            }, []);

            // 组件挂载：替代 componentDidMount + lifecycleSaga
            useEffect(() => {
                // 执行 onEnter 生命周期
                const executeOnEnter = async () => {
                    const routeProps = props as RouteComponentProps & P;
                    const enterActionName = `${moduleName}/@@ENTER`;
                    const startTime = Date.now();

                    try {
                        // 替代 rawCall(executeAction)
                        await executeAction(enterActionName, lifecycleListener.onEnter.bind(lifecycleListener), routeProps);
                        app.logger.info({
                            action: enterActionName,
                            elapsedTime: Date.now() - startTime,
                            info: {
                                component_props: JSON.stringify(routeProps),
                            },
                        });
                    } catch (e) {
                        app.logger.error(`[${enterActionName}] execution failed`, e);
                    }

                    // 执行初始 onLocationMatched
                    if (hasOwnLifecycle("onLocationMatched")) {
                        if ("match" in routeProps && "location" in routeProps) {
                            const initialRenderActionName = `${moduleName}/@@LOCATION_MATCHED`;
                            const startTime = Date.now();
                            const routeParams = routeProps.match.params;

                            try {
                                await executeAction(
                                    initialRenderActionName,
                                    lifecycleListener.onLocationMatched.bind(lifecycleListener),
                                    routeParams,
                                    routeProps.location
                                );
                                app.logger.info({
                                    action: initialRenderActionName,
                                    elapsedTime: Date.now() - startTime,
                                    info: {
                                        route_params: JSON.stringify(routeProps.match.params),
                                        history_state: JSON.stringify(routeProps.location.state),
                                    },
                                });
                            } catch (e) {
                                app.logger.error(`[${initialRenderActionName}] execution failed`, e);
                            }
                        } else {
                            console.error(`[framework] Module component [${moduleName}] is non-route, use onEnter() instead of onLocationMatched()`);
                        }
                    }

                    StartupModulePerformanceLogger.log(moduleName);

                    // 启动 onTick 定时任务（替代 onTickWatcherSaga + onTickSaga）
                    if (hasOwnLifecycle("onTick")) {
                        await startTickTask();
                    }
                };

                // 启动 tick 定时任务（支持 idle 状态暂停/恢复）
                const startTickTask = async () => {
                    // 清理旧任务
                    stopTickTask();

                    const abortController = new AbortController();
                    tickTaskRef.current.abortController = abortController;
                    const signal = abortController.signal;

                    // 替代 onTickWatcherSaga 的 idle 监听逻辑
                    const watchIdleState = async () => {
                        while (!signal.aborted) {
                            try {
                                // 替代 take(IDLE_STATE_ACTION)
                                await takeAction(IDLE_STATE_ACTION);

                                // 停止当前 tick 任务
                                if (tickTaskRef.current.intervalId) {
                                    clearInterval(tickTaskRef.current.intervalId);
                                    tickTaskRef.current.intervalId = null;
                                }

                                // 替代 select 获取状态
                                const state = app.store.getState() as State;
                                const isActive = state.idle.state === "active";

                                // 恢复 tick 任务
                                if (isActive) {
                                    startTickInterval(signal);
                                }
                            } catch (e) {
                                if (e instanceof Error && e.message !== "Task aborted") {
                                    app.logger.error("Idle state watch error", e);
                                }
                            }
                        }
                    };

                    // 启动 tick 定时器（替代 onTickSaga）
                    const startTickInterval = (signal: AbortSignal) => {
                        if (tickTaskRef.current.intervalId) return;

                        const tickIntervalInMillisecond = (lifecycleListener.onTick.tickInterval || 5) * 1000;
                        const boundTicker = lifecycleListener.onTick.bind(lifecycleListener);
                        const tickActionName = `${moduleName}/@@TICK`;

                        // 立即执行一次
                        executeTick();

                        // 设置定时器
                        const intervalId = setInterval(executeTick, tickIntervalInMillisecond);
                        tickTaskRef.current.intervalId = intervalId;

                        // 执行单次 tick
                        async function executeTick() {
                            if (signal.aborted) return;

                            try {
                                await executeAction(tickActionName, boundTicker);
                                setTickCount((prev) => prev + 1);
                            } catch (e) {
                                app.logger.error(`[${tickActionName}] execution failed`, e);
                            }
                        }
                    };

                    // 启动 idle 监听和 tick 定时器
                    startTickInterval(signal);
                    watchIdleState();

                    // 定义取消方法
                    tickTaskRef.current.cancel = () => {
                        abortController.abort();
                        stopTickTask();
                    };
                };

                // 停止 tick 任务
                const stopTickTask = () => {
                    if (tickTaskRef.current.intervalId) {
                        clearInterval(tickTaskRef.current.intervalId);
                        tickTaskRef.current.intervalId = null;
                    }
                    tickTaskRef.current.abortController?.abort();
                    tickTaskRef.current.abortController = null;
                };

                // 执行挂载逻辑
                const controller = new AbortController();
                executeOnEnter().catch((e) => {
                    if (e instanceof Error && e.message !== "Task aborted") {
                        app.logger.error("Lifecycle execution failed", e);
                    }
                });

                // 定义自定义任务（替代 saga Task）
                lifecycleTaskRef.current = {
                    cancel: () => {
                        controller.abort();
                        stopTickTask();
                    },
                };

                // 组件卸载清理
                return () => {
                    // 触发 onDestroy
                    if (hasOwnLifecycle("onDestroy")) {
                        app.store.dispatch(actions.onDestroy());
                    }

                    // 取消导航阻止
                    const currentLocation = (props as any).location;
                    if (currentLocation) {
                        app.store.dispatch(navigationPreventionAction(false));
                    }

                    // 触发 saga cancel action（保留原有逻辑兼容）
                    app.store.dispatch({ type: `@@${moduleName}/@@cancel-saga` });

                    // 记录日志
                    app.logger.info({
                        action: `${moduleName}/@@DESTROY`,
                        stats: {
                            tick_count: tickCount,
                            staying_second: (Date.now() - mountedTimeRef.current) / 1000,
                        },
                    });

                    // 取消所有任务
                    try {
                        lastDidUpdateTaskRef.current?.cancel();
                        lifecycleTaskRef.current?.cancel();
                        stopTickTask();
                    } catch (e) {
                        app.logger.warn("Task cancellation error", e);
                    }
                };
            }, []);

            // 组件更新：替代 componentDidUpdate
            useEffect(() => {
                const prevPropsRef = useRef<P | null>(null);

                // 首次渲染不执行
                if (prevPropsRef.current === null) {
                    prevPropsRef.current = props;
                    return;
                }

                const prevProps = prevPropsRef.current;
                const currentProps = props as RouteComponentProps & P;
                const prevLocation = (prevProps as any).location;
                const currentLocation = currentProps.location;
                const currentRouteParams = currentProps.match ? currentProps.match.params : null;

                // 检查是否需要触发 onLocationMatched
                if (
                    currentLocation &&
                    currentRouteParams &&
                    !areLocationsEqual(currentLocation, prevLocation) &&
                    hasOwnLifecycle("onLocationMatched")
                ) {
                    // 取消旧任务
                    try {
                        lastDidUpdateTaskRef.current?.cancel();
                    } catch (e) {
                        app.logger.warn("Task cancellation error", e);
                    }

                    // 执行 onLocationMatched
                    const executeLocationMatched = async () => {
                        // 触发 cancel action
                        app.store.dispatch({ type: `@@${moduleName}/@@cancel-saga` });
                        const action = `${moduleName}/@@LOCATION_MATCHED`;
                        const startTime = Date.now();

                        try {
                            await executeAction(
                                action,
                                lifecycleListener.onLocationMatched.bind(lifecycleListener),
                                currentRouteParams,
                                currentLocation
                            );
                            app.logger.info({
                                action,
                                elapsedTime: Date.now() - startTime,
                                info: {
                                    route_params: JSON.stringify(currentRouteParams),
                                    history_state: JSON.stringify(currentLocation.state),
                                },
                            });
                        } catch (e) {
                            app.logger.error(`[${action}] execution failed`, e);
                        }
                    };

                    // 创建新任务
                    const controller = new AbortController();
                    executeLocationMatched();

                    lastDidUpdateTaskRef.current = {
                        cancel: () => controller.abort(),
                    };

                    app.store.dispatch(navigationPreventionAction(false));
                }

                // 更新前一次 props
                prevPropsRef.current = props;
            }, [props]);

            // 渲染组件
            return <ComponentType {...props} actions={actions} />;
        };

        // 设置 displayName
        ModuleWrapper.displayName = `Module[${moduleName}]`;

        return ModuleWrapper;
    }
}
