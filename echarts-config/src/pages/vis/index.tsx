import { useState } from "react";

export default function Counter() {
    const [number, setNumber] = useState(0);

    return (
        <>
            <h1>{number}</h1>
            <button
                onClick={() => {
                    setNumber(number + 5);
                    setNumber((n) => n + 1);
                    setNumber(number + 3);
                    setNumber((n) => n + 2);
                }}
            >
                增加数字
            </button>
        </>
    );
}
