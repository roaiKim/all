// 转换大小写
export type ToLowerCamelCase<P extends string> = P extends `${infer A}-${infer B}`
    ? A extends `${Uncapitalize<A>}`
        ? `${A}${Capitalize<B>}`
        : never
    : P extends `${infer C}`
    ? C extends `${Uncapitalize<C>}`
        ? `${C}`
        : never
    : never;
