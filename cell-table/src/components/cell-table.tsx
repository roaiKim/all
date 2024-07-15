import React, { useCallback, useMemo, useRef, useState } from "react";
import { RoCol } from "./ro-col";
import { CellTableColumn, ColumnsService } from "./type";
import { renderTableColumnsByArray, renderTableColumnsByServer } from "./utils";
import "./cell-table.less";

export const ColumnsContext = React.createContext(null);
export const TableContext = React.createContext(null);

export interface SelectCell {
    rowPosition: number;
    colPosition: string;
    position: string;
    colKey: string;
}

export interface CellTableProps {
    /**
     * @description 数据源
     */
    dataSource: Record<string, any>[];

    /**
     *  @description 支持 两种格式 第一种 CellTableColumn， 第二种可以用 装饰器
     * eg1: 1、2 参数必填
     * const columns = [["title", "propertyName"], ["title1", "propertyName1", () => {}, 140], ["title1", "propertyName1", 160], ...]
     * tips: 如果第三个参数是数字 则会被当做 宽度。
     * 
     * eg2: 类的 静态方法名为 字段名
     * const columns = class WaybillColumns {
                    @STRING("调拨单号")
                    static transferNumber(text: string, record: object, rowIndex: number, colIndex: number, colKey: string) {}
                }
        // 其他 装饰器 CUSTOMER OPTION DATE IGNORE WIDTH
        tips: 如果 CUSTOMER 装饰，则下方函数为 rander
     */
    columns: CellTableColumn[] | typeof ColumnsService;

    /**
     * @description 是否需要 序号
     */
    isNoneOrder?: boolean;

    /**
     * @description 行 key
     */
    rowKey?: string;

    /**
     * @description 是否需要 操作栏
     */
    isNoneAction?: boolean;

    /**
     * @description 操作栏 宽度
     */
    actionView?: number;

    /**
     * @description 表格高度
     */
    tableHeight?: number;

    /**
     * @description readOnly
     */
    readOnly?: boolean;

    /**
     * @description 是否显示删除按钮
     */
    showDeleteButton?: boolean;

    /**
     * @description 设置每行 是否显示删除按钮 // showDeleteButton 为true 生效
     * @param rowData 当前 行数据
     * @param rowIndex 行 index
     * @param colIndex 列 inde
     * @param colKey 列 字段
     * @returns true 显示删除
     */
    showCellDeleteButton?: (rowData: Record<string, any>, rowIndex: number, colIndex: number, colKey: string) => boolean;

    /**
     * @description 行删除按钮的回调 内部可判断是否删除
     * @param dataSource 数据源
     * @param rowData 当前 行数据
     * @param rowIndex 行 index
     * @param hasSpan 是否有合并项
     * @returns 返回 boolean 类型 如果删除了 则需要返回 true；
     */
    cellDeletePromiseCallBack?: (dataSource: any[], rowData: Record<string, any>, rowIndex: number, hasSpan: boolean) => Promise<boolean>;

    /**
     * @description 设置每行的高度
     * @param rowData 当前 行数据
     * @param rowIndex 行 index
     * @param colIndex 列 inde
     * @param colKey 列 字段
     * @returns 如果返回的是 number 则使用这个值；如果不返回值 则使用默认值 35px
     */
    getRowHeight?: (rowData: Record<string, any>, rowIndex: number, colIndex: number, colKey: string) => number | void;

    /**
     * @description 单元格编辑回调
     * @param value 当前 输入值
     * @param record 当前 行数据
     * @param rowIndex 行 index
     * @param colIndex 列 index
     * @param colKey 列 字段
     * @returns void
     */
    onCellChange?: (value: string, record: Record<string, any>, rowIndex: number, colIndex: number, colKey: string) => void;
    /**
     * @description 单元格编辑 blur
     * @param value 当前 输入值
     * @param record 当前 行数据
     * @param rowIndex 行 index
     * @param colIndex 列 index
     * @param colKey 列 字段
     * @returns void
     */
    onCellBlur?: (value: string, record: Record<string, any>, rowIndex: number, colIndex: number, colKey: string) => void;
}

export function CellTable(props: CellTableProps) {
    const {
        onCellChange,
        dataSource,
        columns: originColumns,
        getRowHeight,
        isNoneOrder,
        isNoneAction = true,
        actionView,
        readOnly,
        onCellBlur,
        showDeleteButton = false,
        showCellDeleteButton,
        cellDeletePromiseCallBack,
        rowKey = "id",
        tableHeight = 700,
    } = props;

    const columns = useMemo(() => {
        if (Array.isArray(originColumns)) {
            return renderTableColumnsByArray(originColumns, isNoneOrder, isNoneAction || readOnly, actionView);
        } else {
            return renderTableColumnsByServer(originColumns, isNoneOrder, isNoneAction || readOnly, actionView);
        }
    }, [originColumns, readOnly]);

    const [spanCells, setSpanCells] = useState<Record<string, [number, number][]>>({}); // 合并的cell
    const [selectedColPosioton, setSelectedColPosioton] = useState([]); // 被选中的

    const rowHeightRef = useRef({});
    const colunmsLength = columns?.length;

    const filterDataSource = (rowData: Record<string, any>, rowIndex: number) => {
        if (cellDeletePromiseCallBack) {
            const hasSpan = Object.values(spanCells).some((item) => item.some((item1) => item1.includes(rowIndex)));
            cellDeletePromiseCallBack(
                dataSource.filter((item) => item[rowKey] !== rowData[rowKey]),
                rowData,
                rowIndex,
                hasSpan
            ).then((config) => {
                if (config === true) {
                    // 正式删除 则 合并的需要判断
                    rowHeightRef.current = {};
                    if (hasSpan) {
                        const _spanCell = {};
                        Object.keys(spanCells).map((item) => {
                            const values = spanCells[item];
                            if (values?.length && values.some((item1) => item1.includes(rowIndex))) {
                                _spanCell[item] = values
                                    .map((cellsGroup) => {
                                        if (cellsGroup.includes(rowIndex)) {
                                            // const cell = cellsGroup.find((cell) => cell === rowIndex);
                                            return cellsGroup
                                                .map((cell) => {
                                                    if (cell < rowIndex) {
                                                        return cell;
                                                    } else if (cell === rowIndex) {
                                                        return null;
                                                    } else if (cell > rowIndex) {
                                                        return cell - 1;
                                                    }
                                                })
                                                .filter((item) => item !== null);
                                        }
                                        return cellsGroup;
                                    })
                                    .filter((item) => item?.length > 1); // 如果只有一个 则去掉这个合并
                            } else {
                                _spanCell[item] = values;
                            }
                        });

                        setSpanCells(_spanCell);
                    }
                }
            });
        }
    };

    console.log("op-spanCells-po", spanCells);
    return (
        <div className="ro-curtomer-table-component">
            <ColumnsContext.Provider value={columns}>
                <TableContext.Provider
                    value={{
                        onCellChange,
                        onCellBlur,
                        spanCells,
                        setSpanCells,
                        getRowHeight,
                        rowHeightRef,
                        selectedColPosioton,
                        setSelectedColPosioton,
                        readOnly,
                        showDeleteButton,
                        showCellDeleteButton,
                        filterDataSource,
                        rowKey,
                    }}
                >
                    <div className="ro-ct-container" style={{ height: tableHeight }}>
                        <div className="ro-ct-head">
                            {columns.map((item, index) => (
                                <div
                                    className={`${
                                        !index && !isNoneOrder
                                            ? "ro-cell-left-sticky"
                                            : index === colunmsLength - 1 && !isNoneAction
                                            ? "ro-cell-right-sticky"
                                            : ""
                                    }`}
                                    key={item.key}
                                    style={{ width: item.width }}
                                >
                                    {item.title}
                                </div>
                            ))}
                        </div>
                        <div className="ro-ct-body">
                            {dataSource?.length ? (
                                columns.map((column, colIndex) => (
                                    <RoCol
                                        key={column.dataIndex}
                                        dataSource={dataSource}
                                        column={column}
                                        colIndex={colIndex}
                                        colunmsLength={colunmsLength}
                                    ></RoCol>
                                ))
                            ) : (
                                <div></div>
                            )}
                        </div>
                    </div>
                </TableContext.Provider>
            </ColumnsContext.Provider>
        </div>
    );
}
