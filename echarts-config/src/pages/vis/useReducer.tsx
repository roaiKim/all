import { startTransition, useOptimistic, useReducer, useRef, useState } from "react";

const reducer = (state, { type }) => {
    switch (type) {
        case "+":
            return state + 1;
        case "-":
            return state - 1;
        case "*":
            return state * 2;
        case "/":
            return state / 2;
    }
};

export default function LikeButton() {
    // const [state, setState] = useState(10);

    const [state, dispatch] = useReducer(reducer, 10);

    const handleLike = async (sign) => {
        // 立即更新 UI
        dispatch({ type: sign });
    };

    return (
        <div className="like-button">
            {state}
            <br />
            <button
                onClick={() => handleLike("+")}
                style={{
                    color: "red",
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                }}
            >
                👍 +
            </button>
            <br />
            <button
                onClick={() => handleLike("-")}
                style={{
                    color: "red",
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                }}
            >
                👍 -
            </button>
            <br />
            <button
                onClick={() => handleLike("*")}
                style={{
                    color: "red",
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                }}
            >
                👍 *
            </button>
            <br />
            <button
                onClick={() => handleLike("/")}
                style={{
                    color: "red",
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                }}
            >
                👍 /
            </button>
        </div>
    );
}
