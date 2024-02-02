import { __read, __spreadArray } from "tslib";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
export function useLoading(identifier) {
    if (identifier === void 0) { identifier = "global"; }
    return useSelector(function (state) { return state.loading[identifier] > 0; });
}
/**
 * Action parameters must be of primitive types, so that the dependency check can work well.
 * No need add dispatch to dep list, because it is always fixed.
 */
export function useAction(actionCreator) {
    var deps = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        deps[_i - 1] = arguments[_i];
    }
    var dispatch = useDispatch();
    return React.useCallback(function () { return dispatch(actionCreator.apply(void 0, __spreadArray([], __read(deps), false))); }, deps);
}
/**
 * For actions like:
 * *foo(a: number, b: string, c: boolean)
 *
 * useUnaryAction(foo, 100, "") will return:
 * (c: boolean) => void;
 */
export function useUnaryAction(actionCreator) {
    var deps = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        deps[_i - 1] = arguments[_i];
    }
    var dispatch = useDispatch();
    return React.useCallback(function (arg) { return dispatch(actionCreator.apply(void 0, __spreadArray(__spreadArray([], __read(deps), false), [arg], false))); }, deps);
}
/**
 * For actions like:
 * *foo(a: number, b: string, c: boolean)
 *
 * useBinaryAction(foo, 100) will return:
 * (b: string, c: boolean) => void;
 */
export function useBinaryAction(actionCreator) {
    var deps = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        deps[_i - 1] = arguments[_i];
    }
    var dispatch = useDispatch();
    return React.useCallback(function (arg1, arg2) { return dispatch(actionCreator.apply(void 0, __spreadArray(__spreadArray([], __read(deps), false), [arg1, arg2], false))); }, deps);
}
/**
 * For actions like:
 * *foo(data: {key: number})
 *
 * useModuleObjectAction(foo, "key") will return:
 * (objectValue: number) => void;
 */
export function useObjectKeyAction(actionCreator, objectKey) {
    var dispatch = useDispatch();
    return React.useCallback(function (objectValue) {
        var _a;
        return dispatch(actionCreator((_a = {}, _a[objectKey] = objectValue, _a)));
    }, [dispatch, actionCreator, objectKey]);
}
//# sourceMappingURL=hooks.js.map