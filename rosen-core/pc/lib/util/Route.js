import { __assign, __extends, __rest } from "tslib";
import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import { Redirect, Route as ReactRouterDOMRoute } from "react-router-dom";
import { ErrorBoundary } from "./ErrorBoundary";
var Route = /** @class */ (function (_super) {
    __extends(Route, _super);
    function Route() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.renderRegularRouteComponent = function (props) {
            var _a = _this.props, component = _a.component, accessCondition = _a.accessCondition, unauthorizedRedirectTo = _a.unauthorizedRedirectTo, notFound = _a.notFound, withErrorBoundary = _a.withErrorBoundary;
            if (accessCondition) {
                var WrappedComponent = notFound ? withNotFoundWarning(component) : component;
                var routeNode = _jsx(WrappedComponent, __assign({}, props));
                return withErrorBoundary ? _jsx(ErrorBoundary, { children: routeNode }) : routeNode;
            }
            else {
                return _jsx(Redirect, { to: unauthorizedRedirectTo });
            }
        };
        return _this;
    }
    Route.prototype.render = function () {
        var _a = this.props, component = _a.component, restRouteProps = __rest(_a, ["component"]);
        return _jsx(ReactRouterDOMRoute, __assign({}, restRouteProps, { render: this.renderRegularRouteComponent }));
    };
    Route.defaultProps = {
        exact: true,
        sensitive: true,
        withErrorBoundary: true,
        accessCondition: true,
        unauthorizedRedirectTo: "/",
        notFound: false,
    };
    return Route;
}(React.PureComponent));
export { Route };
function withNotFoundWarning(WrappedComponent) {
    return /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.render = function () {
            return _jsx(WrappedComponent, __assign({}, this.props));
        };
        return class_1;
    }(React.PureComponent));
}
//# sourceMappingURL=Route.js.map