import React, { useState } from "react";
import classNames from "classnames";
import "./index.less";

type BubbleFieldDensity = "sparse" | "normal" | "dense";

interface BubbleFieldProps {
    className?: string;
    bubbleIds?: number[];
    bubbleCount?: number;
    density?: BubbleFieldDensity;
    sidesOnly?: boolean;
    variant?: "default" | "sides";
}

const DEFAULT_BUBBLE_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

export function BubbleField(props: BubbleFieldProps) {
    const { bubbleCount, bubbleIds = DEFAULT_BUBBLE_IDS, className, density = "normal", sidesOnly = false, variant = "default" } = props;
    const [bubbleVersions, setBubbleVersions] = useState<Record<number, number>>({});
    const [poppedBubbles, setPoppedBubbles] = useState<Record<number, boolean>>({});
    const resolvedBubbleIds = bubbleIds.slice(0, bubbleCount || bubbleIds.length);
    const isSidesMode = sidesOnly || variant === "sides";

    const onBubbleClick = (bubbleId: number) => {
        if (poppedBubbles[bubbleId]) {
            return;
        }

        setPoppedBubbles((prevState) => ({ ...prevState, [bubbleId]: true }));
    };

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
            {resolvedBubbleIds.map((item) => (
                <span
                    key={`${item}-${bubbleVersions[item] || 0}`}
                    className={classNames("ro-bubble-field-item", `ro-bubble-field-item-${item}`, {
                        "is-popped": poppedBubbles[item],
                    })}
                    onAnimationEnd={(event) => {
                        onBubbleAnimationEnd(item, event);
                    }}
                    onClick={() => {
                        onBubbleClick(item);
                    }}
                >
                    <span className="ro-bubble-field-core"></span>
                </span>
            ))}
        </div>
    );
}
