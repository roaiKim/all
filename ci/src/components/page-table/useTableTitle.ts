import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { TableService } from "@api/TableService";

interface TableTitleProps {
    moduleName: string;
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

export function useTableTitle(props: TableTitleProps): PageModalAction {
    const { moduleName } = props;
    const [view, setView] = useState<ViewState>(initialViewState());

    useEffect(() => {
        TableService.title(moduleName).then((response) => {
            console.log("--response--", response);
        });
    }, []);

    const viewState = useCallback((views) => {
        setView((prevView) => ({ ...prevView, ...views }));
    }, []);

    return {
        view,
        setView: viewState,
    };
}
