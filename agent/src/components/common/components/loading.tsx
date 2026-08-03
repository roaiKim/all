import React from "react";
import { DouyinLoading } from "components/douyin-loading";
import { joinLessPrefix } from "utils/framework";
import { LoadingSVG } from "./loading-svg";

interface SpinningProps {
    text?: string | React.ReactNode;
    loading: boolean;
    backgroundColor?: string;
}

export function Spinning(props: SpinningProps) {
    const { text, loading, backgroundColor = "#fff" } = props;

    return (
        <div className={joinLessPrefix("spaning")} style={{ backgroundColor, display: loading ? "block" : "none" }}>
            <LoadingSVG>
                <DouyinLoading text={text}></DouyinLoading>
            </LoadingSVG>
        </div>
    );
}
