import React, { useCallback, useMemo, useState } from "react";
import { ACTIVE_STATUS, BOOLEAN_STATUS } from "./columns";
import { CUSTOMER, DATE, OPTION, STRING, WIDTH } from "./columns-service";
import { Cell } from "./ro-cell";
import { RoRow } from "./ro-row";
import { renderTableTitle } from "./utils";
import "./table.less";

export class WaybillColumns {
    @STRING("调拨单号")
    static transferNumber() {}

    @OPTION("状态", ACTIVE_STATUS)
    static reviewStatus() {}

    @STRING("服务类型")
    static transportMethodName() {}

    @STRING("时效")
    static aging() {}

    @STRING("冷云项目")
    static projectName() {}

    @STRING("调出站点")
    static outSiteName() {}

    @DATE("调出时间")
    static outTime() {}

    @STRING("调入站点")
    static inSiteName() {}

    @DATE("调入时间")
    static inTime() {}

    @DATE("出港时间")
    static departureTime() {}

    @STRING("出港人")
    static departureUser() {}

    @DATE("要求调拨日期")
    static requireTransferTime() {}

    @STRING("创建人")
    static createUserName() {}

    @DATE("创建时间")
    static createTime() {}

    @STRING("备注")
    static remark() {}
}

export const ColumnsContext = React.createContext(null);
export const TableContext = React.createContext(null);
export interface SelectCell {
    rowPosition: number;
    colPosition: string;
    position: string;
    colKey: string;
}

export interface ActionCell {
    isDown: boolean; // 鼠标是否 downing
    startCell: SelectCell;
    overingCell: SelectCell[];
    endCell: SelectCell;
}

export const defaultActionCell = {
    isDown: false,
    startCell: null,
    overingCell: [],
    endCell: null,
};

export interface TableCellProps {
    onCellChange: (value: string, record: Record<string, any>, rowIndex: number, colIndex: number, colKey: string) => void;
    dataSource: Record<string, any>[];
    columns: any;
}

export function Table(props: TableCellProps) {
    const { onCellChange, dataSource, columns } = props;

    const [spanCells, setSpanCells] = useState<Record<string, [number, number][]>>({}); // 合并的cell
    const [actionCell, setActionCell] = useState<ActionCell>(defaultActionCell);

    console.log("--actionCell--", actionCell, spanCells);
    return (
        <div className="ro-curtomer-table-component">
            <ColumnsContext.Provider value={columns}>
                <TableContext.Provider
                    value={{
                        onCellChange,
                        actionCell,
                        setActionCell,
                        spanCells,
                        setSpanCells,
                    }}
                >
                    <div className="ro-ct-container">
                        <div className="ro-ct-head">
                            {columns.map((item) => (
                                <div key={item.key} style={{ width: item.width }}>
                                    {item.title}
                                </div>
                            ))}
                        </div>
                        <div className="ro-ct-body">
                            {dataSource?.length ? dataSource.map((item, index) => <RoRow rowIndex={index} rowData={item} key={item.id}></RoRow>) : <div></div>}
                        </div>
                    </div>
                </TableContext.Provider>
            </ColumnsContext.Provider>
        </div>
    );
}
