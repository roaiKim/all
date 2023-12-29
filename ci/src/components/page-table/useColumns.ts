import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AdvancedTableService } from "@api/AdvancedTableService";
import { ColumnsService } from "./type";
import { renderTableTitle } from "./utils";

interface ColumnsProps {
    moduleName: string;
    dependent: string;
    colService: typeof ColumnsService;
    isNoneOrder: boolean;
    pageIndex?: number;
    pageSize?: number;
}

export interface ViewState {
    show: boolean;
    loading: boolean;
    initial: boolean;
    readonly: boolean;
}

export type SetView = Dispatch<SetStateAction<Partial<ViewState>>>;

interface ColumnState {
    /**
     * 加载中
     */
    columnLoading: boolean;
    /**
     * 是否加载错误
     */
    columnError: boolean;
    /**
     * 是否加载完成
     */
    columnInitialed: boolean;
    /**
     * 列
     */
    columns: any[];
}

const initialState = {
    columnLoading: true,
    columnError: false,
    columnInitialed: false,
    columns: [],
};

export function useColumns(props: ColumnsProps): ColumnState {
    const { moduleName, dependent, colService, isNoneOrder, pageIndex, pageSize } = props;

    const [state, setState] = useState<ColumnState>(initialState);

    async function fetchColumns() {
        const response = await AdvancedTableService.title(moduleName).catch((error) => {
            setState((prevState) => ({ ...prevState, columnLoading: false, columnError: true, columnInitialed: true, columns: null }));
            // captureError(error);
            return Promise.reject();
        });

        if (response) {
            const { columns, columnsConfig } = renderTableTitle(response.commaListConfigData, colService, isNoneOrder, (pageIndex - 1 || 0) * (pageSize || 20));
            setState((prevState) => ({ ...prevState, columnLoading: false, columnError: false, columnInitialed: true, columns }));
        } else {
            setState((prevState) => ({ ...prevState, columnLoading: false, columnError: false, columnInitialed: true, columns: null }));
        }
    }

    useEffect(() => {
        fetchColumns();
    }, [dependent]);

    return state;
}
