import React from "react";
import classNames from "classnames";
import { prefixCls } from "config/static-constant";
import "./index.less";

interface DouyinLoadingProps {
    className?: string;
    text?: string | React.ReactNode;
    subText?: string;
}

export function DouyinLoading({ className, text = "加载中", subText }: DouyinLoadingProps) {
    return (
        <div className={classNames(prefixCls("douyin-loading"), className)} role="status" aria-live="polite">
            <span className={prefixCls("douyin-loading-scanlines")} aria-hidden="true"></span>
            <span className={prefixCls("douyin-loading-text")} data-text={text}>
                {text}
            </span>
            {subText ? <span className={prefixCls("douyin-loading-subtext")}>{subText}</span> : null}
        </div>
    );
}
