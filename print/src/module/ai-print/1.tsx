import React, { useCallback, useEffect, useRef, useState } from "react";

// 打印元素类型定义
type PrintElementType = "text" | "image" | "custom";

interface PrintElement {
    id: string;
    type: PrintElementType;
    content: string; // 文本内容或图片URL
    x: number; // 横坐标(mm)
    y: number; // 纵坐标(mm)
    width: number; // 宽度(mm)
    height: number; // 高度(mm)
    fontSize?: number; // 字体大小(px)
    color?: string; // 颜色
    textAlign?: "left" | "center" | "right"; // 文本对齐
    isDragging: boolean; // 是否正在拖拽
    isResizing: boolean; // 是否正在缩放
    resizeHandle: "br" | "bl" | "tr" | "tl" | null; // 缩放手柄位置
}

interface PrintConfig {
    paperSize: "A4" | "A3" | "Letter" | "Legal";
    orientation: "portrait" | "landscape";
    margin: number; // 边距(mm)
}

// 纸张尺寸定义（mm）
const PAPER_SIZES = {
    A4: { width: 210, height: 297 },
    A3: { width: 297, height: 420 },
    Letter: { width: 216, height: 279 },
    Legal: { width: 216, height: 356 },
};

// 最小元素尺寸（mm）
const MIN_ELEMENT_SIZE = { width: 50, height: 30 };

const DragPrintComponent: React.FC = () => {
    // 打印元素列表
    const [printElements, setPrintElements] = useState<PrintElement[]>([
        {
            id: "1",
            type: "text",
            content: "可拖拽打印文本",
            x: 30,
            y: 30,
            width: 150,
            height: 40,
            fontSize: 16,
            color: "#333",
            textAlign: "center",
            isDragging: false,
            isResizing: false,
            resizeHandle: null,
        },
        {
            id: "2",
            type: "image",
            content: "https://picsum.photos/200/150",
            x: 200,
            y: 30,
            width: 120,
            height: 90,
            isDragging: false,
            isResizing: false,
            resizeHandle: null,
        },
    ]);

    // 打印配置
    const [printConfig, setPrintConfig] = useState<PrintConfig>({
        paperSize: "A4",
        orientation: "portrait",
        margin: 10,
    });

    // 鼠标位置记录
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    // 预览区域缩放比例
    const [scale, setScale] = useState(1);
    // 引用
    const previewRef = useRef<HTMLDivElement>(null);
    const printRef = useRef<HTMLDivElement>(null);
    const paperRef = useRef<HTMLDivElement>(null);

    // 获取纸张实际尺寸（考虑方向）
    const getPaperDimensions = useCallback((): { width: number; height: number } => {
        const { width, height } = PAPER_SIZES[printConfig.paperSize];
        return printConfig.orientation === "portrait" ? { width, height } : { width: height, height: width };
    }, [printConfig]);

    // 计算缩放比例（适配预览区域）
    useEffect(() => {
        const calculateScale = () => {
            if (previewRef.current && paperRef.current) {
                const previewWidth = previewRef.current.clientWidth - 40; // 留出边距
                const paperWidth = getPaperDimensions().width;
                const newScale = Math.min(previewWidth / paperWidth, 1);
                setScale(newScale);
            }
        };

        calculateScale();
        window.addEventListener("resize", calculateScale);
        return () => window.removeEventListener("resize", calculateScale);
    }, [printConfig, getPaperDimensions]);

    // 监听鼠标移动事件（全局）
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });

            // 处理拖拽
            setPrintElements((prevElements) =>
                prevElements.map((element) => {
                    if (element.isDragging) {
                        // 计算鼠标移动距离（基于缩放比例转换为mm）
                        const dx = (e.clientX - element.dragStartX) / scale;
                        const dy = (e.clientY - element.dragStartY) / scale;

                        // 限制元素不能超出纸张边界
                        const paper = getPaperDimensions();
                        const maxX = paper.width - printConfig.margin * 2 - element.width;
                        const maxY = paper.height - printConfig.margin * 2 - element.height;

                        return {
                            ...element,
                            x: Math.max(printConfig.margin, Math.min(element.dragStartPos.x + dx, maxX)),
                            y: Math.max(printConfig.margin, Math.min(element.dragStartPos.y + dy, maxY)),
                        };
                    }

                    // 处理缩放
                    if (element.isResizing && element.resizeHandle) {
                        const { dragStartPos, dragStartSize } = element;
                        const dx = (e.clientX - dragStartPos.x) / scale;
                        const dy = (e.clientY - dragStartPos.y) / scale;

                        let newWidth = dragStartSize.width;
                        let newHeight = dragStartSize.height;
                        let newX = dragStartPos.x;
                        let newY = dragStartPos.y;

                        // 根据缩放手柄位置计算新尺寸和位置
                        switch (element.resizeHandle) {
                            case "br": // 右下
                                newWidth = Math.max(MIN_ELEMENT_SIZE.width, dragStartSize.width + dx);
                                newHeight = Math.max(MIN_ELEMENT_SIZE.height, dragStartSize.height + dy);
                                break;
                            case "bl": // 左下
                                newWidth = Math.max(MIN_ELEMENT_SIZE.width, dragStartSize.width - dx);
                                newHeight = Math.max(MIN_ELEMENT_SIZE.height, dragStartSize.height + dy);
                                newX = dragStartPos.x + dx;
                                break;
                            case "tr": // 右上
                                newWidth = Math.max(MIN_ELEMENT_SIZE.width, dragStartSize.width + dx);
                                newHeight = Math.max(MIN_ELEMENT_SIZE.height, dragStartSize.height - dy);
                                newY = dragStartPos.y + dy;
                                break;
                            case "tl": // 左上
                                newWidth = Math.max(MIN_ELEMENT_SIZE.width, dragStartSize.width - dx);
                                newHeight = Math.max(MIN_ELEMENT_SIZE.height, dragStartSize.height - dy);
                                newX = dragStartPos.x + dx;
                                newY = dragStartPos.y + dy;
                                break;
                        }

                        // 限制不能超出纸张边界
                        const paper = getPaperDimensions();
                        const maxX = paper.width - printConfig.margin * 2 - newWidth;
                        const maxY = paper.height - printConfig.margin * 2 - newHeight;

                        newX = Math.max(printConfig.margin, Math.min(newX, maxX));
                        newY = Math.max(printConfig.margin, Math.min(newY, maxY));

                        return {
                            ...element,
                            x: newX,
                            y: newY,
                            width: newWidth,
                            height: newHeight,
                        };
                    }

                    return element;
                })
            );
        };

        // 监听鼠标抬起事件（结束拖拽/缩放）
        const handleMouseUp = () => {
            setPrintElements((prevElements) =>
                prevElements.map((element) => ({
                    ...element,
                    isDragging: false,
                    isResizing: false,
                    resizeHandle: null,
                    dragStartPos: undefined,
                    dragStartSize: undefined,
                    dragStartX: undefined,
                    dragStartY: undefined,
                }))
            );
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("mouseleave", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("mouseleave", handleMouseUp);
        };
    }, [scale, printConfig, getPaperDimensions]);

    // 开始拖拽
    const handleDragStart = (id: string, e: React.MouseEvent) => {
        setPrintElements((prevElements) =>
            prevElements.map((element) => {
                if (element.id === id) {
                    return {
                        ...element,
                        isDragging: true,
                        dragStartPos: { x: element.x, y: element.y }, // 记录初始位置
                        dragStartX: e.clientX, // 记录初始鼠标X
                        dragStartY: e.clientY, // 记录初始鼠标Y
                    };
                }
                return element;
            })
        );
    };

    // 开始缩放
    const handleResizeStart = (id: string, handle: PrintElement["resizeHandle"], e: React.MouseEvent) => {
        e.stopPropagation(); // 防止触发拖拽
        setPrintElements((prevElements) =>
            prevElements.map((element) => {
                if (element.id === id && handle) {
                    return {
                        ...element,
                        isResizing: true,
                        resizeHandle: handle,
                        dragStartPos: { x: e.clientX, y: e.clientY }, // 记录初始鼠标位置
                        dragStartSize: { width: element.width, height: element.height }, // 记录初始尺寸
                        dragStartPos: { x: element.x, y: element.y }, // 记录初始元素位置
                    };
                }
                return element;
            })
        );
    };

    // 添加新打印元素
    const addPrintElement = (type: PrintElementType) => {
        const paper = getPaperDimensions();
        const newElement: PrintElement = {
            id: Date.now().toString(),
            type,
            content: type === "text" ? "新文本" : type === "image" ? "https://picsum.photos/150/100" : "自定义内容",
            x: printConfig.margin + 20,
            y: printConfig.margin + 20,
            width: type === "text" ? 120 : 100,
            height: type === "text" ? 30 : 80,
            fontSize: type === "text" ? 14 : undefined,
            color: type === "text" ? "#333" : undefined,
            textAlign: type === "text" ? "left" : undefined,
            isDragging: false,
            isResizing: false,
            resizeHandle: null,
        };

        setPrintElements([...printElements, newElement]);
    };

    // 删除打印元素
    const deletePrintElement = (id: string) => {
        setPrintElements((prev) => prev.filter((element) => element.id !== id));
    };

    // 更新打印元素内容
    const updateElementContent = (id: string, content: string) => {
        setPrintElements((prev) => prev.map((element) => (element.id === id ? { ...element, content } : element)));
    };

    // 更新打印配置
    const updatePrintConfig = (key: keyof PrintConfig, value: any) => {
        setPrintConfig((prev) => ({ ...prev, [key]: value }));
    };

    // 执行打印
    const handlePrint = () => {
        if (!printRef.current) return;

        // 克隆打印内容（避免影响预览）
        const printContent = printRef.current.cloneNode(true) as HTMLDivElement;

        // 创建打印容器
        const printContainer = document.createElement("div");
        printContainer.style.position = "absolute";
        printContainer.style.top = "0";
        printContainer.style.left = "0";
        printContainer.style.width = "100%";
        printContainer.style.height = "100%";
        printContainer.style.overflow = "hidden";
        printContainer.style.visibility = "hidden";
        printContainer.appendChild(printContent);

        // 添加到文档
        document.body.appendChild(printContainer);

        // 执行打印
        window.print();

        // 打印完成后移除容器
        setTimeout(() => {
            document.body.removeChild(printContainer);
        }, 100);
    };

    // 渲染打印元素
    const renderPrintElements = () => {
        return printElements.map((element) => {
            // 计算元素的实际样式（基于mm和缩放比例）
            const style: React.CSSProperties = {
                position: "absolute",
                left: `${element.x}mm`,
                top: `${element.y}mm`,
                width: `${element.width}mm`,
                height: `${element.height}mm`,
                cursor: element.isDragging ? "grabbing" : element.isResizing ? getResizeCursor(element.resizeHandle) : "grab",
                backgroundColor: element.isDragging || element.isResizing ? "rgba(200, 230, 255, 0.5)" : "transparent",
                border: element.isDragging || element.isResizing ? "1px solid #4299e1" : "1px dashed #ccc",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: element.textAlign || "center",
                overflow: "hidden",
                color: element.color || "#333",
                fontSize: element.fontSize ? `${element.fontSize}px` : "14px",
                textAlign: element.textAlign || "center",
                zIndex: element.isDragging || element.isResizing ? 10 : 1,
            };

            return (
                <div key={element.id} style={style} onMouseDown={(e) => handleDragStart(element.id, e)}>
                    {/* 元素内容 */}
                    {element.type === "text" && (
                        <input
                            type="text"
                            value={element.content}
                            onChange={(e) => updateElementContent(element.id, e.target.value)}
                            style={{
                                width: "100%",
                                height: "100%",
                                border: "none",
                                background: "transparent",
                                textAlign: element.textAlign || "center",
                                color: element.color || "#333",
                                fontSize: element.fontSize ? `${element.fontSize}px` : "14px",
                                padding: "0 8px",
                                outline: "none",
                                cursor: "inherit",
                            }}
                        />
                    )}
                    {element.type === "image" && (
                        <img
                            src={element.content}
                            alt="Print image"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                            }}
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://picsum.photos/100/100";
                            }}
                        />
                    )}
                    {element.type === "custom" && <div style={{ padding: "8px" }}>{element.content}</div>}

                    {/* 删除按钮 */}
                    <button
                        style={{
                            position: "absolute",
                            top: "2px",
                            right: "2px",
                            width: "16px",
                            height: "16px",
                            padding: "0",
                            margin: "0",
                            border: "none",
                            borderRadius: "50%",
                            backgroundColor: "#f56565",
                            color: "white",
                            fontSize: "10px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: 0.7,
                            zIndex: 20,
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            deletePrintElement(element.id);
                        }}
                    >
                        ×
                    </button>

                    {/* 缩放手柄 */}
                    <div style={resizeHandleStyle("br")} onMouseDown={(e) => handleResizeStart(element.id, "br", e)} />
                    <div style={resizeHandleStyle("bl")} onMouseDown={(e) => handleResizeStart(element.id, "bl", e)} />
                    <div style={resizeHandleStyle("tr")} onMouseDown={(e) => handleResizeStart(element.id, "tr", e)} />
                    <div style={resizeHandleStyle("tl")} onMouseDown={(e) => handleResizeStart(element.id, "tl", e)} />
                </div>
            );
        });
    };

    // 获取缩放手柄光标样式
    const getResizeCursor = (handle: PrintElement["resizeHandle"]) => {
        switch (handle) {
            case "br":
                return "se-resize";
            case "bl":
                return "sw-resize";
            case "tr":
                return "ne-resize";
            case "tl":
                return "nw-resize";
            default:
                return "grab";
        }
    };

    // 缩放手柄样式
    const resizeHandleStyle = (position: PrintElement["resizeHandle"]) => {
        const baseStyle: React.CSSProperties = {
            position: "absolute",
            width: "8px",
            height: "8px",
            backgroundColor: "#4299e1",
            borderRadius: "50%",
            zIndex: 20,
            cursor: getResizeCursor(position),
        };

        switch (position) {
            case "br":
                return { ...baseStyle, bottom: "-4px", right: "-4px" };
            case "bl":
                return { ...baseStyle, bottom: "-4px", left: "-4px" };
            case "tr":
                return { ...baseStyle, top: "-4px", right: "-4px" };
            case "tl":
                return { ...baseStyle, top: "-4px", left: "-4px" };
            default:
                return baseStyle;
        }
    };

    // 计算纸张样式
    const paperStyle = (isPrint = false): React.CSSProperties => {
        const { width, height } = getPaperDimensions();
        return {
            width: `${width}mm`,
            height: `${height}mm`,
            margin: "0 auto",
            position: "relative",
            backgroundColor: "white",
            boxShadow: isPrint ? "none" : "0 0 20px rgba(0,0,0,0.1)",
            overflow: "hidden",
            padding: `${printConfig.margin}mm`,
        };
    };

    return (
        <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center", marginBottom: "30px" }}>React 拖拽打印组件</h2>

            {/* 操作栏 */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
                <button onClick={() => addPrintElement("text")} style={buttonStyle}>
                    添加文本
                </button>
                <button onClick={() => addPrintElement("image")} style={buttonStyle}>
                    添加图片
                </button>
                <button onClick={() => addPrintElement("custom")} style={buttonStyle}>
                    添加自定义元素
                </button>

                <div style={{ marginLeft: "auto", display: "flex", gap: "10px", alignItems: "center" }}>
                    <select
                        value={printConfig.paperSize}
                        onChange={(e) => updatePrintConfig("paperSize", e.target.value as PrintConfig["paperSize"])}
                        style={selectStyle}
                    >
                        <option value="A4">A4</option>
                        <option value="A3">A3</option>
                        <option value="Letter">Letter</option>
                        <option value="Legal">Legal</option>
                    </select>

                    <select
                        value={printConfig.orientation}
                        onChange={(e) => updatePrintConfig("orientation", e.target.value as PrintConfig["orientation"])}
                        style={selectStyle}
                    >
                        <option value="portrait">纵向</option>
                        <option value="landscape">横向</option>
                    </select>

                    <button onClick={handlePrint} style={{ ...buttonStyle, backgroundColor: "#48bb78" }}>
                        开始打印
                    </button>
                </div>
            </div>

            {/* 预览区域 */}
            <div
                ref={previewRef}
                style={{
                    width: "100%",
                    overflow: "auto",
                    padding: "20px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                }}
            >
                <div ref={paperRef} style={{ ...paperStyle(), transform: `scale(${scale})`, transformOrigin: "top center" }}>
                    {/* 打印内容（仅预览） */}
                    {renderPrintElements()}
                </div>
            </div>

            {/* 打印专用区域（隐藏） */}
            <div
                ref={printRef}
                style={{
                    display: "none",
                }}
            >
                <div style={paperStyle(true)}>{renderPrintElements()}</div>
            </div>

            {/* 使用说明 */}
            <div style={{ marginTop: "30px", padding: "20px", backgroundColor: "#f0f8fb", borderRadius: "8px" }}>
                <h4>使用说明：</h4>
                <ul style={{ margin: "10px 0", paddingLeft: "20px" }}>
                    <li>拖拽元素可调整位置，拖动四角手柄可缩放大小</li>
                    <li>文本元素可直接编辑内容，图片元素可替换URL</li>
                    <li>支持选择纸张大小和打印方向</li>
                    <li>点击"开始打印"按钮触发浏览器打印功能</li>
                </ul>
            </div>
        </div>
    );
};

// 样式辅助函数
const buttonStyle: React.CSSProperties = {
    padding: "8px 16px",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#4299e1",
    color: "white",
    fontSize: "14px",
    cursor: "pointer",
    transition: "background-color 0.2s",
};

const selectStyle: React.CSSProperties = {
    padding: "8px 12px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    backgroundColor: "white",
};

export default DragPrintComponent;
