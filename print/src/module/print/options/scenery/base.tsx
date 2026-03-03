import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Input, InputNumber, Select } from "antd";
import { MicrophoneType, Scenery } from "../../components/input-port";
import { type WebPrint } from "../../main/print";
import { initialStage } from "../../storyboard";
import { type BaseProperty, IncidentalMusic, type Protagonist, type Stage } from "../../type";
import { stagePaginationRules, stageShowState, stageType, timeFormat } from "../options";

interface BaseSceneryProps {
    printModule: WebPrint;
    protagonist: Protagonist;
}

export default function BaseScenery(props: BaseSceneryProps) {
    const { printModule, protagonist } = props;

    const s = printModule.protagonist;

    const [stage, setStage] = useState<Partial<BaseProperty>>({});

    const basePropertyChange = useCallback(
        (stage: Partial<BaseProperty>) => {
            // if (printModule) {
            //     printModule.stageReact(stage);
            // }
        },
        [printModule]
    );
    const subscribeStage = useCallback((stage) => {
        setStage(stage);
    }, []);

    useEffect(() => {
        if (printModule) {
            printModule.subscribe(IncidentalMusic.stageChange, subscribeStage);
            // setStage(printModule.stage);
        }
        return () => {
            if (printModule) {
                printModule.unsubscribe(IncidentalMusic.stageChange);
            }
        };
    }, [printModule]);

    return (
        <div className="major-scenery">
            <div className="scenery-box">
                <Scenery
                    port={MicrophoneType.INPUT}
                    label="标题"
                    value={stage.title}
                    onChange={(value) => {
                        basePropertyChange({ title: value });
                    }}
                />
            </div>
        </div>
    );
}
