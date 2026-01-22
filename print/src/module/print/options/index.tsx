import { useCallback, useEffect, useRef, useState } from "react";
import MajorScenery from "./major-scenery";
import type { WebPrint } from "../main/print";
import "./index.less";

interface SceneryProps {
    printModule: WebPrint;
}

export default function StageScenery(props: SceneryProps) {
    const { printModule } = props;

    return (
        <div className="scenery-option">
            <div className="scenery-header">属性</div>
            <MajorScenery printModule={printModule}></MajorScenery>
        </div>
    );
}
