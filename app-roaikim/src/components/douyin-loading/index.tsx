import React from "react";
import classNames from "classnames";
import { joinLessPrefix } from "utils/framework";
import "./index.less";

interface DouyinLoadingProps {
    className?: string;
    text?: string | React.ReactNode;
    subText?: string;
}

export function DouyinLoading({ className, text = "加载中", subText }: DouyinLoadingProps) {
    return (
        <div className={classNames(joinLessPrefix("douyin-loading"), className)} role="status" aria-live="polite">
            <span className={joinLessPrefix("douyin-loading-scanlines")} aria-hidden="true"></span>
            <span className={joinLessPrefix("douyin-loading-text")} data-text={text}>
                {text}
            </span>
            {subText ? <span className={joinLessPrefix("douyin-loading-subtext")}>{subText}</span> : null}
        </div>
    );
}
