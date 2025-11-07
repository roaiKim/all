import { useState } from "react";
import type { PrintElement } from "../main";
import { TextPrint } from "../shapes/text";
import "./index.less";

interface PrintBodyProps {
    ref: any;
    printElement: Record<string, PrintElement>;
}

export default function PrintBody(props: PrintBodyProps) {
    const { ref, printElement } = props;

    const [movingId, setMovingId] = useState("");
    const onMouseMove = (event) => {
        // //
        // if (movingId) {
        //     console.log("--event--", event);
        // }
    };
    // console.log("----------printElement---", printElement);
    return (
        <div className="print-main">
            <div className="print-body">
                <div ref={ref} className="print-template a4" /* onMouseMove={onMouseMove} onMouseUp={() => setMovingId("")} */>
                    {Object.values(printElement).map((item) => (
                        <TextPrint key={item.id} element={item} setMovingId={setMovingId} />
                    ))}
                </div>
            </div>
        </div>
    );
}
