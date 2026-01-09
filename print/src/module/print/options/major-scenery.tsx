import { useCallback, useEffect, useRef, useState } from "react";
import type { WebPrint } from "../main/print";
import "./index.less";

interface MajorSceneryProps {
    printModule: WebPrint;
}

export default function MajorScenery(props: MajorSceneryProps) {
    const { printModule } = props;

    return <div className="major-scenery"></div>;
}
