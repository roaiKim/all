import { Action } from "./reducer";
type DeferLiteralArrayCheck<T> = T extends Array<string | number | boolean | null | undefined> ? T : never;
export declare function useLoading(identifier?: string): boolean;
/**
 * Action parameters must be of primitive types, so that the dependency check can work well.
 * No need add dispatch to dep list, because it is always fixed.
 */
export declare function useAction<P extends Array<string | number | boolean | null | undefined>>(actionCreator: (...args: P) => Action<P>, ...deps: P): () => void;
/**
 * For actions like:
 * *foo(a: number, b: string, c: boolean)
 *
 * useUnaryAction(foo, 100, "") will return:
 * (c: boolean) => void;
 */
export declare function useUnaryAction<P extends any[], U>(actionCreator: (...args: [...P, U]) => Action<[...DeferLiteralArrayCheck<P>, U]>, ...deps: P): (arg: U) => void;
/**
 * For actions like:
 * *foo(a: number, b: string, c: boolean)
 *
 * useBinaryAction(foo, 100) will return:
 * (b: string, c: boolean) => void;
 */
export declare function useBinaryAction<P extends any[], U, K>(actionCreator: (...args: [...P, U, K]) => Action<[...DeferLiteralArrayCheck<P>, U, K]>, ...deps: P): (arg1: U, arg2: K) => void;
/**
 * For actions like:
 * *foo(data: {key: number})
 *
 * useModuleObjectAction(foo, "key") will return:
 * (objectValue: number) => void;
 */
export declare function useObjectKeyAction<T extends object, K extends keyof T>(actionCreator: (arg: T) => Action<[T]>, objectKey: K): (objectValue: T[K]) => void;
export {};
