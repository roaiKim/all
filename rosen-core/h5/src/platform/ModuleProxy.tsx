import React from "react";
import { RouteComponentProps } from "react-router";
import { Location } from "history";
import { app } from "../app";
import { ActionCreators, ActionHandler, executeAction } from "../module";
import { Module, ModuleLifecycleListener } from "./Module";

let startupModuleName: string | null = null;

function locationsAreEqual(a: Location, b: Location) {
    return a.pathname === b.pathname && a.search === b.search && a.hash === b.hash && a.key === b.key && a.state === b.state;
}

export const ModuleNameContext = React.createContext(null);

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
            private timer: number | undefined;
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
                const props = this.props as RouteComponentProps & P;
                const currentLocation = props.location;
                const currentRouteParams = props.match || null;
                // console.log("-componentDidUpdate-" + moduleName, prevProps, props);
                if (currentLocation && currentRouteParams && !locationsAreEqual(currentLocation, prevLocation) && this.hasOwnLifecycle("onLocationMatched")) {
                    const actionName = `${moduleName}/@@LOCATION_MATCHED`;
                    // const startTime = Date.now();
                    await executeAction(
                        actionName,
                        lifecycleListener.onLocationMatched.bind(lifecycleListener) as ActionHandler,
                        currentRouteParams,
                        currentLocation
                    );
                }
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
                const props = this.props as RouteComponentProps & P;

                const enterActionName = `${moduleName}/@@ENTER`;
                // const startTime = Date.now();
                await executeAction(enterActionName, lifecycleListener.onEnter.bind(lifecycleListener), props?.match, props?.location);

                if (this.hasOwnLifecycle("onLocationMatched")) {
                    if ("match" in props && "location" in props) {
                        const initialRenderActionName = `${moduleName}/@@LOCATION_MATCHED`;
                        // const startTime = Date.now();
                        await executeAction(
                            initialRenderActionName,
                            lifecycleListener.onLocationMatched.bind(lifecycleListener) as ActionHandler,
                            props.match,
                            props.location
                        );
                    }
                }

                if (this.hasOwnLifecycle("onTick")) {
                    const tickIntervalInMillisecond = (lifecycleListener.onTick.tickInterval || 5) * 1000;
                    const boundTicker = lifecycleListener.onTick.bind(lifecycleListener);
                    const tickActionName = `${moduleName}/@@TICK`;

                    // eslint-disable-next-line no-constant-condition
                    while (true) {
                        await executeAction(tickActionName, boundTicker);
                        this.tickCount++;
                        await new Promise((resolve, reject) => {
                            this.timer = setTimeout(resolve, tickIntervalInMillisecond) as any;
                        });
                    }
                }
            }

            override render() {
                return (
                    <ModuleNameContext.Provider value={moduleName}>
                        <ComponentType {...this.props} />
                    </ModuleNameContext.Provider>
                );
            }

            private hasOwnLifecycle = (methodName: keyof ModuleLifecycleListener): boolean => {
                return Object.prototype.hasOwnProperty.call(modulePrototype, methodName);
            };
        };
    }
}
