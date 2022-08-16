import { LoadingSVG } from "components/loadingSVG";
import React, { PropsWithChildren } from "react";

interface Props {
    title?: string;
    loading?: boolean;
    backgroundColor?: string;
    loadingRender?: boolean; // loading时 是否渲染 children
}

export function GlobalMask(props: PropsWithChildren<Props>) {
    const { title, loading, children, backgroundColor = "#fff", loadingRender = false } = props;
    const dev = (
        <div className="ro-global-mask" style={{ backgroundColor }}>
            <div className="ro-develop-module ro-flex ro-center ro-height-100">
                <LoadingSVG>
                    <div>
                        {title}
                        <a className="ro-a-action">刷新</a>
                    </div>
                </LoadingSVG>
            </div>
        </div>
    );
    if (loadingRender) {
        return (
            <React.Fragment>
                {loading && dev}
                {children}
            </React.Fragment>
        );
    }
    return <React.Fragment>{loading ? dev : children}</React.Fragment>;
}
