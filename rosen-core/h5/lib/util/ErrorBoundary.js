import { __extends } from "tslib";
import React from "react";
import { captureError } from "./error-util";
var ErrorBoundary = /** @class */ (function (_super) {
    __extends(ErrorBoundary, _super);
    function ErrorBoundary(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { exception: null };
        return _this;
    }
    ErrorBoundary.prototype.componentDidCatch = function (error, errorInfo) {
        var exception = captureError(error, "@@framework/error-boundary", {
            extraStacktrace: errorInfo.componentStack,
        });
        this.setState({ exception: exception });
    };
    ErrorBoundary.prototype.render = function () {
        return this.state.exception ? this.props.render(this.state.exception) : this.props.children || null;
    };
    ErrorBoundary.displayName = "ErrorBoundary";
    ErrorBoundary.defaultProps = { render: function () { return null; } };
    return ErrorBoundary;
}(React.PureComponent));
export { ErrorBoundary };
//# sourceMappingURL=ErrorBoundary.js.map