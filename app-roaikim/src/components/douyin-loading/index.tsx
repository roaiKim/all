import React from "react";
import classNames from "classnames";
import "./index.less";

interface DouyinLoadingProps {
    className?: string;
    text?: string | React.ReactNode;
    subText?: string;
}

export function DouyinLoading({ className, text = "加载中", subText }: DouyinLoadingProps) {
    return (
        <div className={classNames("ro-douyin-loading", className)} role="status" aria-live="polite">
            <span className="ro-douyin-loading-scanlines" aria-hidden="true"></span>
            <span className="ro-douyin-loading-text" data-text={text}>
                {text}
            </span>
            {subText ? <span className="ro-douyin-loading-subtext">{subText}</span> : null}
        </div>
    );
}
