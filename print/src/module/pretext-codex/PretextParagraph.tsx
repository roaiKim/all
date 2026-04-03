import type { CSSProperties, ElementType, ReactNode } from "react";
import { useElementWidth } from "./useElementWidth";
import { type PretextWhiteSpace, usePretext } from "./usePretext";

export type PretextParagraphProps<T extends ElementType = "div"> = {
    as?: T;
    text: string;
    font: string;
    lineHeight: number;
    width?: number;
    whiteSpace?: PretextWhiteSpace;
    className?: string;
    style?: CSSProperties;
    lineClassName?: string;
    renderLine?: (lineText: string, index: number) => ReactNode;
};

export function PretextParagraph<T extends ElementType = "div">({
    as,
    text,
    font,
    lineHeight,
    width,
    whiteSpace = "normal",
    className,
    style,
    lineClassName,
    renderLine,
}: PretextParagraphProps<T>) {
    const Component = (as ?? "div") as ElementType;
    const measured = useElementWidth();
    const finalWidth = width ?? measured.width;
    const { lines, height } = usePretext({
        text,
        font,
        width: finalWidth,
        lineHeight,
        whiteSpace,
    });

    return (
        <Component
            ref={width == null ? measured.ref : undefined}
            className={className}
            style={{
                ...style,
                font,
                lineHeight: `${lineHeight}px`,
                minHeight: height,
            }}
        >
            {lines.map((line, index) => {
                const content = renderLine?.(line.text, index) ?? line.text;
                return (
                    <div key={`${index}-${line.text}`} className={lineClassName}>
                        {content}
                    </div>
                );
            })}
        </Component>
    );
}
