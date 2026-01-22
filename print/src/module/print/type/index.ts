import type { stagePaginationRules } from "../options/options";

export enum RolesName {
    TEXT = "TEXT",
    IMG = "IMG",
    BRCODE = "BRCODE",
    QRCODE = "QRCODE",
    TEXTAREA = "TEXTAREA",
    TABLE = "TABLE",
    HTML = "HTML",
}

export enum StageType {
    "A3" = "A3",
    "A4" = "A4",
}

export interface DramaActor extends BaseShape {
    type: RolesName | null;
    id: string;
    content: string;
    option?: any;
}

export interface Shapes {
    base: any[];
    auxiliary: any[];
    other: any[];
    custom: any[];
}

export interface BaseShape {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface StageDirections extends BaseShape {
    type: RolesName | null;
    draging: boolean;
}

export interface ProtagonistStatus {
    /**
     * 是否在移动
     */
    moving: boolean;
    /**
     * 是否 在resize
     */
    resizing: boolean;
    /**
     * 是否聚焦
     */
    spotlight: boolean;
}

export interface Protagonist extends ProtagonistStatus {
    dramaActor: DramaActor;
}

export interface Stage extends BaseShape {
    color?: string;
    /**
     * 纸张类型
     */
    type: StageType;
    /**
     * 分页规则
     */
    paginationRule: (typeof stagePaginationRules)[number]["value"];
    /**
     * 页眉线
     */
    headerLine: number;
    /**
     * 页尾线
     */
    footerLine: number;
    /**
     * 首页页尾线
     */
    firstPageFooterLine: number;
    /**
     * 尾页页尾线
     */
    lastPageFooterLine: number;
    /**
     * 偶数页尾线
     */
    evenPageFooterLine: number;
    /**
     * 奇数页尾线
     */
    oddPageFooterLine: number;
    /**
     * 左偏移
     */
    leftOffset: number;
    /**
     * 顶部偏移
     */
    topOffset: number;
}

export enum IncidentalMusic {
    /**
     * 更改 stage
     */
    stageChange = "stageChange",
    /**
     * 拖拽结束
     */
    dragEnd = "dragEnd",
    /**
     * 新增组件
     */
    addActor = "addActor",
    /**
     * 新增组件
     */
    actorChange = "actorChange",
    /**
     * drag 变化
     */
    dragStateChange = "dragStateChange",

    /**
     * 移动
     */
    movingStateChange = "movingStateChange",
    /**
     *
     */
    // spotlightChange = "spotlightChange",
}
