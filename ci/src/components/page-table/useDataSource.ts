import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { AdvancedTableService } from "@api/AdvancedTableService";
import { transformTitle } from "./utils";
import { useDispatch } from "react-redux";

interface DataSourceProps {
    moduleName: string;
    fetch: any;
    columns: any;
}

interface SourceState {
    sourceLoading: boolean;
    sourceLoadError: boolean;
    sources: any[];
}

const initialState = {
    sourceLoading: true,
    sourceLoadError: false,
    sources: [],
};

export function useDataSource(props: DataSourceProps) {
    const { fetch, columns } = props;
    const dispatch = useDispatch();

    useEffect(() => {
        if (columns) {
            dispatch(fetch());
        }
    }, [columns]);

    return null;
}
