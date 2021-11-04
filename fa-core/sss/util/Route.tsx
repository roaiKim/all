import React from "react";
import { RouteProps, RouteComponentProps } from "react-router";
import { Redirect, Route as ReactRouterDOMRoute } from "react-router-dom";

interface Props extends RouteProps {
    component: React.ComponentType<any>;
    accessCondition?: boolean;
    unauthorizedRedirectTo?: string;
}

export class Route extends React.PureComponent<Props> {
    static defaultProps = {
        exact: true,
        accessCondition: true,
        unauthorizedRedirectTo: "/",
    };

    render() {
        const { component, accessCondition, unauthorizedRedirectTo, ...restProps } = this.props;
        const TargetComponent = component;
        function render(props: RouteComponentProps) {
            return accessCondition ? <TargetComponent {...props} /> : <Redirect to={{ pathname: unauthorizedRedirectTo }} />;
        }
        return <ReactRouterDOMRoute {...restProps} render={render} />;
    }
}
