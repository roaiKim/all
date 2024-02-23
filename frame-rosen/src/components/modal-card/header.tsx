import { PropsWithChildren, ReactNode } from "react";
import "./index.less";

interface ModalCardHeaderProps {
    title: string | ReactNode;
}

export function ModalCardHeader(props: PropsWithChildren<ModalCardHeaderProps>) {
    const { title, children } = props;
    return (
        <div className="ro-card-header">
            <span className="ro-card-title">{title}</span>
            <div>{children}</div>
        </div>
    );
}
