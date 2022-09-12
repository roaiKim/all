import { PageModalPlace } from "components/page-modal";
import { useEffect, useRef, useState } from "react";

interface ContainerRectProps {
    width?: number;
    place?: PageModalPlace;
}

interface ContainerRect {
    top: number;
    right: number;
    bottom: number;
    left: number;
    width: number;
    height: number;
    panelWidth: number;
    maxPanelBodyHeight: number;
}

interface BodyRect {
    bodyWidth: number;
    bodyHeight: number;
}

export function useContainerRect(props: ContainerRectProps): ContainerRect {
    const { width: originWidth } = props || {};
    const container = useRef(document.querySelector(".ro-module-body"));

    const [bodyRect] = useState<BodyRect>(() => {
        const body = document.body;
        const { width, height } = body.getBoundingClientRect();
        return { bodyWidth: width, bodyHeight: height };
    });

    const [state, setState] = useState<ContainerRect>(() => {
        const containerRef = container.current;
        const { top, right, bottom, left, width, height } = containerRef.getBoundingClientRect();
        const { bodyWidth, bodyHeight } = bodyRect;
        const panelWidth = originWidth ? (originWidth > width ? width * 0.95 : originWidth) : width * 0.8;
        const maxPanelBodyHeight = (height - 46) * 0.96;

        return {
            top,
            right: bodyWidth - right,
            bottom: bodyHeight - bottom,
            left,
            width,
            height,
            panelWidth,
            maxPanelBodyHeight,
        };
    });

    useEffect(() => {
        const observer = new ResizeObserver((entries) => {
            const containerRef = container.current;
            const { top, right, bottom, left, width, height } = containerRef.getBoundingClientRect();
            const { bodyWidth, bodyHeight } = bodyRect;
            const panelWidth = originWidth ? (originWidth > width ? width * 0.95 : originWidth) : width * 0.8;
            const maxPanelBodyHeight = (height - 46) * 0.96;

            setState({
                top,
                right: bodyWidth - right,
                bottom: bodyHeight - bottom,
                left,
                width,
                height,
                panelWidth,
                maxPanelBodyHeight,
            });
        });
        observer.observe(container.current);
        return () => observer.disconnect();
    }, []);
    console.log("useContainerRect", state);
    return state;
}
