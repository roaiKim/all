import { useEffect, useRef, useState } from "react";
import "./index.less";

interface TextPrint {
    setMovingId: (id: string) => void;
}

export function TextPrint(props) {
    const { element, setMovingId } = props;
    const { x, y, width, height, content, id } = element || {};
    const [moving, setMoving] = useState(false);

    const rectRef = useRef(null);

    const [position, setPosition] = useState(() => ({ left: x, top: y, width, height }));
    const [origin, setOrigin] = useState([0, 0]);

    useEffect(() => {
        setPosition({ left: x, top: y, width, height });
    }, [x, y, width, height]);

    const onMouseDown = (event) => {
        // setMovingId(id);
        setMoving(true);
        if (origin[0] || origin[1]) {
            return;
        }
        setOrigin([event.pageX, event.pageY]);
    };

    const onMouseUp = (event) => {
        // setMovingId("");
        setMoving(false);

        // setOrigin([event.pageX, event.pageY]);
    };

    const onMouseMove = (event) => {
        if (!moving) {
            return;
        }
        console.log("onMouseMove", origin);
        const deltaX = event.pageX - origin[0];
        const deltaY = event.pageY - origin[1];
        // 用transform更新位置（性能优于top/left）
        console.log("delta", deltaX, deltaY);
        // rectRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    };

    return (
        <div
            ref={rectRef}
            className="print-element"
            style={position}
            onMouseMove={onMouseMove}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
        >
            {content}
        </div>
    );
}
