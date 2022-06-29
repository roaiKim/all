import ReactDOM from "react-dom";
import React, { createRef, forwardRef, useEffect, useImperativeHandle, useState } from "react";
import WeToast from "./toast";
import { IconValue } from "components/icon";

interface ToastShowProps {
    content: string | React.ReactNode;
    duration?: number;
    container?: HTMLElement | (() => HTMLElement) | undefined | null;
    afterClose?: () => void;
    icon?: keyof typeof IconValue;
}

export function getContainer(getContainer: HTMLElement | (() => HTMLElement) | undefined | null) {
    const container = typeof getContainer === "function" ? getContainer() : getContainer;
    return container || document.body;
}

type ToastHandler = {
    close: () => void;
};

function show(props: ToastShowProps | string) {
    if (typeof props === "string") {
        props = {
            content: props,
        };
    }
    let timer = 0;
    const { content, duration = 2000, container, afterClose, icon } = props;

    const bodyContainer = getContainer(container);
    const element = document.createElement("div");
    bodyContainer.appendChild(element);

    const TempToast = forwardRef((_, ref) => {
        const [visible, setVisible] = useState(true);

        useImperativeHandle(ref, () => ({
            close: () => {
                setVisible(false);
                bodyContainer.removeChild(element);
            },
        }));

        useEffect(() => {
            return () => {
                afterClose && afterClose();
            };
        }, []);

        useEffect(() => {
            if (duration === 0) {
                return;
            }
            timer = window.setTimeout(() => {
                setVisible(false);
                bodyContainer.removeChild(element);
            }, duration);
            return () => {
                window.clearTimeout(timer);
            };
        }, []);

        return (
            <WeToast icon={icon} show={visible}>
                {content}
            </WeToast>
        );
    });

    const toastRef = createRef<ToastHandler>();
    ReactDOM.render(<TempToast ref={toastRef} />, element);

    return {
        close: () => {
            toastRef.current?.close();
        },
    };
}

export const Toast = {
    show,
};
