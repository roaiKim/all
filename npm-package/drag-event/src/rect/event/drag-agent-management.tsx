import { DragEventManagement } from "./drag";

export interface DragTargetState {
    _uid: string;
    x: number;
    y: number;
    width: number;
    height: number;
    draging: boolean;
    moving: boolean;
}
export interface DragContainerState {
    _uid: string;
    x: number;
    y: number;
    width: number;
    height: number;
    element: HTMLElement;
}

export class DragAgent {
    dragTargetState: Map<string, DragTargetState> = new Map([]);
    dragContainer: Map<string, DragContainerState> = new Map([]);
    activeStateId: string = "";
    // dragEventManagement: DragEventManagement;
    constructor(props: any) {
        // this.dragEventManagement = new DragEventManagement({}, this);
    }

    pushDragTargetState(state: DragTargetState | DragTargetState[]) {
        if (Array.isArray(state)) {
            state.forEach((state) => {
                this.dragTargetState.set(state._uid, state);
            });
        } else {
            this.dragTargetState.set(state._uid, state);
        }
    }

    deleteDragTargetState(state: string | string[] | DragTargetState | DragTargetState[]) {
        if (typeof state === "string") {
            this.dragTargetState.delete(state);
        } else if (Array.isArray(state)) {
            state.forEach((state) => {
                if (typeof state === "string") {
                    this.dragTargetState.delete(state);
                } else {
                    this.dragTargetState.delete(state._uid);
                }
            });
        } else {
            this.dragTargetState.delete(state._uid);
        }
    }

    updateDragTargetState(state: DragTargetState | DragTargetState[]) {
        if (Array.isArray(state)) {
            state.forEach((state) => {
                this.dragTargetState.set(state._uid, state);
            });
        } else {
            this.dragTargetState.set(state._uid, state);
        }
    }

    getDragTargetState(uid: string) {
        return this.dragTargetState.get(uid);
    }

    clearDragTargetState() {
        return this.dragTargetState.clear();
    }

    pushDragContainer(container: DragContainerState) {
        this.dragContainer.set(container._uid, container);
    }

    deleteDragContainer(container: string | string[] | DragContainerState | DragContainerState[]) {
        if (typeof container === "string") {
            this.dragContainer.delete(container);
        } else if (Array.isArray(container)) {
            container.forEach((state) => {
                if (typeof state === "string") {
                    this.dragContainer.delete(state);
                } else {
                    this.dragContainer.delete(state._uid);
                }
            });
        } else {
            this.dragContainer.delete(container._uid);
        }
    }

    getActiveState() {
        return this.dragTargetState.get(this.activeStateId);
    }

    setActiveState(state: string | DragTargetState) {
        const id = typeof state === "string" ? state : state._uid;
        if (this.dragTargetState.has(id)) {
            this.activeStateId = id;
        } else {
            console.error(`当前activeKey(${id || ""})不存在`);
        }
    }

    deleteActiveState() {
        this.activeStateId = "";
    }
}
