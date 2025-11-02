import React, { useCallback, useEffect, useRef, useState } from "react";
import { useEvent } from "react-use"; // 可选，简化事件绑定（也可手动绑定）

// 子元素组件（用React.memo避免无关重渲染）
const DraggableItem = React.memo(({ id, style, onMouseDown }) => {
    return (
        <div
            className="draggable-item"
            style={{
                width: "100px",
                height: "100px",
                background: "skyblue",
                margin: "10px",
                cursor: "move",
                position: "absolute", // 相对父容器定位
                ...style,
            }}
            onMouseDown={(e) => onMouseDown(e, id)} // 传递子元素ID
        />
    );
});

// 父容器组件
const DragContainer = () => {
    // 存储所有子元素的位置信息
    const [positions, setPositions] = useState({
        1: { x: 0, y: 0 }, // 子元素1初始位置
        2: { x: 120, y: 0 }, // 子元素2初始位置
        3: { x: 240, y: 0 }, // 子元素3初始位置
    });
    // 拖动状态：当前拖动的元素ID、初始位置等
    const [dragState, setDragState] = useState({
        isDragging: false,
        currentId: null,
        startX: 0,
        startY: 0,
        initialX: 0,
        initialY: 0,
    });
    // 父容器DOM引用（用于计算边界）
    const containerRef = useRef(null);

    // 处理鼠标按下：记录初始状态
    const handleMouseDown = useCallback(
        (e, id) => {
            const container = containerRef.current;
            if (!container) return;

            // 阻止默认行为（避免选中文本）
            e.preventDefault();

            // 获取父容器的位置和尺寸（用于限制范围）
            const containerRect = container.getBoundingClientRect();
            // 获取当前子元素的初始位置
            const { x: initialX, y: initialY } = positions[id];

            setDragState({
                isDragging: true,
                currentId: id,
                startX: e.clientX, // 鼠标初始位置（相对视口）
                startY: e.clientY,
                initialX, // 元素初始X（相对父容器）
                initialY, // 元素初始Y（相对父容器）
                containerRect, // 缓存父容器边界（避免mousemove中重复计算）
            });
        },
        [positions]
    );

    // 处理鼠标移动：计算位移并限制范围
    const handleMouseMove = useCallback(
        (e) => {
            const { isDragging, currentId, startX, startY, initialX, initialY, containerRect } = dragState;
            if (!isDragging || !currentId || !containerRect) return;

            // 计算相对位移（鼠标移动距离）
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            // 计算目标位置（相对父容器）
            let targetX = initialX + deltaX;
            let targetY = initialY + deltaY;

            // 限制范围在父容器内（减去子元素自身尺寸）
            const maxX = containerRect.width - 100; // 子元素宽100
            const maxY = containerRect.height - 100; // 子元素高100
            targetX = Math.max(0, Math.min(targetX, maxX)); // 0 <= x <= maxX
            targetY = Math.max(0, Math.min(targetY, maxY)); // 0 <= y <= maxY

            // 更新当前元素位置（只更新变化的子元素，减少重渲染）
            setPositions((prev) => ({
                ...prev,
                [currentId]: { x: targetX, y: targetY },
            }));
        },
        [dragState]
    );

    // 处理鼠标释放：结束拖动
    const handleMouseUp = useCallback(() => {
        if (dragState.isDragging) {
            setDragState((prev) => ({ ...prev, isDragging: false, currentId: null }));
        }
    }, [dragState.isDragging]);

    // 绑定全局事件（用useEvent或useEffect手动绑定）
    useEvent("mousemove", handleMouseMove);
    useEvent("mouseup", handleMouseUp);

    return (
        <div
            ref={containerRef}
            style={{
                width: "600px",
                height: "400px",
                border: "2px solid #333",
                position: "relative", // 子元素相对父容器定位
                margin: "20px auto",
            }}
        >
            {/* 渲染所有子元素 */}
            {Object.entries(positions).map(([id, { x, y }]) => (
                <DraggableItem
                    key={id}
                    id={id}
                    // 使用transform定位（性能最优）
                    style={{ transform: `translate(${x}px, ${y}px)` }}
                    onMouseDown={handleMouseDown}
                />
            ))}
        </div>
    );
};

export default DragContainer;
