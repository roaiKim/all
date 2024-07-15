import React, { useContext, useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import { SelectCell, TableContext } from "./cell-table";
import { Cell } from "./ro-cell";
import { deafaultColKeys, getColPosition } from "./utils";

interface RoRowProps {
    dataSource: any[];
    column: any;
    colIndex: number;
    colunmsLength: number;
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

export enum RanderType {
    COVER = "COVER", // 覆盖
    VOID = "VOID", // 不渲染
}

export const defaultCellHeight = 35;

export function RoCol(props: RoRowProps) {
    const { dataSource, column, colIndex, colunmsLength } = props;
    const { dataIndex, key, title, render, width } = column || {};

    const [actionCell, setActionCell] = useState<ActionCell>(defaultActionCell);

    const { spanCells, getRowHeight, rowHeightRef, selectedColPosioton, rowKey } = useContext(TableContext);
    // const { isDown, startCell, overingCell, endCell } = actionCell;
    const colPosition = useMemo(() => getColPosition(colIndex), [colIndex]);

    const className = classNames("ro-ct-col", {
        "ro-cell-left-sticky": deafaultColKeys[0] === dataIndex,
        "ro-cell-right-sticky": deafaultColKeys[1] === dataIndex,
    });

    const renderTypes = useMemo(() => {
        if (spanCells[dataIndex]) {
            const renderTypes = {};
            spanCells[dataIndex].forEach((item) => {
                if (item?.length) {
                    const height = item.reduce((prev, next) => {
                        if (getRowHeight && rowHeightRef.current[next]) {
                            return prev + rowHeightRef.current[next];
                        }
                        return prev + defaultCellHeight;
                    }, 0);
                    item.forEach((element, index) => {
                        renderTypes[element] = {
                            type: index ? RanderType.VOID : RanderType.COVER,
                            renderHeight: index ? 0 : height,
                        };
                    });
                }
            });
            return renderTypes;
        }
        return null;
    }, [spanCells, dataIndex]);

    useEffect(() => {
        if (selectedColPosioton !== colPosition) {
            setActionCell({ ...defaultActionCell });
        }
    }, [selectedColPosioton]);
    console.log("--actionCell--", actionCell);
    return (
        <div className={className} style={{ width: column.width }}>
            {dataSource.map((item, rowIndex) => (
                <Cell
                    rowData={item}
                    colunmsLength={colunmsLength}
                    key={item[rowKey]}
                    rowValue={item[rowKey]}
                    columnProperty={column}
                    colIndex={colIndex}
                    colPosition={colPosition}
                    rowIndex={rowIndex}
                    actionCell={actionCell}
                    setActionCell={setActionCell}
                    renderType={renderTypes?.[rowIndex]}
                    isOperatorCell={deafaultColKeys[1] === dataIndex}
                ></Cell>
            ))}
        </div>
    );
}
