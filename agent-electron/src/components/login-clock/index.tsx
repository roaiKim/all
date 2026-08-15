import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { joinLessPrefix } from "utils/framework";
import "./index.less";

function formatTime(date: Date) {
    return new Intl.DateTimeFormat("zh-CN", {
        hour: "2-digit",
        hour12: false,
        minute: "2-digit",
        second: "2-digit",
    }).format(date);
}

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("zh-CN", {
        day: "numeric",
        month: "long",
        weekday: "short",
    }).format(date);
}

export function LoginClock() {
    const [clock, setClock] = useState(() => {
        const now = new Date();
        const timeText = formatTime(now);

        return {
            currentTimeText: timeText,
            dateText: formatDate(now),
            previousTimeText: timeText,
        };
    });

    useEffect(() => {
        const timer = window.setInterval(() => {
            const now = new Date();
            const nextTimeText = formatTime(now);

            setClock((prevState) => ({
                currentTimeText: nextTimeText,
                dateText: formatDate(now),
                previousTimeText: prevState.currentTimeText,
            }));
        }, 1000);

        return () => {
            window.clearInterval(timer);
        };
    }, []);

    return (
        <div className={joinLessPrefix("login-clock")}>
            <div className={joinLessPrefix("login-clock-time")} aria-label={clock.currentTimeText}>
                {(() => {
                    let digitOrder = -1;

                    return clock.currentTimeText.split("").map((char, index) => {
                        const previousChar = clock.previousTimeText[index] || char;
                        const isSeparator = char === ":";
                        const isFlipping = !isSeparator && previousChar !== char;

                        if (isSeparator) {
                            return (
                                <span key={`separator-${index}`} className={joinLessPrefix("login-clock-separator")} aria-hidden="true">
                                    <span className={joinLessPrefix("login-clock-separator-dot")}></span>
                                    <span className={joinLessPrefix("login-clock-separator-dot")}></span>
                                </span>
                            );
                        }

                        digitOrder += 1;
                        const isSecondDigit = digitOrder >= 4;

                        return (
                            <span
                                key={`digit-${index}`}
                                className={classNames(joinLessPrefix("login-clock-digit"), {
                                    "is-flipping": isFlipping,
                                    "is-second": isSecondDigit,
                                })}
                            >
                                <span className={`${joinLessPrefix("login-clock-digit-face")} ${joinLessPrefix("login-clock-digit-face-top")}`}>
                                    <span className={`${joinLessPrefix("login-clock-digit-value")} ${joinLessPrefix("login-clock-digit-value-top")}`}>
                                        {char}
                                    </span>
                                </span>
                                <span className={`${joinLessPrefix("login-clock-digit-face")} ${joinLessPrefix("login-clock-digit-face-bottom")}`}>
                                    <span
                                        className={`${joinLessPrefix("login-clock-digit-value")} ${joinLessPrefix("login-clock-digit-value-bottom")}`}
                                    >
                                        {char}
                                    </span>
                                </span>
                                {isFlipping ? (
                                    <>
                                        <span
                                            key={`front-${index}-${previousChar}-${char}-${clock.currentTimeText}`}
                                            className={`${joinLessPrefix("login-clock-digit-flap")} ${joinLessPrefix("login-clock-digit-flap-front")}`}
                                            aria-hidden="true"
                                        >
                                            <span
                                                className={`${joinLessPrefix("login-clock-digit-value")} ${joinLessPrefix("login-clock-digit-value-top")}`}
                                            >
                                                {previousChar}
                                            </span>
                                        </span>
                                        <span
                                            key={`back-${index}-${previousChar}-${char}-${clock.currentTimeText}`}
                                            className={`${joinLessPrefix("login-clock-digit-flap")} ${joinLessPrefix("login-clock-digit-flap-back")}`}
                                            aria-hidden="true"
                                        >
                                            <span
                                                className={`${joinLessPrefix("login-clock-digit-value")} ${joinLessPrefix("login-clock-digit-value-bottom")}`}
                                            >
                                                {char}
                                            </span>
                                        </span>
                                        <span
                                            className={`${joinLessPrefix("login-clock-digit-shadow")} ${joinLessPrefix("login-clock-digit-shadow-top")}`}
                                            aria-hidden="true"
                                        ></span>
                                        <span
                                            className={`${joinLessPrefix("login-clock-digit-shadow")} ${joinLessPrefix("login-clock-digit-shadow-bottom")}`}
                                            aria-hidden="true"
                                        ></span>
                                    </>
                                ) : null}
                            </span>
                        );
                    });
                })()}
            </div>
            <span className={joinLessPrefix("login-clock-date")}>{clock.dateText}</span>
        </div>
    );
}
