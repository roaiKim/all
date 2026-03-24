import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";
import { prefixCls } from "config/static-constant";
import "./index.less";

type PageLoadingContainerTarget = HTMLElement | string | null | undefined;

interface PageLoadingProps {
    className?: string;
    text?: string;
    tip?: string;
    show?: boolean;
    theme?: "dark" | "light";
    container?: PageLoadingContainerTarget;
    mountTo?: PageLoadingContainerTarget;
}

function resolveContainerTarget(container: PageLoadingContainerTarget) {
    if (typeof window === "undefined" || !container) {
        return null;
    }

    if (typeof container === "string") {
        return document.querySelector<HTMLElement>(container);
    }

    return container instanceof HTMLElement ? container : null;
}

export function PageLoading({
    className,
    text = "正在加载",
    tip = "请稍候，正在准备页面内容",
    show = true,
    theme = "light",
    container,
    mountTo,
}: PageLoadingProps) {
    const anchorRef = useRef<HTMLSpanElement>(null);
    const [portalHost, setPortalHost] = useState<HTMLElement | null>(null);
    const targetContainer = container ?? mountTo;
    const isFullscreen = !targetContainer;

    useEffect(() => {
        if (!show || isFullscreen) {
            setPortalHost(null);
            return;
        }

        const target = resolveContainerTarget(targetContainer) ?? anchorRef.current?.parentElement ?? null;
        setPortalHost(target);
    }, [isFullscreen, show, targetContainer]);

    useEffect(() => {
        if (!portalHost || isFullscreen || typeof window === "undefined") {
            return;
        }

        const computedPosition = window.getComputedStyle(portalHost).position;

        if (computedPosition !== "static") {
            return;
        }

        const previousInlinePosition = portalHost.style.position;
        portalHost.style.position = "relative";

        return () => {
            if (previousInlinePosition) {
                portalHost.style.position = previousInlinePosition;
            } else {
                portalHost.style.removeProperty("position");
            }
        };
    }, [isFullscreen, portalHost]);

    const loadingNode = useMemo(
        () => (
            <div
                className={classNames(prefixCls("page-loading"), className, {
                    "is-light": theme === "light",
                    "is-dark": theme === "dark",
                    "is-fullscreen": isFullscreen,
                    "is-contained": !isFullscreen,
                })}
                role="status"
                aria-live="polite"
            >
                <div className={prefixCls("page-loading-shell")}>
                    <div className={prefixCls("page-loading-visual")} aria-hidden="true">
                        <span className={`${prefixCls("page-loading-halo")} ${prefixCls("page-loading-halo-outer")}`}></span>
                        <span className={`${prefixCls("page-loading-halo")} ${prefixCls("page-loading-halo-inner")}`}></span>
                        <span className={`${prefixCls("page-loading-ring")} ${prefixCls("page-loading-ring-track")}`}></span>
                        <span className={`${prefixCls("page-loading-ring")} ${prefixCls("page-loading-ring-primary")}`}></span>
                        <span className={`${prefixCls("page-loading-ring")} ${prefixCls("page-loading-ring-secondary")}`}></span>
                        <span className={prefixCls("page-loading-core")}></span>
                        <span className={prefixCls("page-loading-pulse")}></span>
                        <div className={prefixCls("page-loading-dots")}>
                            <span className={prefixCls("page-loading-dot")}></span>
                            <span className={prefixCls("page-loading-dot")}></span>
                            <span className={prefixCls("page-loading-dot")}></span>
                        </div>
                    </div>
                    <div className={prefixCls("page-loading-text")}>
                        <span className={prefixCls("page-loading-title")}>{text}</span>
                        <span className={prefixCls("page-loading-tip")}>{tip}</span>
                        <span className={prefixCls("page-loading-progress")} aria-hidden="true">
                            <span className={prefixCls("page-loading-progress-bar")}></span>
                        </span>
                    </div>
                </div>
            </div>
        ),
        [className, isFullscreen, text, theme, tip]
    );

    if (!show) {
        return null;
    }

    if (isFullscreen) {
        return loadingNode;
    }

    return (
        <>
            <span ref={anchorRef} className={prefixCls("page-loading-anchor")} aria-hidden="true"></span>
            {portalHost ? createPortal(loadingNode, portalHost) : null}
        </>
    );
}
