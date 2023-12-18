import { ViewState } from "utils/hooks/usePageModal";

export type ToLowerCamelCase<P extends string> = P extends `${infer A}-${infer B}`
    ? A extends `${Uncapitalize<A>}`
        ? `${A}${Capitalize<B>}`
        : never
    : P extends `${infer C}`
    ? C extends `${Uncapitalize<C>}`
        ? `${C}`
        : never
    : never;

// interface addition {
//     addition:
// }
/**
 * 页面主弹窗 message
 */
export interface AdditionMessage<T> extends Partial<ViewState> {
    addition?: T;
}
