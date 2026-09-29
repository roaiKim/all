export interface DragTargetState {
    _uid: string;
    x: number;
    y: number;
    width: number;
    height: number;
    draging: boolean;
    moving: boolean;
}

export class DragEventManager {
    dragTargetState: Map<string, DragTargetState> = new Map([]);
    activeStateId: string = "";
    constructor() {
        //
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

    getActiveState() {
        return this.dragTargetState.get(this.activeStateId);
    }
}
