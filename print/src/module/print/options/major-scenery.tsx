import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Input, InputNumber, Select } from "antd";
import { stagePaginationRules, stageType } from "./options";
import { Scenery } from "../components/input-port";
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
                    label="纸张列表"
                    value={stage.type}
                    onChange={(value) => {
                        stageChange({ type: value });
                    }}
                    electric={
                        {
                            // onChange: (value: number) => {
                            //     stageChange({ type: value });
                            // },
                        }
                    }
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
                <div className="scenery-row">
                    <div>宽：</div>
                    <div>
                        <InputNumber
                            value={stage.width}
                            onChange={(value: number) => {
                                stageChange({ width: value });
                            }}
                        />
                    </div>
                </div>
                <div className="scenery-row">
                    <div>高：</div>
                    <div>
                        <InputNumber
                            value={stage.height}
                            onChange={(value: number) => {
                                stageChange({ height: value });
                            }}
                        />
                    </div>
                </div>
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
                <div className="scenery-row">
                    <div>页眉位置：</div>
                    <div>
                        <InputNumber
                            value={stage.headerLine}
                            onChange={(value: number) => {
                                stageChange({ headerLine: value });
                            }}
                        />
                    </div>
                </div>
                <div className="scenery-row">
                    <div>页尾位置：</div>
                    <div>
                        <InputNumber
                            value={stage.footerLine}
                            onChange={(value: number) => {
                                stageChange({ footerLine: value });
                            }}
                        />
                    </div>
                </div>
                <div className="scenery-row">
                    <div>首页页眉：</div>
                    <div>
                        <InputNumber
                            value={stage.firstPageFooterLine}
                            onChange={(value: number) => {
                                stageChange({ firstPageFooterLine: value });
                            }}
                        />
                    </div>
                </div>
                <div className="scenery-row">
                    <div>尾页页尾：</div>
                    <div>
                        <InputNumber
                            value={stage.lastPageFooterLine}
                            onChange={(value: number) => {
                                stageChange({ lastPageFooterLine: value });
                            }}
                        />
                    </div>
                </div>
                <div className="scenery-row">
                    <div>偶数页页尾：</div>
                    <div>
                        <InputNumber
                            value={stage.evenPageFooterLine}
                            onChange={(value: number) => {
                                stageChange({ evenPageFooterLine: value });
                            }}
                        />
                    </div>
                </div>
                <div className="scenery-row">
                    <div>奇数页页尾：</div>
                    <div>
                        <InputNumber
                            value={stage.oddPageFooterLine}
                            onChange={(value: number) => {
                                stageChange({ oddPageFooterLine: value });
                            }}
                        />
                    </div>
                </div>
                <div className="scenery-row">
                    <div>左偏移：</div>
                    <div>
                        <InputNumber
                            value={stage.leftOffset}
                            onChange={(value: number) => {
                                stageChange({ leftOffset: value });
                            }}
                        />
                    </div>
                </div>
                <div className="scenery-row">
                    <div>顶部偏移：</div>
                    <div>
                        <InputNumber
                            value={stage.topOffset}
                            onChange={(value: number) => {
                                stageChange({ topOffset: value });
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
