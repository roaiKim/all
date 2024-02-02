// 这里的装饰器只能用于 module 中的方法
import { __awaiter, __generator } from "tslib";
import { app } from "../app";
import { NetworkConnectionException } from "../Exception";
import { loadingAction } from "../reducer";
import { createActionHandlerDecorator } from ".";
/**
 * @description loading
 * @param identifier loading的标识 用于区分不同的loading, 取值时 showLoading 的第二个参数
 * @returns
 */
export function loading(identifier) {
    var _this = this;
    if (identifier === void 0) { identifier = "global"; }
    return createActionHandlerDecorator(function (handler) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, , 2, 3]);
                    app.store.dispatch(loadingAction(true, identifier));
                    return [4 /*yield*/, handler()];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    app.store.dispatch(loadingAction(false, identifier));
                    return [7 /*endfinally*/];
                case 3: return [2 /*return*/];
            }
        });
    }); });
}
/**
 * @description module中 onTick 函数的执行周期
 * @param second 间隔的秒数
 * @returns
 */
export function interval(second) {
    return function (target, propertyKey, descriptor) {
        descriptor.value.tickInterval = second;
        return descriptor;
    };
}
/**
 * @description 互斥锁
 * @returns null
 */
export function mutex() {
    var lockTime = null;
    return createActionHandlerDecorator(function (handler) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!lockTime) return [3 /*break*/, 1];
                        return [3 /*break*/, 4];
                    case 1:
                        _a.trys.push([1, , 3, 4]);
                        lockTime = Date.now();
                        return [4 /*yield*/, handler()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        lockTime = null;
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    });
}
/**
 * @description 遇到出错时 自动重试
 * @param retryIntervalSecond 重试的间隔数
 * @param timesBlock 重试的次数
 * @returns null
 */
export function retryOnNetworkConnectionError(retryIntervalSecond, timesBlock) {
    if (retryIntervalSecond === void 0) { retryIntervalSecond = 3; }
    if (timesBlock === void 0) { timesBlock = 5; }
    return createActionHandlerDecorator(function (handler) {
        return __awaiter(this, void 0, void 0, function () {
            var retryTime, timer, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        retryTime = 0;
                        _a.label = 1;
                    case 1:
                        if (!true) return [3 /*break*/, 9];
                        if (retryTime > timesBlock) {
                            return [3 /*break*/, 9];
                        }
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 8]);
                        return [4 /*yield*/, handler()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 4:
                        e_1 = _a.sent();
                        if (!(e_1 instanceof NetworkConnectionException)) return [3 /*break*/, 6];
                        retryTime++;
                        return [4 /*yield*/, new Promise(function (resolve) {
                                timer = setTimeout(resolve, retryIntervalSecond * 1000);
                            })];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 6: throw e_1;
                    case 7: return [3 /*break*/, 8];
                    case 8: return [3 /*break*/, 1];
                    case 9: return [2 /*return*/];
                }
            });
        });
    });
}
//# sourceMappingURL=module.js.map