import { type DramaActor, type Protagonist, type ProtagonistStatus, type Stage, StageType } from "../type";
import { PositionManager } from "../utils/position-manager";

/**
 * @description 初始化拖拽模板
 * @returns
 */
export const initialStageDirections = () => ({
    x: 0,
    y: 0,
    type: null,
    width: 280,
    height: 100,
    draging: false,
});

/**
 * @description 初始化元素
 * @param state
 * @returns
 */
export const initialDramaActor = (state?: Partial<DramaActor>) => ({
    id: "",
    x: 0,
    y: 0,
    type: null,
    width: 280,
    height: 100,
    content: "",
    ...state,
});

/**
 * @description 初始化焦点元素状态
 * @param status
 * @returns
 */
export const initialProtagonistStatus = (status?: Partial<ProtagonistStatus>) => ({
    moving: false,
    resizing: false,
    spotlight: false,
    ...status,
});

/**
 * @description 初始化焦点元素
 * @param status
 * @param state
 * @returns
 */
export const initialProtagonist = (status?: Partial<ProtagonistStatus>, state?: DramaActor): Protagonist => ({
    dramaActor: initialDramaActor(state),
    ...initialProtagonistStatus(status),
});

/**
 * @description 初始化 舞台
 * @param stageState
 * @param stage
 * @returns
 */
export const initialStage = (stageState: Partial<Stage>, stage?: HTMLElement): Stage => ({
    type: StageType.A4,
    paginationRule: 1,
    headerLine: null,
    footerLine: null,
    firstPageFooterLine: null,
    lastPageFooterLine: null,
    evenPageFooterLine: null,
    oddPageFooterLine: null,
    leftOffset: null,
    topOffset: null,
    ...stageState,
    ...PositionManager.getRectState(stage),
});
