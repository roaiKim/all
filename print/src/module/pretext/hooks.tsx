import { useMemo } from "react";
import { layout, prepare } from "@chenglou/pretext";

// 🔥 完全正确的 Pretext + React 组件
export default function PretextText({ text, maxWidth = 300, fontSize = 16 }) {
    const lineHeightPx = fontSize * 1.5;

    // 1. 预处理文本
    const prepared = useMemo(() => {
        const font = `${fontSize}px alimama`;
        return prepare(text, font);
    }, [text, fontSize]);

    // 2. ✅ 正确 layout 用法：传 3 个参数！不是对象！
    const result = useMemo(() => {
        return layout(prepared, maxWidth, lineHeightPx);
    }, [prepared, maxWidth, lineHeightPx]);

    return (
        <div
            style={{
                width: maxWidth,
                fontSize: fontSize + "px",
                lineHeight: 1.5,
            }}
        >
            {text}
            <p>计算高度：{result.height}px</p>
        </div>
    );
}
