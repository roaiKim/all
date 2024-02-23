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

export const ACTIVE_STATUS = [
    { key: 0, value: "禁用", style: { color: "#FF2525" } },
    { key: 1, value: "启用", style: { color: "#27B148" } },
];

export const BOOLEAN_STATUS = [
    { key: 0, value: "是", style: { color: "#FF2525" } },
    { key: 1, value: "否", style: { color: "#27B148" } },
];
