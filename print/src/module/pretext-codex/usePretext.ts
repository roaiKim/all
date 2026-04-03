import { useMemo } from "react";
import { type LayoutLine, layoutWithLines, prepareWithSegments } from "@chenglou/pretext";

export type PretextWhiteSpace = "normal" | "pre-wrap";

export type UsePretextOptions = {
    text: string;
    font: string;
    width: number;
    lineHeight: number;
    whiteSpace?: PretextWhiteSpace;
};

export type UsePretextResult = {
    lines: LayoutLine[];
    height: number;
    lineCount: number;
};

export function usePretext({ text, font, width, lineHeight, whiteSpace = "normal" }: UsePretextOptions): UsePretextResult {
    const prepared = useMemo(() => prepareWithSegments(text, font, { whiteSpace }), [font, text, whiteSpace]);

    return useMemo(() => {
        if (width <= 0) {
            return {
                lines: [],
                height: 0,
                lineCount: 0,
            };
        }

        return layoutWithLines(prepared, width, lineHeight);
    }, [lineHeight, prepared, width]);
}
