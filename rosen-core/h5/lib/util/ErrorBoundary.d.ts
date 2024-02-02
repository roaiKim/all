import React, { PropsWithChildren } from "react";
import { Exception } from "../Exception";
interface Props {
    render: (exception: Exception) => React.ReactElement | null;
}
interface State {
    exception: Exception | null;
}
export declare class ErrorBoundary extends React.PureComponent<PropsWithChildren<Props>, State> {
    static displayName: string;
    static defaultProps: Pick<Props, "render">;
    constructor(props: Props);
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void;
    render(): {};
}
export {};
