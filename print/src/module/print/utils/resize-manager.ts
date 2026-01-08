import { ToolManager } from "./tool-manager";
import { MoveDirection } from "../event/spotlight-event";
import type { BaseShape } from "../main/print";

export class ResizeManager {
    static controller(event: MouseEvent, direction: MoveDirection, state: BaseShape, stage: BaseShape): Partial<BaseShape> {
        // const { state, stage } = printModule;
        switch (direction) {
            case MoveDirection.BOTTOM_RIGHT: // 右下角
                return this.BottomRight(event, state, stage);
            case MoveDirection.MIDDLE_RIGHT: // 右中
                return this.MiddleRight(event, state, stage);
            case MoveDirection.MIDDLE_BOTTOM: // 下中
                return this.MiddleBottom(event, state, stage);
            case MoveDirection.MIDDLE_TOP: // 上中
                return this.MiddleTop(event, state, stage);
            case MoveDirection.MIDDLE_LEFT: // 左中
                return this.MiddleLeft(event, state, stage);
            case MoveDirection.BOTTOM_LEFT: // 左下
                return this.BottomLeft(event, state, stage);
            case MoveDirection.TOP_RIGHT: // 右上
                return this.TopRight(event, state, stage);
            case MoveDirection.TOP_LEFT: // 左上
                return this.TopLeft(event, state, stage);
            default:
                return {};
        }
        return {};
    }

    static BottomRight(event: MouseEvent, state: BaseShape, stage: BaseShape) {
        const width = this.positiveWidthElasticity(event, state, stage);
        const height = this.positiveHeightElasticity(event, state, stage);
        return ToolManager.numberObjectPrecision({ width, height });
    }

    static MiddleRight(event: MouseEvent, state: BaseShape, stage: BaseShape) {
        const width = this.positiveWidthElasticity(event, state, stage);
        return ToolManager.numberObjectPrecision({ width });
    }

    static MiddleBottom(event: MouseEvent, state: BaseShape, stage: BaseShape) {
        const height = this.positiveHeightElasticity(event, state, stage);
        return ToolManager.numberObjectPrecision({ height });
    }

    static MiddleTop(event: MouseEvent, state: BaseShape, stage: BaseShape) {
        const y = this.negativeYElasticity(event, state, stage);
        const height = this.negativeHeightElasticity(y, state);
        return ToolManager.numberObjectPrecision({ height, y });
    }

    static MiddleLeft(event: MouseEvent, state: BaseShape, stage: BaseShape) {
        const x = this.negativeXElasticity(event, state, stage);
        const width = this.negativeWidthElasticity(x, state);
        return ToolManager.numberObjectPrecision({ width, x });
    }

    static BottomLeft(event: MouseEvent, state: BaseShape, stage: BaseShape) {
        const x = this.negativeXElasticity(event, state, stage);
        const width = this.negativeWidthElasticity(x, state);
        const height = this.positiveHeightElasticity(event, state, stage);
        return ToolManager.numberObjectPrecision({ width, height, x });
    }

    static TopRight(event: MouseEvent, state: BaseShape, stage: BaseShape) {
        const y = this.negativeYElasticity(event, state, stage);
        const width = this.positiveWidthElasticity(event, state, stage);
        const height = this.negativeHeightElasticity(y, state);
        return ToolManager.numberObjectPrecision({ height, width, y });
    }

    static TopLeft(event: MouseEvent, state: BaseShape, stage: BaseShape) {
        const x = this.negativeXElasticity(event, state, stage);
        const width = this.negativeWidthElasticity(x, state);
        const y = this.negativeYElasticity(event, state, stage);
        const height = this.negativeHeightElasticity(y, state);
        return ToolManager.numberObjectPrecision({ width, height, x, y });
    }

    static negativeXElasticity(event: MouseEvent, state: BaseShape, stage: BaseShape) {
        return Math.min(state.x + state.width, Math.max(event.clientX - stage.x, 0));
    }

    static negativeYElasticity(event: MouseEvent, state: BaseShape, stage: BaseShape) {
        return Math.min(state.y + state.height, Math.max(event.clientY - stage.y, 0));
    }

    static negativeHeightElasticity(y: number, state: BaseShape) {
        return state.y - y + state.height;
    }

    static positiveHeightElasticity(event: MouseEvent, state: BaseShape, stage: BaseShape) {
        return Math.max(state.y, Math.min(event.clientY - stage.y, stage.height)) - state.y;
    }

    static negativeWidthElasticity(x: number, state: BaseShape) {
        return state.x - x + state.width;
    }

    static positiveWidthElasticity(event: MouseEvent, state: BaseShape, stage: BaseShape) {
        return Math.max(state.x, Math.min(event.clientX - stage.x, stage.width)) - state.x;
    }
}
