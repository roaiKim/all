import React, { useCallback, useEffect, useRef, useState } from "react";

// 子元素组件（无需绑定事件，仅接收样式和id）
const DraggableItem = React.memo(({ id, style, isDragging }) => {
    return (
        <div
            // 给子元素添加标识，方便父容器识别
            data-draggable-id={id}
            style={{
                width: "100px",
                height: "100px",
                background: isDragging ? "lightgreen" : "skyblue",
                cursor: "move",
                position: "absolute",
                userSelect: "none",
                border: "1px solid #333",
                ...style,
            }}
        >
            {id}
        </div>
    );
});

const DragContainer = () => {
    const [positions, setPositions] = useState({
        1: { x: 0, y: 0 },
        2: { x: 120, y: 0 },
        3: { x: 240, y: 0 },
    });

    const [dragState, setDragState] = useState({
        isDragging: false,
        currentId: null,
        startX: 0, // 鼠标按下时的坐标（相对父容器）
        startY: 0,
        initialX: 0, // 子元素初始位置（相对父容器）
        initialY: 0,
    });

    const containerRef = useRef(null);

    // 父容器监听鼠标按下：判断是否点击子元素
    const handleMouseDown = useCallback(
        (e) => {
            const container = containerRef.current;
            if (!container) return;

            // 从事件目标获取子元素id（通过data属性）
            const target = e.target.closest("[data-draggable-id]");
            if (!target) return; // 未点击子元素，不触发拖动

            const id = target.dataset.draggableId;
            const { x: initialX, y: initialY } = positions[id];

            // 计算鼠标在父容器内的初始坐标（关键：相对父容器，而非视口）
            const containerRect = container.getBoundingClientRect();
            const startX = e.clientX - containerRect.left; // 鼠标X相对父容器左边界
            const startY = e.clientY - containerRect.top; // 鼠标Y相对父容器上边界

            setDragState({
                isDragging: true,
                currentId: id,
                startX,
                startY,
                initialX,
                initialY,
            });

            e.preventDefault();
        },
        [positions]
    );

    // 父容器监听鼠标移动：计算位移（相对父容器）
    const handleMouseMove = useCallback(
        (e) => {
            const { isDragging, currentId, startX, startY, initialX, initialY } = dragState;
            const container = containerRef.current;
            if (!isDragging || !currentId || !container) return;

            // 计算鼠标在父容器内的当前坐标
            const containerRect = container.getBoundingClientRect();
            const currentX = e.clientX - containerRect.left;
            const currentY = e.clientY - containerRect.top;

            // 位移 = 当前鼠标位置 - 初始鼠标位置（均相对父容器）
            const deltaX = currentX - startX;
            const deltaY = currentY - startY;

            // 目标位置 = 初始位置 + 位移
            let targetX = initialX + deltaX;
            let targetY = initialY + deltaY;

            // 边界限制（基于父容器内部尺寸）
            const itemWidth = 100;
            const itemHeight = 100;
            const maxX = container.clientWidth - itemWidth;
            const maxY = container.clientHeight - itemHeight;

            targetX = Math.max(0, Math.min(targetX, maxX));
            targetY = Math.max(0, Math.min(targetY, maxY));

            setPositions((prev) => ({ ...prev, [currentId]: { x: targetX, y: targetY } }));
        },
        [dragState]
    );

    // 父容器监听鼠标释放：结束拖动
    const handleMouseUp = useCallback(() => {
        setDragState((prev) => ({ ...prev, isDragging: false, currentId: null }));
    }, []);

    // 仅在父容器挂载时绑定一次事件（利用事件委托，无需依赖变化）
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.addEventListener("mousedown", handleMouseDown);
        container.addEventListener("mousemove", handleMouseMove);
        container.addEventListener("mouseup", handleMouseUp);
        container.addEventListener("mouseleave", handleMouseUp);

        // 清理事件
        return () => {
            container.removeEventListener("mousedown", handleMouseDown);
            container.removeEventListener("mousemove", handleMouseMove);
            container.removeEventListener("mouseup", handleMouseUp);
            container.removeEventListener("mouseleave", handleMouseUp);
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
                boxSizing: "border-box", // 确保width包含边框
            }}
        >
            {Object.entries(positions).map(([id, { x, y }]) => (
                <DraggableItem
                    key={id}
                    id={id}
                    style={{ transform: `translate(${x}px, ${y}px)` }}
                    isDragging={dragState.isDragging && dragState.currentId === id}
                />
            ))}
        </div>
    );
};

export default DragContainer;
