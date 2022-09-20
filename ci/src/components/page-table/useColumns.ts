import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { AdvancedTableService } from "@api/AdvancedTableService";
import { transformTitle } from "./utils";
import { useDispatch } from "react-redux";

interface TableTitleProps {
    moduleName: string;
    fetch: any;
}

export interface ViewState {
    show: boolean;
    loading: boolean;
    initial: boolean;
    readonly: boolean;
}

export type SetView = Dispatch<SetStateAction<Partial<ViewState>>>;

interface PageModalAction {
    columns: any;
}

interface ColumnState {
    columnLoading: boolean;
    columnLoadError: boolean;
    columns: any[];
}

export function useColumns(props: TableTitleProps): PageModalAction {
    const { moduleName, fetch } = props;
    const dispatch = useDispatch();
    const [columns, setColumns] = useState<ColumnState>();

    async function fetchColumns() {
        const response = await AdvancedTableService.title(moduleName).catch((error) => {
            setColumns((prevState) => ({ ...prevState, columnLoadError: true }));
        });
        if (response) {
            dispatch(fetch());
            const columns = transformTitle(response.commaListConfigData);
            setColumns((prevState) => ({ ...prevState, columnLoading: false, columnLoadError: false, columns }));
        } else {
            //
        }
    }

    useEffect(() => {
        fetchColumns();
    }, []);

    return {
        columns,
    };
}
