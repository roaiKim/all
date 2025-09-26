import { startTransition, useOptimistic, useRef, useState } from "react";

// async function updateOptimistic() {}
async function addText(text) {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (Math.random() > 0.5) {
        throw new Error("错误");
    }

    return text;
}

// export default function TodoList() {
//     const [todos, setTodos] = useState([]);

//     const [optimisticTodos, addOptimsiticTodos] = useOptimistic(todos, (currentState, newTodos) => [
//         ...currentState,
//         { id: Date.now(), text: newTodos, completed: false },
//     ]);

//     const inputRef = useRef(null);

//     async function handleAddTodo(text) {
//         console.log("--handleAddTodo--", text);
//         await addOptimsiticTodos(addText(text));

//         // setTodos((prev) => [...prev, finalTodo]);
//     }
//     console.log(optimisticTodos);
//     return (
//         <div>
//             <input type="text" ref={inputRef} placeholder="添加代办"></input>
//             <button onClick={() => handleAddTodo(inputRef.current.value)}>添加</button>
//             <ul>
//                 {optimisticTodos.map((item, index) => (
//                     <li key={item.id}>{item.text}</li>
//                 ))}
//             </ul>
//         </div>
//     );
// }

// export default function () {
//     const [count, setCount] = useState(4);

//     const [optCount, addOptCount] = useOptimistic(count, (currentCount, newCount: number) => currentCount + newCount);

//     const handle = () => {
//         // setCount((prev) => prev + 1);

//         // setCount((prev) => prev + 4);
//         startTransition(async () => {
//             addOptCount(4);
//             const count = await addText(4);
//             setCount((prev) => prev + count);
//         });
//     };

//     return (
//         <div>
//             <button onClick={handle}>添加</button>
//             {optCount}
//         </div>
//     );
// }

// 模拟 API 调用
async function sendLike() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // 模拟 10% 失败率
            if (Math.random() < 0.1) {
                reject(new Error("点赞失败，请重试"));
            } else {
                resolve(true);
            }
        }, 800);
    });
}

export default function LikeButton() {
    const [likes, setLikes] = useState(67);
    const [error, setError] = useState(null);

    // 定义乐观更新
    const [optimisticLikes, addOptimisticLike] = useOptimistic(likes, (currentLikes, delta: number) => currentLikes + delta);

    const handleLike = async () => {
        // 立即更新 UI

        // 在 transition 中处理异步操作
        startTransition(async () => {
            addOptimisticLike(1);
            setError(null);
            try {
                await sendLike();
                // 更新真实状态
                setLikes((prev) => prev + 1);
            } catch (err) {
                // 错误处理，React 会自动回滚 UI
                setError(err.message);
            }
        });
    };

    return (
        <div className="like-button">
            <button
                onClick={handleLike}
                disabled={error !== null}
                style={{
                    backgroundColor: error ? "#ef4444" : "#3b82f6",
                    color: "white",
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                }}
            >
                👍 {optimisticLikes}
            </button>
            {error && <p style={{ color: "#ef4444", marginTop: "4px" }}>{error}</p>}
        </div>
    );
}
