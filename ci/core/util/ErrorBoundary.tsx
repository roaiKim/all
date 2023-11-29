import React, { PropsWithChildren } from "react";
import { captureError } from "./error-util";
import { Exception } from "../Exception";

interface Props {
    render: (exception: Exception) => React.ReactElement | null;
}

interface State {
    exception: Exception | null;
}

export class ErrorBoundary extends React.PureComponent<PropsWithChildren<Props>, State> {
    static displayName = "ErrorBoundary";
    static defaultProps: Pick<Props, "render"> = { render: () => null };

    constructor(props: Props) {
        super(props);
        this.state = { exception: null };
    }

    override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        const exception = captureError(error, "@@framework/error-boundary", {
            extraStacktrace: errorInfo.componentStack,
        });
        this.setState({ exception });
    }

    override render() {
        return this.state.exception ? this.props.render(this.state.exception) : this.props.children || null;
    }
}
