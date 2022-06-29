import React from "react";
import classNames from "classnames";
import "./index.less";

interface MaskProps {
    transparent?: boolean;
    className?: string;
}

export default function Mask(props: MaskProps) {
    const { transparent = false, className, ...others } = props;

    const clz = classNames(
        {
            "weui-mask": !transparent,
            "weui-mask-transparent": transparent,
        },
        className
    );

    return <div className={clz} {...others}></div>;
}
