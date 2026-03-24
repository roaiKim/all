import React from "react";
import classNames from "classnames";
import "./index.less";

interface PageLoadingProps {
    className?: string;
    text?: string;
    tip?: string;
    show?: boolean;
}

export function PageLoading({ className, text = "加载中", tip, show = true }: PageLoadingProps) {
    if (!show) {
        return null;
    }

    return (
        <div className={classNames("ro-page-loading", className)} role="status" aria-live="polite">
            <div className="ro-page-loading-shell">
                <div className="ro-page-loading-orbit" aria-hidden="true">
                    <span className="ro-page-loading-orbit-ring ro-page-loading-orbit-ring-outer"></span>
                    <span className="ro-page-loading-orbit-ring ro-page-loading-orbit-ring-inner"></span>
                    <span className="ro-page-loading-orbit-core"></span>
                    <span className="ro-page-loading-orbit-dot ro-page-loading-orbit-dot-1">
                        <span className="ro-page-loading-orbit-dot-core"></span>
                    </span>
                    <span className="ro-page-loading-orbit-dot ro-page-loading-orbit-dot-2">
                        <span className="ro-page-loading-orbit-dot-core"></span>
                    </span>
                    <span className="ro-page-loading-orbit-dot ro-page-loading-orbit-dot-3">
                        <span className="ro-page-loading-orbit-dot-core"></span>
                    </span>
                </div>
                <div className="ro-page-loading-text">
                    <span className="ro-page-loading-title">{text}</span>
                    {tip ? <span className="ro-page-loading-tip">{tip}</span> : null}
                </div>
            </div>
        </div>
    );
}
