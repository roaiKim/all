import React from "react";
import { Resizable } from "react-resizable";

const ResizeableTitle = (props) => {
    const { onResize, width, ...restProps } = props;

    // console.log('props', props, props.key)

    if (!width || props.className === "table-action table-action-action") {
        return <th style={{ minHeight: "51px" }} {...restProps} />;
    }

    // console.log('restProps.children', restProps)
    // restProps.children = [<CellBox key={restProps.children.key} title={restProps.children && restProps.children.props && restProps.children.props.children && restProps.children.props.children[0]}>{restProps.children}</CellBox>]
    // console.log('restProps.children', restProps.children.key)
    return (
        <Resizable width={width || props.minWidth} height={0} onResize={onResize}>
            <th>
                <CellBox>
                    <div {...restProps} />
                </CellBox>
            </th>
        </Resizable>
    );
};
