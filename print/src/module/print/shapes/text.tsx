import { useState } from "react";
import "./index.less";

interface TextPrint {
    setMovingId: (id: string) => void;
}

export function TextPrint(props) {
    const { element, setMovingId } = props;
    const { x, y, width, height, content, id } = element || {};
    const [moving, setMoving] = useState(false);

    const onMouseDown = (event) => {
        setMovingId(id);
    };

    const onMouseUp = (event) => {
        setMovingId("");
    };

    return (
        <div
            className="print-element"
            style={{ width, height, top: y, left: x }}
            // onMouseMove={onMouseMove}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
        >
            {content}
        </div>
    );
}
