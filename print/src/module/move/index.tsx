import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { message } from "antd";
import Actor, { ChildrenActor } from "./actor";
import "./index.less";

export interface PrintElement {
    id: string;
    content: string;
    option?: any;
}

export default function WebContainer() {
    const [print, setPrint] = useState([]);

    return (
        <div className="web-app">
            <div></div>
            <div id="web-container" className="web-container">
                {print.map((item, index) => (
                    <ChildrenActor print={item} key={index} />
                ))}
            </div>
            <div style={{ height: 200 }}></div>
            <Actor
                addActor={(state) => {
                    setPrint((prev) => [...prev, state]);
                }}
            />
        </div>
    );
}
