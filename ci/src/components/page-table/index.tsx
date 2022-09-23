import { DeleteOutlined, SettingOutlined } from "@ant-design/icons";
import { AdvancedTableResponse } from "@api/AdvancedTableService";
import { Button, ConfigProvider, Input, PaginationProps, Table, TableProps } from "antd";
import { LoadingSVG } from "components/loadingSVG";
import { useEffect, useRef, useState } from "react";
import { AdvancedTableSource } from "type";
import { useElementResizeObserver } from "utils/hooks/useElementResizeObserver";
import { transformSelected } from "./utils";
import { v4 } from "uuid";
import { pageEmpty } from "./empty";
import { PageTitle } from "./header";
import "./index.less";
import { useColumns } from "./useColumns";
import { useDataSource } from "./useDataSource";

const { Search } = Input;

interface Signature {
    name: string;
    actions: any;
}

type RowSelection<T> = Omit<TableProps<T>["rowSelection"], "selectedRowKeys"> & { selectedRowKeys: any };

interface PageTableProps<T> extends TableProps<T> {
    height?: number;
    signature: Signature;
    tableSource: AdvancedTableSource<T>["table"];
    rowSelection: RowSelection<T>;
    isNoneSelected?: boolean;
    isNonePagination?: boolean;
}

const showTotal: PaginationProps["showTotal"] = (total) => `共 ${total} 条`;
const defaultHeight = 165;

export function PageTable<T extends Record<string, any>>(props: PageTableProps<T>) {
    const { signature, tableSource, height: originHeight, isNoneSelected, isNonePagination } = props;
    const { name, actions } = signature;
    const { source, sourceLoading, sourceLoadError } = tableSource;
    const { data, pageIndex, pageSize, total } = source || {};

    const containerRef = useRef({ elementRef: null, height: 0 });
    const [containerId] = useState(v4());
    const [colRely, setColRely] = useState(v4()); // 表格依赖
    const [sourceRely, setSourceRely] = useState(v4()); // 表格数据依赖
    const { width, height } = useElementResizeObserver(document.querySelector(".ro-module-body"));

    const { columnLoading, columnLoadError, columns } = useColumns({
        moduleName: name,
        rely: colRely,
    });

    useDataSource({
        fetch: actions.fetchPageTable,
        sourceRely,
    });

    const updateColAndSource = (type: "col" | "source") => {
        if (type === "col") {
            setColRely(v4());
        } else if (type === "source") {
            setSourceRely(v4());
        }
    };

    // 高度控制
    useEffect(() => {
        try {
            if (!containerRef.current.elementRef) {
                containerRef.current.elementRef = document.querySelector(`#ro-table-container-${containerId} .ant-table-body`);
            }
            const container: any = containerRef.current.elementRef;
            if (!container) return;

            // const containerHeight = Number((container.style.height || "").replace("px", ""));
            if (!originHeight) {
                const h = height - defaultHeight;
                if (h === containerRef.current.height) return;
                container.style.height = `${h}px`;
                containerRef.current.height = h;
            } else {
                if (containerRef.current.height === originHeight) return;
                container.style.height = `${originHeight}px`;
                containerRef.current.height = originHeight;
            }
        } catch (e) {
            console.error("设置table高度失败 table-id:" + containerId, e);
        }
    }, [height, data]);

    // console.log("--PageTable-columns-", columns, columnLoadError);
    if (columnLoadError) {
        return pageEmpty({
            error: true,
            titleError: "暂无表格数据",
            handlerName: "生成",
            handler: () => {
                // updateColAndSource("col");
            },
            style: { marginTop: 20 },
        });
    } else if (!columns) {
        return pageEmpty({
            error: true,
            titleError: "表格数据加载失败",
            handler: () => {
                updateColAndSource("col");
            },
            style: { marginTop: 20 },
        });
    }

    console.log("--selected--");

    return (
        <div className="ro-page-table" id={`ro-table-container-${containerId}`}>
            <ConfigProvider
                renderEmpty={() =>
                    pageEmpty({
                        error: sourceLoadError,
                        handler: () => {
                            updateColAndSource("source");
                        },
                    })
                }
            >
                <div className="ro-page-table-title ro-flex ro-col-center">
                    <div className="ro-flex ro-col-center" style={{ height: 34 }}>
                        <div>
                            <DeleteOutlined />
                            <a style={{ marginLeft: 5 }}>清空条件</a>
                        </div>
                        <Search size="small" placeholder="input search text" allowClear onSearch={() => {}} style={{ width: 200, marginLeft: 10 }} />
                    </div>
                    <div className="ro-grow" style={{ marginLeft: 10 }}></div>
                    <Button icon={<SettingOutlined />} size="small" />
                </div>
                <Table
                    size="small"
                    rowKey={props.rowKey || "id"}
                    bordered
                    dataSource={data || []}
                    columns={columns}
                    scroll={{
                        x: width,
                        y: originHeight || height - defaultHeight,
                    }}
                    loading={{
                        spinning: columnLoading || sourceLoading,
                        indicator: <LoadingSVG />,
                    }}
                    {...(!isNonePagination
                        ? {
                              pagination: {
                                  showSizeChanger: true,
                                  size: "small",
                                  total: Number(total) || 0,
                                  current: pageIndex,
                                  pageSize,
                                  showTotal,
                                  pageSizeOptions: [20, 50, 100, 200],
                                  ...props.pagination,
                              },
                          }
                        : { pagination: false })}
                    {...(!isNoneSelected
                        ? {
                              rowSelection: {
                                  fixed: true,
                                  type: "checkbox",
                                  ...props.rowSelection,
                                  ...(props.rowSelection?.selectedRowKeys
                                      ? { selectedRowKeys: transformSelected(props.rowSelection.selectedRowKeys, props.rowKey) }
                                      : {}),
                              },
                          }
                        : {})}
                />
            </ConfigProvider>
        </div>
    );
}

PageTable.header = PageTitle;
