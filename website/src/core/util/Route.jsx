import React from "react";
import { Redirect, Route as ReactRouterDOMRoute } from "react-router-dom";

export class Route extends React.PureComponent {

    static defaultProps = {
        exact: true,
        accessCondition: true,
        unauthorizedRedirectTo: "/",
    };

    render() {
        const {
            component, accessCondition, unauthorizedRedirectTo, ...restProps
        } = this.props;
        const TargetComponent = component;
        return <ReactRouterDOMRoute {...restProps} render={(props) => (accessCondition ? <TargetComponent {...props} /> : <Redirect to={{ pathname: unauthorizedRedirectTo }} />)} />;
    }

}
