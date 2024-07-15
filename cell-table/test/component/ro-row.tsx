import React, { useContext } from "react";
import { Cell } from "./ro-cell";
import { ColumnsContext } from "./table";

interface RoRowProps {
    rowData: any;
    columnProperty?: any;
    rowIndex: number; // 行 index
}
export function RoRow(props: RoRowProps) {
    const { rowData, rowIndex } = props;
    const columns = useContext(ColumnsContext);
    const colunmsLength = columns?.length;

    return (
        <div className="ro-ct-row">
            {columns.map((item, index) => (
                <Cell rowData={rowData} colunmsLength={colunmsLength} key={item.key} columnProperty={item} colIndex={index} rowIndex={rowIndex}></Cell>
            ))}
        </div>
    );
}
