import React from "react";

export default function CellBox(props) {
    const { boxClass, parentStyle, boxStyle, children, title } = props;

    // console.log("className", props);
    return (
        <div style={{ minHeight: 21 }}>
            <div
                title={title}
                className="flex flex-vertical-center"
                style={{
                    position: "absolute",
                    width: "calc(100% + 1px)",
                    left: 0,
                    top: 0,
                    padding: "0 10px",
                    height: "100%",
                    ...parentStyle,
                }}
            >
                <div className={`text-overflow-ellipsis ${boxClass}`} style={{ width: "100%", ...boxStyle }}>
                    {children}
                </div>
            </div>
        </div>
    );
}
