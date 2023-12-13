import { Dispatch, SetStateAction, useCallback, useState } from "react";

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

export function usePageModal(props?: PageModalProps): PageModalAction {
    const [state, setState] = useState<ViewState>(initialViewState(props));

    const setViewState = useCallback((views) => {
        setState((prevView) => ({ ...prevView, ...views }));
    }, []);

    return {
        ...state,
        viewState: state,
        setViewState,
        viewStateModal: [state, setViewState],
    };
}
