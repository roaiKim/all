import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";

export interface ViewState {
    open: boolean;
    loading: boolean;
    initialized: boolean;
    readonly: boolean;
}

export type SetViewState = Dispatch<SetStateAction<Partial<ViewState>>>;

interface PageModalProps extends ViewState {}

interface PageModalAction extends ViewState {
    viewState: ViewState;
    setViewState: SetViewState;
    viewStateModal: [ViewState, SetViewState];
}

export interface PageModalState {
    pageModalState: PageModalAction;
}

const initialViewState = (props?: Partial<ViewState>) => ({
    open: false,
    loading: false,
    initialized: false,
    readonly: false,
    ...(props || {}),
});

function calcState(open, loading, initialized, readonly) {
    const state = {};
    if (open !== null && open !== undefined) {
        state["open"] = open;
    }
    if (loading !== null && loading !== undefined) {
        state["loading"].loading;
    }
    if (initialized !== null && initialized !== undefined) {
        state["initialized"] = initialized;
    }
    if (readonly !== null && readonly !== undefined) {
        state["readonly"] = readonly;
    }
    return state;
}

export function usePageModal(props?: Partial<PageModalProps>): PageModalAction {
    const [state, setState] = useState<ViewState>(initialViewState(props));

    const setViewState = useCallback((views) => {
        setState((prevView) => ({ ...prevView, ...views }));
    }, []);

    useEffect(() => {
        const state = calcState(props?.open, props?.loading, props?.initialized, props?.readonly);
        setViewState(state);
    }, [props?.open, props?.loading, props?.initialized, props?.readonly]);

    return {
        ...state,
        viewState: state,
        setViewState,
        viewStateModal: [state, setViewState],
    };
}
