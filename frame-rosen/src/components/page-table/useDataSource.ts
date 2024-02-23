import { useEffect } from "react";
import { useDispatch } from "react-redux";

interface DataSourceProps {
    fetch: any;
    sourceRely: string;
}

export function useDataSource(props: DataSourceProps) {
    const { fetch, sourceRely } = props;
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetch());
    }, [sourceRely]);

    return null;
}
