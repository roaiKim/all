// import PretextText from "./hooks";

// function App() {
//     return (
//         <div style={{ padding: 20 }}>
//             <PretextText text="这是一段测试文本，layout 参数完全正确，不会报错！" maxWidth={300} fontSize={16} />
//         </div>
//     );
// }

// export default App;

import { useEffect, useState } from "react";
import { PretextParagraph } from "../pretext-codex";

export default function LiveEditor() {
    const [text, setText] = useState("这是一段初始文本，你可以不断输入，下面会实时重新排版。");

    return (
        <div style={{ width: 320, padding: 16 }}>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={6}
                style={{
                    width: "100%",
                    marginBottom: 16,
                    padding: 8,
                    fontSize: 16,
                    lineHeight: "24px",
                }}
            />

            <PretextParagraph text={text} font="16px Inter" lineHeight={24} whiteSpace="pre-wrap" className="preview" />
        </div>
    );
}

// const messages = [
//     "短句",
//     "这是一段稍微长一点的文本，会自动换行。",
//     "这是一段更长的内容，用来模拟服务端不断推送的新消息，React 会重新渲染，Pretext 会重新计算布局。",
// ];

// export default function AutoChangeText() {
//     const [index, setIndex] = useState(0);

//     useEffect(() => {
//         const timer = setInterval(() => {
//             setIndex((prev) => (prev + 1) % messages.length);
//         }, 2000);

//         return () => clearInterval(timer);
//     }, []);

//     return (
//         <div style={{ width: 280 }}>
//             <PretextParagraph text={messages[index]} font="16px Inter" lineHeight={24} />
//         </div>
//     );
// }
