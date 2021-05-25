import React from "react";

export function async(resolve, component, loadingComponent = null) {
    return class AsyncWrapperComponent extends React.PureComponent {

        constructor(props) {
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
