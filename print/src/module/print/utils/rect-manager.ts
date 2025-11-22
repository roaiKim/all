import { ToolManager } from "./tool-manager";
import { MoveDirection } from "../event/spotlight-event";
import type { BaseShape, CurtainState, MovingState, WebPrint } from "../main/print";

export class RectManager {
    // -x
    static negativeXElasticity(event: MouseEvent, movingState: MovingState, curtainState: CurtainState) {
        return Math.min(movingState.x + movingState.width, Math.max(event.clientX - curtainState.x, 0));
    }

    // -y
    static negativeYElasticity(event: MouseEvent, movingState: MovingState, curtainState: CurtainState) {
        return Math.min(movingState.y + movingState.height, Math.max(event.clientY - curtainState.y, 0));
    }

    static negativeHeightElasticity(y: number, movingState: MovingState) {
        return movingState.y - y + movingState.height;
    }

    static positiveHeightElasticity(event: MouseEvent, movingState: MovingState, curtainState: CurtainState) {
        return Math.max(movingState.y, Math.min(event.clientY - curtainState.y, curtainState.height)) - movingState.y;
    }

    static negativeWidthElasticity(x: number, movingState: MovingState) {
        return movingState.x - x + movingState.width;
    }

    static positiveWidthElasticity(event: MouseEvent, movingState: MovingState, curtainState: CurtainState) {
        return Math.max(movingState.x, Math.min(event.clientX - curtainState.x, curtainState.width)) - movingState.x;
    }

    static BottomRight(event: MouseEvent, movingState: MovingState, curtainState: CurtainState) {
        const width = this.positiveWidthElasticity(event, movingState, curtainState);
        const height = this.positiveHeightElasticity(event, movingState, curtainState);
        return ToolManager.numberObjectPrecision({ width, height });
    }

    static MiddleRight(event: MouseEvent, movingState: MovingState, curtainState: CurtainState) {
        const width = this.positiveWidthElasticity(event, movingState, curtainState);
        return ToolManager.numberObjectPrecision({ width });
    }

    static MiddleBottom(event: MouseEvent, movingState: MovingState, curtainState: CurtainState) {
        const height = this.positiveHeightElasticity(event, movingState, curtainState);
        return ToolManager.numberObjectPrecision({ height });
    }

    static MiddleTop(event: MouseEvent, movingState: MovingState, curtainState: CurtainState) {
        const y = this.negativeYElasticity(event, movingState, curtainState);
        const height = this.negativeHeightElasticity(y, movingState);
        return ToolManager.numberObjectPrecision({ height, y });
    }

    static MiddleLeft(event: MouseEvent, movingState: MovingState, curtainState: CurtainState) {
        const x = this.negativeXElasticity(event, movingState, curtainState);
        const width = this.negativeWidthElasticity(x, movingState);
        return ToolManager.numberObjectPrecision({ width, x });
    }

    static BottomLeft(event: MouseEvent, movingState: MovingState, curtainState: CurtainState) {
        const x = this.negativeXElasticity(event, movingState, curtainState);
        const width = this.negativeWidthElasticity(x, movingState);
        const height = this.positiveHeightElasticity(event, movingState, curtainState);
        return ToolManager.numberObjectPrecision({ width, height, x });
    }

    static TopRight(event: MouseEvent, movingState: MovingState, curtainState: CurtainState) {
        const y = this.negativeYElasticity(event, movingState, curtainState);
        const width = this.positiveWidthElasticity(event, movingState, curtainState);
        const height = this.negativeHeightElasticity(y, movingState);
        return ToolManager.numberObjectPrecision({ height, width, y });
    }

    static TopLeft(event: MouseEvent, movingState: MovingState, curtainState: CurtainState) {
        const x = this.negativeXElasticity(event, movingState, curtainState);
        const width = this.negativeWidthElasticity(x, movingState);
        const y = this.negativeYElasticity(event, movingState, curtainState);
        const height = this.negativeHeightElasticity(y, movingState);
        return ToolManager.numberObjectPrecision({ width, height, x, y });
    }
}
