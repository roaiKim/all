import { useEffect, useMemo, useRef, useState } from "react";
import { closestCenter, DndContext, type DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { arrayMove, horizontalListSortingStrategy, SortableContext, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { type ChromeStyleTabType, TabItem } from "./tab";
import { NextSvg, PrevSvg } from "./tab-path";
import "./index.less";

interface ChromeStyleTabsProps {
    /**
     * @description default ActiveKey
     */
    defaultActiveKey?: string | number;

    /**
     * @description activeKey
     */
    activeKey?: string | number;

    /**
     * @description tabs 数据
     */
    tabs: ChromeStyleTabType[];

    /**
     * @description 是否可拖拽
     * @default true
     */
    draggable?: boolean;

    /**
     * @description tab 点击事件
     * @param tab 当前点击的 tab
     * @param index 当前点击元素的index
     * @returns void
     */
    onClick?: (tab: ChromeStyleTabType, index: number) => void;

    /**
     * @description  tab close 事件
     * @param tab 当前点击的元素
     * @param index 当前点击元素的index
     * @param tabs close 后的元素的copy副本
     * @returns void
     */
    onClose?: (tab: ChromeStyleTabType, index: number, tabs: ChromeStyleTabType[]) => void;

    /**
     * @description 切换 tab 事件
     * @param key activekey
     * @returns void
     */
    onChange?: (key: string | number) => void;

    /**
     * @description 拖拽事件 需要 draggable 为 true (draggable default is true)
     * @param tabs 拖拽后的 tabs
     * @returns void
     */
    onDrag?: (tabs: ChromeStyleTabType[]) => void;

    /**
     * @description className
     */
    className?: string;

    /**
     * @description style
     */
    style?: React.CSSProperties;
}

const scrollStep = 100;

function ChromeStyleTabs(props: ChromeStyleTabsProps) {
    const { tabs = [], activeKey, defaultActiveKey, onClick, onClose, onChange, draggable = true, onDrag, className, style } = props;
    const [activeTabKey, setActiveTabKey] = useState(defaultActiveKey);

    const tabContainerRef = useRef(null);
    const observerRef = useRef(null);

    const [prevAndNextBtnConfig, setPrevAndNextBtnConfig] = useState<Record<"prev" | "next", boolean>>({
        prev: false,
        next: false,
    });

    const onTabClose = (active: string | number) => {
        const index = tabs.findIndex((item) => item.key === active);
        const currentCloseTab = tabs[index];
        const afterTabs = tabs.filter((item) => item.key !== active);
        if (onClose) {
            onClose(currentCloseTab, index, afterTabs);
        }
        if (active === activeTabKey) {
            // has next tab
            const nextTab = tabs[index + 1];
            if (nextTab) {
                const nextActive = nextTab.key;
                setActiveTabKey(nextActive);
            } else {
                const nextActive = tabs[index - 1]?.key || "";
                setActiveTabKey(nextActive);
            }
        }
    };

    const onTabClick = (tab: ChromeStyleTabType, index: number) => {
        if (onClick) {
            onClick(tab, index);
        }
        if (activeTabKey !== tab.key) {
            setActiveTabKey(tab.key);
        }
    };

    const tabContainerWheel = (event) => {
        if (!tabContainerRef.current) return;
        tabContainerRef.current.scrollLeft += event.deltaY;
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        if (!draggable || !onDrag) return;
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = tabs.findIndex((item) => item.key === active.id);
            const newIndex = tabs.findIndex((item) => item.key === over.id);
            const afterTabs = arrayMove(tabs, oldIndex, newIndex);
            onDrag(afterTabs);
        }
    };

    const stepScrollTab = (delta: number) => {
        tabContainerRef.current.scrollLeft += delta;
    };

    const tabObserver = () => {
        const box = tabContainerRef.current;
        const firstTab = document.querySelector<HTMLDivElement>(".cst-first-tab"); // 第一个元素
        const lastTab = document.querySelector<HTMLDivElement>(".cst-last-tab"); // 最后一个元素
        if (!box || (!firstTab && !lastTab)) return;

        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        const options = {
            root: box, // 默认视口作为根
            rootMargin: "0px", // 扩展/缩小检测区域
            threshold: 0.7, // 元素可见比例达到50%时触发
        };

        // 创建观察器
        observerRef.current = new IntersectionObserver((entries, order) => {
            entries.forEach((entry, index) => {
                if (entry.target) {
                    const element = entry.target as HTMLDivElement;
                    if (element.dataset?.index === "first") {
                        const prev = !entry.isIntersecting;
                        setPrevAndNextBtnConfig((prevState) => ({ ...prevState, prev }));
                    } else if (element.dataset?.index === "last") {
                        const next = !entry.isIntersecting;
                        setPrevAndNextBtnConfig((prevState) => ({ ...prevState, next }));
                    }
                }
            });
        }, options);

        if (firstTab) {
            firstTab.dataset.index = "first";
            observerRef.current.observe(firstTab);
        }
        if (lastTab) {
            lastTab.dataset.index = "last";
            observerRef.current.observe(lastTab);
        }
    };

    useEffect(() => {
        setActiveTabKey(activeKey);
    }, [activeKey]);

    useEffect(() => {
        if (onChange) {
            onChange(activeTabKey);
        }
    }, [activeTabKey]);

    useEffect(() => {
        tabObserver();
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [tabs]);

    const memoTabs = useMemo(() => (tabs || []).map((item) => ({ ...item, id: item.key })), [tabs]);

    return (
        <div className={`cst-container cst-tabs ${className}`} style={{ ...(style || {}) }}>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToHorizontalAxis]}
                autoScroll={{ threshold: { x: 0.2, y: 0 } }}
            >
                <div className={`cst-prev-btn ${prevAndNextBtnConfig.prev ? "show" : "hide"}`} onClick={() => stepScrollTab(-scrollStep)}>
                    <PrevSvg />
                </div>
                <SortableContext disabled={!draggable} items={memoTabs} strategy={horizontalListSortingStrategy}>
                    <div className="cst-box" ref={tabContainerRef} onWheel={tabContainerWheel}>
                        {tabs.map((item, index) => (
                            <TabItem
                                index={index}
                                key={item.key}
                                isActive={activeTabKey === item.key}
                                onClick={onTabClick}
                                onClose={onTabClose}
                                tab={item}
                                isFirstTab={!index}
                                isLastTab={tabs.length === index + 1}
                            ></TabItem>
                        ))}
                    </div>
                </SortableContext>
                <div className={`cst-next-btn ${prevAndNextBtnConfig.next ? "show" : "hide"}`} onClick={() => stepScrollTab(scrollStep)}>
                    <NextSvg />
                </div>
            </DndContext>
            <div className="cst-bottom-bar"></div>
        </div>
    );
}

export default ChromeStyleTabs;
