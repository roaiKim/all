import { __awaiter, __generator, __read, __spreadArray, __values } from "tslib";
import { app } from "./app";
import { ModuleProxy } from "./platform/ModuleProxy";
import { setStateAction } from "./reducer";
export function register(module) {
    var moduleName = module.name;
    if (!app.store.getState().app[moduleName]) {
        app.store.dispatch(setStateAction(moduleName, module.initialState, "@@".concat(moduleName, "/@@init")));
    }
    var actions = {};
    getKeys(module).forEach(function (actionType) {
        var method = module[actionType];
        var qualifiedActionType = "".concat(moduleName, "/").concat(actionType);
        method.actionName = qualifiedActionType;
        actions[actionType] = function () {
            var payload = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                payload[_i] = arguments[_i];
            }
            return ({ type: qualifiedActionType, payload: payload });
        };
        app.actionHandlers[qualifiedActionType] = method.bind(module);
    });
    return new ModuleProxy(module, actions);
}
export function executeAction(actionName, handler) {
    var payload = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        payload[_i - 2] = arguments[_i];
    }
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, handler.apply(void 0, __spreadArray([], __read(payload), false))];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getKeys(module) {
    var e_1, _a;
    var keys = [];
    try {
        for (var _b = __values(Object.getOwnPropertyNames(Object.getPrototypeOf(module))), _c = _b.next(); !_c.done; _c = _b.next()) {
            var propertyName = _c.value;
            if (module[propertyName] instanceof Function && propertyName !== "constructor") {
                keys.push(propertyName);
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return keys;
}
//# sourceMappingURL=module.js.map