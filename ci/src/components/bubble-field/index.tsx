import React, { useState } from "react";
import classNames from "classnames";
import "./index.less";

type BubbleFieldDensity = "sparse" | "normal" | "dense";
type BubbleHorizontalRange = [number, number];

/**
 * BubbleField 组件参数，控制布局、密度和交互范围。
 */
interface BubbleFieldProps {
    /** 容器额外类名。 */
    className?: string;
    /** 指定要渲染的泡泡 id 列表。 */
    bubbleIds?: number[];
    /** 从最终 id 列表里截取前多少个泡泡进行渲染。 */
    bubbleCount?: number;
    /** 控制泡泡整体速度和视觉强度。 */
    density?: BubbleFieldDensity;
    /** 控制泡泡横向初始生成范围，单位为百分比，例如 [[0, 20], [80, 100]]。 */
    horizontalRanges?: BubbleHorizontalRange[];
    /** 是否启用仅两侧显示的快捷模式。 */
    sidesOnly?: boolean;
    /** 预设布局模式。 */
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

/**
 * 将用户传入的横向范围限制在 0-100 之间，并过滤掉无效区间。
 */
function normalizeHorizontalRanges(ranges?: BubbleHorizontalRange[]): BubbleHorizontalRange[] {
    return (ranges || []).reduce<BubbleHorizontalRange[]>((result, [start, end]) => {
        const normalizedStart = Math.max(0, Math.min(100, start));
        const normalizedEnd = Math.max(0, Math.min(100, end));
        const normalizedRange: BubbleHorizontalRange = normalizedStart <= normalizedEnd ? [normalizedStart, normalizedEnd] : [normalizedEnd, normalizedStart];

        if (normalizedRange[1] > normalizedRange[0]) {
            result.push(normalizedRange);
        }

        return result;
    }, []);
}

/**
 * 按多个区间的总宽度比例，把泡泡平均分配到这些横向范围内。
 */
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
    const { bubbleCount, bubbleIds = DEFAULT_BUBBLE_IDS, className, density = "normal", horizontalRanges, sidesOnly = false, variant = "default" } = props;
    const [bubbleVersions, setBubbleVersions] = useState<Record<number, number>>({});
    const [poppedBubbles, setPoppedBubbles] = useState<Record<number, boolean>>({});
    const resolvedBubbleIds = bubbleIds.slice(0, bubbleCount || bubbleIds.length);
    const isSidesMode = sidesOnly || variant === "sides";
    const resolvedHorizontalRanges = normalizeHorizontalRanges(horizontalRanges);

    /**
     * 标记某个泡泡进入破裂状态，由 CSS 动画驱动破裂效果。
     */
    const onBubbleClick = (bubbleId: number) => {
        if (poppedBubbles[bubbleId]) {
            return;
        }

        setPoppedBubbles((prevState) => ({ ...prevState, [bubbleId]: true }));
    };

    /**
     * 在破裂动画结束后重建泡泡，让它重新参与漂浮动画。
     */
    const onBubbleAnimationEnd = (bubbleId: number, event: React.AnimationEvent<HTMLSpanElement>) => {
        if (event.animationName !== "ro-bubble-pop") {
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
            className={classNames("ro-bubble-field", className, `ro-bubble-field-density-${density}`, {
                "ro-bubble-field-sides": isSidesMode,
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
                        className={classNames("ro-bubble-field-item", `ro-bubble-field-item-${item}`, {
                            "is-popped": poppedBubbles[item],
                        })}
                        style={
                            {
                                "--ro-bubble-border": bubbleTint.border,
                                "--ro-bubble-glow": bubbleTint.glow,
                                "--ro-bubble-fill": bubbleTint.fill,
                                "--ro-bubble-ring": bubbleTint.ring,
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
                        <span className="ro-bubble-field-core"></span>
                    </span>
                );
            })}
        </div>
    );
}
