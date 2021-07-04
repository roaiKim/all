import React from "react";
import { Table, Popover, Button } from "antd";
import { UnorderedListOutlined, DownloadOutlined, PlusOutlined } from "@icon";
import arrayMove from "array-move";
import SortColumnsContainer from "./SortColumns";
import ResizeableTitle from "./ResizeableTitle";
import "./index.less";

// 支持 Antd Table 的大部分属性
/**
 * @props showSelects 是否显示 select 框
 * @props showSortColumns 是否显示 表格排序
 * @props showNumber  是否显示 表格行编号
 * @props ellipsis 单元格溢出隐藏
 * @props sortColumnsContainer 列表排序的 容器
 * @props sortColumnsTitle 列表排序的 标题
 * @props resizeColumn 是否可以拖动列
 * @props columnMinWidth 列最小值
 * @props title 表格 title  字符串 和 React.Component 表现有点区别
 * @props OperationAction 自定义操作按钮
 * @props onDownload 下载 可以是 true 和 一个函数、 如果是 true 则显示下载按钮 并且 启用 默认的下载动作， 如果是一个函数 则启动函数、参数为 columns
 * @props onAdd 一个函数 新增
 */
class TableComponent extends React.PureComponent {

    static defaultProps = {
        showNumber: false,
        showSelects: false,
        showSortColumns: true,
        ellipsis: true,
        sortColumnsContainer: () => document.body,
        sortColumnsTitle: "Tick the display, drag and drop sort",
        resizeColumn: false,
        columnMinWidth: 100,
        onDownload: false,
        onAdd: false,
    }

    constructor(props) {
        super(props);

        // 控制 长度截断
        const newColumns = this.initialColumns();

        this.state = {
            columns: newColumns,
        };
    }

    initialColumns = () => {
        const { resizeColumn, ellipsis, columns } = this.props;
        let newColumns = columns;
        if (resizeColumn) {
            newColumns = newColumns.map((item) => ({
                ...item,
                onHeaderCell: (column) => ({
                    width: column.width, // 100 没有设置宽度可以在此写死 例如100试下
                    onResize: this.onColumnsResize(column),
                }),
            }));
        }
        if (ellipsis) {
            newColumns = newColumns.map((item) => ({
                ...item,
                ellipsis: true,
            }));
        }
        return newColumns;
    }

    onSortColumns = ({ oldIndex, newIndex }) => {
        if (oldIndex === newIndex) {
            return false;
        }

        this.setState(({ columns }) => ({
            columns: arrayMove(columns, oldIndex, newIndex),
        }));
    };

    onChangeColumns = (event, column) => {
        const { checked } = event.target;
        const { columns } = this.state;
        const newColumns = columns.map((item) => {
            if ((item.key && item.key === column.key) || (item.dataIndex && item.dataIndex === column.dataIndex)) {
                const newItem = item;
                newItem.hide = !checked;
                return newItem;
            }
            return item;
        });
        this.setState({ columns: newColumns });
    };

    onColumnsResize = (column) => (event, { size }) => {
        const { columnMinWidth } = this.props;
        this.setState(({ columns }) => {
            const nextColumns = [...columns];
            const newColumn = nextColumns.find((item) => {
                if (item.key) {
                    return item.key === column.key;
                }
                return item.dataIndex === column.dataIndex;
            });
            newColumn.width = size.width < columnMinWidth ? columnMinWidth : size.width;
            return { columns: nextColumns };
        });
    };

    getTableColumns = () => {
        const { columns = [] } = this.state;
        const { showNumber } = this.props;
        if (showNumber) {
            return [{
                className: "text-overflow-ellipsis",
                title: "No.",
                align: "center",
                dataIndex: "no",
                fixed: "left",
                key: "no",
                ignore: true,
                width: 60,
                render: (text, arrayColumns, index) => index + 1,
            },
            ...columns].filter((item) => !item.hide);
        }
        return columns.filter((item) => !item.hide);
    }

    getRowSelection = () => {
        const { showSelects, rowSelection = {} } = this.props;
        if (showSelects) {
            return {
                type: "checkbox",
                fixed: true,
                ...rowSelection,
            };
        }
        return null;
    }

    getTableXWidth = (columns) => {

        // const { columns = [] } = this.state;
        const width = columns.reduce((prev, next) => {
            if (typeof next.width === "number") {
                return prev + (next.width || 140);
            }
            console.error(`columns[].width属性 只支持 number 类型, 其他无效! ${next.title} 中 width 类型不为 number`);
            return prev + 140;
        }, 0);
        return width + 100;
    }

    onDownload = () => {
        const { onDownload } = this.props;
        if (typeof onDownload === "boolean") {
            this.onInitialDownloadAction();
        } else if (typeof onDownload === "function") {
            const { columns } = this.state;
            const columnsKeyArray = columns.filter((item) => !item.hide).map((item) => item.dataIndex || item.key);
            onDownload(columnsKeyArray);
        } else {
            throw new Error("table 的 onDownload 属性只支持 true/function");
        }
    }

    onInitialDownloadAction = () => {
        // 默认的下载动作
    }

    render() {
        const {
            dataSource, sortColumnsContainer, sortColumnsTitle, onAdd,
            onDownload, title, OperationAction, showSortColumns,
        } = this.props;
        const { columns } = this.state;
        const tableColumns = this.getTableColumns();

        // console.log("TableComponent render", columns);
        const titleIsString = React.isValidElement(title);
        return (
            <div className="ro-component-table">
                <div className="ro-table-header">
                    <div className="ro-header-title-container">
                        {
                            titleIsString ? title : <h3>{title}</h3>
                        }
                    </div>
                    <div className="ro-header-operator-container">
                        <div>
                            {OperationAction || null}
                        </div>
                        {
                            onAdd && (
                                <Button icon={<PlusOutlined />} onClick={this.onAdd}>
                                    Add
                                </Button>
                            )
                        }
                        {
                            onDownload && (
                                <Button icon={<DownloadOutlined />} onClick={this.onDownload}>
                                    Download
                                </Button>
                            )
                        }
                        {
                            showSortColumns && (
                                <Popover
                                    arrowPointAtCenter
                                    getPopupContainer={sortColumnsContainer}
                                    placement="bottomRight"
                                    title={sortColumnsTitle}
                                    content={<SortColumnsContainer onChange={this.onChangeColumns} columns={columns} onSortColumns={this.onSortColumns} />}
                                    trigger="click"
                                >
                                    <Button icon={<UnorderedListOutlined />} />
                                </Popover>
                            )
                        }
                    </div>
                </div>
                <Table
                    scroll={{ x: this.getTableXWidth(tableColumns) }}
                    rowSelection={this.getRowSelection()}
                    rowKey="id"
                    columns={tableColumns}
                    dataSource={dataSource}
                    bordered
                    size="small"
                    components={
                        {
                            header: {
                                cell: ResizeableTitle,
                            },
                        }
                    }
                />
            </div>
        );
    }

}

export { TableComponent };
