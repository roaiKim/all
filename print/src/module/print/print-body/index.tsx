import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "antd";
import { Controller } from "../controller";
import { CustomerBodyEvent } from "../event/body-event";
import { CustomerMovingEvent } from "../event/moving-event";
import type { PrintElement } from "../main";
import { initialMovingState, ListenerType, type MovingState, type WebPrint } from "../main/print";
import { TextPrint } from "../shapes/text";
import "./index.less";

interface PrintBodyProps {
    ref: any;
    printElement: Record<string, PrintElement>;
    printModule: WebPrint;
}

export default function PrintBody(props: PrintBodyProps) {
    const { ref, printElement, printModule } = props;

    const [movingState, setMovingState] = useState(initialMovingState);
    const [spotlightState, setSpotlightState] = useState<MovingState>();
    const printBodyRef = useRef<HTMLDivElement>(null);
    const customerMovingEvent = useRef<CustomerMovingEvent>(null);
    const customerBodyEvent = useRef<CustomerBodyEvent>(null);

    const mouseEvent = useRef({
        mousemove: null,
        mouseleave: null,
        mouseup: null,
    });

    const movingStateChange = useCallback((state) => {
        console.log("===movingState===", state);
        setMovingState((prev) => ({ ...prev, ...state }));
    }, []);

    const spotlightChange = useCallback((state) => {
        console.log("--spotlight-正在改动-", state);
        if (state) {
            setSpotlightState((prev) => ({ ...(prev || {}), ...state }));
        } else {
            setSpotlightState(null);
        }
    }, []);

    useEffect(() => {
        if (printModule) {
            customerMovingEvent.current = new CustomerMovingEvent(printModule);
            customerBodyEvent.current = new CustomerBodyEvent(printModule, printBodyRef.current);
            // 监听
            customerMovingEvent.current.mousedown();
            printModule.subscribe(ListenerType.movingStateChange, movingStateChange);
            printModule.subscribe(ListenerType.spotlightChange, spotlightChange);
        }
        return () => {
            customerMovingEvent.current?.destroyAll();
            if (printModule) {
                printModule.unsubscribe(ListenerType.movingStateChange, movingStateChange);
                printModule.unsubscribe(ListenerType.spotlightChange, spotlightChange);
            }
        };
    }, [printModule]);

    useEffect(() => {
        if (movingState.moving) {
            mouseEvent.current.mousemove = customerMovingEvent.current.mousemove();
            mouseEvent.current.mouseup = customerMovingEvent.current.mouseup();
            mouseEvent.current.mouseleave = customerMovingEvent.current.mouseleave();
        } else {
            if (mouseEvent.current.mousemove) {
                customerMovingEvent.current?.destroyByState(mouseEvent.current.mousemove);
            }
            if (mouseEvent.current.mouseleave) {
                customerMovingEvent.current?.destroyByState(mouseEvent.current.mouseleave);
            }
            if (mouseEvent.current.mouseup) {
                customerMovingEvent.current?.destroyByState(mouseEvent.current.mouseup);
            }
        }
    }, [movingState.moving]);

    const hasSpotlight = !!spotlightState;

    useEffect(() => {
        console.log("---movingState---", movingState.moving, movingState.resizing);
        if (hasSpotlight && !movingState.moving && !movingState.resizing) {
            customerBodyEvent.current?.registerLeaveSpotlight();
        } else {
            customerBodyEvent.current?.removeLeaveSpotlight();
        }
        return () => {
            if (customerBodyEvent.current) {
                customerBodyEvent.current.destroyAll();
            }
        };
    }, [hasSpotlight, movingState.moving, movingState.resizing]);

    // console.log(customerMovingEvent.current);
    return (
        <div className="print-main">
            <div id="printBodyDom" ref={printBodyRef} className="print-body">
                <div id="printTemplateDom" ref={ref} className="print-template a4" /* onMouseMove={onMouseMove} onMouseUp={() => setMovingId("")} */>
                    {Object.values(printElement).map((item) => (
                        <Controller
                            key={item.id}
                            element={item}
                            movingState={movingState}
                            printModule={printModule}
                            spotlighting={spotlightState?.id === item.id}
                        >
                            <TextPrint element={item} />
                        </Controller>
                    ))}
                </div>
            </div>
        </div>
    );
}
