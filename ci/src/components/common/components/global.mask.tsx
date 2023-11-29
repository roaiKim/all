import React, { PropsWithChildren } from "react";
import { LoadingSVG } from "components/loadingSVG";

interface Props {
    title?: string | React.ReactNode;
    loading?: boolean;
    backgroundColor?: string;
    loadingRender?: boolean; // loading时 是否渲染 children
    refresh?: () => void;
}

export function GlobalMask(props: PropsWithChildren<Props>) {
    const { title, loading, children, backgroundColor = "#fff", loadingRender = false, refresh } = props;

    return (
        <React.Fragment>
            <div className="ro-global-mask" style={{ backgroundColor, display: loading ? "block" : "none" }}>
                <div className="ro-develop-module ro-flex ro-center ro-height-100">
                    <LoadingSVG>
                        <div>
                            {title}
                            {refresh && (
                                <p onClick={refresh} className="ro-a-action">
                                    刷新
                                </p>
                            )}
                        </div>
                    </LoadingSVG>
                </div>
            </div>
            {loading ? (loadingRender ? children : null) : children}
        </React.Fragment>
    );
}
