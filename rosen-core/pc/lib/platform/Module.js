import { enablePatches, produce } from "immer";
import { roDispatchFunction } from "../actions";
import { app } from "../app";
import { setStateAction } from "../reducer";
// enableES5();
if (process.env.NODE_ENV === "development") {
    enablePatches();
}
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
    /**
     *
     * @param stateOrUpdater 更新的内容 可以是对象 & function
     */
    Module.prototype.setState = function (stateOrUpdater) {
        if (typeof stateOrUpdater === "function") {
            var originalState = this.state;
            var updater_1 = stateOrUpdater;
            var patchDescriptions_1;
            var newState = produce(originalState, function (draftState) {
                // Wrap into a void function, in case updater() might return anything
                updater_1(draftState);
            }, process.env.NODE_ENV === "development"
                ? function (patches) {
                    // No need to read "op", in will only be "replace"
                    patchDescriptions_1 = patches.map(function (_) { return _.path.join("."); });
                }
                : undefined);
            if (newState !== originalState) {
                var description = "@@".concat(this.name, "/setState").concat(patchDescriptions_1 ? "[".concat(patchDescriptions_1.join("/"), "]") : "");
                app.store.dispatch(setStateAction(this.name, newState, description));
            }
        }
        else {
            var partialState_1 = stateOrUpdater;
            this.setState(function (state) { return Object.assign(state, partialState_1); });
        }
    };
    return Module;
}());
export { Module };
//# sourceMappingURL=Module.js.map