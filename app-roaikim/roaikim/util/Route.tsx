// import React from "react";
// import { Redirect, Route as ReactRouterDOMRoute, type RouteComponentProps, type RouteProps } from "react-router-dom";
// import { ErrorBoundary } from "./ErrorBoundary";
// import { app } from "../app";

// interface Props extends RouteProps {
//     component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
//     // All below are optional
//     withErrorBoundary: boolean;
//     accessCondition: boolean;
//     unauthorizedRedirectTo: string;
//     notFound: boolean;
// }

// export class Route extends React.PureComponent<Props> {
//     static defaultProps: Pick<Props, "exact" | "sensitive" | "withErrorBoundary" | "accessCondition" | "unauthorizedRedirectTo" | "notFound"> = {
//         exact: true,
//         sensitive: true,
//         withErrorBoundary: true,
//         accessCondition: true,
//         unauthorizedRedirectTo: "/",
//         notFound: false,
//     };

//     renderRegularRouteComponent = (props: RouteComponentProps<any>): React.ReactElement => {
//         const { component, accessCondition, unauthorizedRedirectTo, notFound, withErrorBoundary } = this.props;
//         if (accessCondition) {
//             const WrappedComponent = notFound ? withNotFoundWarning(component) : component;
//             const routeNode = <WrappedComponent {...props} />;
//             return withErrorBoundary ? <ErrorBoundary>{routeNode}</ErrorBoundary> : routeNode;
//         } else {
//             return <Redirect to={unauthorizedRedirectTo} />;
//         }
//     };

//     override render() {
//         const { component, ...restRouteProps } = this.props;
//         return <ReactRouterDOMRoute {...restRouteProps} render={this.renderRegularRouteComponent} />;
//     }
// }

// function RouteFc() {}

// function withNotFoundWarning<T extends {}>(WrappedComponent: React.ComponentType<T>): React.ComponentType<T> {
//     return class extends React.PureComponent<T> {
//         override componentDidMount() {
//             app.logger.warn({
//                 action: "@@framework/route-404",
//                 elapsedTime: 0,
//                 errorMessage: `${location.href} not supported by <Route>`,
//                 errorCode: "ROUTE_NOT_FOUND",
//                 info: {},
//             });
//         }

//         override render() {
//             return <WrappedComponent {...this.props} />;
//         }
//     };
// }

import React, { useEffect, useMemo } from "react";
import { Navigate } from "react-router-dom";
import { ErrorBoundary } from "./ErrorBoundary";
import { app } from "../app";

interface RouteElementProps {
    component: React.ComponentType<any>;
    withErrorBoundary?: boolean;
    accessCondition?: boolean;
    unauthorizedRedirectTo?: string;
    notFound?: boolean;
}

export function RouteElement({
    component,
    withErrorBoundary = true,
    accessCondition = true,
    unauthorizedRedirectTo = "/",
    notFound = false,
}: RouteElementProps) {
    const WrappedComponent = useMemo(() => (notFound ? withNotFoundWarning(component) : component), [component, notFound]);

    if (!accessCondition) {
        return <Navigate to={unauthorizedRedirectTo} replace />;
    }

    const routeNode = <WrappedComponent />;

    return withErrorBoundary ? <ErrorBoundary>{routeNode}</ErrorBoundary> : routeNode;
}

function withNotFoundWarning<T extends object>(WrappedComponent: React.ComponentType<T>): React.ComponentType<T> {
    const ComponentWithNotFoundWarning = (props: T) => {
        useEffect(() => {
            app.logger.warn({
                action: "@@framework/route-404",
                elapsedTime: 0,
                errorMessage: `${window.location.href} not supported by <Route>`,
                errorCode: "ROUTE_NOT_FOUND",
                info: {},
            });
        }, []);

        return <WrappedComponent {...props} />;
    };

    return ComponentWithNotFoundWarning;
}

// import { Routes, Route } from "react-router-dom";

// <Routes>
//     <Route
//         path="/home"
//         element={<RouteElement component={HomePage} accessCondition={true} />}
//     />
//     <Route
//         path="*"
//         element={<RouteElement component={NotFoundPage} notFound />}
//     />
// </Routes>
