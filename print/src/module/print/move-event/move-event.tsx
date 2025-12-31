import { MoveBaseEventManager, type MoveBaseEventManagerProps } from "./base-move-event";
import type { DramaActor } from "../main";
import type { WebPrint } from "../main/print";
import type { BasePrintPlugin } from "../plugin/base-print-plugin";

interface MoveEventManagerProps extends MoveBaseEventManagerProps {
    state: DramaActor;
    movStart?: (state: MoveBaseEventManagerProps["state"]) => void;
    moving?: (state: MoveBaseEventManagerProps["state"]) => void;
    movEnd?: (state: MoveBaseEventManagerProps["state"], isWrap: boolean) => void;
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
        if (this.options.movStart) {
            this.options.movStart(this.state);
        }
        this.printModule.moveEvent("start", { moving: true, spotlight: true }, this.state);
    };

    mousemoveListener = () => {
        if (this.options.moving) {
            this.options.moving(this.state);
        }
        this.printModule.moveEvent("moving", {}, this.state);
    };

    mouseupListener = (event, isWrap) => {
        if (this.options.movEnd) {
            this.options.movEnd(this.state, isWrap);
        }
        this.printModule.moveEvent("end", { moving: false }, this.state);
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
