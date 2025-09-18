import React, { type PropsWithChildren } from "react";

interface ComposeProps {
    title?: string | React.ReactNode;
    query?: string | React.ReactNode;
    queryStyle?: React.CSSProperties;
    className?: string;
}

const Compose: React.FC<PropsWithChildren<ComposeProps>> = ({ title, query, queryStyle = {}, children, className }) => {
    // 分离出不同的插槽内容

    return (
        <div className={"compose-box " + className}>
            <div className="flex title-box">
                <div className="flex1 title">{title || null}</div>
                <div style={{ ...queryStyle }}>{query}</div>
            </div>
            <div className="content">{children}</div>
        </div>
    );
};

export default Compose;
