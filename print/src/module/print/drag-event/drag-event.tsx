import { DragBaseEventManager, type DragBaseEventManagerProps } from "./base-drag-event";
import type { WebPrint } from "../main/print";
import type { BasePrintPlugin } from "../plugin/base-print-plugin";
import type { RolesName } from "../type";
import { PositionManager } from "../utils/position-manager";

interface DragEventManagerProps extends DragBaseEventManagerProps {
    draggableType: RolesName;
    movStart?: (state: DragBaseEventManagerProps["state"]) => void;
    moving?: (state: DragBaseEventManagerProps["state"]) => void;
    movEnd?: (state: DragBaseEventManagerProps["state"], isWrap: boolean) => void;
}

export class DragEventManager extends DragBaseEventManager {
    options: DragEventManagerProps;
    printModule: WebPrint;
    shape: BasePrintPlugin;
    constructor(props: DragEventManagerProps, printModule: WebPrint) {
        // const { dragId, containerId } = props;
        super(props);
        this.options = props;

        this.printModule = printModule;

        this.shape = this.printModule.getPluginByName(props.draggableType);
        const { width, height } = this.shape.option || {};
        this.setState({ width, height });
    }

    mousedownListener = (event) => {
        if (this.options.movStart) {
            this.options.movStart(this.state);
        }
        const state = {
            type: this.options.draggableType,
            width: this.state.width,
            height: this.state.height,
            x: this.state.x,
            y: this.state.y,
            draging: true,
        };
        this.printModule.dragEvent("start", state);
    };

    mousemoveListener = () => {
        if (this.options.moving) {
            this.options.moving(this.state);
        }
        const state = {
            x: this.state.x,
            y: this.state.y,
        };
        this.printModule.dragEvent("draging", state);
    };

    mouseupListener = (event, isWrap) => {
        if (this.options.movEnd) {
            this.options.movEnd(this.state, isWrap);
        }
        this.printModule.dragEvent("end", {}, isWrap);
        const { width, height } = this.shape.option || {};
        this.initialDragState({ width, height });
    };

    validateWhole = (showWholeContain = true) => {
        if (this.printModule.domManger.printTemplateDom) {
            return PositionManager.isChildrenInContainer(
                this.printModule.domManger.temporaryTemplateDom,
                this.printModule.domManger.printTemplateDom,
                showWholeContain
            );
        }
        return false;
    };
}
