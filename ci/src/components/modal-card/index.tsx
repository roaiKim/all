import { PropsWithChildren } from "react";
import { ModalCardHeader } from "./card-header";
import "./index.less";

interface ModalCardProps {}

export function ModalCard(props: PropsWithChildren<ModalCardProps>) {
    const { children } = props;
    return (
        <div className="ro-modal-card">
            <div className="ro-card-center">{children}</div>
        </div>
    );
}

ModalCard.Header = ModalCardHeader;
