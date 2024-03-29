import { useEffect, useMemo, useState } from "react";
import { PageModalPlace } from "components/page-modal";
import { debounce } from "utils/function";

interface ContainerRectProps {
    width?: number;
    place?: PageModalPlace;
    frequency?: number;
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
const maxHeightRate = 0.95;
const pagemodalHeaderHegiht = 46;

/**
 * @description 计算矩形相对于值的
 * @param param0
 * @returns
 */
const calcRect = ({ container, originWidth }) => {
    const { top, right, bottom, left, width, height } = container.getBoundingClientRect();

    const body = document.body;
    const { width: bodyWidth, height: bodyHeight } = body.getBoundingClientRect();

    const panelWidth = originWidth ? (originWidth > width ? width * maxWidthRate : originWidth) : width * baseWidthRate;
    const maxPanelBodyHeight = (height - pagemodalHeaderHegiht) * maxHeightRate;

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
    const { width: originWidth, place, frequency = 80 } = props || {};

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
        }, frequency);
        const observer = new ResizeObserver((entries) => {
            debounceCalc();
        });
        observer.observe(container);
        return () => observer.disconnect();
    }, []);

    return state;
}
