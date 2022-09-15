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

export function useColumns(props: TableTitleProps): PageModalAction {
    const { moduleName, fetch } = props;
    const dispatch = useDispatch();
    const [columns, setColumns] = useState();

    async function fetchTitle() {
        const response = await AdvancedTableService.title(moduleName).catch((error) => {
            console.log("----", error);
        });
        if (response) {
            dispatch(fetch());
            const columns = transformTitle(response.commaListConfigData);
            setColumns(columns);
        } else {
            //
        }
    }

    useEffect(() => {
        fetchTitle();
    }, []);

    return {
        columns,
    };
}
