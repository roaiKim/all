import { PageModalPlace } from "components/page-modal";
import { useEffect, useMemo, useRef, useState } from "react";
import { debounce } from "utils/function";

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

const baseWidthRate = 0.8;
const maxWidthRate = 0.95;
const pagemodalHeaderHegiht = 46;

const calcRect = ({ container, originWidth }) => {
    const { top, right, bottom, left, width, height } = container.getBoundingClientRect();

    const body = document.body;
    const { width: bodyWidth, height: bodyHeight } = body.getBoundingClientRect();

    const panelWidth = originWidth ? (originWidth > width ? width * maxWidthRate : originWidth) : width * baseWidthRate;
    const maxPanelBodyHeight = (height - pagemodalHeaderHegiht) * maxWidthRate;

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
};

/**
 * 用于 PageModal 弹窗，监听文档高度变化
 * @param props
 * @returns
 */
export function useContainerRect(props?: ContainerRectProps): ContainerRect {
    const { width: originWidth, place } = props || {};

    const container = useMemo(() => {
        let element = undefined;
        if (place === undefined || place === "default") {
            element = document.querySelector(".ro-module-body");
        } else if (place === "global") {
            element = document.body;
        } else if (typeof place === "object") {
            element = place;
        }
        return element || document.body;
    }, []);

    const [state, setState] = useState<ContainerRect>(() => {
        return calcRect({ container, originWidth });
    });

    useEffect(() => {
        const debounceCalc = debounce(() => {
            const rect = calcRect({ container, originWidth });
            setState(rect);
        }, 200);
        const observer = new ResizeObserver((entries) => {
            debounceCalc();
        });
        observer.observe(container);
        return () => observer.disconnect();
    }, []);

    return state;
}
