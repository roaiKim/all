import { useEffect, useRef, useState } from "react";

interface DocumentSize {
    width: number;
    height: number;
}

export function useDocumentResizeObserver(doc?: Element, frequency?: number): DocumentSize {
    const bodyRef = useRef(doc || document.body);

    const [documentSize, setDocumentSize] = useState<DocumentSize>(() => {
        const body = bodyRef.current;
        const { width, height } = body.getBoundingClientRect();
        return { width, height };
    });

    useEffect(() => {
        const observer = new ResizeObserver((entries) => {
            const { width, height } = entries[0].contentRect;
            setDocumentSize({ width, height });
        });
        observer.observe(bodyRef.current);
        return () => observer.disconnect();
    }, []);

    return documentSize;
}
