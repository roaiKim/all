export type ToLowerCamelCase<P extends string> = P extends `${infer A}-${infer B}` ? `${A}${Capitalize<B>}` : P extends `${infer C}` ? `${C}` : never;
