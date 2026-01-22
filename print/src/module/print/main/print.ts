// import { produce } from "immer";
import { produce } from "immer";
import { DomManger } from "../event/dom-manger";
import type { MoveDirection } from "../event/spotlight-event";
import * as printPlugin from "../plugin";
import { BasePrintPlugin } from "../plugin/base-print-plugin";
import { initialProtagonist, initialStage, initialStageDirections } from "../storyboard";
import {
    type DramaActor,
    IncidentalMusic,
    type Protagonist,
    type ProtagonistStatus,
    RolesName,
    type Stage,
    type StageDirections,
    StageType,
} from "../type";
import { PositionManager } from "../utils/position-manager";
import { ResizeManager } from "../utils/resize-manager";
import { ToolManager } from "../utils/tool-manager";

type PrintListener = (...state: any[]) => void;

// stage play
export class WebPrint {
    moveEndTimer: number;
    // curtain: HTMLElement;
    // shapes: Shapes;
    // defalutPlugin: BasePrintPlugin;
    /**
     * 角色 插件
     */
    roles: Partial<Record<string, BasePrintPlugin>>;
    domManger: DomManger;
    /**
     * 演员组
     */
    dramaActors: DramaActor[];
    /**
     * 舞台指导
     */
    stageDirections: StageDirections;
    // movingState: MovingState;
    // spotlightActor: PrintElement;
    /**
     * 舞台
     */
    stage: Stage;
    /**
     * 主角
     */
    protagonist: Protagonist;
    /**
     * 排除的 角色
     */
    excludeRoles: (keyof typeof RolesName & string)[];
    /**
     * 插曲 监听事件
     */
    incidentalMusic: Partial<Record<keyof typeof IncidentalMusic, PrintListener[]>>;
    /**
     *
     * 类别
     */
    incidentalMusicName: (keyof typeof IncidentalMusic)[] = Object.keys(IncidentalMusic) as Array<keyof typeof IncidentalMusic>;
    constructor(excludeRoles?: (keyof typeof RolesName & string)[]) {
        // this.shapes = {
        //     base: [],
        //     auxiliary: [],
        //     other: [],
        //     custom: [],
        // };
        // this.curtain = curtain;

        this.domManger = new DomManger();
        this.dramaActors = [];
        this.incidentalMusic = {};
        this.roles = {};
        this.excludeRoles = excludeRoles || [];
        this.protagonist = this.initialProtagonist();
        this.stageDirections = this.initialStageDirections();
        this.#initialStage();
        this.#registerDefaultShapes();

        // @ts-ignore
        window.__WEB_PRINT__ = this;
    }

    getDragState() {
        return this.stageDirections;
    }

    getActor(config = true) {
        if (config) {
            // return new dramaActors
            return [...this.dramaActors];
        }
        return this.dramaActors;
    }

    getListener() {
        return this.incidentalMusic;
    }

    getPluginByName(name: RolesName): BasePrintPlugin {
        if (this.roles[name]) {
            return this.roles[name];
        } else {
            return this.roles["DEFAULT"];
            // throw new Error(`插件${name}不存在`);
        }
    }

    initialStageDirections() {
        this.stageDirections = initialStageDirections();
        // this.#variantStageDirections(initialStageDirections());
        this.#triggerListener(IncidentalMusic.dragStateChange, this.stageDirections);
        return this.stageDirections;
    }

    #initialStage() {
        this.stage = initialStage({}, this.domManger.printTemplateDom);
        this.#triggerListener(IncidentalMusic.stageChange, this.stage);
    }

    initialProtagonist(regain: boolean = false) {
        this.protagonist = initialProtagonist();
        // produce(this.protagonist, (draft) => {
        //     draft.dramaActor = initialDramaActor();
        //     draft.moving = false;
        //     draft.resizing = false;
        //     draft.spotlight = false;
        // });
        if (regain) {
            this.#triggerListener(IncidentalMusic.movingStateChange, this.protagonist);
        }
        return this.protagonist;
    }

    dragEvent(eventType: "start" | "draging" | "end", state: Partial<StageDirections>, isWrap?: boolean) {
        // console.log("dragEvent", eventType, state);
        if (eventType === "start") {
            this.stageDirections = {
                ...this.stageDirections,
                ...state,
            };
            this.#triggerListener(IncidentalMusic.dragStateChange, this.stageDirections);
            return this.stageDirections;

            // const l = this.#variantStageDirections(state);
            // console.log("lllll", l);
            // this.#triggerListener(IncidentalMusic.dragStateChange, this.stageDirections);
            // return this.stageDirections;
        } else if (eventType === "draging") {
            if (!this.stageDirections.draging) return;
            this.stageDirections = {
                ...this.stageDirections,
                ...state,
            };
            this.#triggerListener(IncidentalMusic.dragStateChange, this.stageDirections);
            return this.stageDirections;

            // console.log("draging", this.stageDirections.type);
            // if (!this.stageDirections.draging) return;
            // this.#variantStageDirections(state);
            // this.#triggerListener(IncidentalMusic.dragStateChange, this.stageDirections);
            // return this.stageDirections;
        } else if (eventType === "end") {
            if (!this.stageDirections.draging) return;
            if (this.domManger.printTemplateDom) {
                const temporaryTemplateDom = this.domManger.temporaryTemplateDom;
                if (isWrap) {
                    const position = PositionManager.getPositionByContainer(temporaryTemplateDom, this.domManger.printTemplateDom);
                    this.addActor({ ...position });
                }
                this.#triggerListener(IncidentalMusic.dragEnd, {
                    stageDirections: this.stageDirections,
                    contain: isWrap,
                });
            }
            return this.initialStageDirections();
        }
    }

    moveEvent(eventType: "start" | "moving" | "end", protagonistStatus: Partial<ProtagonistStatus>, state: Partial<DramaActor>) {
        this.#upProtagonist(protagonistStatus, state);
        this.#triggerListener(IncidentalMusic.movingStateChange, this.protagonist);

        if (eventType === "end") {
            const id = this.protagonist.dramaActor.id;

            if (id) {
                const index = this.dramaActors.findIndex((item) => item.id === id);
                if (index > -1) {
                    this.dramaActors[index] = {
                        ...this.dramaActors[index],
                        ...this.protagonist.dramaActor,
                        // moving: false,
                    };
                }
            }

            // this.moveEndTimer = setTimeout(this.initialProtagonist.bind(this), 50);
            return this.protagonist;
        }
        return this.protagonist;
    }

    resizeEvent(eventType: "start" | "resizing" | "end", protagonistStatus: Partial<ProtagonistStatus>, state: Partial<DramaActor>) {
        this.#upProtagonist(protagonistStatus, state);
        this.#triggerListener(IncidentalMusic.movingStateChange, this.protagonist);

        if (eventType === "end") {
            const id = this.protagonist.dramaActor.id;
            if (id) {
                const index = this.dramaActors.findIndex((item) => item.id === id);
                if (index > -1) {
                    this.dramaActors[index] = {
                        ...this.dramaActors[index],
                        ...this.protagonist.dramaActor,
                    };
                }
            }
        }

        return this.protagonist;
    }

    stageReact(stage: Partial<Stage>) {
        this.stage = produce(this.stage, (draft) => {
            for (const key in stage) {
                draft[key] = stage[key];
            }
        });
        this.#triggerListener(IncidentalMusic.stageChange, this.stage);
    }

    // resizeStart(moveState: Partial<MovingState>) {
    //     if (!moveState) return;
    //     this.#initialCurtainState();
    //     this.movingState = {
    //         ...this.movingState,
    //         ...moveState,
    //         resizing: true,
    //     };
    //     this.#triggerListener(IncidentalMusic.movingStateChange, this.movingState);
    //     return this.movingState;
    // }

    // resizing(event: MouseEvent, direction: MoveDirection) {
    //     if (!this.movingState.resizing) return;
    //     // const width = Math.max(this.movingState.x, Math.min(event.clientX - this.curtainState.x, this.curtainState.width));
    //     // const height = Math.max(this.movingState.y, Math.min(event.clientY - this.curtainState.y, this.curtainState.height));

    //     // this.movingState.width = width - this.movingState.x;
    //     // this.movingState.height = height - this.movingState.y;
    //     const size = ResizeManager.controller(event, direction, this);
    //     this.movingState = {
    //         ...this.movingState,
    //         ...size,
    //     };
    //     this.#triggerListener(IncidentalMusic.movingStateChange, this.movingState);

    //     return this.movingState;
    // }

    // resizeEnd() {
    //     if (!this.movingState.resizing) return;
    //     this.movingState.resizing = false;
    //     this.#triggerListener(IncidentalMusic.movingStateChange, this.movingState);
    //     const id = this.movingState.id;
    //     if (id) {
    //         const index = this.dramaActors.findIndex((item) => item.id === id);
    //         if (index > -1) {
    //             // this.dramaActors[index] = {
    //             //     ...this.dramaActors[index],
    //             //     ...this.movingState,
    //             // };
    //         }
    //     }
    //     // 延迟
    //     this.moveEndTimer = setTimeout(this.initialMovingState.bind(this), 100);
    // }

    // upSpotlight(id: string) {
    //     if (id) {
    //         const spotlightActor = this.dramaActors.find((item) => item.id === id);
    //         if (spotlightActor) {
    //             this.protagonist = initialProtagonist({ spotlight: true }, spotlightActor);
    //             this.#triggerListener(IncidentalMusic.spotlightChange, this.protagonist);
    //         }
    //     }
    // }

    // downSpotlight(id: string) {
    //     if (this.protagonist.dramaActor?.id === id) {
    //         this.protagonist = initialProtagonist({ spotlight: false });
    //         this.#triggerListener(IncidentalMusic.spotlightChange, this.protagonist);
    //     }
    // }

    addActor(state: { x: number; y: number; width?: number; height?: number }) {
        const id = ToolManager.getUid();

        const dramaActor = {
            ...this.stageDirections,
            id,
            content: this.stageDirections.type,
            ...state,
        };
        this.dramaActors.push(dramaActor);
        // produce(this.dramaActors, (dramaActors) => {
        //     dramaActors.push(dramaActor);
        // });

        this.protagonist = initialProtagonist({ spotlight: true }, dramaActor);

        this.#triggerListener(IncidentalMusic.movingStateChange, this.protagonist);
        this.#triggerListener(IncidentalMusic.addActor, dramaActor);
        this.#triggerListener(IncidentalMusic.actorChange, this.getActor());
    }

    // #initSize(curtain) {
    //     const updateContainerBounds = () => {
    //         // const curtain = containerRef.current;
    //         if (curtain) {
    //             const { clientWidth: cw, clientHeight: ch } = curtain;
    //             // dragState.current.maxLeft = cw - itemSize.current.width;
    //             // dragState.current.maxTop = ch - itemSize.current.height;
    //         }
    //     };

    //     updateContainerBounds();
    //     // 监听窗口大小变化，实时更新边界
    //     window.addEventListener("resize", updateContainerBounds);
    // }

    subscribe(type: keyof typeof IncidentalMusic, incidentalMusic: PrintListener) {
        if (!this.incidentalMusicName.includes(type)) {
            throw new Error("订阅事件类型不存在");
        }
        if (this.incidentalMusic[type]) {
            this.incidentalMusic[type].push(incidentalMusic);
        } else {
            this.incidentalMusic[type] = [incidentalMusic];
        }
    }

    #triggerListener(type: keyof typeof IncidentalMusic, ...state: any[]) {
        if (this.incidentalMusic[type]?.length) {
            this.incidentalMusic[type].forEach((item) => item(...state));
        }
    }

    unsubscribe(type: IncidentalMusic, incidentalMusic?: PrintListener) {
        if (!this.incidentalMusicName.includes(type)) {
            throw new Error("取消订阅事件类型不存在");
        }
        if (this.incidentalMusic[type]) {
            this.incidentalMusic[type] = this.incidentalMusic[type].filter((item) => item !== incidentalMusic);
        }
    }

    registerShapes(plugin: BasePrintPlugin) {
        const { type, key, title, height, width } = plugin.option;
        if (!this.excludeRoles.includes(key as any)) {
            if (!this.roles[key]) {
                this.roles[key] = plugin;
            } else {
                throw new Error(`插件${title}已经注册`);
            }
        }
    }

    #registerDefaultShapes() {
        this.roles["DEFAULT"] = new BasePrintPlugin({
            key: "DEFAULT",
            title: "DEFAULT",
            type: null,
            width: 280,
            height: 100,
        });
        Object.values(printPlugin).forEach((item) => {
            this.registerShapes(new item());
        });
    }

    #upProtagonist(protagonistStatus: Partial<ProtagonistStatus>, state: Partial<DramaActor>) {
        this.protagonist = {
            ...this.protagonist,
            ...protagonistStatus,
            dramaActor: {
                ...this.protagonist.dramaActor,
                ...state,
            },
        };
    }

    // #variantStageDirections(stageDirections: Partial<StageDirections>) {
    //     console.log("--variantStageDirections--", stageDirections);
    //     return produce(this.stageDirections, (draft) => {
    //         for (const key in stageDirections) {
    //             draft[key] = stageDirections[key];
    //         }
    //     });
    // }

    // #variantProtagonist(protagonistStatus: Partial<ProtagonistStatus>, protagonist: Partial<DramaActor>) {
    //     return produce(this.protagonist, (draft) => {
    //         for (const key in protagonistStatus) {
    //             draft[key] = protagonistStatus[key];
    //         }
    //         for (const key in protagonist) {
    //             draft.dramaActor[key] = protagonist[key];
    //         }
    //     });
    // }

    // #immer(agent, state) {
    //     return produce(agent, (draft) => {
    //         for (const status in state) {
    //             draft[status] = state[status];
    //         }
    //     });
    // }
}
