import { __read, __spreadArray } from "tslib";
export function createActionHandlerDecorator(interceptor) {
    return function (target, propertyKey, descriptor) {
        var fn = descriptor.value;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var boundFn = fn.bind.apply(fn, __spreadArray([this], __read(args), false));
            boundFn.actionName = descriptor.value.actionName;
            return interceptor(boundFn, this);
        };
        return descriptor;
    };
}
//# sourceMappingURL=index.js.map