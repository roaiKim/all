import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AdvancedTableService } from "@api/AdvancedTableService";
import { transformTitle } from "./utils";

interface ColumnsProps {
    moduleName: string;
    dependent: string;
}

export interface ViewState {
    show: boolean;
    loading: boolean;
    initial: boolean;
    readonly: boolean;
}

export type SetView = Dispatch<SetStateAction<Partial<ViewState>>>;

interface ColumnState {
    columnLoading: boolean;
    columnLoadError: boolean;
    columns: any[];
}

const initialState = {
    columnLoading: true,
    columnLoadError: false,
    columns: [],
};

export function useColumns(props: ColumnsProps): ColumnState {
    const { moduleName, dependent } = props;

    const [state, setState] = useState<ColumnState>(initialState);

    async function fetchColumns() {
        const response = await AdvancedTableService.title(moduleName).catch((error) => {
            setState((prevState) => ({ ...prevState, columnLoading: false, columnLoadError: true, columns: null }));
            // captureError(error);
            return Promise.reject();
        });
        console.log("--res", response);
        if (response) {
            const columns = transformTitle(response.commaListConfigData);
            setState((prevState) => ({ ...prevState, columnLoading: false, columnLoadError: false, columns }));
        } else {
            setState((prevState) => ({ ...prevState, columnLoading: false, columnLoadError: false, columns: null }));
        }
    }

    useEffect(() => {
        fetchColumns();
    }, [dependent]);

    return state;
}
