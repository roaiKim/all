import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { DouyinLoading } from "components/douyin-loading";
import "./index.less";

interface SolarLoadingProps {
    className?: string;
    text?: string;
    loading?: boolean;
    theme?: "dark" | "light";
}

const PLANETS = [
    { name: "Mercury", radius: 40, size: 6, periodYears: 0.24, color: "#c9b8a5" },
    { name: "Venus", radius: 56, size: 8, periodYears: 0.62, color: "#e8c27a" },
    { name: "Earth", radius: 76, size: 9, periodYears: 1, color: "#6fb6ff" },
    { name: "Mars", radius: 94, size: 7, periodYears: 1.88, color: "#f1a07a" },
    { name: "Jupiter", radius: 122, size: 14, periodYears: 11.86, color: "#f3c7a1" },
    { name: "Saturn", radius: 150, size: 12, periodYears: 29.46, color: "#f6d08a", ring: true },
    { name: "Uranus", radius: 176, size: 10, periodYears: 84.01, color: "#9fe0ff" },
    { name: "Neptune", radius: 200, size: 10, periodYears: 164.8, color: "#6f8bff" },
];

const BASE_PERIOD_SECONDS = 3.6;
const EARTH_PERIOD_DAYS = 365.25;
const EPOCH_UTC = Date.UTC(2000, 0, 1, 12, 0, 0);

function getDaysSinceEpoch(date: Date) {
    return (date.getTime() - EPOCH_UTC) / 86400000;
}

function getPhaseOffsetDegrees(daysSinceEpoch: number, periodYears: number) {
    if (periodYears === 1) {
        return 0;
    }

    const periodDays = periodYears * EARTH_PERIOD_DAYS;
    const earthPhase = daysSinceEpoch / EARTH_PERIOD_DAYS;
    const planetPhase = daysSinceEpoch / periodDays;
    const normalized = ((planetPhase - earthPhase) * 360) % 360;

    return normalized < 0 ? normalized + 360 : normalized;
}

export function SolarLoading({ className, text = "正在启动", loading = true, theme = "dark" }: SolarLoadingProps) {
    if (!loading) {
        return null;
    }

    return (
        <div
            className={classNames("ro-solar-loading", className, {
                "is-light": theme === "light",
            })}
            role="status"
            aria-live="polite"
        >
            <div className="ro-solar-loading-shell">
                <div className="ro-solar-loading-system" aria-hidden="true">
                    <div className="ro-solar-loading-sun"></div>
                    {PLANETS.map((planet) => {
                        const duration = `${Math.max(planet.periodYears * BASE_PERIOD_SECONDS, 2.2)}s`;
                        const offset = getPhaseOffsetDegrees(getDaysSinceEpoch(new Date()), planet.periodYears);

                        return (
                            <div
                                key={planet.name}
                                className="ro-solar-loading-orbit"
                                style={
                                    {
                                        "--ro-orbit-radius": `${planet.radius}px`,
                                        "--ro-orbit-duration": duration,
                                        "--ro-orbit-offset": `${offset}deg`,
                                    } as React.CSSProperties
                                }
                            >
                                <span
                                    className={classNames("ro-solar-loading-planet", {
                                        "has-ring": planet.ring,
                                    })}
                                    style={
                                        {
                                            "--ro-planet-size": `${planet.size}px`,
                                            "--ro-planet-color": planet.color,
                                        } as React.CSSProperties
                                    }
                                ></span>
                            </div>
                        );
                    })}
                </div>
                <div className="ro-solar-loading-text">
                    <DouyinLoading text={text}></DouyinLoading>
                </div>
            </div>
        </div>
    );
}
