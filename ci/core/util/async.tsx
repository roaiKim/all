import React from "react";
import { captureError } from "./error-util";
import { app } from "../app";
import { loadingAction } from "../reducer";

export type ReactComponentKeyOf<T> = { [P in keyof T]: T[P] extends React.ComponentType<any> ? P : never }[keyof T];

export interface AsyncOptions {
    loadingIdentifier?: string;
    LoadingComponent?: React.ComponentType;
    ErrorComponent?: React.ComponentType<AsyncErrorComponentProps>;
}

export interface AsyncErrorComponentProps {
    error: unknown;
    reload: () => Promise<void>;
}

interface WrapperComponentState {
    Component: React.ComponentType<any> | null;
    error: unknown | null;
}

export function async<T, K extends ReactComponentKeyOf<T>>(
    resolve: () => Promise<T>,
    component: K,
    { LoadingComponent, loadingIdentifier = "pageloading", ErrorComponent }: AsyncOptions = {}
): T[K] {
    return class AsyncWrapperComponent extends React.PureComponent<{}, WrapperComponentState> {
        private timeOut = null;

        constructor(props: {}) {
            super(props);
            this.state = { Component: null, error: null };
        }

        override componentDidMount() {
            this.loadComponent();
        }

        moduleLoading() {
            // 延迟200ms
            this.timeOut = setTimeout(() => {
                app.store.dispatch(loadingAction(true, loadingIdentifier));
            }, 200);
        }

        loadComponent = async () => {
            try {
                this.setState({ error: null });
                app.store.dispatch(loadingAction(true, loadingIdentifier));
                // this.moduleLoading();
                const moduleExports = await resolve();
                this.setState({ Component: moduleExports[component] as any });
            } catch (e) {
                captureError(e, "@@framework/async-import");
                this.setState({ error: e });
            } finally {
                if (this.timeOut) {
                    clearTimeout(this.timeOut);
                }
                app.store.dispatch(loadingAction(false, loadingIdentifier));
            }
        };

        override render() {
            const { Component, error } = this.state;
            const hasError = error !== null;

            if (hasError) {
                return ErrorComponent ? <ErrorComponent error={error} reload={this.loadComponent} /> : null;
            }

            return Component ? <Component {...this.props} /> : LoadingComponent ? <LoadingComponent /> : null;
        }
    } as any;
}
