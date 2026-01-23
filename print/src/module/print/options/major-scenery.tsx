import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Input, InputNumber, Select } from "antd";
import { stagePaginationRules, stageType } from "./options";
import { MicrophoneType, Scenery } from "../components/input-port";
import { type WebPrint } from "../main/print";
import { initialStage } from "../storyboard";
import { IncidentalMusic, type Stage } from "../type";

interface MajorSceneryProps {
    printModule: WebPrint;
}

export default function MajorScenery(props: MajorSceneryProps) {
    const { printModule } = props;

    const [stage, setStage] = useState<Stage>(() => initialStage({}));

    const stageChange = useCallback(
        (stage: Partial<Stage>) => {
            if (printModule) {
                printModule.stageReact(stage);
            }
        },
        [printModule]
    );
    const subscribeStage = useCallback((stage) => {
        setStage(stage);
    }, []);

    useEffect(() => {
        if (printModule) {
            printModule.subscribe(IncidentalMusic.stageChange, subscribeStage);
            setStage(printModule.stage);
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
                    port={MicrophoneType.NUMBER}
                    label="纸张列表"
                    value={stage.type}
                    onChange={(value) => {
                        stageChange({ type: value });
                    }}
                />
                <div className="scenery-row">
                    <div>纸张列表：</div>
                    <div>
                        <Select
                            value={stage.type}
                            onChange={(value) => {
                                stageChange({ type: value });
                            }}
                            options={stageType}
                        />
                    </div>
                    <div>测测</div>
                </div>
                <Scenery
                    port={MicrophoneType.NUMBER}
                    label="宽"
                    value={stage.width}
                    onChange={(value: number) => {
                        stageChange({ width: value });
                    }}
                />

                <Scenery
                    port={MicrophoneType.NUMBER}
                    label="高"
                    value={stage.height}
                    onChange={(value: number) => {
                        stageChange({ height: value });
                    }}
                />

                <div className="scenery-row">
                    <div>分页规则：</div>
                    <div>
                        <Select
                            value={stage.paginationRule}
                            onChange={(value) => {
                                stageChange({ paginationRule: value });
                            }}
                            options={[...stagePaginationRules]}
                        />
                    </div>
                </div>
                <Scenery
                    port={MicrophoneType.NUMBER}
                    label="页眉位置"
                    value={stage.headerLine}
                    onChange={(value: number) => {
                        stageChange({ headerLine: value });
                    }}
                />
                <Scenery
                    port={MicrophoneType.NUMBER}
                    label="页尾位置"
                    value={stage.footerLine}
                    onChange={(value: number) => {
                        stageChange({ footerLine: value });
                    }}
                />
                <Scenery
                    port={MicrophoneType.NUMBER}
                    label="首页页眉"
                    value={stage.firstPageFooterLine}
                    onChange={(value: number) => {
                        stageChange({ firstPageFooterLine: value });
                    }}
                />
                <Scenery
                    port={MicrophoneType.NUMBER}
                    label="尾页页尾"
                    value={stage.lastPageFooterLine}
                    onChange={(value: number) => {
                        stageChange({ lastPageFooterLine: value });
                    }}
                />
                <Scenery
                    port={MicrophoneType.NUMBER}
                    label="偶数页页尾"
                    value={stage.evenPageFooterLine}
                    onChange={(value: number) => {
                        stageChange({ evenPageFooterLine: value });
                    }}
                />
                <Scenery
                    port={MicrophoneType.NUMBER}
                    label="奇数页页尾"
                    value={stage.oddPageFooterLine}
                    onChange={(value: number) => {
                        stageChange({ oddPageFooterLine: value });
                    }}
                />
                <Scenery
                    port={MicrophoneType.NUMBER}
                    label="左偏移"
                    value={stage.leftOffset}
                    onChange={(value: number) => {
                        stageChange({ leftOffset: value });
                    }}
                />
                <Scenery
                    port={MicrophoneType.NUMBER}
                    label="顶部偏移"
                    value={stage.topOffset}
                    onChange={(value: number) => {
                        stageChange({ topOffset: value });
                    }}
                />
            </div>
        </div>
    );
}
