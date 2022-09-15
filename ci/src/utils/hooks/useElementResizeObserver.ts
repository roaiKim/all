import { useEffect, useRef, useState } from "react";
import { debounce } from "utils/function";

interface DocumentSize {
    width: number;
    height: number;
}

/**
 * 监听 元素的大小变化
 * @param doc
 * @param frequency
 * @returns
 */
export function useElementResizeObserver(doc?: Element, frequency: number = 200): DocumentSize {
    const bodyRef = useRef(doc || document.body);

    const [documentSize, setDocumentSize] = useState<DocumentSize>(() => {
        const body = bodyRef.current;
        const { width, height } = body.getBoundingClientRect();
        return { width, height };
    });

    useEffect(() => {
        const debounceCalc = debounce((entries) => {
            const { width, height } = entries[0].contentRect;
            setDocumentSize({ width, height });
        }, frequency);
        const observer = new ResizeObserver((entries) => {
            debounceCalc(entries);
        });
        observer.observe(bodyRef.current);
        return () => observer.disconnect();
    }, []);

    return documentSize;
}
