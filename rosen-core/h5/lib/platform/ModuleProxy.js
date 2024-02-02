import { __assign, __awaiter, __extends, __generator } from "tslib";
import React from "react";
import { app } from "../app";
import { executeAction } from "../module";
var startupModuleName = null;
function locationsAreEqual(a, b) {
    return a.pathname === b.pathname && a.search === b.search && a.hash === b.hash && a.key === b.key && a.state === b.state;
}
export var ModuleNameContext = React.createContext(null);
var ModuleProxy = /** @class */ (function () {
    function ModuleProxy(module, actions) {
        this.module = module;
        this.actions = actions;
    }
    ModuleProxy.prototype.getActions = function () {
        return this.actions;
    };
    ModuleProxy.prototype.connect = function (ComponentType) {
        var _a;
        var moduleName = this.module.name;
        var initialState = this.module.initialState;
        var lifecycleListener = this.module;
        var modulePrototype = Object.getPrototypeOf(lifecycleListener);
        var actions = this.actions;
        return _a = /** @class */ (function (_super) {
                __extends(class_1, _super);
                function class_1(props) {
                    var _this = _super.call(this, props) || this;
                    _this.tickCount = 0;
                    _this.hasOwnLifecycle = function (methodName) {
                        return Object.prototype.hasOwnProperty.call(modulePrototype, methodName);
                    };
                    if (!startupModuleName) {
                        startupModuleName = moduleName;
                    }
                    return _this;
                }
                class_1.prototype.componentDidMount = function () {
                    this.initialLifecycle();
                };
                class_1.prototype.componentDidUpdate = function (prevProps) {
                    return __awaiter(this, void 0, void 0, function () {
                        var prevLocation, props, currentLocation, currentRouteParams, actionName;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    prevLocation = prevProps.location;
                                    props = this.props;
                                    currentLocation = props.location;
                                    currentRouteParams = props.match || null;
                                    if (!(currentLocation && currentRouteParams && !locationsAreEqual(currentLocation, prevLocation) && this.hasOwnLifecycle("onLocationMatched"))) return [3 /*break*/, 2];
                                    actionName = "".concat(moduleName, "/@@LOCATION_MATCHED");
                                    // const startTime = Date.now();
                                    return [4 /*yield*/, executeAction(actionName, lifecycleListener.onLocationMatched.bind(lifecycleListener), currentRouteParams, currentLocation)];
                                case 1:
                                    // const startTime = Date.now();
                                    _a.sent();
                                    _a.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    });
                };
                class_1.prototype.componentWillUnmount = function () {
                    if (this.hasOwnLifecycle("onDestroy")) {
                        app.store.dispatch(actions.onDestroy());
                    }
                    try {
                        this.timer && clearTimeout(this.timer);
                    }
                    catch (_a) {
                        //
                    }
                };
                class_1.prototype.initialLifecycle = function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var props, enterActionName, initialRenderActionName, tickIntervalInMillisecond_1, boundTicker, tickActionName;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    props = this.props;
                                    enterActionName = "".concat(moduleName, "/@@ENTER");
                                    // const startTime = Date.now();
                                    return [4 /*yield*/, executeAction(enterActionName, lifecycleListener.onEnter.bind(lifecycleListener), props === null || props === void 0 ? void 0 : props.match, props === null || props === void 0 ? void 0 : props.location)];
                                case 1:
                                    // const startTime = Date.now();
                                    _a.sent();
                                    if (!this.hasOwnLifecycle("onLocationMatched")) return [3 /*break*/, 3];
                                    if (!("match" in props && "location" in props)) return [3 /*break*/, 3];
                                    initialRenderActionName = "".concat(moduleName, "/@@LOCATION_MATCHED");
                                    // const startTime = Date.now();
                                    return [4 /*yield*/, executeAction(initialRenderActionName, lifecycleListener.onLocationMatched.bind(lifecycleListener), props.match, props.location)];
                                case 2:
                                    // const startTime = Date.now();
                                    _a.sent();
                                    _a.label = 3;
                                case 3:
                                    if (!this.hasOwnLifecycle("onTick")) return [3 /*break*/, 7];
                                    tickIntervalInMillisecond_1 = (lifecycleListener.onTick.tickInterval || 5) * 1000;
                                    boundTicker = lifecycleListener.onTick.bind(lifecycleListener);
                                    tickActionName = "".concat(moduleName, "/@@TICK");
                                    _a.label = 4;
                                case 4:
                                    if (!true) return [3 /*break*/, 7];
                                    return [4 /*yield*/, executeAction(tickActionName, boundTicker)];
                                case 5:
                                    _a.sent();
                                    this.tickCount++;
                                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                                            _this.timer = setTimeout(resolve, tickIntervalInMillisecond_1);
                                        })];
                                case 6:
                                    _a.sent();
                                    return [3 /*break*/, 4];
                                case 7: return [2 /*return*/];
                            }
                        });
                    });
                };
                class_1.prototype.render = function () {
                    return (React.createElement(ModuleNameContext.Provider, { value: moduleName },
                        React.createElement(ComponentType, __assign({}, this.props))));
                };
                return class_1;
            }(React.PureComponent)),
            _a.displayName = "Module[".concat(moduleName, "]"),
            _a;
    };
    return ModuleProxy;
}());
export { ModuleProxy };
//# sourceMappingURL=ModuleProxy.js.map