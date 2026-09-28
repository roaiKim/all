import { useRef } from "react";
import { Tabs } from "antd";
import classNames from "classnames";
import { useDrag } from "./hooks/useDrag";
import "./index.less";

interface RectProps {}

function Rect(props: RectProps) {
    const contaienr = useRef<HTMLDivElement>(null);
    const { dragState } = useDrag({
        dragger: contaienr,
        target: ".rect-box",
    });
    console.log("---dragState--", dragState);
    return (
        <div ref={contaienr} className={"rect-container"}>
            <div className={"rect-box"}></div>
            <div className={"rect-box"}></div>
        </div>
    );
}

export default Rect;
