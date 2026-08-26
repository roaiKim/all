import { PositionManager } from "utils/framework/position-manager";
import { DragBaseEventManager, type DragBaseEventManagerProps } from "./base";

export interface DragEventManagerProps extends DragBaseEventManagerProps {
    onDragStart?: (state: DragBaseEventManager["dragState"]) => void;
    onDragMove?: (state: DragBaseEventManager["dragState"]) => void;
    onDragEnd?: (state: DragBaseEventManager["dragState"], isWrap: boolean) => void;
    onResizeStart?: (state: DragBaseEventManager["dragState"]) => void;
    onResizing?: (state: DragBaseEventManager["dragState"]) => void;
    onResizeEnd?: (state: DragBaseEventManager["dragState"], isWrap: boolean) => void;
    onStateChange?: (state: DragBaseEventManager["dragState"], isWrap: boolean) => void;
}

export class DragEventManager extends DragBaseEventManager {
    options: DragEventManagerProps;
    constructor(props: DragEventManagerProps) {
        // const { dragId, containerId } = props;
        super(props);
        this.options = props;
        console.log("--init-");
        // this.printModule = printModule;

        // this.shape = this.printModule.getPluginByName(props.draggableType);
        // const { width, height } = this.shape.option || {};
        // this.setDragTargetState({ width, height });
    }

    mousedownListener = (event) => {
        if (this.options.onDragStart) {
            this.options.onDragStart(this.dragState);
        }
        // const state = {
        //     type: this.options.draggableType,
        //     width: this.state.width,
        //     height: this.state.height,
        //     x: this.state.x,
        //     y: this.state.y,
        //     draging: true,
        // };
        // this.printModule.dragEvent("start", state);
    };

    mousemoveListener = () => {
        if (this.options.onDragMove) {
            this.options.onDragMove(this.dragState);
        }
        // const state = {
        //     x: this.state.x,
        //     y: this.state.y,
        // };
        // this.printModule.dragEvent("draging", state);
    };

    mouseupListener = (event, isWrap) => {
        if (this.options.onDragEnd) {
            this.options.onDragEnd(this.dragState, isWrap);
        }
        // this.printModule.dragEvent("end", this.state, isWrap);
        // const { width, height } = this.shape.option || {};
        // this.initialDragState({ width, height });
    };

    // validateWhole = (shouldWholeContain = true) => {
    //     return PositionManager.isChildrenInContainer(this.dragTarget, this.container, shouldWholeContain);
    // };
}
