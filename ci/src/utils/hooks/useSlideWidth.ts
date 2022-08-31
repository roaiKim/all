import { PageModalPlace } from "components/page-modal";
import { useEffect, useRef, useState } from "react";

interface SlideWidthProps {
    width?: number;
    place?: PageModalPlace;
}

interface WidthState {
    maskLeft: number;
    maskTop: number;
    panelWidth: number;
    maxPanelHeight: number;
    sliderWight: number;
}

export function useSlideWidth(props: SlideWidthProps): WidthState {
    const { width, place } = props;
    const sliderRef = useRef(document.querySelector(".ro-meuns-module"));

    const [state, setState] = useState<WidthState>(() => {
        const body = document.body;
        const slider = sliderRef.current;

        const { width: bodyWidth, height: bodyHeight } = body.getBoundingClientRect();

        let maskWidth = bodyWidth;
        let maskHeight = bodyHeight;
        let otherHegiht = 0;
        let otherWidth = 0;

        if (slider && place === "default") {
            const { width: sliderWight } = slider.getBoundingClientRect() || {};
            otherWidth = sliderWight || 200;
            otherHegiht = 46;

            maskWidth -= otherWidth;
            maskHeight -= otherHegiht;
        }

        const panelWidth = width ? (width > maskWidth ? maskWidth * 0.95 : width) : maskWidth * 0.8;
        const maxPanelHeight = (bodyHeight - 40 - otherHegiht) * 0.96;

        const maskLeft = bodyWidth - maskWidth;
        const maskTop = bodyHeight - maskHeight;

        return { maskLeft, maskTop, panelWidth, maxPanelHeight, sliderWight: otherWidth };
    });

    useEffect(() => {
        const observer = new ResizeObserver((entries) => {
            const entry = entries?.[0];
            const { width } = entry?.contentRect || {};
            setState((prevState) => ({ ...prevState, sliderWight: width || prevState.sliderWight }));
        });
        observer.observe(sliderRef.current);
        return () => observer.disconnect();
    }, []);

    return state;
}
