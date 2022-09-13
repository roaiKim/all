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

const baseWidthRate = 0.8;
const maxWidthRate = 0.95;
const pagemodalHeaderHegiht = 46;

export function useContainerRect(props: ContainerRectProps): ContainerRect {
    const { width: originWidth } = props || {};
    const container = useRef(document.querySelector(".ro-module-body"));

    const [bodyRect] = useState<BodyRect>(() => {
        const body = document.body;
        const { width, height } = body.getBoundingClientRect();
        return { bodyWidth: width, bodyHeight: height };
    });

    const calcRect = (width: number, height: number) => {
        const panelWidth = originWidth ? (originWidth > width ? width * maxWidthRate : originWidth) : width * baseWidthRate;
        const maxPanelBodyHeight = (height - pagemodalHeaderHegiht) * maxWidthRate;
        return { panelWidth, maxPanelBodyHeight };
    };

    const [state, setState] = useState<ContainerRect>(() => {
        const containerRef = container.current;
        const { top, right, bottom, left, width, height } = containerRef.getBoundingClientRect();
        const { bodyWidth, bodyHeight } = bodyRect;
        const { panelWidth, maxPanelBodyHeight } = calcRect(width, height);

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
            const { panelWidth, maxPanelBodyHeight } = calcRect(width, height);
            const body = document.body;
            const { width: bodyWidth, height: bodyHeight } = body.getBoundingClientRect();
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

    return state;
}
