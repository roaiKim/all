import { __assign, __awaiter, __extends, __generator } from "tslib";
import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import { captureError } from "./error-util";
import { app } from "../app";
import { loadingAction } from "../reducer";
export function async(resolve, component, _a) {
    var _b = _a === void 0 ? {} : _a, LoadingComponent = _b.LoadingComponent, _c = _b.loadingIdentifier, loadingIdentifier = _c === void 0 ? "pageloading" : _c, ErrorComponent = _b.ErrorComponent;
    return /** @class */ (function (_super) {
        __extends(AsyncWrapperComponent, _super);
        function AsyncWrapperComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.timeOut = null;
            _this.loadComponent = function () { return __awaiter(_this, void 0, void 0, function () {
                var moduleExports, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, 3, 4]);
                            this.setState({ error: null });
                            app.store.dispatch(loadingAction(true, loadingIdentifier));
                            return [4 /*yield*/, resolve()];
                        case 1:
                            moduleExports = _a.sent();
                            this.setState({ Component: moduleExports[component] });
                            return [3 /*break*/, 4];
                        case 2:
                            e_1 = _a.sent();
                            captureError(e_1, "@@framework/async-import");
                            this.setState({ error: e_1 });
                            return [3 /*break*/, 4];
                        case 3:
                            if (this.timeOut) {
                                clearTimeout(this.timeOut);
                            }
                            app.store.dispatch(loadingAction(false, loadingIdentifier));
                            return [7 /*endfinally*/];
                        case 4: return [2 /*return*/];
                    }
                });
            }); };
            _this.state = { Component: null, error: null };
            return _this;
        }
        AsyncWrapperComponent.prototype.componentDidMount = function () {
            this.loadComponent();
        };
        AsyncWrapperComponent.prototype.moduleLoading = function () {
            // 延迟200ms
            this.timeOut = setTimeout(function () {
                app.store.dispatch(loadingAction(true, loadingIdentifier));
            }, 200);
        };
        AsyncWrapperComponent.prototype.render = function () {
            var _a = this.state, Component = _a.Component, error = _a.error;
            var hasError = error !== null;
            if (hasError) {
                return ErrorComponent ? _jsx(ErrorComponent, { error: error, reload: this.loadComponent }) : null;
            }
            return Component ? _jsx(Component, __assign({}, this.props)) : LoadingComponent ? _jsx(LoadingComponent, {}) : null;
        };
        return AsyncWrapperComponent;
    }(React.PureComponent));
}
//# sourceMappingURL=async.js.map