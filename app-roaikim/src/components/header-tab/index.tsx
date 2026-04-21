import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import { joinLessPrefix } from "utils/framework";
import "./index.less";

export interface HeaderTabsProps {
    className?: string;
    tabs: any[];
    activeId?: string;
    onChange?: (id: string) => void;
    onClose?: (id: string) => void;
}

export function HeaderTabs(props: HeaderTabsProps) {
    const { className, tabs = [], onChange, activeId, onClose } = props;

    return (
        <section className={classNames(joinLessPrefix("header-tabs"), className)}>
            <div className={joinLessPrefix("header-tabs-list")} role="tablist" aria-label="Bookmarks">
                {tabs.map((item, index) => {
                    const isActive = item.id === activeId;
                    return (
                        <button
                            key={item.id}
                            aria-selected={isActive}
                            className={classNames(joinLessPrefix("header-tabs-tab"), {
                                "is-active": isActive,
                            })}
                            onClick={() => {}}
                        >
                            <span className={joinLessPrefix("header-tabs-tab-top")}></span>
                            <span className={joinLessPrefix("header-tabs-tab-title")}>{item.title}</span>
                            <div
                                className={joinLessPrefix("header-tabs-tab-close")}
                                aria-label={`关闭 ${item.title}`}
                                onClick={(event) => {
                                    event.stopPropagation();
                                }}
                            >
                                <span className={joinLessPrefix("header-tabs-tab-close-dot")}></span>
                                <span className={joinLessPrefix("header-tabs-tab-close-x")}>×</span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}
