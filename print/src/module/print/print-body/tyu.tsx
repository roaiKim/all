import type { PrintElement } from "../main";
import type { WebPrint } from "../main/print";

export interface SplitterPrintProps {
    printModule: WebPrint;
    printElement: PrintElement;
}

export function SplitterPrint(props: SplitterPrintProps) {
    const { printModule, printElement } = props;
    const { x, y, width, height, content, id, type } = printElement || {};

    return <div className="print-element">{content}</div>;
}
