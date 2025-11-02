import React, { useCallback, useEffect, useRef, useState } from "react";

const DraggableItem = React.memo(({ id, baseLeft, baseTop, deltaX, deltaY, isDragging }) => {
    return (
        <div
            data-draggable-id={id}
            style={{
                width: "100px",
                height: "100px",
                background: isDragging ? "lightgreen" : "skyblue",
                cursor: "move",
                position: "absolute",
                userSelect: "none",
                border: "1px solid #333",
                // 拖动中用transform，结束后用left/top（核心同步逻辑）
                left: `${isDragging ? baseLeft : baseLeft + deltaX}px`,
                top: `${isDragging ? baseTop : baseTop + deltaY}px`,
                transform: isDragging ? `translate(${deltaX}px, ${deltaY}px)` : "none",
                willChange: isDragging ? "transform" : "auto",
                zIndex: isDragging ? 1000 : 1,
            }}
        >
            {id}
        </div>
    );
});

const DragContainer = () => {
    const [basePositions, setBasePositions] = useState({
        1: { left: 0, top: 0 },
        2: { left: 120, top: 0 },
        3: { left: 240, top: 0 },
    });

    const [dragOffsets, setDragOffsets] = useState({
        1: { x: 0, y: 0 },
        2: { x: 0, y: 0 },
        3: { x: 0, y: 0 },
    });

    // 用ref实时存储最新偏移量（解决React状态异步问题）
    const latestOffsets = useRef(dragOffsets);
    useEffect(() => {
        latestOffsets.current = dragOffsets;
    }, [dragOffsets]);

    const dragState = useRef({
        isDragging: false,
        currentId: null,
        startX: 0,
        startY: 0,
        initialLeft: 0,
        initialTop: 0,
        maxLeft: 0,
        maxTop: 0,
    });

    const containerRef = useRef(null);
    const rafId = useRef(null);
    const itemSize = useRef({ width: 100, height: 100 });

    // 初始化父容器边界
    useEffect(() => {
        const updateContainerBounds = () => {
            const container = containerRef.current;
            if (container) {
                const { clientWidth: cw, clientHeight: ch } = container;
                dragState.current.maxLeft = cw - itemSize.current.width;
                dragState.current.maxTop = ch - itemSize.current.height;
            }
        };

        updateContainerBounds();
        // 监听窗口大小变化，实时更新边界
        window.addEventListener("resize", updateContainerBounds);
        return () => window.removeEventListener("resize", updateContainerBounds);
    }, []);

    const handleMouseDown = useCallback(
        (e) => {
            const container = containerRef.current;
            if (!container) return;

            const target = e.target.closest("[data-draggable-id]");
            if (!target) return;
            const id = target.dataset.draggableId;

            const { left: initialLeft, top: initialTop } = basePositions[id];
            const containerRect = container.getBoundingClientRect();
            const startX = e.clientX - containerRect.left;
            const startY = e.clientY - containerRect.top;
            const { clientWidth: cw, clientHeight: ch } = container;
            const { width: iw, height: ih } = itemSize.current;

            dragState.current = {
                isDragging: true,
                currentId: id,
                startX,
                startY,
                initialLeft,
                initialTop,
                maxLeft: cw - iw,
                maxTop: ch - ih,
            };

            // 重置偏移量（确保拖动开始时从基础位置出发）
            setDragOffsets((prev) => ({ ...prev, [id]: { x: 0, y: 0 } }));
            e.preventDefault();
        },
        [basePositions]
    );

    const handleMouseMove = useCallback((e) => {
        const state = dragState.current;
        if (!state.isDragging || !state.currentId) return;

        if (rafId.current) cancelAnimationFrame(rafId.current);
        rafId.current = requestAnimationFrame(() => {
            const container = containerRef.current;
            if (!container) return;

            const containerRect = container.getBoundingClientRect();
            const currentX = e.clientX - containerRect.left;
            const currentY = e.clientY - containerRect.top;

            // 计算偏移量
            let deltaX = currentX - state.startX;
            let deltaY = currentY - state.startY;

            // 边界限制（与最终同步逻辑保持一致）
            const minX = -state.initialLeft;
            const maxX = state.maxLeft - state.initialLeft;
            const minY = -state.initialTop;
            const maxY = state.maxTop - state.initialTop;

            deltaX = Math.max(minX, Math.min(deltaX, maxX));
            deltaY = Math.max(minY, Math.min(deltaY, maxY));

            setDragOffsets((prev) => ({ ...prev, [state.currentId]: { x: deltaX, y: deltaY } }));
        });
    }, []);

    const handleMouseUp = useCallback(() => {
        const state = dragState.current;
        if (!state.isDragging || !state.currentId) return;

        if (rafId.current) {
            cancelAnimationFrame(rafId.current);
            rafId.current = null;
        }

        // 关键修复：用ref获取最新偏移量（避免React状态异步导致的旧值）
        const { x: deltaX, y: deltaY } = latestOffsets.current[state.currentId];

        // 计算最终位置（严格遵循边界限制）
        const finalLeft = state.initialLeft + deltaX;
        const finalTop = state.initialTop + deltaY;

        // 二次校验边界（确保同步后位置正确）
        const clampedLeft = Math.max(0, Math.min(finalLeft, state.maxLeft));
        const clampedTop = Math.max(0, Math.min(finalTop, state.maxTop));

        // 更新基础位置
        setBasePositions((prev) => ({
            ...prev,
            [state.currentId]: { left: clampedLeft, top: clampedTop },
        }));

        // 重置偏移量和状态
        setDragOffsets((prev) => ({ ...prev, [state.currentId]: { x: 0, y: 0 } }));
        dragState.current = { ...state, isDragging: false, currentId: null };
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.addEventListener("mousedown", handleMouseDown);
        container.addEventListener("mousemove", handleMouseMove);
        container.addEventListener("mouseup", handleMouseUp);
        container.addEventListener("mouseleave", handleMouseUp);

        return () => {
            container.removeEventListener("mousedown", handleMouseDown);
            container.removeEventListener("mousemove", handleMouseMove);
            container.removeEventListener("mouseup", handleMouseUp);
            container.removeEventListener("mouseleave", handleMouseUp);
            if (rafId.current) cancelAnimationFrame(rafId.current);
        };
    }, [handleMouseDown, handleMouseMove, handleMouseUp]);

    return (
        <div
            ref={containerRef}
            style={{
                width: "600px",
                height: "400px",
                border: "2px solid #333",
                position: "relative",
                margin: "20px auto",
                boxSizing: "border-box",
            }}
        >
            {Object.entries(basePositions).map(([id, { left, top }]) => (
                <DraggableItem
                    key={id}
                    id={id}
                    baseLeft={left}
                    baseTop={top}
                    deltaX={dragOffsets[id].x}
                    deltaY={dragOffsets[id].y}
                    isDragging={dragState.current.isDragging && dragState.current.currentId === id}
                />
            ))}
        </div>
    );
};

export default DragContainer;
