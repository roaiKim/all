import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import { TableContext } from "./cell-table";
import { ActionCell, defaultActionCell, defaultCellHeight, RanderType } from "./ro-col";
import { deafaultColKeys } from "./utils";

interface CellProps {
    columnProperty: any;
    rowData: any;
    colIndex: number;
    rowIndex: number;
    colPosition: string;
    rowValue: string;
    colunmsLength: number;
    actionCell: ActionCell;
    isOperatorCell: boolean;
    setActionCell: React.Dispatch<React.SetStateAction<ActionCell>>;
    renderType: { type: RanderType; renderHeight: number };
}

const calcOrder = (rowIndex, dataIndex, colPosition) => {
    return {
        rowPosition: rowIndex,
        colPosition,
        colKey: dataIndex,
        position: `${colPosition}${rowIndex}`,
    };
};

let timer = null;

function CellTable(props: CellProps) {
    const { columnProperty, colIndex, rowData, rowIndex, colunmsLength, actionCell, setActionCell, renderType, colPosition, isOperatorCell, rowValue } = props;
    const { dataIndex, render } = columnProperty || {};
    const { type, renderHeight } = renderType || {};
    const {
        spanCells,
        setSpanCells,
        getRowHeight,
        rowHeightRef,
        onCellChange,
        setSelectedColPosioton,
        readOnly,
        onCellBlur,
        showDeleteButton,
        showCellDeleteButton,
        filterDataSource,
    } = useContext(TableContext);
    const { isDown, startCell, overingCell, endCell } = actionCell as ActionCell;

    const { rowPosition, position, colKey } = useMemo(() => calcOrder(rowIndex, dataIndex, colPosition), [dataIndex, rowIndex, colPosition]);

    const [showSpan, setShowSpan] = useState(false);
    const [showCancelSpan, setShowCancelSpan] = useState(false);
    const [editable, setEditable] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef(null);

    const inOveringCell = !!overingCell.find((item) => item.position === position);
    const isSelected = startCell?.position === position || endCell?.position === position || inOveringCell;

    const overIndexs = overingCell.map((item) => item.rowPosition).sort((prev, next) => prev - next);
    const selectedLength = overIndexs?.length;
    const isLastCell = overIndexs?.length && overIndexs[overIndexs.length - 1] === rowPosition;

    // const fixedCol = deafaultColKeys.includes(dataIndex);

    // 显示合并
    useEffect(() => {
        if (isSelected && !showSpan && isLastCell && selectedLength > 1) {
            setShowSpan(true);
        }
        if (showSpan && !isLastCell) {
            setShowSpan(false);
        }
    }, [isSelected, showSpan, isLastCell, selectedLength]);

    // 显示取消合并
    useEffect(() => {
        if (isSelected && !showCancelSpan && type === RanderType.COVER && selectedLength === 1) {
            setShowCancelSpan(true);
        }
        if (showCancelSpan && (selectedLength !== 1 || !isSelected)) {
            setShowCancelSpan(false);
        }
    }, [isSelected, showCancelSpan, type, selectedLength]);

    // 失焦
    // useEffect(() => {
    //     if (!isSelected) {
    //         inputRef.current?.blur();
    //         setEditable(false);
    //     }
    // }, [isSelected]);

    const className = classNames("ro-ct-cell", {
        "is-selected-cell": isSelected, // 选中效果
        "is-void": type === RanderType.VOID,
        "is-cover": type === RanderType.COVER,
        "content-flex-position": showSpan || showCancelSpan,
        "content-flex-right-position": colIndex >= colunmsLength - 2,
        "ro-cell-editable": editable,
        "ro-delete-button": isOperatorCell,
        "ro-first-col-border": !colIndex,
        "ro-selected-col-overing": inOveringCell,
        "ro-selected-col-start": startCell?.position === position,
        "ro-selected-col-end-top": endCell?.position === position && endCell?.rowPosition > startCell?.rowPosition,
        "ro-selected-col-end-bottom": endCell?.position === position && endCell?.rowPosition < startCell?.rowPosition,
    });
    let cellHeight = defaultCellHeight;
    if (getRowHeight) {
        if (colIndex) {
            cellHeight = rowHeightRef.current[rowIndex];
        } else {
            cellHeight = getRowHeight(rowData, rowIndex, colIndex, colKey) || defaultCellHeight;
            rowHeightRef.current[rowIndex] = cellHeight;
        }
    }
    cellHeight = type === RanderType.VOID ? 0 : renderHeight || cellHeight;

    if (isOperatorCell) {
        let show = showDeleteButton;
        if (show && showCellDeleteButton) {
            show = showCellDeleteButton(rowData, rowIndex, colIndex, colKey);
        }
        return (
            <div className={className} style={{ height: cellHeight }}>
                {show && (
                    <a
                        onClick={() => {
                            filterDataSource(rowData, rowIndex);
                        }}
                    >
                        删除
                    </a>
                )}
            </div>
        );
    }

    // console.log("0-0", rowPosition, position);

    return (
        <div
            className={className}
            style={{ height: cellHeight }}
            onClick={() => {
                // if (randerType === 2) {
                //     setShowCancelSpan(true);
                // }
            }}
            onDoubleClick={() => {
                if (readOnly || deafaultColKeys.includes(dataIndex)) return;
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
                if (readOnly || deafaultColKeys.includes(dataIndex)) return;
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
                    setSelectedColPosioton(colPosition);
                    // setShowSpan(false);
                }
            }}
            onMouseEnter={() => {
                if (readOnly) return;
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
                if (readOnly) return;
                if (isDown) {
                    setActionCell((prev) => ({ ...prev, isDown: false }));
                }
            }}
        >
            <textarea
                style={{ display: editable ? "block" : "none" }}
                value={inputValue}
                ref={inputRef}
                onChange={(event) => {
                    setInputValue(event.target.value);
                    onCellChange(event.target.value, rowData, rowIndex, colIndex, colKey);
                }}
                readOnly={!editable}
                onBlur={() => {
                    setEditable(false);
                    if (onCellBlur) {
                        onCellBlur(inputValue, rowData, rowIndex, colIndex, colKey);
                    }
                    setInputValue("");
                }}
            ></textarea>

            <div className="ro-cell-text" style={{ display: !editable ? "block" : "none" }}>
                {render(rowData[dataIndex], rowData, rowIndex, colIndex, colKey)}
            </div>

            <div
                className={`ro-menu-content ro-cancel-content ${showCancelSpan ? "ro-cc-block" : ""}`}
                onClick={(event) => {
                    event.stopPropagation();
                    if (readOnly) return;
                    if (type !== RanderType.COVER || !spanCells[colKey]) return;
                    const currentCell = spanCells[colKey].find((item) => item.includes(rowPosition));
                    if (currentCell) {
                        spanCells[colKey] = spanCells[colKey].filter((item) => item !== currentCell);
                        setSpanCells({ ...spanCells });
                        setActionCell({ ...defaultActionCell });
                    }
                }}
            >
                取消合并
            </div>
            <div
                className={`ro-menu-content ro-span-content ${showSpan ? "ro-cc-block" : ""}`}
                onClick={(event) => {
                    event.stopPropagation();
                    if (readOnly) return;
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
                    setSpanCells({ ...spanCells });
                    setActionCell({ ...defaultActionCell });
                }}
            >
                合并
            </div>
        </div>
    );
}

export const Cell = React.memo(CellTable);
