import { DragBaseEventManager, type DragBaseEventManagerProps } from "./base-drag-event";
import type { WebPrint } from "../main/print";
import type { DraggableType } from "../main/static";

interface DragEventManagerProps extends DragBaseEventManagerProps {
    draggableType: DraggableType;
    movStart?: (state: DragBaseEventManagerProps["state"]) => void;
    moving?: (state: DragBaseEventManagerProps["state"]) => void;
    movEnd?: (state: DragBaseEventManagerProps["state"], isWrap: boolean) => void;
}

export class DragEventManager extends DragBaseEventManager {
    options: DragEventManagerProps;
    printModule: WebPrint;
    constructor(props: DragEventManagerProps, printModule: WebPrint) {
        // const { dragId, containerId } = props;
        super(props);
        this.options = props;

        this.printModule = printModule;
    }

    mousedownListener = (event) => {
        console.log("--mousedownListener--");
        if (this.options.movStart) {
            this.options.movStart(this.state);
        }
        // const
    };

    mousemoveListener = () => {
        console.log("--mousemoveListener--");
        if (this.options.moving) {
            this.options.moving(this.state);
        }
    };

    mouseupListener = (event, isWrap) => {
        console.log("--mouseupListener--", isWrap);
        if (this.options.movEnd) {
            this.options.movEnd(this.state, isWrap);
        }
    };
}
