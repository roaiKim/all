// 元素属性组件
export const ElementProperties = ({ element, updateProperty, deleteElement }) => {
    if (!element) return null;

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">位置和大小</label>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="block text-xs text-gray-600 mb-1">X:</label>
                        <input
                            type="number"
                            value={element.x}
                            onChange={(e) => updateProperty(element.id, "x", parseInt(e.target.value))}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-600 mb-1">Y:</label>
                        <input
                            type="number"
                            value={element.y}
                            onChange={(e) => updateProperty(element.id, "y", parseInt(e.target.value))}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-600 mb-1">宽度:</label>
                        <input
                            type="number"
                            value={element.width}
                            onChange={(e) => updateProperty(element.id, "width", parseInt(e.target.value))}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-600 mb-1">高度:</label>
                        <input
                            type="number"
                            value={element.height}
                            onChange={(e) => updateProperty(element.id, "height", parseInt(e.target.value))}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                    </div>
                </div>
            </div>

            {element.type !== "line" && (
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">样式</label>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">填充色:</label>
                            <input
                                type="color"
                                value={element.fill}
                                onChange={(e) => updateProperty(element.id, "fill", e.target.value)}
                                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">边框色:</label>
                            <input
                                type="color"
                                value={element.stroke}
                                onChange={(e) => updateProperty(element.id, "stroke", e.target.value)}
                                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                            />
                        </div>
                    </div>
                </div>
            )}

            {element.type === "text" && (
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">文本属性</label>
                    <div className="space-y-2">
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">字体大小:</label>
                            <input
                                type="number"
                                value={element.fontSize}
                                onChange={(e) => updateProperty(element.id, "fontSize", parseInt(e.target.value))}
                                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">字体:</label>
                            <select
                                value={element.fontFamily}
                                onChange={(e) => updateProperty(element.id, "fontFamily", e.target.value)}
                                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                            >
                                <option value="Arial">Arial</option>
                                <option value="Times New Roman">Times New Roman</option>
                                <option value="Courier New">Courier New</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">操作</label>
                <button
                    onClick={() => deleteElement(element.id)}
                    className="w-full bg-danger text-white text-xs py-1 rounded hover:bg-danger/90 transition-colors"
                >
                    <i className="fa fa-trash mr-1"></i>删除
                </button>
            </div>
        </div>
    );
};
