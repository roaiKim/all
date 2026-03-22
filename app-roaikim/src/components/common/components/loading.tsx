import React, { type PropsWithChildren } from "react";
import { DouyinLoading } from "components/douyin-loading";
import { LoadingSVG } from "./loading-svg";

interface SpinningProps {
    text?: string | React.ReactNode;
    loading: boolean;
    backgroundColor?: string;
}

export function Spinning(props: SpinningProps) {
    const { text, loading, backgroundColor = "#fff" } = props;

    return (
        <div className="ro-spaning" style={{ backgroundColor, display: loading ? "block" : "none" }}>
            {/* <div className="ro-develop-module ro-flex ro-center ro-height-100"> */}
            <LoadingSVG>
                <DouyinLoading text={text}></DouyinLoading>
            </LoadingSVG>
            {/* </div> */}
        </div>
    );
}
