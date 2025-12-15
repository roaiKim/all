import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { message } from "antd";
import { WebEvent } from "./event";

export default function Actor() {
    const act = useRef(null);

    useEffect(() => {
        const webEvent = new WebEvent("web-actor", "web-container");
    }, []);

    return <div id="web-actor" ref={act}></div>;
}
