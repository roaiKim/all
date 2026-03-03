import { useCallback, useEffect, useRef, useState } from "react";
import MajorScenery from "./major-scenery";
import SceneryController from "./scenery/controller";
import type { WebPrint } from "../main/print";
import { IncidentalMusic, type Protagonist } from "../type";
import "./index.less";

interface SceneryProps {
    printModule: WebPrint;
}

export default function StageScenery(props: SceneryProps) {
    const { printModule } = props;

    const [protagonist, setProtagonist] = useState<Protagonist>(null);

    useEffect(() => {
        if (printModule) {
            printModule.subscribe(IncidentalMusic.protagonistChange, (protagonist) => {
                setProtagonist(protagonist);
            });
        }
    }, [printModule]);

    return (
        <div className="scenery-option">
            <div className="scenery-header">属性</div>
            {/* <MajorScenery printModule={printModule}></MajorScenery> */}

            <SceneryController printModule={printModule} protagonist={protagonist} />
        </div>
    );
}
