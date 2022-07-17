import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";

interface PageModalProps {
    name?: string;
}

export interface ViewState {
    show: boolean;
    loading: boolean;
    initial: boolean;
    readonly: boolean;
}

export type SetView = Dispatch<SetStateAction<Partial<ViewState>>>;

interface PageModalAction {
    view: ViewState;
    setView: SetView;
}

const initialViewState = () => ({
    show: false,
    loading: false,
    initial: false,
    readonly: false,
});

export function usePageModal(props: PageModalProps): PageModalAction {
    const { name } = props;
    const [view, setView] = useState<ViewState>(initialViewState());

    const viewState = useCallback((views) => {
        setView((prevView) => ({ ...prevView, ...views }));
    }, []);

    return {
        view,
        setView: viewState,
    };
}
