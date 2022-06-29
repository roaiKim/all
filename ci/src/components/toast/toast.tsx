import React, { PropsWithChildren } from "react";
import Mask from "../mask/index";
import Icon from "../icon/index";
import { IconValue } from "../icon";
import "./index.less";
import classNames from "classnames";

interface ToastProps {
    icon: keyof typeof IconValue | undefined;
    iconSize?: "small" | "large";
    show?: boolean;
    className?: string;
}

export default function (props: PropsWithChildren<ToastProps>) {
    const { className = "", icon, show = false, children, iconSize = "small", ...others } = props;

    const cls = classNames({
        "weui-toast": true,
        "weui-toast-no-icon": !icon,
        [className]: className,
    });

    return (
        <div style={{ display: show ? "block" : "none" }}>
            <Mask transparent={true} />
            <div className={cls} {...others}>
                {icon && <Icon value={icon} size={iconSize} className="weui-icon-toast" />}
                <p className="weui-toast-content">{children}</p>
            </div>
        </div>
    );
}
