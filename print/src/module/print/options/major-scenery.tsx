import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Input, InputNumber, Select } from "antd";
import { stagePaginationRules, stageShowState, stageType, timeFormat } from "./options";
import { MicrophoneType, Scenery } from "../components/input-port";
import { type WebPrint } from "../main/print";
import { initialStage } from "../storyboard";
import { IncidentalMusic, type Stage } from "../type";

interface MajorSceneryProps {
    printModule: WebPrint;
}

export default function MajorScenery(props: MajorSceneryProps) {
    const { printModule } = props;

    const [stage, setStage] = useState<Partial<Stage>>(() => initialStage({}));

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
                    port={MicrophoneType.SELECT}
                    label="纸张列表"
                    value={stage.type}
                    onChange={(value) => {
                        stageChange({ type: value });
                    }}
                    washLight={{
                        options: stageType,
                    }}
                />
                <Scenery
                    port={MicrophoneType.NUMBER}
                    label="宽"
                    value={stage.width}
                    onChange={(value) => {
                        stageChange({ width: value });
                    }}
                />
                <Scenery
                    port={MicrophoneType.NUMBER}
                    label="高"
                    value={stage.height}
                    onChange={(value) => {
                        stageChange({ height: value });
                    }}
                />
                <Scenery
                    port={MicrophoneType.SELECT}
                    label="分页规则"
                    value={stage.paginationRule}
                    onChange={(value) => {
                        stageChange({ paginationRule: value });
                    }}
                    washLight={{
                        options: [...stagePaginationRules],
                    }}
                />
                <Scenery
                    port={MicrophoneType.NUMBER}
                    label="页眉位置"
                    value={stage.headerLine}
                    onChange={(value) => {
                        stageChange({ headerLine: value });
                    }}
                />
                <Scenery
                    port={MicrophoneType.NUMBER}
                    label="页尾位置"
                    value={stage.footerLine}
                    onChange={(value) => {
                        stageChange({ footerLine: value });
                    }}
                />
                <Scenery
                    port={MicrophoneType.NUMBER}
                    label="首页页眉"
                    value={stage.firstPageFooterLine}
                    onChange={(value) => {
                        stageChange({ firstPageFooterLine: value });
                    }}
                />
                <Scenery
                    port={MicrophoneType.NUMBER}
                    label="尾页页尾"
                    value={stage.lastPageFooterLine}
                    onChange={(value) => {
                        stageChange({ lastPageFooterLine: value });
                    }}
                />
                <Scenery
                    port={MicrophoneType.NUMBER}
                    label="偶数页页尾"
                    value={stage.evenPageFooterLine}
                    onChange={(value) => {
                        stageChange({ evenPageFooterLine: value });
                    }}
                />
                <Scenery
                    port={MicrophoneType.NUMBER}
                    label="奇数页页尾"
                    value={stage.oddPageFooterLine}
                    onChange={(value) => {
                        stageChange({ oddPageFooterLine: value });
                    }}
                />
                <Scenery
                    port={MicrophoneType.NUMBER}
                    label="左偏移"
                    value={stage.leftOffset}
                    onChange={(value) => {
                        stageChange({ leftOffset: value });
                    }}
                />
                <Scenery
                    port={MicrophoneType.NUMBER}
                    label="顶部偏移"
                    value={stage.topOffset}
                    onChange={(value) => {
                        stageChange({ topOffset: value });
                    }}
                />
                <Scenery
                    port={MicrophoneType.SELECT}
                    label="页码显示"
                    value={stage.showPageNo}
                    onChange={(value) => {
                        stageChange({ showPageNo: value });
                    }}
                    washLight={{
                        options: stageShowState,
                    }}
                />
                <Scenery
                    port={MicrophoneType.INPUT}
                    label="页码格式"
                    value={stage.pageNoFormat}
                    onChange={(value) => {
                        stageChange({ pageNoFormat: value });
                    }}
                    powered={!!stage.showPageNo}
                    washLight={{
                        placeholder: "index/total",
                    }}
                />
                <Scenery
                    port={MicrophoneType.SELECT}
                    label="水印显示"
                    value={stage.showWatermark}
                    onChange={(value) => {
                        stageChange({ showWatermark: value });
                    }}
                    washLight={{
                        options: stageShowState,
                    }}
                />
                <Scenery
                    port={MicrophoneType.INPUT}
                    label="水印内容"
                    value={stage.watermark}
                    powered={stage.showWatermark === 1}
                    onChange={(value) => {
                        stageChange({ watermark: value });
                    }}
                />
                <Scenery
                    port={MicrophoneType.SELECT}
                    label="水印时间"
                    value={stage.showWatermarkTime}
                    onChange={(value) => {
                        stageChange({ showWatermarkTime: value });
                    }}
                    powered={stage.showWatermark === 1}
                    washLight={{
                        options: stageShowState,
                    }}
                />
                <Scenery
                    port={MicrophoneType.SELECT}
                    label="时间格式"
                    value={stage.watermarkTime}
                    onChange={(value) => {
                        stageChange({ watermarkTime: value });
                    }}
                    powered={stage.showWatermark === 1 && !!stage.showWatermarkTime}
                    washLight={{
                        options: timeFormat.map((item) => ({ value: item, label: item })),
                    }}
                />
            </div>
        </div>
    );
}
