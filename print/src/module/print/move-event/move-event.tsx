import { MoveBaseEventManager, type MoveBaseEventManagerProps } from "./base-move-event";
import type { DramaActor } from "../main";
import type { WebPrint } from "../main/print";
import type { RolesName } from "../main/static";
import type { BasePrintPlugin } from "../plugin/base-print-plugin";
import { PositionManager } from "../utils/position-manager";

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

    // initial() {
    //     this.moverDom.addEventListener("click", );
    // }

    mousedownListener = (event) => {
        if (this.options.movStart) {
            this.options.movStart(this.state);
        }
        this.state.moving = true;
        this.printModule.moveEvent("start", this.state);
    };

    mousemoveListener = () => {
        if (this.options.moving) {
            this.options.moving(this.state);
        }
        this.printModule.moveEvent("moving", this.state);
    };

    mouseupListener = (event, isWrap) => {
        if (this.options.movEnd) {
            this.options.movEnd(this.state, isWrap);
        }
        this.state.moving = false;
        this.printModule.moveEvent("end", this.state);
    };
}
