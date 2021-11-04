import React from "react";

type ReactComponentKeyOf<T> = { [P in keyof T]: T[P] extends React.ComponentType<any> ? P : never }[keyof T];

interface WrapperComponentState {
    Component: React.ComponentType<any> | null;
}

export function async<T, K extends ReactComponentKeyOf<T>>(resolve: () => Promise<T>, component: K, loadingComponent: React.ReactNode = null) {
    return class AsyncWrapperComponent extends React.PureComponent<{}, WrapperComponentState> {
        constructor(props: any) {
            super(props);
            this.state = {
                Component: null,
            };
        }

        componentDidMount() {
            const promise = resolve();
            promise.then((module) => {
                const Component = module[component];
                this.setState({ Component });
            });
        }

        render() {
            const { Component } = this.state;
            return Component ? <Component {...this.props} /> : loadingComponent;
        }
    };
}
