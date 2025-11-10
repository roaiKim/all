import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "antd";
import { Controller } from "../controller";
import { CustomerMovingEvent } from "../event/moving-event";
import type { PrintElement } from "../main";
import { initialMovingState, ListenerType, type WebPrint } from "../main/print";
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
    const customerMovingEvent = useRef<CustomerMovingEvent>(null);
    const mouseEvent = useRef({
        mousemove: null,
        mouseleave: null,
    });

    const movingStateChange = useCallback((state) => {
        // console.log("===movingState===", state);
        setMovingState((prev) => ({ ...prev, ...state }));
    }, []);

    useEffect(() => {
        if (printModule) {
            customerMovingEvent.current = new CustomerMovingEvent(printModule);
            customerMovingEvent.current.mousedown();
            customerMovingEvent.current.mouseup();
            printModule.subscribe(ListenerType.movingStateChange, movingStateChange);
        }
        return () => {
            customerMovingEvent.current?.destroy();
            if (printModule) {
                printModule.unsubscribe(ListenerType.movingStateChange, movingStateChange);
            }
        };
    }, [printModule]);

    useEffect(() => {
        if (movingState.moving) {
            mouseEvent.current.mousemove = customerMovingEvent.current.mousemove();
            mouseEvent.current.mouseleave = customerMovingEvent.current.mouseleave();
        } else {
            if (mouseEvent.current.mousemove) {
                customerMovingEvent.current?.destroy(mouseEvent.current.mousemove);
            }
            if (mouseEvent.current.mouseleave) {
                customerMovingEvent.current?.destroy(mouseEvent.current.mouseleave);
            }
        }
    }, [movingState.moving]);
    // console.log(customerMovingEvent.current);
    return (
        <div className="print-main">
            <div className="print-body">
                <div ref={ref} className="print-template a4" /* onMouseMove={onMouseMove} onMouseUp={() => setMovingId("")} */>
                    {Object.values(printElement).map((item) => (
                        <Controller key={item.id} element={item} movingState={movingState} printModule={printModule}>
                            <TextPrint element={item} />
                        </Controller>
                    ))}
                </div>
            </div>
            <Button
                onClick={() => {
                    console.log("printModule", printModule);
                }}
            >
                大小
            </Button>
        </div>
    );
}
