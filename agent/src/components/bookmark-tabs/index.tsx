import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import { joinLessPrefix } from "utils/framework";
import "./index.less";

type BookmarkTone = "ink" | "sea" | "citrus" | "orchid" | "slate";

export interface BookmarkTabItem {
    id: string;
    title: string;
    url?: string;
    description?: string;
    icon?: React.ReactNode;
    accent?: string;
    tone?: BookmarkTone;
    content?: React.ReactNode;
    onClose?: (id: string) => void;
}

export interface BookmarkTabsProps {
    className?: string;
    items?: BookmarkTabItem[];
    initialActiveId?: string;
    activeId?: string;
    onChange?: (id: string) => void;
    onClose?: (id: string) => void;
    showUrl?: boolean;
    emptyText?: string;
}

const DEFAULT_ITEMS: BookmarkTabItem[] = [
    {
        id: "docs",
        title: "Design Notes",
        url: "https://design.yourstudio.com",
        description: "Typography system, layout decisions, and baseline grid snapshots.",
        tone: "sea",
        content: (
            <div>
                <p>Quick links to the design system, tokens, and layout specs.</p>
                <ul>
                    <li>Spacing scale</li>
                    <li>Type rhythm</li>
                    <li>Component anatomy</li>
                </ul>
            </div>
        ),
    },
    {
        id: "ops",
        title: "Launch Check",
        url: "https://ops.yourstudio.com",
        description: "Release checklist, rollout notes, and incident playbooks.",
        tone: "citrus",
        content: (
            <div>
                <p>Launch checklist, deployment slots, and on-call rules.</p>
                <ul>
                    <li>Pre-flight checks</li>
                    <li>Monitoring dashboards</li>
                    <li>Rollback plan</li>
                </ul>
            </div>
        ),
    },
    {
        id: "inbox",
        title: "Research Queue",
        url: "https://research.yourstudio.com",
        description: "Active briefs, open questions, and experiment outcomes.",
        tone: "orchid",
        content: (
            <div>
                <p>Collects research threads and active hypotheses.</p>
                <ul>
                    <li>Discovery interviews</li>
                    <li>Prototype learnings</li>
                    <li>Next experiments</li>
                </ul>
            </div>
        ),
    },
    {
        id: "stack",
        title: "Frontend Stack",
        url: "https://stack.yourstudio.com",
        description: "Libraries, runtime decisions, and engineering standards.",
        tone: "ink",
        content: (
            <div>
                <p>Current stack decisions and integration guides.</p>
                <ul>
                    <li>Build tooling</li>
                    <li>Design token pipeline</li>
                    <li>Release cadence</li>
                </ul>
            </div>
        ),
    },
];

const TONE_CLASS_MAP: Record<BookmarkTone, string> = {
    ink: "tone-ink",
    sea: "tone-sea",
    citrus: "tone-citrus",
    orchid: "tone-orchid",
    slate: "tone-slate",
};

function resolveToneClass(item: BookmarkTabItem, index: number) {
    if (item.tone) {
        return TONE_CLASS_MAP[item.tone];
    }

    const tones: BookmarkTone[] = ["sea", "citrus", "orchid", "ink", "slate"];
    return TONE_CLASS_MAP[tones[index % tones.length]];
}

function normalizeItems(items?: BookmarkTabItem[]) {
    return items && items.length ? items : DEFAULT_ITEMS;
}

export function BookmarkTabs(props: BookmarkTabsProps) {
    const { className, items, activeId, initialActiveId, onChange, onClose, showUrl = true, emptyText = "暂无书签" } = props;

    const resolvedItems = useMemo(() => normalizeItems(items), [items]);
    const defaultActiveId = resolvedItems[0]?.id;
    const [internalActiveId, setInternalActiveId] = useState(initialActiveId || defaultActiveId);

    const currentActiveId = activeId ?? internalActiveId;
    const currentIndex = resolvedItems.findIndex((item) => item.id === currentActiveId);
    const activeIndex = currentIndex >= 0 ? currentIndex : 0;
    const activeItem = resolvedItems[activeIndex];
    const shellRef = useRef<HTMLDivElement | null>(null);
    const listRef = useRef<HTMLDivElement | null>(null);
    const panelRef = useRef<HTMLDivElement | null>(null);
    const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

    const updateActive = (id: string) => {
        if (activeId === undefined) {
            setInternalActiveId(id);
        }
        onChange?.(id);
    };

    useLayoutEffect(() => {
        const shell = shellRef.current;
        const panel = panelRef.current;
        const tab = tabRefs.current[activeItem?.id || ""];

        if (!shell || !panel || !tab) {
            return;
        }

        const updateConnector = () => {
            const panelRect = panel.getBoundingClientRect();
            const tabRect = tab.getBoundingClientRect();
            const centerX = tabRect.left + tabRect.width / 2;
            const offset = Math.max(32, Math.min(panelRect.width - 32, centerX - panelRect.left));
            shell.style.setProperty("--bookmark-connector-x", `${offset}px`);
        };

        updateConnector();

        const resizeObserver = new ResizeObserver(updateConnector);
        resizeObserver.observe(panel);
        if (listRef.current) {
            resizeObserver.observe(listRef.current);
        }

        window.addEventListener("resize", updateConnector);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener("resize", updateConnector);
        };
    }, [activeItem?.id, resolvedItems.length]);

    return (
        <section className={classNames(joinLessPrefix("bookmark-tabs"), className)}>
            <header className={joinLessPrefix("bookmark-tabs-header")}>
                <div className={joinLessPrefix("bookmark-tabs-title")}>书签切换</div>
                <div className={joinLessPrefix("bookmark-tabs-subtitle")}>像翻阅卡片一样在收藏之间切换</div>
            </header>

            {resolvedItems.length === 0 ? (
                <div className={joinLessPrefix("bookmark-tabs-empty")}>{emptyText}</div>
            ) : (
                <div className={joinLessPrefix("bookmark-tabs-shell")} ref={shellRef}>
                    <div className={joinLessPrefix("bookmark-tabs-list")} role="tablist" aria-label="Bookmarks" ref={listRef}>
                        {resolvedItems.map((item, index) => {
                            const isActive = item.id === activeItem?.id;
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={isActive}
                                    className={classNames(joinLessPrefix("bookmark-tabs-tab"), joinLessPrefix(resolveToneClass(item, index)), {
                                        "is-active": isActive,
                                    })}
                                    ref={(node) => {
                                        tabRefs.current[item.id] = node;
                                    }}
                                    style={item.accent ? ({ "--bookmark-accent": item.accent } as React.CSSProperties) : undefined}
                                    onClick={() => updateActive(item.id)}
                                >
                                    <span className={joinLessPrefix("bookmark-tabs-tab-top")}></span>
                                    <span className={joinLessPrefix("bookmark-tabs-tab-main")}>
                                        <span className={joinLessPrefix("bookmark-tabs-tab-title")}>{item.title}</span>
                                        {showUrl && item.url ? (
                                            <span className={joinLessPrefix("bookmark-tabs-tab-url")}>{item.url.replace(/^https?:\/\//, "")}</span>
                                        ) : null}
                                    </span>
                                    <div
                                        className={joinLessPrefix("bookmark-tabs-tab-close")}
                                        aria-label={`关闭 ${item.title}`}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            item.onClose?.(item.id);
                                            onClose?.(item.id);
                                        }}
                                    >
                                        <span className={joinLessPrefix("bookmark-tabs-tab-close-dot")}></span>
                                        <span className={joinLessPrefix("bookmark-tabs-tab-close-x")}>×</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* <div className={joinLessPrefix("bookmark-tabs-panel")} role="tabpanel">
                        <div className={joinLessPrefix("bookmark-tabs-panel-card")} ref={panelRef}>
                            <div className={joinLessPrefix("bookmark-tabs-panel-header")}>
                                <div>
                                    <div className={joinLessPrefix("bookmark-tabs-panel-title")}>{activeItem?.title}</div>
                                    {activeItem?.description ? (
                                        <div className={joinLessPrefix("bookmark-tabs-panel-desc")}>{activeItem.description}</div>
                                    ) : null}
                                </div>
                                {activeItem?.url ? (
                                    <a className={joinLessPrefix("bookmark-tabs-panel-link")} href={activeItem.url} target="_blank" rel="noreferrer">
                                        打开书签
                                    </a>
                                ) : null}
                            </div>
                            <div className={joinLessPrefix("bookmark-tabs-panel-body")}>
                                {activeItem?.content || <p>在这里放置书签内容或预览。</p>}
                            </div>
                        </div>
                    </div> */}
                </div>
            )}
        </section>
    );
}
