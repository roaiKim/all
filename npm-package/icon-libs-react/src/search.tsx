import { useState } from "react";
import { useGetLanguage } from "./useGetLanguage";

interface RoveSearchProps {
    onSearch: (value: string) => void;
}

export function RoveSearch(props: RoveSearchProps) {
    const { onSearch } = props;
    const [value, setValue] = useState("");
    const { getLanguage } = useGetLanguage();

    return (
        <div className="rove-search">
            <input
                placeholder={getLanguage("rove-search-placeholder")}
                className="rove-input"
                onInput={(event: any) => {
                    const value = event.target.value;
                    setValue(value);
                }}
                style={{ width: 160, marginLeft: 5 }}
            />
            <button
                onClick={() => {
                    onSearch(value);
                }}
            >
                {getLanguage("rove-search-button")}
            </button>
        </div>
    );
}
