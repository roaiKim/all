import React, { useCallback, useEffect, useRef, useState } from "react";

const DraggableItem = React.memo(({ id, style, onMouseDown, isDragging }) => {
    return (
        <div
            style={{
                width: "100px",
                height: "100px",
                background: isDragging ? "lightgreen" : "skyblue", // 拖动时变色（调试用）
                cursor: "move",
                position: "absolute",
                userSelect: "none",
                border: "1px solid #333",
                ...style,
            }}
            onMouseDown={(e) => onMouseDown(e, id)}
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
        startX: 0, // 鼠标按下时的视口X
        startY: 0, // 鼠标按下时的视口Y
        initialX: 0, // 元素初始X（相对父容器）
        initialY: 0, // 元素初始Y（相对父容器）
        // 新增：父容器内部宽高（而非视口坐标）
        containerWidth: 0,
        containerHeight: 0,
    });

    const containerRef = useRef(null);

    // 鼠标按下：初始化状态（关键修复：获取父容器内部宽高）
    const handleMouseDown = useCallback(
        (e, id) => {
            const container = containerRef.current;
            if (!container) return;

            e.preventDefault();

            // 关键修复：父容器的内部宽高（不依赖视口坐标）
            const containerWidth = container.clientWidth; // 内容宽度（不含边框）
            const containerHeight = container.clientHeight; // 内容高度（不含边框）
            const { x: initialX, y: initialY } = positions[id];

            setDragState({
                isDragging: true,
                currentId: id,
                startX: e.clientX,
                startY: e.clientY,
                initialX,
                initialY,
                containerWidth, // 缓存内部宽度
                containerHeight, // 缓存内部高度
            });
        },
        [positions]
    );

    // 鼠标移动：计算位移并修正边界判断
    const handleMouseMove = useCallback(
        (e) => {
            const { isDragging, currentId, startX, startY, initialX, initialY, containerWidth, containerHeight } = dragState;

            if (!isDragging || !currentId) return;

            // 计算鼠标相对位移（视口坐标差）
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            // 目标位置 = 初始位置 + 相对位移（均相对父容器）
            let targetX = initialX + deltaX;
            let targetY = initialY + deltaY;

            // 关键修复：基于父容器内部宽高限制边界
            const itemWidth = 100; // 子元素宽度（需与样式一致）
            const itemHeight = 100; // 子元素高度（需与样式一致）
            const maxX = containerWidth - itemWidth; // 最大X偏移（右边界）
            const maxY = containerHeight - itemHeight; // 最大Y偏移（下边界）

            // 限制在 [0, maxX] 和 [0, maxY] 范围内
            targetX = Math.max(0, Math.min(targetX, maxX));
            targetY = Math.max(0, Math.min(targetY, maxY));

            setPositions((prev) => ({ ...prev, [currentId]: { x: targetX, y: targetY } }));
        },
        [dragState]
    );

    const handleMouseUp = useCallback(() => {
        setDragState((prev) => ({ ...prev, isDragging: false, currentId: null }));
    }, []);

    // 监听窗口大小变化，更新父容器尺寸（可选，处理窗口缩放）
    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                const { clientWidth, clientHeight } = containerRef.current;
                setDragState((prev) => ({
                    ...prev,
                    containerWidth: clientWidth,
                    containerHeight: clientHeight,
                }));
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // 绑定全局事件
    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp]);

    return (
        <div
            ref={containerRef}
            style={{
                width: "600px",
                height: "1500px",
                border: "2px solid #333", // 边框不影响内部宽高（clientWidth已排除边框）
                position: "relative",
                margin: "20px auto",
                padding: 0, // 确保内部宽高准确
                boxSizing: "border-box", // 避免边框影响容器整体尺寸
            }}
        >
            {Object.entries(positions).map(([id, { x, y }]) => (
                <DraggableItem
                    key={id}
                    id={id}
                    style={{ transform: `translate(${x}px, ${y}px)` }}
                    onMouseDown={handleMouseDown}
                    isDragging={dragState.isDragging && dragState.currentId === id}
                />
            ))}
        </div>
    );
};

export default DragContainer;
