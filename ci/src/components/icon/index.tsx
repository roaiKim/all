import React from "react";
import classNames from "classnames";
import "./index.less";

export enum IconValue {
    "safe-success" = "safe-success",
    "safe-warn" = "safe-warn",
    "success-circle" = "success-circle",
    "success-no-circle" = "success-no-circle",
    "waiting-circle" = "waiting-circle",
    "info-circle" = "info-circle",
    "loading" = "loading",
    "success" = "loading",
    "waiting" = "loading",
    "warn" = "loading",
    "info" = "loading",
}

interface IconProps {
    value?: keyof typeof IconValue;
    size?: "small" | "large";
    className?: string;
    primary?: boolean;
}

export default function Icon(props: IconProps) {
    const { value, size, className, primary, ...others } = props;

    const cls = classNames({
        ["weui-icon-" + value]: value !== "loading",
        "weui-icon-msg": size === "large" && !primary,
        "weui-icon-msg-primary": size === "large" && primary,
        "weui-loading": value === "loading",
    });

    return <i {...others} className={`${cls} ${className}`} />;
}
