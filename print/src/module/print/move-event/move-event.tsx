import { MoveBaseEventManager, type MoveBaseEventManagerProps } from "./base-move-event";
import type { WebPrint } from "../main/print";
import type { BasePrintPlugin } from "../plugin/base-print-plugin";
import type { DramaActor } from "../type";

interface MoveEventManagerProps extends MoveBaseEventManagerProps {
    state: DramaActor;
    onMoveStart?: (state: MoveBaseEventManagerProps["state"]) => void;
    onMoving?: (state: MoveBaseEventManagerProps["state"]) => void;
    onMoveEnd?: (state: MoveBaseEventManagerProps["state"], isWrap: boolean) => void;
    onResizeStart?: (state: MoveBaseEventManagerProps["state"]) => void;
    onResizing?: (state: MoveBaseEventManagerProps["state"]) => void;
    onResizeEnd?: (state: MoveBaseEventManagerProps["state"], isWrap: boolean) => void;
    onStateChange?: (state: MoveBaseEventManagerProps["state"], isWrap: boolean) => void;
}

export class MoveEventManager extends MoveBaseEventManager {
    options: MoveEventManagerProps;
    printModule: WebPrint;
    shape: BasePrintPlugin;
    constructor(props: MoveEventManagerProps, printModule: WebPrint) {
        super(props);
        this.options = props;

        this.printModule = printModule;
    }

    mousedownListener = (event) => {
        if (this.eventType === "move") {
            if (this.options.onMoveStart) {
                this.options.onMoveStart(this.state);
            }
            this.printModule.moveEvent("start", this.state.id, { moving: true, spotlight: true }, this.state);
        } else if (this.eventType === "resize") {
            this.printModule.resizeEvent("start", this.state.id, { resizing: true }, this.state);
        }
    };

    mousemoveListener = () => {
        if (this.eventType === "move") {
            if (this.options.onMoving) {
                this.options.onMoving(this.state);
            }
            this.printModule.moveEvent("moving", this.state.id, {}, this.state);
        } else if (this.eventType === "resize") {
            this.printModule.resizeEvent("resizing", this.state.id, {}, this.state);
        }
    };

    mouseupListener = (event, isWrap) => {
        if (this.eventType === "move") {
            if (this.options.onMoveEnd) {
                this.options.onMoveEnd(this.state, isWrap);
            }
            this.printModule.moveEvent("end", this.state.id, { moving: false }, this.state);
        } else if (this.eventType === "resize") {
            this.printModule.resizeEvent("end", this.state.id, { resizing: false }, this.state);
        }
    };

    // mousedownContinue = (event: MouseEvent) => {
    //     const target: any = event.target;
    //     if (target) {
    //         if (target.dataset?.fluctuateDirection) {
    //             event.stopPropagation();
    //             this.direction = target.dataset.fluctuateDirection as MoveDirection;
    //             this.printModule.resizeStart(this.getActor());
    //             this.registerMousemove();
    //         }
    //     }
    //     return true;
    // };
}
