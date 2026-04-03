import { useEffect, useState } from "react";

export function useElementWidth() {
    const [element, setElement] = useState<HTMLElement | null>(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        if (!element) return;

        const updateWidth = () => {
            setWidth(element.getBoundingClientRect().width);
        };

        updateWidth();

        const observer = new ResizeObserver(() => {
            updateWidth();
        });

        observer.observe(element);
        return () => observer.disconnect();
    }, [element]);

    return {
        ref: setElement,
        width,
    };
}
