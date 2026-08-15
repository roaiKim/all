import React from "react";
import { type Params, UNSAFE_LocationContext, UNSAFE_RouteContext } from "react-router";
import type { Location } from "history";
import { StartupModulePerformanceLogger } from "./StartupModulePerformanceLogger";
import { app } from "../../app";
import { type ActionCreators, executeAction } from "../../module";
import { navigationPreventionAction, type State } from "../../reducer";
import { stringifyWithMask } from "../../util/json-util";
import { Module, type ModuleLifecycleListener } from "../Module";

export interface ResolvedRouteState {
    isRouteComponent: boolean;
    location: Location | null;
    params: Params<string>;
}

interface CancelableTask {
    cancel: () => void;
}

const MAX_LOG_LENGTH = 2000;

function areLocationsEqual(a: Location, b: Location): boolean {
    return a.pathname === b.pathname && a.search === b.search && a.hash === b.hash && a.key === b.key && a.state === b.state;
}

function stringifySafely(...values: unknown[]): string | undefined {
    try {
        const serialized = stringifyWithMask(app.loggerConfig?.maskedKeywords || [], "***", ...values);
        if (!serialized) {
            return undefined;
        }

        return serialized.length > MAX_LOG_LENGTH ? `${serialized.slice(0, MAX_LOG_LENGTH)}...[truncated]` : serialized;
    } catch {
        return '"[Unserializable]"';
    }
}

function useResolvedRouteState(): ResolvedRouteState {
    const locationContext = React.useContext(UNSAFE_LocationContext);
    const routeContext = React.useContext(UNSAFE_RouteContext);
    const matches = routeContext?.matches ?? [];
    const currentMatch = matches.length > 0 ? matches[matches.length - 1] : null;

    return React.useMemo(
        () => ({
            isRouteComponent: matches.length > 0,
            location: (locationContext?.location ?? null) as Location | null,
            params: (currentMatch?.params ?? {}) as Params<string>,
        }),
        [currentMatch, locationContext?.location, matches.length]
    );
}

function createLegacyLifecycleProps<P extends object>(
    props: P,
    routeState: ResolvedRouteState
): P & { location?: Location; match?: { params: Params<string> } } {
    if (!routeState.location) {
        return props;
    }

    return {
        ...props,
        location: routeState.location,
        match: routeState.isRouteComponent ? { params: routeState.params } : undefined,
    };
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

    connect<P extends object>(ComponentType: React.ComponentType<P>): React.ComponentType<P> {
        return this.attachLifecycle(ComponentType);
    }

    attachLifecycle<P extends object>(ComponentType: React.ComponentType<P>): React.ComponentType<P> {
        const moduleName = this.moduleName;
        const lifecycleListener = this.module as ModuleLifecycleListener;
        const modulePrototype = Object.getPrototypeOf(lifecycleListener);
        const actions = this.actions as any;
        const WrappedComponent = ComponentType as React.ComponentType<P & { actions: ActionCreators<M> }>;

        const ModuleWrapper: React.FC<P> = (props) => {
            const routeState = useResolvedRouteState();
            const mountedTimeRef = React.useRef(Date.now());
            const tickCountRef = React.useRef(0);
            const routeStateRef = React.useRef(routeState);
            const tickTaskRef = React.useRef<CancelableTask | null>(null);
            const initializedRef = React.useRef(false);
            const disposedRef = React.useRef(false);
            const lastMatchedLocationRef = React.useRef<Location | null>(null);
            const pendingLocationRef = React.useRef<ResolvedRouteState | null>(null);
            const locationRunnerActiveRef = React.useRef(false);

            routeStateRef.current = routeState;

            React.useEffect(() => {
                StartupModulePerformanceLogger.registerIfNotExist(moduleName);
            }, []);

            const hasOwnLifecycle = React.useCallback(
                (methodName: keyof ModuleLifecycleListener): boolean => Object.prototype.hasOwnProperty.call(modulePrototype, methodName),
                [modulePrototype]
            );

            const runLocationMatched = React.useCallback(
                async (nextRouteState: ResolvedRouteState): Promise<boolean> => {
                    if (!hasOwnLifecycle("onLocationMatched")) {
                        return false;
                    }

                    if (!nextRouteState.isRouteComponent || !nextRouteState.location) {
                        return false;
                    }

                    if (lastMatchedLocationRef.current && areLocationsEqual(nextRouteState.location, lastMatchedLocationRef.current)) {
                        return false;
                    }

                    app.store.dispatch({ type: `@@${moduleName}/@@cancel-saga` });

                    const action = `${moduleName}/@@LOCATION_MATCHED`;
                    const startTime = Date.now();
                    await executeAction(
                        action,
                        lifecycleListener.onLocationMatched.bind(lifecycleListener),
                        nextRouteState.params,
                        nextRouteState.location
                    );

                    if (disposedRef.current) {
                        return false;
                    }

                    lastMatchedLocationRef.current = nextRouteState.location;
                    app.logger.info({
                        action,
                        elapsedTime: Date.now() - startTime,
                        info: {
                            route_params: stringifySafely(nextRouteState.params),
                            history_state: stringifySafely(nextRouteState.location.state),
                        },
                    });
                    app.store.dispatch(navigationPreventionAction(false));
                    return true;
                },
                [hasOwnLifecycle, lifecycleListener, moduleName]
            );

            const enqueueLocationMatched = React.useCallback(
                (nextRouteState: ResolvedRouteState) => {
                    if (!hasOwnLifecycle("onLocationMatched")) {
                        return;
                    }

                    if (!nextRouteState.isRouteComponent || !nextRouteState.location) {
                        return;
                    }

                    if (lastMatchedLocationRef.current && areLocationsEqual(nextRouteState.location, lastMatchedLocationRef.current)) {
                        return;
                    }

                    if (pendingLocationRef.current?.location && areLocationsEqual(nextRouteState.location, pendingLocationRef.current.location)) {
                        return;
                    }

                    pendingLocationRef.current = nextRouteState;
                    if (locationRunnerActiveRef.current) {
                        return;
                    }

                    locationRunnerActiveRef.current = true;
                    void (async () => {
                        try {
                            while (!disposedRef.current && pendingLocationRef.current) {
                                const currentRouteState = pendingLocationRef.current;
                                pendingLocationRef.current = null;
                                await runLocationMatched(currentRouteState);
                            }
                        } finally {
                            locationRunnerActiveRef.current = false;
                            if (!disposedRef.current && pendingLocationRef.current) {
                                enqueueLocationMatched(pendingLocationRef.current);
                            }
                        }
                    })();
                },
                [hasOwnLifecycle, runLocationMatched]
            );

            React.useEffect(() => {
                disposedRef.current = false;
                const controller = new AbortController();
                const signal = controller.signal;
                const initialRouteState = routeState;

                const logAction = (action: string, startTime: number, info?: Record<string, string>) => {
                    if (signal.aborted) {
                        return;
                    }

                    app.logger.info({
                        action,
                        elapsedTime: Date.now() - startTime,
                        ...(info ? { info } : {}),
                    });
                };

                const runEnterLifecycle = async () => {
                    const legacyLifecycleProps = createLegacyLifecycleProps(props, initialRouteState);
                    const enterActionName = `${moduleName}/@@ENTER`;
                    const startTime = Date.now();
                    const onEnterArgs =
                        lifecycleListener.onEnter.length <= 1
                            ? [legacyLifecycleProps]
                            : [initialRouteState.params, initialRouteState.location as Location];

                    await executeAction(enterActionName, lifecycleListener.onEnter.bind(lifecycleListener), ...onEnterArgs);
                    const componentProps = stringifySafely(legacyLifecycleProps);
                    logAction(enterActionName, startTime, componentProps ? { component_props: componentProps } : undefined);
                };

                const startTickTask = () => {
                    if (!hasOwnLifecycle("onTick")) {
                        return;
                    }

                    const tickIntervalInMillisecond = (lifecycleListener.onTick.tickInterval || 5) * 1000;
                    const boundTicker = lifecycleListener.onTick.bind(lifecycleListener);
                    const tickActionName = `${moduleName}/@@TICK`;
                    const tickController = new AbortController();
                    const tickSignal = tickController.signal;
                    let timerId: ReturnType<typeof window.setTimeout> | null = null;
                    let running = false;
                    let idleState = (app.store.getState() as State).idle.state;

                    const clearTimer = () => {
                        if (timerId !== null) {
                            window.clearTimeout(timerId);
                            timerId = null;
                        }
                    };

                    function scheduleTick(delayInMillisecond: number) {
                        if (tickSignal.aborted || idleState !== "active" || running || timerId !== null) {
                            return;
                        }

                        timerId = window.setTimeout(() => {
                            timerId = null;
                            void runTick();
                        }, delayInMillisecond);
                    }

                    async function runTick() {
                        if (tickSignal.aborted || idleState !== "active" || running) {
                            return;
                        }

                        running = true;
                        try {
                            await executeAction(tickActionName, boundTicker);
                            if (!tickSignal.aborted) {
                                tickCountRef.current += 1;
                            }
                        } finally {
                            running = false;
                            if (!tickSignal.aborted && idleState === "active") {
                                scheduleTick(tickIntervalInMillisecond);
                            }
                        }
                    }

                    const unsubscribe = app.store.subscribe(() => {
                        const nextIdleState = (app.store.getState() as State).idle.state;
                        if (nextIdleState === idleState) {
                            return;
                        }

                        idleState = nextIdleState;
                        clearTimer();

                        if (idleState === "active" && !running) {
                            scheduleTick(0);
                        }
                    });

                    void runTick();

                    tickTaskRef.current = {
                        cancel: () => {
                            tickController.abort();
                            clearTimer();
                            unsubscribe();
                        },
                    };
                };

                void (async () => {
                    await runEnterLifecycle();
                    if (signal.aborted || disposedRef.current) {
                        return;
                    }

                    if (hasOwnLifecycle("onLocationMatched")) {
                        const currentRouteState = routeStateRef.current;
                        if (!currentRouteState.isRouteComponent || !currentRouteState.location) {
                            console.error(`[framework] Module component [${moduleName}] is non-route, use onEnter() instead of onLocationMatched()`);
                        } else {
                            await runLocationMatched(currentRouteState);
                        }
                    }

                    if (signal.aborted || disposedRef.current) {
                        return;
                    }

                    StartupModulePerformanceLogger.log(moduleName);
                    initializedRef.current = true;
                    startTickTask();

                    if (
                        routeStateRef.current.isRouteComponent &&
                        routeStateRef.current.location &&
                        (!lastMatchedLocationRef.current || !areLocationsEqual(routeStateRef.current.location, lastMatchedLocationRef.current))
                    ) {
                        enqueueLocationMatched(routeStateRef.current);
                    }
                })();

                return () => {
                    controller.abort();
                    disposedRef.current = true;
                    pendingLocationRef.current = null;

                    if (hasOwnLifecycle("onDestroy")) {
                        app.store.dispatch(actions.onDestroy());
                    }

                    if (routeStateRef.current.location) {
                        app.store.dispatch(navigationPreventionAction(false));
                    }

                    app.store.dispatch({ type: `@@${moduleName}/@@cancel-saga` });

                    app.logger.info({
                        action: `${moduleName}/@@DESTROY`,
                        stats: {
                            tick_count: tickCountRef.current,
                            staying_second: (Date.now() - mountedTimeRef.current) / 1000,
                        },
                    });

                    tickTaskRef.current?.cancel();
                };
            }, []);

            React.useEffect(() => {
                if (!initializedRef.current || !hasOwnLifecycle("onLocationMatched") || !routeState.isRouteComponent || !routeState.location) {
                    return;
                }

                enqueueLocationMatched(routeState);
            }, [enqueueLocationMatched, hasOwnLifecycle, routeState]);

            return <WrappedComponent {...props} actions={actions} />;
        };

        ModuleWrapper.displayName = `Module[${moduleName}]`;

        return ModuleWrapper;
    }
}
