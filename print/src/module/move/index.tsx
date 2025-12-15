import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { message } from "antd";
import Actor from "./actor";
import "./index.less";

export interface PrintElement {
    id: string;
    content: string;
    option?: any;
}

export default function WebContainer() {
    return (
        <div>
            <div></div>
            <div id="web-container" className="web-container"></div>
            <div style={{ height: 200 }}></div>
            <Actor />
        </div>
    );
}
