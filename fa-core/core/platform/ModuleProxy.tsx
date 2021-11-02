/* eslint-disable max-classes-per-file */
import React from "react";
import { app } from "../app";
import { executeAction, ActionCreators } from "../module";
import { setStateAction } from "../reducer";
import { Module, ModuleLifecycleListener } from "./Module";
import { RouteComponentProps } from "react-router";

export class ModuleProxy<M extends Module<{}>> {
    constructor(private module: M, private actions: ActionCreators<M>) {}

    getActions(): ActionCreators<M> {
        return this.actions;
    }

    connect<P extends object>(ComponentType: React.ComponentType<P>): React.ComponentType<P & RouteComponentProps> {
        const moduleName = this.module.name;
        const { initialState } = this.module;
        const lifecycleListener = this.module as ModuleLifecycleListener;
        const actions = this.actions as any;

        return class extends React.PureComponent<P & RouteComponentProps> {
            static displayName = `ModuleBoundary(${moduleName})`;

            constructor(props: P & RouteComponentProps) {
                super(props);
                this.initialLifecycle();
            }

            componentDidUpdate(prevProps: Readonly<P & RouteComponentProps>) {
                // onRender 在初始化中也会执行
                const prevLocation = prevProps.location;
                const { props } = this;
                const currentLocation = props.location;
                const currentRouteParams = props.match ? props.match.params : null;
                if (currentLocation && currentRouteParams && prevLocation !== currentLocation && lifecycleListener.onRender.isLifecycle) {
                    app.store.dispatch(actions.onRender(currentRouteParams, currentLocation));
                }
            }

            componentWillUnmount() {
                if (lifecycleListener.onDestroy.isLifecycle) {
                    app.store.dispatch(actions.onDestroy());
                }
                if (!config.retainStateOnLeave) {
                    app.store.dispatch(setStateAction(moduleName, initialState, `@@${moduleName}/@@reset`));
                }
            }

            async initialLifecycle() {
                const { props } = this;
                if (lifecycleListener.onRender.isLifecycle) {
                    if ("match" in props && "location" in props) {
                        await executeAction(lifecycleListener.onRender.bind(lifecycleListener), props.match.params, props.location);
                    } else {
                        await executeAction(lifecycleListener.onRender.bind(lifecycleListener), {}, app.browserHistory);
                    }
                }
            }

            render() {
                return <ComponentType {...this.props} />;
            }
        };
    }
}
