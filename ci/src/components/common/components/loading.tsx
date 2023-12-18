import React, { PropsWithChildren } from "react";
import { LoadingSVG } from "components/loadingSVG";

interface SpinningProps {
    title?: string | React.ReactNode;
    loading?: boolean;
    backgroundColor?: string;
    initialized?: boolean; // loading时 是否渲染 children
    refresh?: () => void;
}

export function Spinning(props: PropsWithChildren<SpinningProps>) {
    const { title, loading, children, backgroundColor = "#fff", initialized, refresh } = props;

    return (
        <React.Fragment>
            <div className="ro-spaning" style={{ backgroundColor, display: loading ? "block" : "none" }}>
                <div className="ro-develop-module ro-flex ro-center ro-height-100">
                    <LoadingSVG></LoadingSVG>
                </div>
            </div>
            {/* {loading ? (loadingRender ? children : null) : children} */}
            {initialized ? children : null}
        </React.Fragment>
    );
}
