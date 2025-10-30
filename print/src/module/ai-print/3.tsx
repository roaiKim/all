import React, { useEffect, useRef, useState } from "react";

const DragPrintComponent = () => {
    // 状态管理
    const [dragging, setDragging] = useState(false);
    const [dragItem, setDragItem] = useState(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [dropItems, setDropItems] = useState([]);
    const canvasRef = useRef(null);

    // 可拖拽元素列表
    const draggableItems = [
        { id: 1, type: "triangle", text: "三角形1" },
        { id: 2, type: "triangle", text: "三角形2" },
        { id: 3, type: "square", text: "正方形1" },
        { id: 4, type: "circle", text: "圆形1" },
    ];

    // 处理拖拽开始
    const handleDragStart = (e, item) => {
        e.preventDefault();
        setDragging(true);
        setDragItem(item);

        // 计算初始位置（相对于幕布）
        const canvasRect = canvasRef.current.getBoundingClientRect();
        setPosition({
            x: e.clientX - canvasRect.left,
            y: e.clientY - canvasRect.top,
        });
    };

    // 处理拖拽移动
    const handleMouseMove = (e) => {
        if (!dragging || !canvasRef.current) return;

        const canvasRect = canvasRef.current.getBoundingClientRect();
        // 确保拖拽位置在幕布内
        const x = Math.max(0, Math.min(e.clientX - canvasRect.left, canvasRect.width - 50));
        const y = Math.max(0, Math.min(e.clientY - canvasRect.top, canvasRect.height - 50));

        setPosition({ x, y });
    };

    // 处理拖拽结束（放置元素）
    const handleMouseUp = () => {
        if (dragging && dragItem) {
            // 将元素添加到幕布中
            setDropItems([
                ...dropItems,
                {
                    ...dragItem,
                    id: Date.now(), // 使用时间戳确保id唯一
                    x: position.x,
                    y: position.y,
                },
            ]);
        }

        setDragging(false);
        setDragItem(null);
    };

    // 添加鼠标移动和释放的事件监听
    useEffect(() => {
        if (dragging) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [dragging, position]);

    // 渲染形状的组件
    const Shape = ({ type, text, x, y, isDragging = false }) => {
        const styles = {
            position: isDragging ? "absolute" : "relative",
            left: isDragging ? `${x}px` : 0,
            top: isDragging ? `${y}px` : 0,
            width: "100px",
            height: "100px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "14px",
            fontWeight: "bold",
            cursor: "move",
            userSelect: "none",
            zIndex: isDragging ? 100 : 1,
        };

        switch (type) {
            case "triangle":
                return (
                    <div
                        style={{
                            ...styles,
                            width: 0,
                            height: 0,
                            borderLeft: "50px solid transparent",
                            borderRight: "50px solid transparent",
                            borderBottom: "100px solid #2196F3",
                        }}
                    >
                        <span
                            style={{
                                position: "absolute",
                                top: "60px",
                                textAlign: "center",
                                width: "100px",
                                marginLeft: "-50px",
                            }}
                        >
                            {text}
                        </span>
                    </div>
                );
            case "square":
                return (
                    <div
                        style={{
                            ...styles,
                            backgroundColor: "#4CAF50",
                        }}
                    >
                        {text}
                    </div>
                );
            case "circle":
                return (
                    <div
                        style={{
                            ...styles,
                            borderRadius: "50%",
                            backgroundColor: "#f44336",
                        }}
                    >
                        {text}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div
            style={{
                display: "flex",
                gap: "20px",
                padding: "20px",
                height: "calc(100vh - 40px)",
                boxSizing: "border-box",
            }}
        >
            {/* 左侧拖拽元素区域 */}
            <div
                style={{
                    width: "200px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "15px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                    backgroundColor: "#f9f9f9",
                }}
            >
                <h3>可拖拽元素</h3>
                {draggableItems.map((item) => (
                    <div
                        key={item.id}
                        onMouseDown={(e) => handleDragStart(e, item)}
                        style={{
                            padding: "10px",
                            borderRadius: "4px",
                            border: "1px solid #ddd",
                            backgroundColor: "white",
                            cursor: "grab",
                        }}
                    >
                        <Shape type={item.type} text={item.text} />
                    </div>
                ))}
            </div>

            {/* 右侧幕布区域 */}
            <div
                ref={canvasRef}
                style={{
                    flex: 1,
                    border: "2px dashed #666",
                    borderRadius: "8px",
                    position: "relative",
                    backgroundColor: "#fff",
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                        color: "#666",
                        fontSize: "14px",
                    }}
                >
                    幕布区域 - 拖放元素到这里
                </div>

                {/* 已放置的元素 */}
                {dropItems.map((item) => (
                    <div
                        key={item.id}
                        style={{
                            position: "absolute",
                            left: `${item.x}px`,
                            top: `${item.y}px`,
                        }}
                    >
                        <Shape type={item.type} text={item.text} />
                    </div>
                ))}

                {/* 拖拽中的元素 */}
                {dragging && dragItem && <Shape type={dragItem.type} text={dragItem.text} x={position.x} y={position.y} isDragging={true} />}
            </div>
        </div>
    );
};

export default DragPrintComponent;
