import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "antd";
// import { Controller } from "../controller";
import { CustomerBodyEvent } from "../event/body-event";
import { CustomerMovingEvent } from "../event/moving-event";
import type { PrintElement } from "../main";
import { initialMovingState, ListenerType, type MovingState, type WebPrint } from "../main/print";
import { DramaActor } from "../shapes/text";
import { dpiManager } from "../utils/dpi-manager";
import "./index.less";

interface PrintBodyProps {
    printModule: WebPrint;
}

export default function PrintBody(props: PrintBodyProps) {
    const { printModule } = props;

    return <div className="print-option-contaienr">ssf</div>;
}
