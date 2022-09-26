import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AdvancedTableService } from "@api/AdvancedTableService";
import { transformTitle } from "./utils";

interface ColumnsProps {
    moduleName: string;
    rely: string;
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

export function useColumns(props: ColumnsProps) {
    const { moduleName, rely } = props;

    const [state, setState] = useState<ColumnState>(initialState);

    function handleResize(index) {
        return (e, { size }) => {
            setState((prevState) => {
                const nextColumns = [...prevState.columns];
                nextColumns[index] = {
                    ...nextColumns[index],
                    width: size.width,
                };
                return { ...prevState, columns: nextColumns };
            });
        };
    }

    async function fetchColumns() {
        const response = await AdvancedTableService.title(moduleName).catch(() => {
            setState((prevState) => ({ ...prevState, columnLoading: false, columnLoadError: true, columns: null }));
            // captureError(error);
            return Promise.reject();
        });
        if (response) {
            const columns = transformTitle(response.commaListConfigData, handleResize);
            setState((prevState) => ({ ...prevState, columnLoading: false, columnLoadError: false, columns }));
        } else {
            setState((prevState) => ({ ...prevState, columnLoading: false, columnLoadError: false, columns: null }));
        }
    }

    useEffect(() => {
        fetchColumns();
    }, [rely]);

    return state;
}
