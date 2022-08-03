import { useEffect, useRef, useState } from "react";

interface SlideWidthProps {
    width?: number;
}

interface WidthState {
    panelWidth: number;
    maxPanelHeight: number;
    sliderWight: number;
}

export function useSlideWidth(props: SlideWidthProps): WidthState {
    const { width } = props;
    const sliderRef = useRef(document.querySelector(".ro-meuns-module"));

    const [state, setState] = useState<WidthState>(() => {
        const body = document.body;
        const slider = sliderRef.current;

        const { width: bodyWidth, height: bodyHeight } = body.getBoundingClientRect();
        const { width: sliderWight } = slider?.getBoundingClientRect() || {};

        const parentWidth = bodyWidth - sliderWight || 200;
        const panelWidth = width ? (width > parentWidth ? parentWidth * 0.95 : width) : parentWidth * 0.8;
        const maxPanelHeight = (bodyHeight - 96) * 0.96;

        return { panelWidth, maxPanelHeight, sliderWight: sliderWight || 200 };
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
