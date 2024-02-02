import { roDispatchFunction } from "../actions";
import { app } from "../app";
var Module = /** @class */ (function () {
    function Module(name, initialState) {
        this.name = name;
        this.initialState = initialState;
    }
    /**
     * @description mount 之后调用
     * @param parms
     * @param location
     */
    Module.prototype.onEnter = function (parms, location) {
        //
    };
    /**
     * @description 销毁
     */
    Module.prototype.onDestroy = function () {
        //
    };
    /**
     * @description 更新 路由 参数变更
     * @param routeParam
     * @param location
     */
    Module.prototype.onLocationMatched = function (routeParam, location) {
        //
    };
    /**
     * @description 循环请求 可用 @interval 装饰器决定 周期
     */
    Module.prototype.onTick = function () {
        //
    };
    /**
     *
     * @param action
     */
    Module.prototype.dispatch = function (action) {
        roDispatchFunction(action);
    };
    Object.defineProperty(Module.prototype, "state", {
        get: function () {
            return this.rootState.app[this.name];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Module.prototype, "rootState", {
        get: function () {
            return app.store.getState();
        },
        enumerable: false,
        configurable: true
    });
    Module.prototype.setState = function (state) {
        var partialState = state;
        this.setState(function (state) { return Object.assign(state, partialState); });
    };
    return Module;
}());
export { Module };
//# sourceMappingURL=Module.js.map