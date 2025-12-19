import { DragBaseEventManager, type DragBaseEventManagerProps } from "./base-event";

interface DragEventManagerProps extends DragBaseEventManagerProps {
    movStart?: (state: DragBaseEventManagerProps["state"]) => void;
    moving?: (state: DragBaseEventManagerProps["state"]) => void;
    movEnd?: (state: DragBaseEventManagerProps["state"]) => void;
}

export class DragEventManager extends DragBaseEventManager {
    options: DragEventManagerProps;
    constructor(props: DragEventManagerProps) {
        // const { dragId, containerId } = props;
        super(props);
        this.options = props;
    }

    mousedownListener = () => {
        console.log("--mousedownListener--");
        if (this.options.movStart) {
            this.options.movStart(this.state);
        }
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
            this.options.movEnd(this.state);
        }
    };
}
