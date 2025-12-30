import { createContext, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { message } from "antd";
import { type BaseShape, IncidentalMusic, WebPrint } from "./print";
import type { RolesName } from "./static";
import TemporaryTemplate from "./temporary-template";
import { CustomerDragingEvent } from "../event/draging-event";
import Header from "../header";
import Operate from "../operate";
import PrintBody from "../print-body";
import Rule from "../rule";
import "./index.less";

export interface DramaActor extends BaseShape {
    type: RolesName | null;
    id: string;
    content: string;
    option?: any;
}

interface StagePlayState {
    stagePlay: WebPrint;
}

export const StagePlayContext = createContext<StagePlayState>(null);

export default function Assemble() {
    const printCurtain = useRef<HTMLElement>(null);
    const printContainer = useRef<HTMLDivElement>(null);

    const [printElement, setPrintElement] = useState<DramaActor[]>([]);

    const [printModule, setPrintModule] = useState<WebPrint>();
    const customDragEvent = useRef<CustomerDragingEvent>(null);

    useLayoutEffect(() => {
        const print = new WebPrint();
        customDragEvent.current = new CustomerDragingEvent(print);
        setPrintModule(print);
    }, []);

    useEffect(() => {
        if (printModule) {
            printModule.subscribe(IncidentalMusic.actorChange, (actor) => {
                console.log("--actor-正在改动-", actor);
                setPrintElement(() => actor);
            });
        }
    }, [printModule]);

    return (
        <StagePlayContext.Provider
            value={{
                stagePlay: printModule,
            }}
        >
            <div id="printContainerDom" className="print-container" ref={printContainer}>
                <Header printModule={printModule} />
                <Operate />
                <Rule></Rule>
                <div className="print-main">
                    <PrintBody ref={printCurtain} printElement={printElement} printModule={printModule} />
                    <div className="print-option"></div>
                </div>
                <TemporaryTemplate printModule={printModule} />
            </div>
        </StagePlayContext.Provider>
    );
}
