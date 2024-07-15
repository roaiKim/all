import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import { ActionCell, ColumnsContext, defaultActionCell, TableContext } from "./table";
import { alphabet } from "./type";
import { deafaultColKeys } from "./utils";

interface CellProps {
    columnProperty: any;
    rowData: any;
    colIndex: number;
    rowIndex: number;
    colunmsLength: number;
}

const calcOrder = (colIndex, rowIndex, dataIndex) => {
    const firstOrder = colIndex / 26;
    const secondOrder = colIndex % 26;
    let colSign = "";
    if (firstOrder < 1) {
        colSign = alphabet[secondOrder];
    } else {
        colSign = `${alphabet[Math.floor(firstOrder) - 1]}${alphabet[secondOrder]}`;
    }

    return {
        rowPosition: rowIndex + 1,
        colPosition: colSign,
        colKey: dataIndex,
        position: `${colSign}${rowIndex + 1}`,
    };
};

let timer = null;

function CellTable(props: CellProps) {
    const { columnProperty, colIndex, rowData, rowIndex, colunmsLength } = props;
    const { dataIndex, key, title, render, width } = columnProperty || {};

    const { actionCell, setActionCell, spanCells, setSpanCells, onCellChange } = useContext(TableContext);

    const { isDown, startCell, overingCell, endCell } = actionCell as ActionCell;
    const { rowPosition, colPosition, position, colKey } = useMemo(() => calcOrder(colIndex, rowIndex, dataIndex), [dataIndex, colIndex, rowIndex]);

    const [showSpan, setShowSpan] = useState(false);
    const [showCancelSpan, setShowCancelSpan] = useState(false);
    const [editable, setEditable] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef(null);

    const isSelected = startCell?.position === position || endCell?.position === position || !!overingCell.find((item) => item.position === position);

    let randerType = 1; // 1正常渲染 2覆盖渲染 3 不渲染
    const hasSpanCell = spanCells[colKey];
    let AllHeight = 0;
    if (hasSpanCell) {
        hasSpanCell.forEach((item) => {
            if (item.includes(rowPosition)) {
                if (item[0] === rowPosition) {
                    randerType = 2;
                    AllHeight = item?.length * 35 - 16;
                } else {
                    randerType = 3;
                }
            }
        });
    }

    const overIndexs = overingCell.map((item) => item.rowPosition).sort((prev, next) => prev - next);
    const selectedLength = overIndexs?.length;
    const isLastCell = overIndexs?.length && overIndexs[overIndexs.length - 1] === rowPosition;

    // const fixedCol = deafaultColKeys.includes(dataIndex);

    useEffect(() => {
        if (isSelected && !showSpan && isLastCell && selectedLength > 1) {
            setShowSpan(true);
        }
        if (showSpan && !isLastCell) {
            setShowSpan(false);
        }
    }, [isSelected, showSpan, isLastCell, selectedLength]);

    useEffect(() => {
        if (isSelected && !showCancelSpan && randerType === 2 && selectedLength === 1) {
            setShowCancelSpan(true);
        }
        if (showCancelSpan && (selectedLength !== 1 || !isSelected)) {
            setShowCancelSpan(false);
        }
    }, [isSelected, showCancelSpan, randerType, selectedLength]);

    useEffect(() => {
        if (!isSelected) {
            inputRef.current?.blur();
            setEditable(false);
        }
    }, [isSelected]);

    const className = classNames("ro-ct-cell", {
        "is-selected-cell": isSelected, // 选中效果
        "is-void": randerType === 3,
        "is-cover": randerType === 2,
        "ro-cell-left-sticky": deafaultColKeys[0] === dataIndex,
        "ro-cell-right-sticky": deafaultColKeys[1] === dataIndex,
        "content-flex-position": showSpan || showCancelSpan,
        "content-flex-right-position": colIndex >= colunmsLength - 2,
        "ro-cell-editable": editable,
    });
    console.log("ffffff");
    return (
        <div
            className={className}
            style={{ width, ...(AllHeight ? { height: AllHeight } : {}) }}
            onClick={() => {
                // if (randerType === 2) {
                //     setShowCancelSpan(true);
                // }
            }}
            onDoubleClick={() => {
                const _value = render(rowData[dataIndex], rowData, colIndex, rowIndex);
                if (typeof _value === "string") {
                    setInputValue(_value);
                }
                setEditable(true);
                timer = setTimeout(() => {
                    inputRef.current?.focus();
                });
            }}
            onMouseDown={(event) => {
                if (deafaultColKeys.includes(dataIndex)) return;
                if (showSpan) return;
                // 1鼠标左键 2右键 4滚轮
                if (event.buttons === 1) {
                    setActionCell((prev) => ({
                        ...prev,
                        isDown: true,
                        startCell: { rowPosition, colPosition, position, colKey },
                        overingCell: [{ rowPosition, colPosition, position, colKey }],
                        endCell: { rowPosition, colPosition, position, colKey },
                    }));
                    // setShowSpan(false);
                }
            }}
            onMouseEnter={() => {
                if (isDown && startCell?.colPosition === colPosition) {
                    if (overingCell.find((item) => item.position === position)) {
                        return;
                    }
                    setActionCell((prev) => {
                        (prev.overingCell || []).push({ rowPosition, colPosition, position, colKey });
                        const cells = (prev.overingCell || []).sort((prev, next) => prev.rowPosition - next.rowPosition);

                        const maxRow = cells[cells?.length - 1]?.rowPosition;
                        const minRow = cells[0]?.rowPosition; // 最大行
                        const interval = maxRow - minRow; // 最小行
                        // 解决中间空行问题
                        if (cells?.length !== interval + 1) {
                            let k = minRow;
                            while (k < maxRow) {
                                if (!cells.find((item) => item.rowPosition === k)) {
                                    cells.push({ rowPosition: k, colPosition, position: `${colPosition}${k}`, colKey });
                                }
                                k++;
                            }
                        }

                        return {
                            ...prev,
                            overingCell: prev.overingCell,
                            endCell: { rowPosition, colPosition, position, colKey },
                        };
                    });
                }
            }}
            onMouseUp={() => {
                if (isDown) {
                    setActionCell((prev) => ({ ...prev, isDown: false }));
                    // if (overingCell?.length > 1 && overingCell.find((item) => item.position === position)) {
                    //     setShowSpan(true);
                    // }
                }
            }}
        >
            {editable ? (
                <input
                    value={inputValue}
                    ref={inputRef}
                    onChange={(event) => {
                        setInputValue(event.target.value);
                        onCellChange(event.target.value, rowData, rowIndex, colIndex, colKey);
                    }}
                    onBlur={() => {
                        setEditable(false);
                    }}
                ></input>
            ) : (
                render(rowData[dataIndex], rowData, rowIndex, colIndex, colKey)
            )}
            <div
                className={`ro-menu-content ro-cancel-content ${showCancelSpan ? "ro-cc-block" : ""}`}
                onClick={(event) => {
                    event.stopPropagation();
                    if (randerType !== 2 || !hasSpanCell) return;
                    const currentCell = hasSpanCell.find((item) => item.includes(rowPosition));
                    if (currentCell) {
                        spanCells[colKey] = spanCells[colKey].filter((item) => item !== currentCell);
                        setSpanCells(spanCells);
                        // setShowCancelSpan(false);
                        setActionCell(defaultActionCell);
                    }
                }}
            >
                取消合并
            </div>
            <div
                className={`ro-menu-content ro-span-content ${showSpan ? "ro-cc-block" : ""}`}
                onClick={(event) => {
                    event.stopPropagation();
                    const cells = (overingCell || []).sort((prev, next) => prev.rowPosition - next.rowPosition);

                    const rowsIndex = cells.map((item) => item.rowPosition);
                    if (spanCells[colKey]) {
                        const newCell = [];
                        const g = [...rowsIndex];
                        spanCells[colKey].forEach((item) => {
                            if (rowsIndex.some((item1) => item.includes(item1))) {
                                g.push(...item);
                            } else {
                                newCell.push(item);
                            }
                        });
                        newCell.push(Array.from(new Set(g)).sort((prev, next) => prev - next));
                        spanCells[colKey] = newCell;
                    } else {
                        spanCells[colKey] = [rowsIndex];
                    }
                    setSpanCells(spanCells);
                    // setShowSpan(false);
                    setActionCell(defaultActionCell);
                }}
            >
                合并
            </div>
        </div>
    );
}

export const Cell = React.memo(CellTable);
