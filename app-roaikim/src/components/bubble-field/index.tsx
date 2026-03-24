import React, { useState } from "react";
import classNames from "classnames";
import { lessPrefixName, prefixCls } from "config/static-constant";
import "./index.less";

type BubbleFieldDensity = "sparse" | "normal" | "dense";
type BubbleHorizontalRange = [number, number];

interface BubbleFieldProps {
    className?: string;
    bubbleIds?: number[];
    bubbleCount?: number;
    density?: BubbleFieldDensity;
    horizontalRanges?: BubbleHorizontalRange[];
    sidesOnly?: boolean;
    variant?: "default" | "sides";
}

const DEFAULT_BUBBLE_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
const BUBBLE_TINTS = [
    { border: "rgba(147, 197, 253, 0.82)", glow: "rgba(59, 130, 246, 0.5)", fill: "rgba(59, 130, 246, 0.44)", ring: "rgba(191, 219, 254, 0.88)" },
    { border: "rgba(103, 232, 249, 0.84)", glow: "rgba(8, 145, 178, 0.48)", fill: "rgba(34, 211, 238, 0.42)", ring: "rgba(165, 243, 252, 0.9)" },
    { border: "rgba(110, 231, 183, 0.82)", glow: "rgba(5, 150, 105, 0.46)", fill: "rgba(16, 185, 129, 0.38)", ring: "rgba(167, 243, 208, 0.88)" },
    { border: "rgba(196, 181, 253, 0.84)", glow: "rgba(124, 58, 237, 0.48)", fill: "rgba(168, 85, 247, 0.42)", ring: "rgba(221, 214, 254, 0.9)" },
    { border: "rgba(251, 182, 206, 0.82)", glow: "rgba(219, 39, 119, 0.42)", fill: "rgba(244, 114, 182, 0.36)", ring: "rgba(251, 207, 232, 0.88)" },
];

function getBubbleTint(bubbleId: number, version: number) {
    return BUBBLE_TINTS[(bubbleId + version) % BUBBLE_TINTS.length];
}

function normalizeHorizontalRanges(ranges?: BubbleHorizontalRange[]): BubbleHorizontalRange[] {
    return (ranges || []).reduce<BubbleHorizontalRange[]>((result, [start, end]) => {
        const normalizedStart = Math.max(0, Math.min(100, start));
        const normalizedEnd = Math.max(0, Math.min(100, end));
        const normalizedRange: BubbleHorizontalRange =
            normalizedStart <= normalizedEnd ? [normalizedStart, normalizedEnd] : [normalizedEnd, normalizedStart];

        if (normalizedRange[1] > normalizedRange[0]) {
            result.push(normalizedRange);
        }

        return result;
    }, []);
}

function getBubbleLeft(index: number, total: number, ranges: BubbleHorizontalRange[]) {
    if (!ranges.length || total <= 0) {
        return undefined;
    }

    const totalWidth = ranges.reduce((sum, [start, end]) => sum + (end - start), 0);

    if (totalWidth <= 0) {
        return undefined;
    }

    const target = ((index + 0.5) / total) * totalWidth;
    let passedWidth = 0;

    for (const [start, end] of ranges) {
        const rangeWidth = end - start;
        const rangeLimit = passedWidth + rangeWidth;

        if (target <= rangeLimit) {
            const offset = target - passedWidth;
            const percent = start + offset;
            return Math.max(start, Math.min(end, percent));
        }

        passedWidth = rangeLimit;
    }

    return ranges[ranges.length - 1][1];
}

export function BubbleField(props: BubbleFieldProps) {
    const {
        bubbleCount,
        bubbleIds = DEFAULT_BUBBLE_IDS,
        className,
        density = "normal",
        horizontalRanges,
        sidesOnly = false,
        variant = "default",
    } = props;
    const [bubbleVersions, setBubbleVersions] = useState<Record<number, number>>({});
    const [poppedBubbles, setPoppedBubbles] = useState<Record<number, boolean>>({});
    const resolvedBubbleIds = bubbleIds.slice(0, bubbleCount || bubbleIds.length);
    const isSidesMode = sidesOnly || variant === "sides";
    const resolvedHorizontalRanges = normalizeHorizontalRanges(horizontalRanges);

    const onBubbleClick = (bubbleId: number) => {
        if (poppedBubbles[bubbleId]) {
            return;
        }

        setPoppedBubbles((prevState) => ({ ...prevState, [bubbleId]: true }));
    };

    const onBubbleAnimationEnd = (bubbleId: number, event: React.AnimationEvent<HTMLSpanElement>) => {
        if (event.animationName !== `${lessPrefixName}-bubble-pop`) {
            return;
        }

        setBubbleVersions((prevState) => ({
            ...prevState,
            [bubbleId]: (prevState[bubbleId] || 0) + 1,
        }));
        setPoppedBubbles((prevState) => ({ ...prevState, [bubbleId]: false }));
    };

    return (
        <div
            className={classNames(prefixCls("bubble-field"), className, prefixCls(`bubble-field-density-${density}`), {
                [prefixCls("bubble-field-sides")]: isSidesMode,
            })}
            aria-hidden="true"
        >
            {resolvedBubbleIds.map((item, index) => {
                const bubbleVersion = bubbleVersions[item] || 0;
                const bubbleTint = getBubbleTint(item, bubbleVersion);
                const bubbleLeft = getBubbleLeft(index, resolvedBubbleIds.length, resolvedHorizontalRanges);

                return (
                    <span
                        key={`${item}-${bubbleVersion}`}
                        className={classNames(prefixCls("bubble-field-item"), prefixCls(`bubble-field-item-${item}`), {
                            "is-popped": poppedBubbles[item],
                        })}
                        style={
                            {
                                [`--${lessPrefixName}-bubble-border`]: bubbleTint.border,
                                [`--${lessPrefixName}-bubble-glow`]: bubbleTint.glow,
                                [`--${lessPrefixName}-bubble-fill`]: bubbleTint.fill,
                                [`--${lessPrefixName}-bubble-ring`]: bubbleTint.ring,
                                left: bubbleLeft === undefined ? undefined : `${bubbleLeft}%`,
                            } as React.CSSProperties
                        }
                        onAnimationEnd={(event) => {
                            onBubbleAnimationEnd(item, event);
                        }}
                        onClick={() => {
                            onBubbleClick(item);
                        }}
                    >
                        <span className={prefixCls("bubble-field-core")}></span>
                    </span>
                );
            })}
        </div>
    );
}
