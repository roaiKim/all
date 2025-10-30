import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";

// 基础图形组件 - 插件式设计
const Rectangle = ({ id, x, y, width, height, onDrag, onResize, isSelected }) => {
    return (
        <div
            id={id}
            className={`draggable-resizable ${isSelected ? "selected" : ""}`}
            style={{
                position: "absolute",
                left: x,
                top: y,
                width,
                height,
                backgroundColor: "rgba(0, 123, 255, 0.5)",
                border: "1px solid #007bff",
                cursor: "move",
            }}
            onMouseDown={onDrag.start}
        >
            <div
                className="resize-handle bottom-right"
                style={{
                    position: "absolute",
                    right: 0,
                    bottom: 0,
                    width: "10px",
                    height: "10px",
                    backgroundColor: "#007bff",
                    cursor: "se-resize",
                }}
                onMouseDown={onResize.start}
            />
        </div>
    );
};

const TextBox = ({ id, x, y, width, height, onDrag, onResize, isSelected }) => {
    const [text, setText] = useState("双击编辑文本");

    return (
        <div
            id={id}
            className={`draggable-resizable ${isSelected ? "selected" : ""}`}
            style={{
                position: "absolute",
                left: x,
                top: y,
                width,
                height,
                backgroundColor: "rgba(255, 255, 0, 0.3)",
                border: "1px solid #ffc107",
                cursor: "move",
                padding: "5px",
                overflow: "hidden",
            }}
            onMouseDown={onDrag.start}
            onDoubleClick={() => {
                const newText = prompt("请输入文本:", text);
                if (newText !== null) setText(newText);
            }}
        >
            {text}
            <div
                className="resize-handle bottom-right"
                style={{
                    position: "absolute",
                    right: 0,
                    bottom: 0,
                    width: "10px",
                    height: "10px",
                    backgroundColor: "#ffc107",
                    cursor: "se-resize",
                }}
                onMouseDown={onResize.start}
            />
        </div>
    );
};

// 插件注册系统
const pluginSystem = {
    plugins: {
        rectangle: { component: Rectangle, name: "矩形", icon: "□" },
        textbox: { component: TextBox, name: "文本框", icon: "T" },
    },

    registerPlugin(type, plugin) {
        if (!this.plugins[type]) {
            this.plugins[type] = plugin;
            return true;
        }
        return false;
    },

    getPlugins() {
        return { ...this.plugins };
    },
};

// 主应用组件
const PrintTemplateEditor = () => {
    const [elements, setElements] = useState([]);
    const [nextId, setNextId] = useState(1);
    const [draggingElement, setDraggingElement] = useState(null);
    const [resizingElement, setResizingElement] = useState(null);
    const [selectedElementId, setSelectedElementId] = useState(null);
    const canvasRef = useRef(null);
    const plugins = pluginSystem.getPlugins();

    // 生成唯一ID
    const generateId = () => {
        const id = nextId;
        setNextId(id + 1);
        return id;
    };

    // 添加新元素
    const addElement = (type, x = 50, y = 50) => {
        const element = {
            id: generateId(),
            type,
            x,
            y,
            width: 100,
            height: 100,
        };

        setElements([...elements, element]);
        setSelectedElementId(element.id);
    };

    // 拖动开始
    const handleDragStart = (id) => (e) => {
        e.stopPropagation();
        const element = elements.find((el) => el.id === id);
        if (!element) return;

        setSelectedElementId(id);
        setDraggingElement({
            id,
            startX: e.clientX,
            startY: e.clientY,
            originalX: element.x,
            originalY: element.y,
        });
    };

    // 调整大小开始
    const handleResizeStart = (id) => (e) => {
        e.stopPropagation();
        const element = elements.find((el) => el.id === id);
        if (!element) return;

        setSelectedElementId(id);
        setResizingElement({
            id,
            startX: e.clientX,
            startY: e.clientY,
            originalWidth: element.width,
            originalHeight: element.height,
            originalX: element.x,
            originalY: element.y,
        });
    };

    // 鼠标移动处理
    const handleMouseMove = (e) => {
        console.log("fffffffffffff", e);
        // 处理拖动
        if (draggingElement) {
            const dx = e.clientX - draggingElement.startX;
            const dy = e.clientY - draggingElement.startY;

            setElements(
                elements.map((el) =>
                    el.id === draggingElement.id ? { ...el, x: draggingElement.originalX + dx, y: draggingElement.originalY + dy } : el
                )
            );
        }

        // 处理调整大小
        if (resizingElement) {
            const dx = e.clientX - resizingElement.startX;
            const dy = e.clientY - resizingElement.startY;

            // 确保最小尺寸
            const newWidth = Math.max(20, resizingElement.originalWidth + dx);
            const newHeight = Math.max(20, resizingElement.originalHeight + dy);

            setElements(elements.map((el) => (el.id === resizingElement.id ? { ...el, width: newWidth, height: newHeight } : el)));
        }
    };

    // 鼠标释放处理
    const handleMouseUp = () => {
        setDraggingElement(null);
        setResizingElement(null);
    };

    // 处理画布点击（取消选择）
    const handleCanvasClick = () => {
        setSelectedElementId(null);
    };

    // 处理从库中拖到画布
    const handleDragFromLibrary = (type) => (e) => {
        e.preventDefault();
        // 获取画布位置
        const canvasRect = canvasRef.current.getBoundingClientRect();
        // 计算相对于画布的位置
        const x = e.clientX - canvasRect.left;
        const y = e.clientY - canvasRect.top;
        addElement(type, x - 50, y - 50); // 居中放置
    };

    // 处理拖放事件
    const handleDragOver = (e) => {
        e.preventDefault();
    };

    // 注册全局鼠标事件
    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [draggingElement, resizingElement, elements]);

    // 删除选中元素
    const deleteSelectedElement = () => {
        if (selectedElementId) {
            setElements(elements.filter((el) => el.id !== selectedElementId));
            setSelectedElementId(null);
        }
    };

    // 打印功能
    const handlePrint = () => {
        window.print();
    };

    // 渲染元素
    const renderElements = () => {
        return elements.map((element) => {
            const PluginComponent = plugins[element.type]?.component;
            if (!PluginComponent) return null;

            return (
                <PluginComponent
                    key={element.id}
                    id={element.id}
                    x={element.x}
                    y={element.y}
                    width={element.width}
                    height={element.height}
                    isSelected={selectedElementId === element.id}
                    onDrag={{ start: handleDragStart(element.id) }}
                    onResize={{ start: handleResizeStart(element.id) }}
                />
            );
        });
    };

    return (
        <div className="print-template-editor" style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
            {/* 左侧工具栏 */}
            <div
                className="sidebar"
                style={{
                    width: "200px",
                    backgroundColor: "#f8f9fa",
                    borderRight: "1px solid #dee2e6",
                    padding: "15px",
                    overflowY: "auto",
                }}
            >
                <h3 style={{ marginBottom: "20px", textAlign: "center" }}>图形库</h3>
                <div className="shape-library">
                    {Object.entries(plugins).map(([type, plugin]) => (
                        <div
                            key={type}
                            className="shape-item"
                            style={{
                                padding: "10px",
                                marginBottom: "10px",
                                backgroundColor: "white",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                                cursor: "move",
                                textAlign: "center",
                            }}
                            draggable
                            onDragEnd={(e) => handleDragFromLibrary(type)(e)}
                        >
                            <div style={{ fontSize: "24px", marginBottom: "5px" }}>{plugin.icon}</div>
                            <div>{plugin.name}</div>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: "30px" }}>
                    <h4 style={{ marginBottom: "15px" }}>操作</h4>
                    <button
                        onClick={deleteSelectedElement}
                        style={{
                            width: "100%",
                            padding: "8px",
                            marginBottom: "10px",
                            backgroundColor: "#dc3545",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                    >
                        删除选中元素
                    </button>
                    <button
                        onClick={handlePrint}
                        style={{
                            width: "100%",
                            padding: "8px",
                            backgroundColor: "#28a745",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                    >
                        打印预览
                    </button>
                </div>
            </div>

            {/* 右侧画布 */}
            <div className="canvas-container" style={{ flex: 1, overflow: "auto", backgroundColor: "#eee" }}>
                <div
                    ref={canvasRef}
                    className="canvas"
                    style={{
                        width: "800px",
                        height: "1000px",
                        margin: "20px auto",
                        backgroundColor: "white",
                        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                        position: "relative",
                    }}
                    onClick={handleCanvasClick}
                    onDragOver={handleDragOver}
                >
                    {renderElements()}
                </div>
            </div>
        </div>
    );
};

// 示例：注册一个新的插件（圆形）
const Circle = ({ id, x, y, width, height, onDrag, onResize, isSelected }) => {
    return (
        <div
            id={id}
            className={`draggable-resizable ${isSelected ? "selected" : ""}`}
            style={{
                position: "absolute",
                left: x,
                top: y,
                width,
                height,
                backgroundColor: "rgba(255, 99, 132, 0.5)",
                border: "1px solid #dc3545",
                borderRadius: "50%",
                cursor: "move",
            }}
            onMouseDown={onDrag.start}
        >
            <div
                className="resize-handle bottom-right"
                style={{
                    position: "absolute",
                    right: 0,
                    bottom: 0,
                    width: "10px",
                    height: "10px",
                    backgroundColor: "#dc3545",
                    cursor: "se-resize",
                    borderRadius: "50%",
                }}
                onMouseDown={onResize.start}
            />
        </div>
    );
};

// 注册圆形插件
pluginSystem.registerPlugin("circle", {
    component: Circle,
    name: "圆形",
    icon: "○",
});

export default PrintTemplateEditor;
