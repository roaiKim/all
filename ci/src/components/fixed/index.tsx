import React, { PropsWithChildren } from "react";
import classNames from "classnames";
import "./index.less";

interface FixedButtonProps {
    onClick?: () => void;
    disabled?: boolean;
    position?: "bottom" | "top";
    className?: string;
    fixed?: boolean;
    style?: React.CSSProperties;
}

export function Fixed(props: PropsWithChildren<FixedButtonProps>) {
    const { children, position = "bottom", className = "", fixed = true, style } = props;

    const cls = classNames({
        "ro-button-container": true,
        "ro-flex": true,
        [`ro-fixed-` + position]: fixed,
        [className]: className,
    });

    return (
        <div className={cls} style={style || null}>
            {children}
        </div>
    );
}
