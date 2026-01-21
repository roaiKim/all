import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Input, Select } from "antd";
import type { Stage, WebPrint } from "../main/print";

interface MajorSceneryProps {
    printModule: WebPrint;
}

export default function MajorScenery(props: MajorSceneryProps) {
    const { printModule } = props;

    const [stage, setStage] = useState<Stage>(printModule.stage);

    const stageChange = useCallback(
        (stage: Partial<Stage>) => {
            if (printModule) {
                printModule.stageReact(stage);
            }
        },
        [printModule]
    );

    return (
        <div className="major-scenery">
            <div className="scenery-box">
                <div className="scenery-row">
                    <div>纸张列表：</div>
                    <div>
                        <Select
                            value={stage.type}
                            onChange={(value) => {
                                stageChange({ type: value });
                            }}
                            options={[
                                { value: "A4", label: "A4" },
                                { value: "A3", label: "A3" },
                            ]}
                        />
                    </div>
                </div>
                <div className="scenery-row">
                    <div>宽：</div>
                    <div>
                        <Input />
                    </div>
                </div>
                <div className="scenery-row">
                    <div>高：</div>
                    <div>
                        <Input />
                    </div>
                </div>
            </div>
        </div>
    );
}
