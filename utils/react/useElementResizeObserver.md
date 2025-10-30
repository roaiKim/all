```ts
import { useEffect, useState } from "react";
import debounce from "lodash/debounce";

interface DocumentSize {
    width: number;
    height: number;
}

/**
 * 监听 元素的大小变化
 * @param doc 被监听的元素
 * @param frequency 监听评率 ms
 * @returns
 */
export function useElementResizeObserver(element: Element, frequency = 200): DocumentSize {
    const [documentSize, setDocumentSize] = useState<DocumentSize>(() => {
        if (!element) {
            return { width: 0, height: 0 };
        }
        const { width, height } = element.getBoundingClientRect();
        return { width, height };
    });

    useEffect(() => {
        if (element) {
            const debounceCalc = debounce((entries) => {
                const { width, height } = entries[0].contentRect;
                setDocumentSize({ width, height });
            }, frequency);
            const observer = new ResizeObserver((entries) => {
                debounceCalc(entries);
            });
            observer.observe(element);
            return () => observer.disconnect();
        }
    }, [element, frequency]);

    return documentSize;
}
```