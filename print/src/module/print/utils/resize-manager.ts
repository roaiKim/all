import { ToolManager } from "./tool-manager";
import { MoveDirection } from "../event/spotlight-event";
import type { BaseShape, CurtainState, MovingState, WebPrint } from "../main/print";

export class ResizeManager {
    static controller(event: MouseEvent, direction: MoveDirection, printModule: WebPrint): Partial<BaseShape> {
        const { movingState, curtainState } = printModule;
        switch (direction) {
            case MoveDirection.BR:
                return this.BR(event, movingState, curtainState);
            case MoveDirection.MR:
                return this.MR(event, movingState, curtainState);
            case MoveDirection.MB:
                return this.MB(event, movingState, curtainState);
            default:
                return {};
        }
        return {};
    }

    // 右下角
    static BR(event: MouseEvent, movingState: MovingState, curtainState: CurtainState) {
        const width = Math.max(movingState.x, Math.min(event.clientX - curtainState.x, curtainState.width)) - movingState.x;
        const height = Math.max(movingState.y, Math.min(event.clientY - curtainState.y, curtainState.height)) - movingState.y;
        return ToolManager.numberObjectPrecision({ width, height });
    }

    // 右中
    static MR(event: MouseEvent, movingState: MovingState, curtainState: CurtainState) {
        const width = Math.max(movingState.x, Math.min(event.clientX - curtainState.x, curtainState.width)) - movingState.x;
        return ToolManager.numberObjectPrecision({ width });
    }

    // 下中
    static MB(event: MouseEvent, movingState: MovingState, curtainState: CurtainState) {
        const height = Math.max(movingState.y, Math.min(event.clientY - curtainState.y, curtainState.height)) - movingState.y;
        return ToolManager.numberObjectPrecision({ height });
    }
}
