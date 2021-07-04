/* eslint-disable react/destructuring-assignment */
import React from "react";
import { Resizable } from "react-resizable";

const ResizeableTitle = (props) => {
    const {
        onResize, width, ...restProps
    } = props;
    if (!width || (props.style && props.style.position === "sticky")) {
        return <th {...restProps} />;
    }

    return (
        <Resizable width={width || 140} height={0} onResize={onResize} className={props.className}>
            <th>
                <div {...restProps} />
            </th>
        </Resizable>
    );
};

export default ResizeableTitle;
