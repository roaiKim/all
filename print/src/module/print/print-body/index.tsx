import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "antd";
import StageManager from "./drama-actor";
import { Director } from "../controller";
import { CustomerBodyEvent } from "../event/body-event";
import { CustomerMovingEvent } from "../event/moving-event";
import { type WebPrint } from "../main/print";
import { initialProtagonist } from "../storyboard";
import { type DramaActor, IncidentalMusic } from "../type";
// import { DramaActor } from "../shapes/text";
import { dpiManager } from "../utils/dpi-manager";
import "./index.less";

interface PrintBodyProps {
    ref: any;
    printElement: DramaActor[];
    printModule: WebPrint;
}

export default function PrintBody(props: PrintBodyProps) {
    const { ref, printElement, printModule } = props;

    const [protagonist, setProtagonist] = useState(initialProtagonist);
    const [spotlightState, setSpotlightState] = useState<DramaActor>();
    const printBodyRef = useRef<HTMLDivElement>(null);
    const customerMovingEvent = useRef<CustomerMovingEvent>(null);
    const customerBodyEvent = useRef<CustomerBodyEvent>(null);

    const mouseEvent = useRef({
        mousemove: null,
        mouseleave: null,
        mouseup: null,
    });

    const movingStateChange = useCallback((state) => {
        // console.log("===movingState===", state);
        setProtagonist((prev) => ({ ...prev, ...state }));
    }, []);

    // const spotlightChange = useCallback((state) => {
    //     console.log("--spotlight-正在改动-", state);
    //     if (state) {
    //         setSpotlightState((prev) => ({ ...(prev || {}), ...state }));
    //     } else {
    //         setSpotlightState(null);
    //     }
    // }, []);

    useEffect(() => {
        if (printModule) {
            // customerMovingEvent.current = new CustomerMovingEvent(printModule);
            // customerBodyEvent.current = new CustomerBodyEvent(printModule, printBodyRef.current);
            // 监听
            // customerMovingEvent.current.mousedown();
            printModule.subscribe(IncidentalMusic.movingStateChange, movingStateChange);
            // printModule.subscribe(IncidentalMusic.spotlightChange, movingStateChange);
        }
        return () => {
            customerMovingEvent.current?.destroyAll();
            if (printModule) {
                printModule.unsubscribe(IncidentalMusic.movingStateChange, movingStateChange);
                // printModule.unsubscribe(IncidentalMusic.spotlightChange, movingStateChange);
            }
        };
    }, [printModule]);

    // useEffect(() => {
    //     if (movingState.moving) {
    //         mouseEvent.current.mousemove = customerMovingEvent.current.mousemove();
    //         mouseEvent.current.mouseup = customerMovingEvent.current.mouseup();
    //         mouseEvent.current.mouseleave = customerMovingEvent.current.mouseleave();
    //     } else {
    //         if (mouseEvent.current.mousemove) {
    //             customerMovingEvent.current?.destroyByState(mouseEvent.current.mousemove);
    //         }
    //         if (mouseEvent.current.mouseleave) {
    //             customerMovingEvent.current?.destroyByState(mouseEvent.current.mouseleave);
    //         }
    //         if (mouseEvent.current.mouseup) {
    //             customerMovingEvent.current?.destroyByState(mouseEvent.current.mouseup);
    //         }
    //     }
    // }, [movingState.moving]);

    const hasSpotlight = !!spotlightState;

    // useEffect(() => {
    //     console.log("---movingState---", movingState.moving, movingState.resizing);
    //     if (hasSpotlight && !movingState.moving && !movingState.resizing) {
    //         // customerBodyEvent.current?.registerLeaveSpotlight();
    //     } else {
    //         // customerBodyEvent.current?.removeLeaveSpotlight();
    //     }
    //     return () => {
    //         if (customerBodyEvent.current) {
    //             customerBodyEvent.current.destroyAll();
    //         }
    //     };
    // }, [hasSpotlight, movingState.moving, movingState.resizing]);

    const height = dpiManager.mmToPx(296) * 1.5 + 80;

    return (
        <div className="print-stage">
            <div id="printBodyDom" ref={printBodyRef} className="print-body" style={{ height }}>
                <div id="printTemplateDom" ref={ref} className="print-template a4">
                    {printElement.map((actor) => (
                        <StageManager
                            key={actor.id}
                            dramaActor={actor}
                            protagonist={protagonist}
                            spotlighting={protagonist.dramaActor?.id === actor.id}
                            stagePlay={printModule}
                        />
                        // <Controller
                        //     key={item.id}
                        //     element={item}
                        //     movingState={movingState}
                        //     printModule={printModule}
                        //     spotlighting={spotlightState?.id === item.id}
                        // >
                        //     <PrintRender printElement={item} printModule={printModule} />
                        // </Controller>
                    ))}
                </div>
            </div>
        </div>
    );
}
