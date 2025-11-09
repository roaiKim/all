import { useEffect, useRef, useState } from "react";
import "./index.less";

interface TextPrint {
    setMovingId: (id: string) => void;
}

export function TextPrint(props) {
    const { element, setMovingId } = props;
    const { x, y, width, height, content, id } = element || {};

    return <div className="print-element">{content}</div>;
}
