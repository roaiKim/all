import React from "react";
import { DouyinLoading } from "components/douyin-loading";
import { prefixCls } from "config/static-constant";
import { LoadingSVG } from "./loading-svg";

interface SpinningProps {
    text?: string | React.ReactNode;
    loading: boolean;
    backgroundColor?: string;
}

export function Spinning(props: SpinningProps) {
    const { text, loading, backgroundColor = "#fff" } = props;

    return (
        <div className={prefixCls("spaning")} style={{ backgroundColor, display: loading ? "block" : "none" }}>
            <LoadingSVG>
                <DouyinLoading text={text}></DouyinLoading>
            </LoadingSVG>
        </div>
    );
}

