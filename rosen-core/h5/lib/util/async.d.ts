import React from "react";
export type ReactComponentKeyOf<T> = {
    [P in keyof T]: T[P] extends React.ComponentType<any> ? P : never;
}[keyof T];
export interface AsyncOptions {
    loadingIdentifier?: string;
    LoadingComponent?: React.ComponentType;
    ErrorComponent?: React.ComponentType<AsyncErrorComponentProps>;
}
export interface AsyncErrorComponentProps {
    error: unknown;
    reload: () => Promise<void>;
}
export declare function async<T, K extends ReactComponentKeyOf<T>>(resolve: () => Promise<T>, component: K, { LoadingComponent, loadingIdentifier, ErrorComponent }?: AsyncOptions): T[K];
